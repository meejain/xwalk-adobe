/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Adobe homepage section breaks and section-metadata.
 * Runs in afterTransform only.
 * Adds <hr> section breaks and Section Metadata blocks based on template sections.
 * Selectors from captured DOM at https://www.adobe.com/home.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const { document } = payload;
    const template = payload.template;
    if (!template || !template.sections || template.sections.length < 2) return;

    const sections = template.sections;

    // Process sections in reverse order to avoid DOM position shifts
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const selector = section.selector;
      if (!selector) continue;

      // Find the section element using the selector
      const sectionEl = element.querySelector(selector);
      if (!sectionEl) continue;

      // Add Section Metadata block if section has a style
      if (section.style) {
        const sectionMetadataBlock = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.append(sectionMetadataBlock);
      }

      // Add <hr> section break before each section (except the first)
      if (i > 0) {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    }
  }
}
