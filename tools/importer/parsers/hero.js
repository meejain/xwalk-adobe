/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero block.
 * Base: hero. Source: https://www.adobe.com/home
 * Source selector: .brand-concierge.hero
 *
 * Block library structure (1 column, multiple content rows):
 * Row 1: Background image (optional)
 * Row 2: Title + search placeholder + prompt buttons + legal text
 *
 * Source DOM structure:
 * .brand-concierge.hero
 *   section.bc-header > h1 - main heading
 *   section.bc-input-field > textarea[placeholder] - search input
 *   section.bc-prompt-cards > button.prompt-card-button - prompt buttons
 *   section.bc-legal > p - legal disclaimer
 * Background images are in parent .section.has-background > picture.section-background
 */
export default function parse(element, { document }) {
  // Extract background image from parent section
  const parentSection = element.closest('.section.has-background');
  const bgPicture = parentSection
    ? parentSection.querySelector('picture.section-background.desktop-only')
    : null;

  // Extract heading
  const heading = element.querySelector('h1, h2, [class*="heading-xxl"], [class*="heading-xl"]');

  // Extract search input placeholder text
  const searchInput = element.querySelector('textarea, input[type="text"]');
  const searchPlaceholder = searchInput ? searchInput.getAttribute('placeholder') : null;

  // Extract prompt button texts
  const promptButtons = element.querySelectorAll('.prompt-card-button, .bc-prompt-cards button');
  const promptTexts = [];
  promptButtons.forEach((btn) => {
    const textEl = btn.querySelector('p');
    if (textEl) {
      promptTexts.push(textEl.textContent.trim());
    } else {
      const label = btn.getAttribute('aria-label');
      if (label) promptTexts.push(label);
    }
  });

  // Extract legal text
  const legalSection = element.querySelector('.bc-legal');
  const legalText = legalSection ? legalSection.querySelector('p') : null;

  // Build cells matching block library structure
  const cells = [];

  // Row 1: Background image (optional)
  if (bgPicture) {
    cells.push([bgPicture]);
  }

  // Row 2: All hero content
  const contentCell = [];
  if (heading) contentCell.push(heading);

  // Add search placeholder as a paragraph
  if (searchPlaceholder) {
    const searchP = document.createElement('p');
    searchP.className = 'hero-search-placeholder';
    searchP.textContent = searchPlaceholder;
    contentCell.push(searchP);
  }

  // Add prompt buttons as paragraphs
  promptTexts.forEach((text) => {
    const promptP = document.createElement('p');
    promptP.className = 'hero-prompt';
    promptP.textContent = text;
    contentCell.push(promptP);
  });

  // Add legal text
  if (legalText) {
    contentCell.push(legalText);
  }

  cells.push(contentCell);

  // Remove ALL section-background pictures from parent (tablet-only, mobile-only remain as orphans)
  if (parentSection) {
    parentSection.querySelectorAll('picture.section-background').forEach((pic) => pic.remove());
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero', cells });
  element.replaceWith(block);
}
