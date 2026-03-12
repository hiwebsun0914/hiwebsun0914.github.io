import { footerData } from './data.js';

export function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function renderFooter() {
  const copy = document.getElementById('footer-copy');
  const slogan = document.getElementById('footer-slogan');
  const socials = document.getElementById('footer-socials');

  if (!copy || !slogan || !socials) return;

  copy.textContent = footerData.copyright;
  slogan.textContent = footerData.slogan;
  socials.innerHTML = footerData.socials
    .map((item) => `<a href="${escapeHtml(item.url)}" target="_blank" rel="noreferrer">${escapeHtml(item.label)}</a>`)
    .join('');
}

export function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

export function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

export function resolveRepo(repoConfig) {
  if (repoConfig && repoConfig !== 'auto') {
    return repoConfig;
  }

  const host = window.location.hostname.toLowerCase();
  if (!host.endsWith('.github.io')) {
    return '';
  }

  const owner = host.split('.')[0];
  const segments = window.location.pathname.split('/').filter(Boolean);
  const repo = segments[0] || `${owner}.github.io`;

  return `${owner}/${repo}`;
}
