import { blogs } from './data.js';
import { escapeHtml, renderFooter } from './common.js';

function getSlug() {
  const params = new URLSearchParams(window.location.search);
  return params.get('slug') || '';
}

function renderArticle() {
  const root = document.getElementById('article-root');
  const slug = getSlug();
  const article = blogs.find((item) => item.slug === slug);

  if (!article) {
    root.innerHTML = `
      <a class="text-btn" href="blogs.html">← 返回博客列表</a>
      <h1 style="margin-top: 12px;">文章不存在</h1>
      <p style="margin-top: 8px; color: var(--text-secondary);">请检查链接，或返回列表重新选择文章。</p>
    `;
    return;
  }

  root.innerHTML = `
    <a class="text-btn" href="blogs.html">← 返回博客列表</a>
    <p class="blog-date" style="margin-top: 8px;">${escapeHtml(article.date)}</p>
    <h1>${escapeHtml(article.title)}</h1>
    <div class="tag-list compact">${article.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join('')}</div>
    <img class="article-cover" src="${escapeHtml(article.cover)}" alt="${escapeHtml(article.title)}" />
    <div class="article-content">
      ${article.content.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')}
    </div>
  `;
}

renderArticle();
renderFooter();
