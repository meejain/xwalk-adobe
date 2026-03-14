import { loadFragment } from '../fragment/fragment.js';

const isMobile = window.matchMedia('(max-width: 599px)');

/* ── SVG icons ──────────────────────────────────── */

const ICONS = {
  globe: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="18" height="18" fill="currentColor"><path d="M50 23.8c-.2-3.3-1-6.5-2.4-9.5A24.81 24.81 0 0 0 26.2 0h-2.4C14.6.4 6.3 5.9 2.4 14.3 1 17.3.2 20.5 0 23.8v2.4c.2 3.3 1 6.5 2.4 9.5 4 8.4 12.2 13.9 21.4 14.3h2.4c9.2-.4 17.5-5.9 21.4-14.3 1.4-3 2.2-6.2 2.4-9.5v-2.4zm-2.4 0h-9.5c0-3.2-.4-6.4-1.2-9.5H45c1.6 2.9 2.5 6.2 2.6 9.5zm-14-11.9h-7.4V2.6c3.1.7 5.7 4.5 7.4 9.3zm-9.8-9.3v9.3h-7.4c1.7-4.8 4.3-8.6 7.4-9.3zm0 11.7v9.5h-9.5c.1-3.2.6-6.4 1.4-9.5h8.1zm0 11.9v9.5h-8.1c-.8-3.1-1.3-6.3-1.4-9.5h9.5zm0 11.9v9.3c-3.1-.7-5.7-4.5-7.4-9.3h7.4zm2.4 9.3v-9.3h7.4c-1.7 4.8-4.3 8.6-7.4 9.3zm0-11.7v-9.5h9.5c-.1 3.2-.6 6.4-1.4 9.5h-8.1zm0-11.9v-9.5h8.1c.8 3.1 1.3 6.3 1.4 9.5h-9.5zm17.1-11.9h-7.1c-.9-3.1-2.4-6.1-4.5-8.6 4.7 1.5 8.8 4.5 11.6 8.6zM18.6 3.3c-2.2 2.5-3.8 5.4-4.8 8.6H6.7c2.9-4.1 7.1-7.1 11.9-8.6zM5 14.3h8.1c-.7 3.1-1.1 6.3-1.2 9.5H2.4c.1-3.3 1-6.6 2.6-9.5zM2.4 26.2h9.5c0 3.2.4 6.4 1.2 9.5H5c-1.6-2.9-2.5-6.2-2.6-9.5zm4 11.9h7.4c.9 3.1 2.4 6.1 4.5 8.6-4.7-1.5-8.8-4.5-11.7-8.6h-.2zm25 8.6c2.2-2.5 3.8-5.4 4.8-8.6h7.4c-3 4.1-7.3 7.2-12.2 8.6zm13.6-11h-8.1c.7-3.1 1.1-6.3 1.2-9.5h9.5c-.1 3.3-1 6.6-2.6 9.5z"></path></svg>',
  facebook: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35 35" width="20" height="20" fill="currentColor"><path d="M28.44 0a6.32 6.32 0 0 1 4.63 1.93A6.32 6.32 0 0 1 35 6.55v21.88A6.57 6.57 0 0 1 28.44 35h-4.29V21.44h4.54l.68-5.28h-5.22v-3.38a2.92 2.92 0 0 1 .54-1.91 2.66 2.66 0 0 1 2.08-.64l2.78-.02V5.49a30.54 30.54 0 0 0-4.05-.2 6.77 6.77 0 0 0-4.96 1.82 6.9 6.9 0 0 0-1.85 5.15v3.9h-4.56v5.28h4.55V35H6.57a6.32 6.32 0 0 1-4.63-1.93A6.32 6.32 0 0 1 0 28.45V6.56a6.32 6.32 0 0 1 1.93-4.63A6.32 6.32 0 0 1 6.55 0Z"></path></svg>',
  instagram: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35 35" width="20" height="20" fill="currentColor"><path d="M4.5.1h26c2.4-.1 4.5 1.8 4.6 4.3v25.9c.1 2.5-1.9 4.5-4.4 4.6H4.5C2.1 35 0 33.1-.1 30.6V4.4C0 2 2.1 0 4.5.1zM25.7 4c-.8 0-1.5.6-1.5 1.5V9.3c0 .8.6 1.5 1.5 1.5h4c.8 0 1.5-.6 1.5-1.5V5.5c0-.8-.6-1.5-1.5-1.5h-4zm5.4 10.9H28a10.67 10.67 0 0 1-10.3 13.6h-.2c-5.9 0-10.9-4.8-10.9-10.5 0-1 .2-2.1.4-3.1H3.9v14.8c0 .7.6 1.3 1.3 1.3h24.2c.7 0 1.3-.5 1.3-1.2V14.9h.4zm-13.5-4.4c-3.7.1-6.7 3.2-6.5 7s3.2 6.7 7 6.5c3.7-.1 6.5-3.1 6.5-6.8-.1-3.7-3.2-6.7-7-6.7z"></path></svg>',
  twitter: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35 35" width="20" height="20" fill="currentColor"><path d="M28.5 0h-22C2.9 0 0 2.9 0 6.5v22C0 32.1 2.9 35 6.5 35h22c3.6 0 6.5-2.9 6.5-6.5v-22C35 2.9 32.1 0 28.5 0zM30 30.4h-5.9c-.3 0-.6-.1-.8-.4L16 21l-7.3 9.1c-.2.2-.5.4-.8.4-.2 0-.4-.1-.6-.2-.4-.3-.5-1-.2-1.4l7.6-9.5L4.2 6.2c-.4-.4-.3-1.1.1-1.4.2-.2.4-.2.7-.2h5.9c.3 0 .6.1.8.4l7.3 9 7.3-9.1c.3-.4 1-.5 1.4-.2.4.3.5 1 .2 1.4l-7.6 9.5 10.5 13.1c.2.2.3.4.3.7-.1.6-.5 1-1.1 1zm-2.1-2h-3.3L7.1 6.6h3.3l17.5 21.8z"></path></svg>',
  linkedin: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35 35" width="20" height="20" fill="currentColor"><path d="M5.4 29.3h5.26V13.49H5.4ZM11 8.61a2.7 2.7 0 0 0-.81-1.96 2.9 2.9 0 0 0-2.12-.78 3.03 3.03 0 0 0-2.16.78 2.56 2.56 0 0 0-.83 1.96 2.6 2.6 0 0 0 .81 1.95 2.9 2.9 0 0 0 2.11.79h.02a3 3 0 0 0 2.17-.79A2.59 2.59 0 0 0 11 8.61ZM24.34 29.3h5.26v-9.07a7.56 7.56 0 0 0-1.66-5.3 5.7 5.7 0 0 0-4.4-1.8 5.3 5.3 0 0 0-4.76 2.66h.04v-2.3h-5.26q.07 1.5 0 15.81h5.26v-8.84a3.75 3.75 0 0 1 .16-1.27 3.52 3.52 0 0 1 1.03-1.36 2.58 2.58 0 0 1 1.68-.56q2.64 0 2.65 3.58ZM35 6.56v21.88A6.57 6.57 0 0 1 28.44 35H6.56a6.32 6.32 0 0 1-4.63-1.93A6.32 6.32 0 0 1 0 28.45V6.56a6.32 6.32 0 0 1 1.93-4.63A6.32 6.32 0 0 1 6.55 0h21.88a6.32 6.32 0 0 1 4.63 1.93A6.32 6.32 0 0 1 35 6.55Z"></path></svg>',
  adchoices: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 9" width="12" height="12" fill="currentColor"><path d="M7.99 5.23c.78-.43.92-.97.01-1.51L1.61.23C.83-.21.2.15.2 1.03v6.88c0 1.13.59 1.24 1.37.82l.73-.41c.12-.08.4-.32.32-.64-.07-.3-.33-.39-.62-.31-.44.24-.71 0-.71-.49v-4.9c0-.49.35-.69.78-.45l4.41 2.52c.43.25.43.64-.01.88L3.75 6.34V4.67a.47.47 0 1 0-.94 0v2.37c0 .26.22.44.47.53.1.04.3.05.44-.03l4.27-2.31z"></path><path d="M3.79 3.42a.5.5 0 1 1-.98 0 .5.5 0 0 1 .98 0"></path></svg>',
};

