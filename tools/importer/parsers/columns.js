/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns block.
 * Base: columns. Source: https://www.adobe.com/home
 * Source selector: .homepage-brick.link.split-background
 *
 * Block library structure (multiple columns per row):
 * Each row has N cells, one per column.
 * Each cell can contain text, headings, links.
 *
 * Source DOM structure:
 * .homepage-brick.link.split-background > .foreground > .body-xs
 *   Column 1 (first .body-xs child):
 *     h2.heading-m "Creative Cloud"
 *     p.body-xs > a links (Creative Cloud Pro free trial, CC for business, Student pricing)
 *   Column 2 (second .body-xs child):
 *     h2.heading-m "Acrobat"
 *     p.body-xs > a links (Acrobat free trial, Online PDF tools)
 *     h2.heading-m "Explore"
 *     p.body-xs > a links (View all products, See all plans and pricing)
 */
export default function parse(element, { document }) {
  // Find the foreground container with column content
  // Found in DOM: <div class="body-xs foreground"> containing child .body-xs divs
  const foreground = element.querySelector('.foreground');
  if (!foreground) {
    const block = WebImporter.Blocks.createBlock(document, { name: 'columns', cells: [] });
    element.replaceWith(block);
    return;
  }

  // Get column divs - direct children of foreground that contain content
  // Found in DOM: .foreground > .body-xs (two sibling divs)
  const columnDivs = foreground.querySelectorAll(':scope > .body-xs, :scope > div.body-xs');

  const cells = [];
  const row = [];

  columnDivs.forEach((colDiv) => {
    // Each column div contains headings and links
    const colContent = [];

    // Get all child elements (h2 headings, p with links)
    Array.from(colDiv.children).forEach((child) => {
      if (child.tagName === 'H2' || child.tagName === 'H3') {
        colContent.push(child);
      } else if (child.tagName === 'P') {
        // Extract the link from the paragraph
        const link = child.querySelector('a');
        if (link) {
          // Clean up checkout-link spans
          const span = link.querySelector('span');
          if (span) {
            link.textContent = span.textContent;
          }
          colContent.push(link);
        } else {
          colContent.push(child);
        }
      }
    });

    row.push(colContent);
  });

  if (row.length > 0) {
    cells.push(row);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns', cells });
  element.replaceWith(block);
}
