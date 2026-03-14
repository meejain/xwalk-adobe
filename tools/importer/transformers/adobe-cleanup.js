/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Adobe homepage cleanup.
 * Selectors from captured DOM at https://www.adobe.com/home.
 * Removes non-authorable content: Milo section-metadata, tracking attributes,
 * analytics elements, and site chrome.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove Milo-specific section-metadata blocks (not EDS section-metadata)
    // Found in captured DOM: <div class="section-metadata" data-block-status="loaded">
    WebImporter.DOMUtils.remove(element, ['.section-metadata']);

    // Remove empty spacer section (link-bar-placeholder)
    // Found in captured DOM: <div class="section" daa-lh="s2"> with only section-metadata
    const spacerSection = element.querySelector('.section[daa-lh="s2"]');
    if (spacerSection) spacerSection.remove();

    // Remove data-block-status attributes that interfere with parsing
    element.querySelectorAll('[data-block-status]').forEach((el) => {
      el.removeAttribute('data-block-status');
    });
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove tracking/analytics attributes from all elements
    // Found in captured DOM: daa-lh, daa-ll, daa-im attributes
    element.querySelectorAll('[daa-lh], [daa-ll], [daa-im]').forEach((el) => {
      el.removeAttribute('daa-lh');
      el.removeAttribute('daa-ll');
      el.removeAttribute('daa-im');
    });

    // Remove checkout-link custom elements and data attributes
    // Found in captured DOM: <a is="checkout-link" data-checkout-workflow-step="segmentation" ...>
    element.querySelectorAll('[is="checkout-link"]').forEach((el) => {
      el.removeAttribute('is');
      el.removeAttribute('data-checkout-workflow-step');
      el.removeAttribute('data-modal');
      el.removeAttribute('data-quantity');
      el.removeAttribute('data-wcs-osi');
      el.removeAttribute('data-extra-options');
      el.removeAttribute('data-modal-id');
    });

    // Remove inline styles that are layout-specific
    element.querySelectorAll('[style]').forEach((el) => {
      el.removeAttribute('style');
    });

    // Remove noscript and link elements
    WebImporter.DOMUtils.remove(element, ['noscript', 'link']);
  }
}
