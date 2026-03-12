import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 900px)');

/* ── helpers ────────────────────────────────────────── */

function closeAllMenus(nav) {
  nav.querySelectorAll('.nav-sections .nav-drop').forEach((d) => {
    d.setAttribute('aria-expanded', 'false');
  });
  const overlay = nav.querySelector('.mega-overlay');
  if (overlay) overlay.classList.remove('active');
}

function closeMobileMenu(nav) {
  nav.setAttribute('aria-expanded', 'false');
  document.body.style.overflowY = '';
  const btn = nav.querySelector('.nav-hamburger button');
  if (btn) btn.setAttribute('aria-label', 'Open navigation');
}

function closeAppsPopover(nav) {
  const popover = nav.querySelector('.apps-popover');
  if (popover) popover.classList.remove('active');
  const btn = nav.querySelector('.apps-launcher');
  if (btn) btn.setAttribute('aria-expanded', 'false');
}

function handleEscape(e) {
  if (e.code !== 'Escape') return;
  const nav = document.getElementById('nav');
  if (!nav) return;

  // close apps popover first
  const popover = nav.querySelector('.apps-popover.active');
  if (popover) { closeAppsPopover(nav); return; }

  // close mega menus
  const openDrop = nav.querySelector('.nav-drop[aria-expanded="true"]');
  if (openDrop && isDesktop.matches) {
    closeAllMenus(nav);
    openDrop.querySelector('.nav-drop-toggle').focus();
    return;
  }

  // close mobile menu
  if (!isDesktop.matches && nav.getAttribute('aria-expanded') === 'true') {
    closeMobileMenu(nav);
    nav.querySelector('.nav-hamburger button').focus();
  }
}

function handleClickOutside(e) {
  const nav = document.getElementById('nav');
  if (!nav) return;
  if (!nav.contains(e.target)) {
    closeAllMenus(nav);
    closeAppsPopover(nav);
  }
}

/* ── build mega menu panel from nav content ──────── */

function buildMegaPanel(dropLi) {
  const nestedUl = dropLi.querySelector(':scope > ul');
  if (!nestedUl) return null;

  const panel = document.createElement('div');
  panel.className = 'mega-panel';

  const inner = document.createElement('div');
  inner.className = 'mega-inner';

  const columns = nestedUl.querySelectorAll(':scope > li');
  columns.forEach((col) => {
    const colDiv = document.createElement('div');
    const hasImage = col.querySelector(':scope > p picture');
    colDiv.className = hasImage ? 'mega-col mega-promo' : 'mega-col';

    if (hasImage) {
      // promo card
      colDiv.innerHTML = col.innerHTML;
      // style CTA link inside promo
      const btn = colDiv.querySelector('.button');
      if (btn) {
        btn.className = 'mega-promo-cta';
        const wrapper = btn.closest('.button-container');
        if (wrapper) wrapper.className = 'mega-promo-cta-wrapper';
      }
    } else {
      // regular column with heading + links
      const innerUl = col.querySelector(':scope > ul');
      if (innerUl) {
        const items = innerUl.querySelectorAll(':scope > li');
        items.forEach((item) => {
          const strong = item.querySelector('strong');
          if (strong && !item.querySelector('a')) {
            // column heading
            const h = document.createElement('div');
            h.className = 'mega-heading';
            h.textContent = strong.textContent;
            colDiv.append(h);
          } else {
            const link = item.querySelector('a');
            if (!link) return;

            const desc = item.querySelector('em');
            const icon = item.querySelector(':scope > img');

            const linkEl = document.createElement('a');
            linkEl.href = link.href;

            // "View all" special link
            if (link.textContent.trim().toLowerCase().startsWith('view all')) {
              linkEl.className = 'mega-link mega-view-all';
              linkEl.textContent = link.textContent;
            } else if (desc || icon) {
              // link with icon and/or description
              linkEl.className = 'mega-link';
              if (icon) {
                const iconImg = document.createElement('img');
                iconImg.src = icon.src;
                iconImg.alt = icon.alt || '';
                iconImg.className = 'mega-link-icon';
                linkEl.append(iconImg);
              }
              const textWrap = document.createElement('div');
              textWrap.className = 'mega-link-text';
              const titleEl = document.createElement('div');
              titleEl.className = 'mega-link-title';
              titleEl.textContent = link.textContent;
              textWrap.append(titleEl);
              if (desc) {
                const descEl = document.createElement('div');
                descEl.className = 'mega-link-desc';
                descEl.textContent = desc.textContent;
                textWrap.append(descEl);
              }
              linkEl.append(textWrap);
            } else {
              // simple text link
              linkEl.className = 'mega-link';
              linkEl.textContent = link.textContent;
            }
            colDiv.append(linkEl);
          }
        });
      }
      // CTA button below the list
      const cta = col.querySelector(':scope > p .button, :scope > p strong a');
      if (cta) {
        const ctaEl = cta.closest('a') || cta;
        const ctaLink = document.createElement('a');
        ctaLink.href = ctaEl.href;
        ctaLink.className = 'mega-cta';
        ctaLink.textContent = ctaEl.textContent;
        const wrapper = document.createElement('div');
        wrapper.className = 'mega-cta-wrapper';
        wrapper.append(ctaLink);
        colDiv.append(wrapper);
      }
    }

    inner.append(colDiv);
  });

  panel.append(inner);

  // remove original nested ul
  nestedUl.remove();

  return panel;
}

