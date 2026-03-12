/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero block.
 * Base: hero. Source: https://www.adobe.com/home
 * Source selector: .homepage-brick.above-pods
 *
 * Block library structure (1 column, 2 content rows):
 * Row 1: Background image (optional)
 * Row 2: Title + Subheading + CTA
 *
 * Source DOM structure:
 * .homepage-brick.above-pods > .foreground > .body-m
 *   h1.heading-xxl - main heading
 *   p.body-m - description text
 *   p.action-area > a.con-button - CTA link
 * Background images are in parent .section.has-background > picture.section-background
 */
export default function parse(element, { document }) {
  // Extract background image from parent section
  // Found in DOM: <picture class="section-background desktop-only"> in parent .section.has-background
  const parentSection = element.closest('.section.has-background');
  const bgPicture = parentSection
    ? parentSection.querySelector('picture.section-background.desktop-only')
    : null;

  // Extract heading - Found in DOM: <h1 class="heading-xxl">
  const heading = element.querySelector('h1, h2, [class*="heading-xxl"], [class*="heading-xl"]');

  // Extract description - Found in DOM: <p class="body-m"> (not the action-area paragraph)
  const description = element.querySelector('.foreground .body-m > p.body-m');

  // Extract CTA link - Found in DOM: <a class="con-button blue button-xl">
  const ctaLink = element.querySelector('a.con-button, a.button, .action-area a');

  // Build cells matching block library structure
  const cells = [];

  // Row 1: Background image (optional)
  if (bgPicture) {
    cells.push([bgPicture]);
  }

  // Row 2: Title + description + CTA
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  if (ctaLink) contentCell.push(ctaLink);
  cells.push(contentCell);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero', cells });
  element.replaceWith(block);
}
