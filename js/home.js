import { blogs, externalLinks, galleryImages, heroData, profileData } from './data.js';
import { escapeHtml, initMobileNav, initSmoothScroll, renderFooter } from './common.js';
import { initGuestbook } from './guestbook.js';

function renderHero() {
  document.getElementById('hero-avatar').src = heroData.avatar;
  document.getElementById('hero-avatar').alt = `${heroData.name} 的头像`;
  document.getElementById('hero-welcome').textContent = heroData.welcome;
  document.getElementById('hero-name').textContent = heroData.name;
  document.getElementById('hero-signature').textContent = heroData.signature;
  document.getElementById('hero-intro').textContent = heroData.intro;
}

function renderProfile() {
  const root = document.getElementById('profile-content');
  root.innerHTML = `
    <div class="profile-meta">
      <p><strong>姓名：</strong>${escapeHtml(profileData.name)}</p>
      <p><strong>学校：</strong>${escapeHtml(profileData.school)}</p>
      <p><strong>专业：</strong>${escapeHtml(profileData.major)}</p>
      <p><strong>年级：</strong>${escapeHtml(profileData.grade)}</p>
    </div>
    <div class="profile-column">
      <h3>兴趣方向</h3>
      <ul class="pill-list">${profileData.interests.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
    </div>
    <div class="profile-column">
      <h3>技能标签</h3>
      <ul class="tag-list">${profileData.skills.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
    </div>
    <div class="profile-column">
      <h3>联系方式</h3>
      <p>邮箱：${escapeHtml(profileData.contact.email)}</p>
      <p>微信：${escapeHtml(profileData.contact.wechat)}</p>
      <p>所在地：${escapeHtml(profileData.contact.location)}</p>
    </div>
  `;
}

function renderLinks() {
  const root = document.getElementById('links-grid');
  root.innerHTML = externalLinks
    .map(
      (item) => `
        <a class="card link-card" href="${escapeHtml(item.url)}" target="_blank" rel="noreferrer">
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.description)}</p>
          <span>${escapeHtml(item.action)} →</span>
        </a>
      `
    )
    .join('');
}

function blogCard(item) {
  return `
    <article class="card blog-card">
      <img class="blog-cover" src="${escapeHtml(item.cover)}" alt="${escapeHtml(item.title)}" />
      <div class="blog-body">
        <p class="blog-date">${escapeHtml(item.date)}</p>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.excerpt)}</p>
        <div class="tag-list compact">${item.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join('')}</div>
        <a class="text-btn" href="article.html?slug=${encodeURIComponent(item.slug)}">阅读全文</a>
      </div>
    </article>
  `;
}

function renderHomeBlogs() {
  const root = document.getElementById('home-blogs-grid');
  root.innerHTML = blogs.slice(0, 4).map(blogCard).join('');
}

function renderGallery() {
  const root = document.getElementById('gallery-grid');
  const modal = document.getElementById('image-modal');
  const modalImage = document.getElementById('modal-image');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');

  root.innerHTML = galleryImages
    .map(
      (item) => `
        <figure class="card gallery-item">
          <button type="button" class="gallery-button" data-gallery-id="${item.id}" aria-label="查看${escapeHtml(item.title)}">
            <img src="${escapeHtml(item.src)}" alt="${escapeHtml(item.title)}" />
          </button>
          <figcaption>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.desc)}</p>
          </figcaption>
        </figure>
      `
    )
    .join('');

  root.addEventListener('click', (event) => {
    const button = event.target.closest('[data-gallery-id]');
    if (!button) return;

    const id = Number(button.getAttribute('data-gallery-id'));
    const item = galleryImages.find((image) => image.id === id);
    if (!item) return;

    modalImage.src = item.src;
    modalImage.alt = item.title;
    modalTitle.textContent = item.title;
    modalDesc.textContent = item.desc;

    modal.classList.remove('hidden');
    document.body.classList.add('modal-open');
  });

  modal.addEventListener('click', (event) => {
    if (!event.target.closest('[data-close-modal]')) return;
    modal.classList.add('hidden');
    document.body.classList.remove('modal-open');
  });
}

function init() {
  renderHero();
  renderProfile();
  renderLinks();
  renderHomeBlogs();
  renderGallery();
  renderFooter();
  initMobileNav();
  initSmoothScroll();
  initGuestbook('#guestbook-root');
}

init();
