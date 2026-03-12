/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroParser from './parsers/hero.js';
import cardsParser from './parsers/cards.js';
import columnsParser from './parsers/columns.js';

// TRANSFORMER IMPORTS
import adobeCleanupTransformer from './transformers/adobe-cleanup.js';
import adobeSectionsTransformer from './transformers/adobe-sections.js';

// PARSER REGISTRY - Map parser names to functions
const parsers = {
  'hero': heroParser,
  'cards': cardsParser,
  'columns': columnsParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Adobe homepage with hero, product showcases, and promotional content',
  urls: [
    'https://www.adobe.com/home',
  ],
  blocks: [
    {
      name: 'hero',
      instances: ['.homepage-brick.above-pods'],
    },
    {
      name: 'cards',
      instances: [
        '.section.has-background .section.masonry .homepage-brick.two-thirds-grid',
        '.section.has-background .section.masonry .homepage-brick.light.click:not(.two-thirds-grid)',
        ".fragment[data-path*='acrobat'] .homepage-brick.dark",
        ".fragment[data-path*='photoshop'] .homepage-brick.dark",
        ".fragment[data-path*='amazing-apps'] .homepage-brick.dark",
        ".fragment[data-path*='business'] .homepage-brick.dark",
        '.homepage-brick.news',
      ],
    },
    {
      name: 'columns',
      instances: ['.homepage-brick.link.split-background'],
    },
  ],
  sections: [
    {
      id: 'section-1-hero',
      name: 'Hero Section',
      selector: '.section.has-background',
      style: 'dark',
      blocks: ['hero', 'cards'],
      defaultContent: [],
    },
    {
      id: 'section-3-masonry-grid',
      name: 'Product Showcase Masonry Grid',
      selector: ".section.masonry[daa-lh='s3']",
      style: 'masonry',
      blocks: ['cards', 'columns'],
      defaultContent: [],
    },
    {
      id: 'section-4-footnote',
      name: 'Footnote Section',
      selector: ".section[daa-lh='s4']",
      style: null,
      blocks: [],
      defaultContent: ['.text.long-form .foreground .body-s'],
    },
  ],
};

// TRANSFORMER REGISTRY
// Section transformer runs after cleanup (in afterTransform hook)
const transformers = [
  adobeCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [adobeSectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - 'beforeTransform' or 'afterTransform'
 * @param {Element} element - The DOM element to transform
 * @param {Object} payload - { document, url, html, params }
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found on the page
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