/* ── apps launcher popover ────────────────────────── */

function buildAppsLauncher() {
  const wrapper = document.createElement('div');
  wrapper.className = 'apps-launcher-wrapper';

  const btn = document.createElement('button');
  btn.className = 'apps-launcher';
  btn.setAttribute('aria-label', 'Apps');
  btn.setAttribute('aria-expanded', 'false');
  // Exact SVG from adobe.com app switcher
  btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path d="M4.75 2.25H3.25C2.69772 2.25 2.25 2.69772 2.25 3.25V4.75C2.25 5.30228 2.69772 5.75 3.25 5.75H4.75C5.30228 5.75 5.75 5.30228 5.75 4.75V3.25C5.75 2.69772 5.30228 2.25 4.75 2.25Z"></path>
    <path d="M10.75 2.25H9.25C8.69772 2.25 8.25 2.69772 8.25 3.25V4.75C8.25 5.30228 8.69772 5.75 9.25 5.75H10.75C11.3023 5.75 11.75 5.30228 11.75 4.75V3.25C11.75 2.69772 11.3023 2.25 10.75 2.25Z"></path>
    <path d="M16.75 2.25H15.25C14.6977 2.25 14.25 2.69772 14.25 3.25V4.75C14.25 5.30228 14.6977 5.75 15.25 5.75H16.75C17.3023 5.75 17.75 5.30228 17.75 4.75V3.25C17.75 2.69772 17.3023 2.25 16.75 2.25Z"></path>
    <path d="M4.75 8.25H3.25C2.69772 8.25 2.25 8.69772 2.25 9.25V10.75C2.25 11.3023 2.69772 11.75 3.25 11.75H4.75C5.30228 11.75 5.75 11.3023 5.75 10.75V9.25C5.75 8.69772 5.30228 8.25 4.75 8.25Z"></path>
    <path d="M10.75 8.25H9.25C8.69772 8.25 8.25 8.69772 8.25 9.25V10.75C8.25 11.3023 8.69772 11.75 9.25 11.75H10.75C11.3023 11.75 11.75 11.3023 11.75 10.75V9.25C11.75 8.69772 11.3023 8.25 10.75 8.25Z"></path>
    <path d="M16.75 8.25H15.25C14.6977 8.25 14.25 8.69772 14.25 9.25V10.75C14.25 11.3023 14.6977 11.75 15.25 11.75H16.75C17.3023 11.75 17.75 11.3023 17.75 10.75V9.25C17.75 8.69772 17.3023 8.25 16.75 8.25Z"></path>
    <path d="M4.75 14.25H3.25C2.69772 14.25 2.25 14.6977 2.25 15.25V16.75C2.25 17.3023 2.69772 17.75 3.25 17.75H4.75C5.30228 17.75 5.75 17.3023 5.75 16.75V15.25C5.75 14.6977 5.30228 14.25 4.75 14.25Z"></path>
    <path d="M10.75 14.25H9.25C8.69772 14.25 8.25 14.6977 8.25 15.25V16.75C8.25 17.3023 8.69772 17.75 9.25 17.75H10.75C11.3023 17.75 11.75 17.3023 11.75 16.75V15.25C11.75 14.6977 11.3023 14.25 10.75 14.25Z"></path>
    <path d="M16.75 14.25H15.25C14.6977 14.25 14.25 14.6977 14.25 15.25V16.75C14.25 17.3023 14.6977 17.75 15.25 17.75H16.75C17.3023 17.75 17.75 17.3023 17.75 16.75V15.25C17.75 14.6977 17.3023 14.25 16.75 14.25Z"></path>
  </svg>`;

  const popover = document.createElement('div');
  popover.className = 'apps-popover';

  const apps = [
    { name: 'Adobe Express', url: '/express/', icon: '/icons/apps/express.png' },
    { name: 'Adobe Firefly', url: '/products/firefly.html', icon: '/icons/apps/firefly.png' },
    { name: 'Acrobat', url: '/acrobat.html', icon: '/icons/apps/acrobat.png' },
    { name: 'Photoshop', url: '/products/photoshop.html', icon: '/icons/apps/photoshop.png' },
    { name: 'Lightroom', url: '/products/photoshop-lightroom.html', icon: '/icons/apps/lightroom.png' },
    { name: 'Stock', url: 'https://stock.adobe.com', icon: '/icons/apps/stock.png' },
    { name: 'Acrobat Sign', url: '/sign.html', icon: '/icons/apps/sign.png' },
    { name: 'Fonts', url: 'https://fonts.adobe.com', icon: '/icons/apps/fonts.png' },
    { name: 'Behance', url: 'https://www.behance.net', icon: '/icons/apps/behance.png' },
    { name: 'Frame.io', url: 'https://frame.io', icon: '/icons/apps/frameio.png' },
    { name: 'Experience Cloud', url: 'https://experience.adobe.com', icon: '/icons/apps/experience-cloud.png' },
  ];

  const heading = document.createElement('div');
  heading.className = 'apps-heading';
  heading.textContent = 'Web Apps';

  const grid = document.createElement('div');
  grid.className = 'apps-grid';
  apps.forEach((app) => {
    const a = document.createElement('a');
    a.href = app.url;
    a.className = 'apps-item';
    const icon = document.createElement('img');
    icon.src = app.icon;
    icon.alt = app.name;
    icon.className = 'apps-icon';
    icon.width = 48;
    icon.height = 48;
    const name = document.createElement('span');
    name.className = 'apps-name';
    name.textContent = app.name;
    a.append(icon, name);
    grid.append(a);
  });

  const footer = document.createElement('div');
  footer.className = 'apps-footer';
  const adobeLink = document.createElement('a');
  adobeLink.href = 'https://www.adobe.com';
  adobeLink.className = 'apps-footer-link';
  adobeLink.innerHTML = '<svg class="apps-footer-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18.21 16"><path d="M9.02 5.1l-2.98 7.34h3.59L10.89 16H0L6.76 0h4.7l6.74 16h-4.79L9.01 5.1z" fill="#eb1000"></path></svg><span>Adobe.com</span>';
  const allAppsLink = document.createElement('a');
  allAppsLink.href = '/products/catalog.html';
  allAppsLink.className = 'apps-footer-link';
  allAppsLink.innerHTML = '<svg class="apps-footer-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><circle cx="4" cy="4" r="2.5"/><circle cx="10" cy="4" r="2.5"/><circle cx="16" cy="4" r="2.5"/><circle cx="4" cy="10" r="2.5"/><circle cx="10" cy="10" r="2.5"/><circle cx="16" cy="10" r="2.5"/><circle cx="4" cy="16" r="2.5"/><circle cx="10" cy="16" r="2.5"/><circle cx="16" cy="16" r="2.5"/></svg><span>All apps</span>';
  footer.append(adobeLink, allAppsLink);

  popover.append(heading, grid, footer);

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const nav = document.getElementById('nav');
    closeAllMenus(nav);
    const isOpen = popover.classList.contains('active');
    popover.classList.toggle('active');
    btn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
  });

  wrapper.append(btn, popover);
  return wrapper;
}

/* ── main decorate ────────────────────────────────── */

export default async function decorate(block) {
  // Use root paths so we request /nav.plain.html (not content/nav.plain.html)
  const path = '/nav';
  const fragment = await loadFragment(path);

  if (!fragment?.firstElementChild) {
    block.textContent = '';
    return;
  }

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  // clean brand link
  const navBrand = nav.querySelector('.nav-brand');
  if (navBrand) {
    const brandLink = navBrand.querySelector('.button');
    if (brandLink) {
      brandLink.className = '';
      const bwrap = brandLink.closest('.button-container');
      if (bwrap) bwrap.className = '';
    }
  }

  // build mega menus
  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    navSections.querySelectorAll(':scope .default-content-wrapper > ul > li').forEach((li) => {
      if (!li.querySelector('ul')) return;
      li.classList.add('nav-drop');
      li.setAttribute('aria-expanded', 'false');

      // wrap label text in a toggle button
      // AEM wraps li text in <p>, local .plain.html may use bare text nodes
      const labelP = Array.from(li.children).find((c) => c.tagName === 'P' && !c.querySelector('ul'));
      const label = labelP || li.childNodes[0];
      const toggleBtn = document.createElement('button');
      toggleBtn.className = 'nav-drop-toggle';
      toggleBtn.setAttribute('type', 'button');
      toggleBtn.textContent = label.textContent.trim();
      label.replaceWith(toggleBtn);

      // build mega panel
      const panel = buildMegaPanel(li);
      if (panel) li.append(panel);

      // click handler
      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const nav2 = document.getElementById('nav');
        closeAppsPopover(nav2);
        const wasOpen = li.getAttribute('aria-expanded') === 'true';
        closeAllMenus(nav2);
        if (!wasOpen) {
          li.setAttribute('aria-expanded', 'true');
          const overlay = nav2.querySelector('.mega-overlay');
          if (overlay && isDesktop.matches) overlay.classList.add('active');
        }
      });
    });
  }

  // overlay behind mega menu
  const overlay = document.createElement('div');
  overlay.className = 'mega-overlay';
  nav.append(overlay);

  // hamburger
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
    <span class="nav-hamburger-icon"></span>
  </button>`;
  hamburger.addEventListener('click', () => {
    const expanded = nav.getAttribute('aria-expanded') === 'true';
    if (expanded) {
      closeMobileMenu(nav);
    } else {
      nav.setAttribute('aria-expanded', 'true');
      document.body.style.overflowY = 'hidden';
      const btn = nav.querySelector('.nav-hamburger button');
      if (btn) btn.setAttribute('aria-label', 'Close navigation');
    }
  });
  nav.prepend(hamburger);

  // apps launcher + sign-in in tools
  const navTools = nav.querySelector('.nav-tools');
  if (navTools) {
    const appsLauncher = buildAppsLauncher();
    navTools.prepend(appsLauncher);
    // clean sign-in button styling
    const signBtn = navTools.querySelector('.button');
    if (signBtn) {
      signBtn.className = 'nav-signin';
      const bwrap = signBtn.closest('.button-container');
      if (bwrap) bwrap.className = '';
    }
  }

  nav.setAttribute('aria-expanded', 'false');

  // global listeners
  window.addEventListener('keydown', handleEscape);
  document.addEventListener('click', handleClickOutside);

  // responsive
  const syncDesktop = () => {
    if (isDesktop.matches) {
      nav.setAttribute('aria-expanded', 'false');
      document.body.style.overflowY = '';
      closeAllMenus(nav);
    }
  };
  isDesktop.addEventListener('change', syncDesktop);

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