/* ── build social links ─────────────────────────── */

function buildSocialLinks() {
  const socials = [
    { name: 'Facebook', icon: 'facebook', url: 'https://www.facebook.com/adobe' },
    { name: 'Instagram', icon: 'instagram', url: 'https://www.instagram.com/adobe/' },
    { name: 'X (Twitter)', icon: 'twitter', url: 'https://twitter.com/Adobe' },
    { name: 'LinkedIn', icon: 'linkedin', url: 'https://www.linkedin.com/company/adobe' },
  ];

  const list = document.createElement('div');
  list.className = 'footer-social';
  socials.forEach((s) => {
    const a = document.createElement('a');
    a.href = s.url;
    a.setAttribute('aria-label', s.name);
    a.className = 'footer-social-link';
    a.innerHTML = ICONS[s.icon];
    list.append(a);
  });
  return list;
}

/* ── region data ───────────────────────────────── */

const REGIONS = {
  Americas: [
    ['Argentina', 'https://www.adobe.com/ar/'],
    ['Brasil', 'https://www.adobe.com/br/'],
    ['Canada - English', 'https://www.adobe.com/ca/'],
    ['Canada - Français', 'https://www.adobe.com/ca_fr/'],
    ['Chile', 'https://www.adobe.com/cl/'],
    ['Colombia', 'https://www.adobe.com/co/'],
    ['Costa Rica', 'https://www.adobe.com/cr/'],
    ['Ecuador', 'https://www.adobe.com/ec/'],
    ['Guatemala', 'https://www.adobe.com/gt/'],
    ['Latinoamérica', 'https://www.adobe.com/la/'],
    ['México', 'https://www.adobe.com/mx/'],
    ['Perú', 'https://www.adobe.com/pe/'],
    ['Puerto Rico', 'https://www.adobe.com/pr/'],
    ['United States', 'https://www.adobe.com/'],
  ],
  'Europe, Middle East and Africa': [
    ['Africa - English', 'https://www.adobe.com/africa/'],
    ['België - Nederlands', 'https://www.adobe.com/be_nl/'],
    ['Belgique - Français', 'https://www.adobe.com/be_fr/'],
    ['Belgium - English', 'https://www.adobe.com/be_en/'],
    ['Danmark', 'https://www.adobe.com/dk/'],
    ['Deutschland', 'https://www.adobe.com/de/'],
    ['España', 'https://www.adobe.com/es/'],
    ['France', 'https://www.adobe.com/fr/'],
    ['Ireland', 'https://www.adobe.com/ie/'],
    ['Israel - English', 'https://www.adobe.com/il_en/'],
    ['Italia', 'https://www.adobe.com/it/'],
    ['Luxembourg - Deutsch', 'https://www.adobe.com/lu_de/'],
    ['Luxembourg - English', 'https://www.adobe.com/lu_en/'],
    ['Luxembourg - Français', 'https://www.adobe.com/lu_fr/'],
    ['Nederland', 'https://www.adobe.com/nl/'],
    ['Norge', 'https://www.adobe.com/no/'],
    ['Polska', 'https://www.adobe.com/pl/'],
    ['Portugal', 'https://www.adobe.com/pt/'],
    ['Schweiz', 'https://www.adobe.com/ch_de/'],
    ['South Africa', 'https://www.adobe.com/za/'],
    ['Suisse', 'https://www.adobe.com/ch_fr/'],
    ['Suomi', 'https://www.adobe.com/fi/'],
    ['Sverige', 'https://www.adobe.com/se/'],
    ['Svizzera', 'https://www.adobe.com/ch_it/'],
    ['Türkiye', 'https://www.adobe.com/tr/'],
    ['United Kingdom', 'https://www.adobe.com/uk/'],
    ['Österreich', 'https://www.adobe.com/at/'],
    ['Česká republika', 'https://www.adobe.com/cz/'],
  ],
  'Asia Pacific': [
    ['Australia', 'https://www.adobe.com/au/'],
    ['Hong Kong S.A.R. of China', 'https://www.adobe.com/hk_en/'],
    ['India', 'https://www.adobe.com/in/'],
    ['Indonesia', 'https://www.adobe.com/id_id/'],
    ['Malaysia', 'https://www.adobe.com/my_ms/'],
    ['New Zealand', 'https://www.adobe.com/nz/'],
    ['Philippines - English', 'https://www.adobe.com/ph_en/'],
    ['Singapore', 'https://www.adobe.com/sg/'],
    ['Thailand - English', 'https://www.adobe.com/th_en/'],
    ['Vietnam - English', 'https://www.adobe.com/vn_en/'],
    ['日本', 'https://www.adobe.com/jp/'],
    ['한국', 'https://www.adobe.com/kr/'],
    ['中国', 'https://www.adobe.com/cn/'],
    ['台灣地區', 'https://www.adobe.com/tw/'],
  ],
};

