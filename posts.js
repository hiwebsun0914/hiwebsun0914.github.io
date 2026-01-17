(() => {
  const listEl = document.querySelector('[data-posts-list]');
  const viewEl = document.querySelector('[data-post-view]');
  if (!listEl || !viewEl || !window.ContentLoader) return;
  const assetBasePath = 'data/posts/';

  function isRelativeUrl(url) {
    if (!url) return false;
    return !/^(?:[a-z][a-z0-9+.-]*:|\/\/|#|\/)/i.test(url);
  }

  function normalizeRelativeUrl(url) {
    return url.replace(/^\.\//, '').replace(/^\//, '');
  }

  function resolveRelativeAssets(container) {
    const images = Array.from(container.querySelectorAll('img[src]'));
    const links = Array.from(container.querySelectorAll('a[href]'));

    images.forEach((img) => {
      const src = img.getAttribute('src');
      if (isRelativeUrl(src)) {
        img.setAttribute('src', `${assetBasePath}${normalizeRelativeUrl(src)}`);
      }
    });

    links.forEach((link) => {
      const href = link.getAttribute('href');
      if (isRelativeUrl(href)) {
        link.setAttribute('href', `${assetBasePath}${normalizeRelativeUrl(href)}`);
      }
    });
  }

  async function loadPosts() {
    return window.ContentLoader.loadPosts();
  }

  function renderList(posts, activeId) {
    listEl.innerHTML = '';

    if (posts.length === 0) {
      listEl.innerHTML = '<p class="muted">暂无文章，请先在管理页添加内容。</p>';
      return;
    }

    for (const post of posts) {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'post-list-item';
      item.dataset.postId = post.id;
      item.innerHTML = `
        <span class="post-title">${post.title}</span>
        <span class="post-meta">${post.category || '文章'} · ${post.readTime || ''}</span>
      `;

      if (post.id === activeId) item.classList.add('is-active');

      item.addEventListener('click', () => {
        renderView(post);
        highlight(post.id);
        const url = new URL(window.location.href);
        url.searchParams.set('id', post.id);
        window.history.replaceState({}, '', url);
      });

      listEl.append(item);
    }
  }

  function highlight(postId) {
    const buttons = Array.from(listEl.querySelectorAll('.post-list-item'));
    for (const button of buttons) {
      button.classList.toggle('is-active', button.dataset.postId === postId);
    }
  }

  function renderView(post) {
    if (!post) return;

    const tags = Array.isArray(post.tags) ? post.tags : [];
    const rawContent = post.content || '';
    const cleanedContent = rawContent.replace(/<!--[\s\S]*?-->/g, '');
    const contentHtml = window.marked
      ? window.marked.parse(cleanedContent)
      : window.renderMarkdown
        ? window.renderMarkdown(cleanedContent)
        : cleanedContent;
    const cover = post.cover?.trim();

    viewEl.innerHTML = `
      <header class="post-view-header">
        <p class="post-meta">${post.category || '文章'} · ${post.readTime || ''}</p>
        <h2>${post.title}</h2>
        <p class="muted">${post.date || ''}</p>
        <p class="post-summary">${post.summary || ''}</p>
        ${tags.length ? `<div class="tag-list">${tags.map((tag) => `<span>${tag}</span>`).join('')}</div>` : ''}
      </header>
      ${cover ? `<div class="media-frame post-cover"><img src="${cover}" alt="${post.title}封面" loading="lazy" /></div>` : ''}
      <div class="post-content">${contentHtml}</div>
    `;
    resolveRelativeAssets(viewEl);
  }

  function getInitialId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
  }

  async function init() {
    const posts = await loadPosts();
    const sorted = posts.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const initialId = getInitialId();
    const initialPost = initialId ? sorted.find((post) => post.id === initialId) : sorted[0];

    renderList(sorted, initialPost?.id);

    if (initialPost) {
      renderView(initialPost);
    }
  }

  init();
})();
