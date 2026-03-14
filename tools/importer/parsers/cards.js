/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards block.
 * Base: cards. Source: https://www.adobe.com/home
 * Source selectors:
 *   - .homepage-brick.two-thirds-grid (CC Pro promo card)
 *   - .homepage-brick.light.click:not(.two-thirds-grid) (Firefly card)
 *   - .fragment[data-path*='acrobat'] .homepage-brick.dark (Acrobat product card)
 *   - .fragment[data-path*='photoshop'] .homepage-brick.dark (Photoshop card)
 *   - .fragment[data-path*='amazing-apps'] .homepage-brick.dark (CC catalog card)
 *   - .fragment[data-path*='business'] .homepage-brick.dark (Business card)
 *   - .homepage-brick.news (News block)
 *
 * Block library structure (2 columns per row):
 * Each row: [image cell, text cell]
 *   image cell: picture element
 *   text cell: heading + description + CTA link
 *
 * Source DOM patterns:
 * Product cards: .background .desktopOnly picture (image), .foreground .body-m (text)
 *   - p.detail-l (label), h2.heading-m (heading), p.body-m (description), .click-link (CTA)
 * Promo cards: .background .desktopOnly picture, a.foreground .body-m
 *   - h2.heading-m (heading), p.body-m (description), .con-button (CTA)
 * News cards: .highlight-row h2 (section heading), .foreground .body-s (items with h3, p, a)
 */
export default function parse(element, { document }) {
  const cells = [];

  // Detect if this is a news block
  // Found in DOM: <div class="homepage-brick news">
  const isNews = element.classList.contains('news');

  if (isNews) {
    // News block: each news item becomes a card row
    // Found in DOM: .highlight-row h2.heading-xs for section heading
    // and .foreground .body-s with h3, p, a elements separated by <hr>
    const foreground = element.querySelector('.foreground .body-s');
    if (foreground) {
      const items = [];
      let currentItem = [];

      // Split content by <hr> separators
      Array.from(foreground.children).forEach((child) => {
        if (child.tagName === 'HR') {
          if (currentItem.length > 0) items.push(currentItem);
          currentItem = [];
        } else {
          currentItem.push(child);
        }
      });
      if (currentItem.length > 0) items.push(currentItem);

      // Section heading as first row (no image variant)
      const sectionHeading = element.querySelector('.highlight-row h2, .highlight-row .heading-xs');
      if (sectionHeading) {
        cells.push([sectionHeading]);
      }

      // Each news item as a card row (no images - single column)
      items.forEach((item) => {
        const contentCell = [];
        item.forEach((el) => contentCell.push(el));
        if (contentCell.length > 0) {
          cells.push(contentCell);
        }
      });
    }
  } else {
    // Product/promo card: extract image and text content
    // Found in DOM: .background .desktopOnly picture
    const bgPicture = element.querySelector('.background .desktopOnly picture, .background picture');

    // Found in DOM: .foreground .body-m or a.foreground .body-m
    const foreground = element.querySelector('.foreground .body-m, a.foreground .body-m');

    // Extract text elements from foreground
    const label = foreground ? foreground.querySelector('.detail-l, [class*="detail"]') : null;
    const heading = foreground ? foreground.querySelector('h2, h1, [class*="heading"]') : null;
    const description = foreground ? foreground.querySelector('p.body-m, p:not(.detail-l):not(.action-area)') : null;

    // Extract CTA - could be .click-link, .con-button, or parent <a> wrapper
    const ctaButton = foreground ? foreground.querySelector('.con-button, .click-link') : null;
    const ctaLink = element.querySelector('a.foreground');

    // Build image cell
    const imageCell = bgPicture ? [bgPicture] : [];

    // Build text cell
    const textCell = [];
    if (label) textCell.push(label);
    if (heading) textCell.push(heading);
    if (description) textCell.push(description);

    // Add CTA as a proper link
    if (ctaButton && ctaLink) {
      const link = document.createElement('a');
      link.href = ctaLink.href;
      link.textContent = ctaButton.textContent;
      textCell.push(link);
    } else if (ctaButton) {
      textCell.push(ctaButton);
    }

    if (imageCell.length > 0) {
      cells.push([imageCell, textCell]);
    } else {
      cells.push(textCell);
    }
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards', cells });
  element.replaceWith(block);
}
