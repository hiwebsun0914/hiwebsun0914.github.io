import { blogs } from './data.js';
import { escapeHtml, renderFooter } from './common.js';

function renderBlogsPage() {
  const count = document.getElementById('blogs-count');
  const grid = document.getElementById('blogs-grid');

  count.textContent = `共 ${blogs.length} 篇，按时间倒序展示。`;

  grid.innerHTML = blogs
    .map(
      (item) => `
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
      `
    )
    .join('');
}

renderBlogsPage();
renderFooter();
