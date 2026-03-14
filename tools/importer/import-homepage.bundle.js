var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero.js
  function parse(element, { document }) {
    const parentSection = element.closest(".section.has-background");
    const bgPicture = parentSection ? parentSection.querySelector("picture.section-background.desktop-only") : null;
    const heading = element.querySelector('h1, h2, [class*="heading-xxl"], [class*="heading-xl"]');
    const searchInput = element.querySelector('textarea, input[type="text"]');
    const searchPlaceholder = searchInput ? searchInput.getAttribute("placeholder") : null;
    const promptButtons = element.querySelectorAll(".prompt-card-button, .bc-prompt-cards button");
    const promptTexts = [];
    promptButtons.forEach((btn) => {
      const textEl = btn.querySelector("p");
      if (textEl) {
        promptTexts.push(textEl.textContent.trim());
      } else {
        const label = btn.getAttribute("aria-label");
        if (label) promptTexts.push(label);
      }
    });
    const legalSection = element.querySelector(".bc-legal");
    const legalText = legalSection ? legalSection.querySelector("p") : null;
    const cells = [];
    if (bgPicture) {
      cells.push([bgPicture]);
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (searchPlaceholder) {
      const searchP = document.createElement("p");
      searchP.className = "hero-search-placeholder";
      searchP.textContent = searchPlaceholder;
      contentCell.push(searchP);
    }
    promptTexts.forEach((text) => {
      const promptP = document.createElement("p");
      promptP.className = "hero-prompt";
      promptP.textContent = text;
      contentCell.push(promptP);
    });
    if (legalText) {
      contentCell.push(legalText);
    }
    cells.push(contentCell);
    if (parentSection) {
      parentSection.querySelectorAll("picture.section-background").forEach((pic) => pic.remove());
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards.js
  function parse2(element, { document }) {
    const cells = [];
    const isNews = element.classList.contains("news");
    if (isNews) {
      const foreground = element.querySelector(".foreground .body-s");
      if (foreground) {
        const items = [];
        let currentItem = [];
        Array.from(foreground.children).forEach((child) => {
          if (child.tagName === "HR") {
            if (currentItem.length > 0) items.push(currentItem);
            currentItem = [];
          } else {
            currentItem.push(child);
          }
        });
        if (currentItem.length > 0) items.push(currentItem);
        const sectionHeading = element.querySelector(".highlight-row h2, .highlight-row .heading-xs");
        if (sectionHeading) {
          cells.push([sectionHeading]);
        }
        items.forEach((item) => {
          const contentCell = [];
          item.forEach((el) => contentCell.push(el));
          if (contentCell.length > 0) {
            cells.push(contentCell);
          }
        });
      }
    } else {
      const bgPicture = element.querySelector(".background .desktopOnly picture, .background picture");
      const foreground = element.querySelector(".foreground .body-m, a.foreground .body-m");
      const label = foreground ? foreground.querySelector('.detail-l, [class*="detail"]') : null;
      const heading = foreground ? foreground.querySelector('h2, h1, [class*="heading"]') : null;
      const description = foreground ? foreground.querySelector("p.body-m, p:not(.detail-l):not(.action-area)") : null;
      const ctaButton = foreground ? foreground.querySelector(".con-button, .click-link") : null;
      const ctaLink = element.querySelector("a.foreground");
      const imageCell = bgPicture ? [bgPicture] : [];
      const textCell = [];
      if (label) textCell.push(label);
      if (heading) textCell.push(heading);
      if (description) textCell.push(description);
      if (ctaButton && ctaLink) {
        const link = document.createElement("a");
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
    const block = WebImporter.Blocks.createBlock(document, { name: "cards", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns.js
  function parse3(element, { document }) {
    const foreground = element.querySelector(".foreground");
    if (!foreground) {
      const block2 = WebImporter.Blocks.createBlock(document, { name: "columns", cells: [] });
      element.replaceWith(block2);
      return;
    }
    const columnDivs = foreground.querySelectorAll(":scope > .body-xs, :scope > div.body-xs");
    const cells = [];
    const row = [];
    columnDivs.forEach((colDiv) => {
      const colContent = [];
      Array.from(colDiv.children).forEach((child) => {
        if (child.tagName === "H2" || child.tagName === "H3") {
          colContent.push(child);
        } else if (child.tagName === "P") {
          const link = child.querySelector("a");
          if (link) {
            const span = link.querySelector("span");
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
    const block = WebImporter.Blocks.createBlock(document, { name: "columns", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/adobe-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [".section-metadata"]);
      const spacerSection = element.querySelector('.section[daa-lh="s2"]');
      if (spacerSection) spacerSection.remove();
      element.querySelectorAll("[data-block-status]").forEach((el) => {
        el.removeAttribute("data-block-status");
      });
    }
    if (hookName === TransformHook.afterTransform) {
      element.querySelectorAll("[daa-lh], [daa-ll], [daa-im]").forEach((el) => {
        el.removeAttribute("daa-lh");
        el.removeAttribute("daa-ll");
        el.removeAttribute("daa-im");
      });
      element.querySelectorAll('[is="checkout-link"]').forEach((el) => {
        el.removeAttribute("is");
        el.removeAttribute("data-checkout-workflow-step");
        el.removeAttribute("data-modal");
        el.removeAttribute("data-quantity");
        el.removeAttribute("data-wcs-osi");
        el.removeAttribute("data-extra-options");
        el.removeAttribute("data-modal-id");
      });
      element.querySelectorAll("[style]").forEach((el) => {
        el.removeAttribute("style");
      });
      WebImporter.DOMUtils.remove(element, ["noscript", "link"]);
    }
  }

  // tools/importer/transformers/adobe-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { document } = payload;
      const template = payload.template;
      if (!template || !template.sections || template.sections.length < 2) return;
      const sections = template.sections;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const selector = section.selector;
        if (!selector) continue;
        const sectionEl = element.querySelector(selector);
        if (!sectionEl) continue;
        if (section.style) {
          const sectionMetadataBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.append(sectionMetadataBlock);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero": parse,
    "cards": parse2,
    "columns": parse3
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Adobe homepage with hero, product showcases, and promotional content",
    urls: [
      "https://www.adobe.com/home"
    ],
    blocks: [
      {
        name: "hero",
        instances: [".brand-concierge.hero"]
      },
      {
        name: "columns",
        instances: [".homepage-brick.link.split-background"]
      },
      {
        name: "cards",
        instances: [
          ".section.has-background .homepage-brick.two-thirds-grid",
          ".section.has-background .homepage-brick.dark.click:not(.two-thirds-grid)",
          ".fragment[data-path*='acrobat'] .homepage-brick.dark",
          ".fragment[data-path*='photoshop'] .homepage-brick.dark",
          ".fragment[data-path*='amazing-apps'] .homepage-brick.dark",
          ".fragment[data-path*='business'] .homepage-brick.dark",
          ".homepage-brick.news"
        ]
      }
    ],
    sections: [
      {
        id: "section-1-hero",
        name: "Hero Section",
        selector: ".section.has-background",
        style: "dark",
        blocks: ["hero", "cards"],
        defaultContent: []
      },
      {
        id: "section-3-masonry-grid",
        name: "Product Showcase Masonry Grid",
        selector: ".section.masonry[daa-lh='s3']",
        style: "masonry",
        blocks: ["cards", "columns"],
        defaultContent: []
      },
      {
        id: "section-4-footnote",
        name: "Footnote Section",
        selector: ".section[daa-lh='s4']",
        style: null,
        blocks: [],
        defaultContent: [".text.long-form .foreground .body-s"]
      }
    ]
  };
  var transformers = [
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : [],
    transform
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