/* ── build region modal ────────────────────────── */

function buildRegionModal() {
  const overlay = document.createElement('div');
  overlay.className = 'footer-region-overlay';

  const modal = document.createElement('div');
  modal.className = 'footer-region-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-label', 'Choose your region');

  // close button
  const closeBtn = document.createElement('button');
  closeBtn.className = 'footer-region-close';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10" fill="#707070"/><path d="M13.5 7.6l-1.1-1.1L10 8.9 7.6 6.5 6.5 7.6 8.9 10l-2.4 2.4 1.1 1.1L10 11.1l2.4 2.4 1.1-1.1L11.1 10z" fill="#fff"/></svg>';

  // title
  const header = document.createElement('div');
  header.className = 'footer-region-header';
  header.innerHTML = '<p class="footer-region-title">Choose your region</p><p class="footer-region-subtitle">Selecting a region changes the language and/or content on Adobe.com.</p>';

  // region groups
  const content = document.createElement('div');
  content.className = 'footer-region-content';
  Object.entries(REGIONS).forEach(([name, countries]) => {
    const group = document.createElement('div');
    group.className = 'footer-region-group';
    const groupTitle = document.createElement('p');
    groupTitle.className = 'footer-region-group-title';
    groupTitle.textContent = name;
    group.append(groupTitle);

    const list = document.createElement('ul');
    list.className = 'footer-region-list';
    countries.forEach(([label, url]) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = url;
      a.textContent = label;
      li.append(a);
      list.append(li);
    });
    group.append(list);
    content.append(group);
  });

  modal.append(closeBtn, header, content);

  // close handlers
  const close = () => {
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
  };
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) close();
  });

  overlay.append(modal);
  return overlay;
}

