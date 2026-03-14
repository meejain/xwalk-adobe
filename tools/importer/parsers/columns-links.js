/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-links
 * Base block: columns
 * Source: https://www.adobe.com/home
 * Selector: .homepage-brick.link.split-background
 * Generated: 2026-03-12
 *
 * Block library structure (columns): Multiple columns per row
 *   Row N: [col1-content, col2-content]
 *   Each cell can contain text, images, or inline elements.
 *
 * UE model: columns (number), rows (number) - no field hints needed
 * NOTE: Columns blocks do NOT require field hint comments (per hinting.md exception)
 *
 * Source DOM structure:
 *   .homepage-brick.link.split-background
 *     .background.first-background (decorative, skip)
 *     .body-xs.foreground
 *       div.body-xs (left column):
 *         h2.heading-m "Creative Cloud"
 *         p > a (Creative Cloud Pro free trial)
 *         p > a (Creative Cloud for business)
 *         p > a (Student pricing)
 *       div.body-xs (right column):
 *         h2.heading-m "Acrobat"
 *         p > a (Acrobat free trial)
 *         p > a (Online PDF tools)
 *         h2.heading-m "Explore"
 *         p > a (View all products)
 *         p > a (See all plans and pricing)
 */
export default function parse(element, { document }) {
  // Find the foreground container with the two column divs
  // Found in DOM: .body-xs.foreground > div.body-xs (x2)
  const foreground = element.querySelector('.foreground');
  if (!foreground) {
    const block = WebImporter.Blocks.createBlock(document, { name: 'columns-links', cells: [] });
    element.replaceWith(block);
    return;
  }

  // Get the two column divs
  // Found in DOM: .foreground > div.body-xs (direct children)
  const columnDivs = Array.from(foreground.querySelectorAll(':scope > div.body-xs, :scope > div'));

  // Build column content fragments
  const col1Frag = document.createDocumentFragment();
  const col2Frag = document.createDocumentFragment();

  // Process left column (index 0)
  if (columnDivs[0]) {
    const headings = columnDivs[0].querySelectorAll('h2');
    const links = columnDivs[0].querySelectorAll('p');

    headings.forEach((h) => {
      const h2 = document.createElement('h2');
      h2.textContent = h.textContent.trim();
      col1Frag.appendChild(h2);
    });

    links.forEach((p) => {
      const anchor = p.querySelector('a');
      if (anchor) {
        const para = document.createElement('p');
        const a = document.createElement('a');
        a.href = anchor.href;
        // Use the visible text, handling spans with pointer-events:none
        const spanText = anchor.querySelector('span');
        a.textContent = spanText ? spanText.textContent.trim() : anchor.textContent.trim();
        para.appendChild(a);
        col1Frag.appendChild(para);
      }
    });
  }

  // Process right column (index 1)
  if (columnDivs[1]) {
    const children = Array.from(columnDivs[1].children);

    for (const child of children) {
      if (child.tagName === 'H2') {
        const h2 = document.createElement('h2');
        h2.textContent = child.textContent.trim();
        col2Frag.appendChild(h2);
      } else if (child.tagName === 'P') {
        const anchor = child.querySelector('a');
        if (anchor) {
          const para = document.createElement('p');
          const a = document.createElement('a');
          a.href = anchor.href;
          const spanText = anchor.querySelector('span');
          a.textContent = spanText ? spanText.textContent.trim() : anchor.textContent.trim();
          para.appendChild(a);
          col2Frag.appendChild(para);
        }
      }
    }
  }

  // Build cells: 1 row with 2 columns
  const cells = [[col1Frag, col2Frag]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-links', cells });
  element.replaceWith(block);
}
