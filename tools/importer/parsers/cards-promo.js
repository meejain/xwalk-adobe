/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-promo
 * Base block: cards
 * Source: https://www.adobe.com/home
 * Selectors: .homepage-brick (multiple variants: dark click, news, two-thirds-grid)
 * Generated: 2026-03-12
 *
 * Block library structure (cards): 2+ columns per row
 *   Row N: [card-id, image, text-content]
 *   - Col 1: "card" component identifier (xwalk)
 *   - Col 2: Image or icon
 *   - Col 3: Title (heading), description, CTA link (richtext)
 *
 * UE model (card): image (reference), text (richtext)
 * Field hinting: image, text per card row (skip imageAlt - collapsed)
 *
 * Source DOM patterns:
 *
 * Standard promo tile (.homepage-brick.dark.click):
 *   .background > .desktopOnly > picture (background image)
 *   a.foreground > .body-m:
 *     p.detail-l (eyebrow)
 *     h2.heading-m (heading)
 *     p.body-m (description)
 *     p > div.click-link OR div.con-button (CTA text)
 *
 * News brick (.homepage-brick.news):
 *   .highlight-row > h2.heading-xs ("In the news")
 *   .foreground > .body-s:
 *     h3.heading-xs (story heading)
 *     p.body-s (story description)
 *     p > a (Read the story link)
 *     hr (separator between stories)
 */
export default function parse(element, { document }) {
  const cells = [];

  // Detect if this is a news brick
  const isNews = element.classList.contains('news');

  if (isNews) {
    // News brick: each news story becomes a card row
    // Found in DOM: .highlight-row > h2, then .foreground > h3 + p + a separated by hr
    const foreground = element.querySelector('.foreground .body-s, .foreground');
    if (!foreground) {
      const block = WebImporter.Blocks.createBlock(document, { name: 'cards-promo', cells });
      element.replaceWith(block);
      return;
    }

    // Extract the "In the news" header as first card
    const highlightHeading = element.querySelector('.highlight-row h2, .highlight-row .heading-xs');
    if (highlightHeading) {
      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(' field:text '));
      const h2 = document.createElement('h2');
      h2.textContent = highlightHeading.textContent.trim();
      textFrag.appendChild(h2);
      cells.push(['card', '', textFrag]);
    }

    // Split news stories by hr separators
    const stories = [];
    let currentStory = { heading: null, description: null, link: null };

    const children = Array.from(foreground.querySelectorAll(':scope > h3, :scope > p, :scope > hr'));
    for (const child of children) {
      if (child.tagName === 'HR') {
        if (currentStory.heading) {
          stories.push({ ...currentStory });
        }
        currentStory = { heading: null, description: null, link: null };
      } else if (child.tagName === 'H3') {
        currentStory.heading = child;
      } else if (child.tagName === 'P' && child.querySelector('a')) {
        currentStory.link = child.querySelector('a');
      } else if (child.tagName === 'P') {
        currentStory.description = child;
      }
    }
    // Push last story
    if (currentStory.heading) {
      stories.push(currentStory);
    }

    for (const story of stories) {
      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(' field:text '));

      if (story.heading) {
        const h3 = document.createElement('h3');
        h3.textContent = story.heading.textContent.trim();
        textFrag.appendChild(h3);
      }
      if (story.description) {
        const p = document.createElement('p');
        p.textContent = story.description.textContent.trim();
        textFrag.appendChild(p);
      }
      if (story.link) {
        const p = document.createElement('p');
        const a = document.createElement('a');
        a.href = story.link.href;
        a.textContent = story.link.textContent.trim();
        p.appendChild(a);
        textFrag.appendChild(p);
      }

      // News cards have no image
      cells.push(['card', '', textFrag]);
    }
  } else {
    // Standard promo tile: single card with background image and text overlay
    // Found in DOM: .background > .desktopOnly > picture
    const bgPicture = element.querySelector('.desktopOnly picture, .background picture');

    // Found in DOM: a.foreground > .body-m
    const foreground = element.querySelector('a.foreground .body-m, a.foreground, .foreground .body-m, .foreground');

    // Build image cell
    const imgFrag = document.createDocumentFragment();
    imgFrag.appendChild(document.createComment(' field:image '));
    if (bgPicture) {
      imgFrag.appendChild(bgPicture.cloneNode(true));
    }

    // Build text cell
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:text '));

    if (foreground) {
      // Extract eyebrow text
      // Found in DOM: p.detail-l
      const eyebrow = foreground.querySelector('p.detail-l, .detail-l');
      if (eyebrow) {
        const p = document.createElement('p');
        p.textContent = eyebrow.textContent.trim();
        textFrag.appendChild(p);
      }

      // Extract heading
      // Found in DOM: h2.heading-m
      const heading = foreground.querySelector('h2.heading-m, h2, h3');
      if (heading) {
        const h2 = document.createElement('h2');
        h2.textContent = heading.textContent.trim();
        textFrag.appendChild(h2);
      }

      // Extract description paragraphs (exclude action area and eyebrow)
      // Found in DOM: p.body-m (not containing .click-link or .con-button)
      const descPs = Array.from(foreground.querySelectorAll('p.body-m'));
      for (const p of descPs) {
        if (!p.querySelector('.click-link, .con-button') && !p.classList.contains('detail-l')) {
          const para = document.createElement('p');
          para.textContent = p.textContent.trim();
          textFrag.appendChild(para);
        }
      }

      // Extract CTA link
      // Found in DOM: div.click-link or div.con-button or a with class
      const ctaEl = foreground.querySelector('.click-link, .con-button');
      const ctaLink = foreground.closest('a') || foreground.querySelector('a');
      if (ctaEl && ctaLink) {
        const p = document.createElement('p');
        const a = document.createElement('a');
        a.href = ctaLink.href;
        a.textContent = ctaEl.textContent.trim();
        p.appendChild(a);
        textFrag.appendChild(p);
      } else if (ctaEl) {
        const p = document.createElement('p');
        p.textContent = ctaEl.textContent.trim();
        textFrag.appendChild(p);
      }
    }

    cells.push(['card', imgFrag, textFrag]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-promo', cells });
  element.replaceWith(block);
}
