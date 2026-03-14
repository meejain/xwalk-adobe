/* eslint-disable */
/* global WebImporter */

/**
 * Parser: hero-chatbot
 * Base block: hero
 * Source: https://www.adobe.com/home
 * Selector: .brand-concierge.hero
 * Generated: 2026-03-12
 *
 * Block library structure (hero): 1 column, 3 rows max
 *   Row 1: Background image (optional)
 *   Row 2: Title, subheading, description, CTA (richtext)
 *
 * UE model fields: image (reference), imageAlt (collapsed), text (richtext)
 * Field hinting: image, text (skip imageAlt - collapsed field)
 *
 * Source DOM structure:
 *   .brand-concierge.hero
 *     section.bc-header > h1.bc-header-title
 *     section.bc-input-field > textarea (chatbot input)
 *     section.bc-prompt-cards > button.prompt-card-button (4 prompt suggestions)
 *     section.bc-legal > p (legal text with links)
 *
 * Parent has section-background pictures for background image.
 */
export default function parse(element, { document }) {
  // Extract background image from parent section
  // Found in DOM: parent .section.has-background > picture.section-background.desktop-only
  const parentSection = element.closest('.section.has-background') || element.closest('.section');
  const bgPicture = parentSection
    ? parentSection.querySelector('picture.section-background.desktop-only, picture.section-background')
    : null;

  // Extract heading from hero
  // Found in DOM: section.bc-header > h1.bc-header-title
  const heading = element.querySelector('h1.bc-header-title, h1, h2');

  // Extract prompt suggestion text as description
  // Found in DOM: section.bc-prompt-cards > button.prompt-card-button > .prompt-card-text > p
  const promptCards = Array.from(element.querySelectorAll('.prompt-card-button .prompt-card-text p'));

  // Extract legal text
  // Found in DOM: section.bc-legal > p
  const legalText = element.querySelector('section.bc-legal p, .bc-legal p');

  // Build cells array matching hero block library structure
  const cells = [];

  // Row 1: Background image (optional)
  if (bgPicture) {
    const imgFrag = document.createDocumentFragment();
    imgFrag.appendChild(document.createComment(' field:image '));
    imgFrag.appendChild(bgPicture.cloneNode(true));
    cells.push([imgFrag]);
  }

  // Row 2: Text content (heading + description)
  const textFrag = document.createDocumentFragment();
  textFrag.appendChild(document.createComment(' field:text '));

  if (heading) {
    const h1 = document.createElement('h1');
    h1.textContent = heading.textContent;
    textFrag.appendChild(h1);
  }

  // Add prompt suggestions as paragraph list
  if (promptCards.length > 0) {
    promptCards.forEach((card) => {
      const p = document.createElement('p');
      p.textContent = card.textContent.trim();
      textFrag.appendChild(p);
    });
  }

  // Add legal disclaimer
  if (legalText) {
    const p = document.createElement('p');
    p.innerHTML = legalText.innerHTML;
    textFrag.appendChild(p);
  }

  cells.push([textFrag]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-chatbot', cells });
  element.replaceWith(block);
}