/* ── build region selector ──────────────────────── */

function buildRegionSelector() {
  const wrapper = document.createElement('div');
  wrapper.className = 'footer-region-wrapper';

  const btn = document.createElement('button');
  btn.className = 'footer-region';
  btn.setAttribute('type', 'button');
  btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML = `${ICONS.globe}<span>Change region</span><svg class="footer-region-chevron" xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><path d="M1 3.5l4 4 4-4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  const modal = buildRegionModal();
  const resetBtn = () => btn.setAttribute('aria-expanded', 'false');
  btn.addEventListener('click', () => {
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    btn.setAttribute('aria-expanded', 'true');
    modal.querySelector('.footer-region-close').addEventListener('click', resetBtn, { once: true });
  });

  wrapper.append(btn);
  document.body.append(modal);
  return wrapper;
}

/* ── build Adobe logo ───────────────────────────── */

function buildAdobeLogo() {
  const logo = document.createElement('div');
  logo.className = 'footer-logo';
  const img = document.createElement('img');
  img.src = '/icons/adobe-logo.svg';
  img.alt = 'Adobe';
  img.width = 105;
  img.height = 28;
  logo.append(img);
  return logo;
}

/* ── build nav grid (Section 1) ─────────────────── */

function buildNavGrid(section) {
  const navEl = document.createElement('nav');
  navEl.className = 'footer-nav';
  navEl.setAttribute('aria-label', 'Footer navigation');

  const headings = section.querySelectorAll('h2');
  headings.forEach((h2) => {
    const ul = h2.nextElementSibling;
    if (!ul || ul.tagName !== 'UL') return;

    const col = document.createElement('div');
    col.className = 'footer-nav-col';

    const heading = document.createElement('h5');
    heading.className = 'footer-nav-heading';
    heading.textContent = h2.textContent;

    // accordion toggle for mobile
    heading.setAttribute('role', 'button');
    heading.setAttribute('tabindex', '0');
    heading.setAttribute('aria-expanded', 'false');
    heading.addEventListener('click', () => {
      if (!isMobile.matches) return;
      const expanded = heading.getAttribute('aria-expanded') === 'true';
      heading.setAttribute('aria-expanded', String(!expanded));
    });
    heading.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        heading.click();
      }
    });

    const links = document.createElement('ul');
    links.className = 'footer-nav-links';
    ul.querySelectorAll('li').forEach((li) => {
      const newLi = document.createElement('li');
      const a = li.querySelector('a');
      if (a) {
        const newA = document.createElement('a');
        newA.href = a.href;
        newA.textContent = a.textContent;
        newLi.append(newA);
      }
      links.append(newLi);
    });

    col.append(heading, links);
    navEl.append(col);
  });

  return navEl;
}

/* ── build featured products (Section 2) ────────── */

function buildFeaturedProducts(section) {
  const strip = document.createElement('div');
  strip.className = 'footer-products';

  const heading = section.querySelector('h2, h5');
  if (heading) {
    const title = document.createElement('h5');
    title.className = 'footer-products-title';
    title.textContent = heading.textContent;
    strip.append(title);
  }

  const list = document.createElement('div');
  list.className = 'footer-products-list';

  // Try list-based structure first (legacy: <ul><li><a><img>name</a></li></ul>)
  const listItems = section.querySelectorAll('li');
  if (listItems.length) {
    listItems.forEach((li) => {
      const a = li.querySelector('a');
      if (!a) return;
      const link = document.createElement('a');
      link.href = a.href;
      link.className = 'footer-product-item';
      const img = a.querySelector('img');
      if (img) {
        const icon = document.createElement('img');
        icon.src = img.src;
        icon.alt = img.alt;
        icon.width = 30;
        icon.height = 30;
        icon.className = 'footer-product-icon';
        link.append(icon);
      }
      const name = document.createElement('span');
      name.textContent = a.textContent.trim();
      link.append(name);
      list.append(link);
    });
  } else {
    // Xwalk flat structure: alternating <p><picture> and <p><a> pairs
    let currentPic = null;
    section.querySelectorAll('p').forEach((p) => {
      const pic = p.querySelector('picture');
      const a = p.querySelector('a');
      if (pic && !a) {
        currentPic = pic;
      } else if (a && currentPic) {
        const link = document.createElement('a');
        link.href = a.href;
        link.className = 'footer-product-item';
        const img = currentPic.querySelector('img');
        if (img) {
          const icon = document.createElement('img');
          icon.src = img.src;
          icon.alt = img.alt || '';
          icon.width = 30;
          icon.height = 30;
          icon.className = 'footer-product-icon';
          link.append(icon);
        }
        const name = document.createElement('span');
        name.textContent = a.textContent.trim();
        link.append(name);
        list.append(link);
        currentPic = null;
      }
    });
  }

  strip.append(list);
  return strip;
}

/* ── build bottom legal bar (Section 3) ─────────── */

function buildBottomBar(section) {
  const bar = document.createElement('div');
  bar.className = 'footer-bottom';

  // left: region + social
  const left = document.createElement('div');
  left.className = 'footer-bottom-left';
  left.append(buildRegionSelector(), buildSocialLinks());

  // center: Adobe logo + copyright
  const center = document.createElement('div');
  center.className = 'footer-bottom-center';
  center.append(buildAdobeLogo());
  const copyright = section.querySelector('p');
  if (copyright) {
    const p = document.createElement('p');
    p.className = 'footer-copyright';
    p.textContent = copyright.textContent;
    center.append(p);
  }

  // right: legal links
  const right = document.createElement('div');
  right.className = 'footer-bottom-right';
  const legalP = section.querySelectorAll('p')[1];
  if (legalP) {
    const legalLinks = document.createElement('div');
    legalLinks.className = 'footer-legal';
    legalP.querySelectorAll('a').forEach((a, idx) => {
      if (idx > 0) {
        const sep = document.createElement('span');
        sep.className = 'footer-legal-sep';
        sep.textContent = '/';
        legalLinks.append(sep);
      }
      const link = document.createElement('a');
      link.href = a.href;
      link.textContent = a.textContent;
      if (a.textContent === 'AdChoices') {
        link.innerHTML = `${ICONS.adchoices} AdChoices`;
      }
      legalLinks.append(link);
    });
    right.append(legalLinks);
  }

  bar.append(left, center, right);
  return bar;
}

/* ── main decorate ──────────────────────────────── */

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const path = '/footer';
  const fragment = await loadFragment(path);

  if (!fragment?.firstElementChild) {
    block.textContent = '';
    return;
  }

  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // Identify sections: divs inside the fragment wrapper
  const sections = [...footer.querySelectorAll(':scope > div')];
  if (sections.length < 3) {
    block.append(footer);
    return;
  }

  const [navSection, productsSection, legalSection] = sections;

  const wrapper = document.createElement('div');
  wrapper.className = 'footer-wrapper';

  // Section 1: nav grid
  const navContainer = document.createElement('div');
  navContainer.className = 'footer-section footer-section-nav';
  navContainer.append(buildNavGrid(navSection));
  wrapper.append(navContainer);

  // Section 2: featured products
  const productsContainer = document.createElement('div');
  productsContainer.className = 'footer-section footer-section-products';
  productsContainer.append(buildFeaturedProducts(productsSection));
  wrapper.append(productsContainer);

  // Section 3: bottom legal
  const bottomContainer = document.createElement('div');
  bottomContainer.className = 'footer-section footer-section-bottom';
  bottomContainer.append(buildBottomBar(legalSection));
  wrapper.append(bottomContainer);

  block.append(wrapper);
}
