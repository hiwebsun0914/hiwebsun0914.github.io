(() => {
  const listEl = document.querySelector('[data-posts-list]');
  const viewEl = document.querySelector('[data-post-view]');
  if (!listEl || !viewEl || !window.ContentLoader) return;
  const postAssetsBase = 'data/posts/';

  function resolveRelativeUrl(url, basePath) {
    if (!url) return url;
    const trimmed = url.trim();
    if (!trimmed) return trimmed;
    if (/^(?:[a-z][a-z0-9+.-]*:|#|\/)/i.test(trimmed)) return trimmed;
    const normalized = trimmed.replace(/^\.?\//, '');
    return `${basePath}${normalized}`;
  }

  function isCoverImage(value) {
    if (!value) return false;
    const trimmed = value.trim();
    if (!trimmed) return false;
    if (trimmed.startsWith('data:image/')) return true;
    return /\.(png|jpe?g|gif|webp|avif|svg)(?:\?.*)?(?:#.*)?$/i.test(trimmed);
  }

  function updateRelativeImages(container, basePath) {
    const images = container.querySelectorAll('img');
    images.forEach((image) => {
      const rawSrc = image.getAttribute('src');
      const resolved = resolveRelativeUrl(rawSrc, basePath);
      if (resolved && resolved !== rawSrc) {
        image.setAttribute('src', resolved);
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
    const contentHtml = window.marked
      ? window.marked.parse(post.content || '', { baseUrl: postAssetsBase })
      : window.renderMarkdown
        ? window.renderMarkdown(post.content || '', postAssetsBase)
        : post.content || '';
    const rawCover = post.cover?.trim();
    const cover = isCoverImage(rawCover) ? resolveRelativeUrl(rawCover, postAssetsBase) : '';

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

    const contentEl = viewEl.querySelector('.post-content');
    if (contentEl) {
      updateRelativeImages(contentEl, postAssetsBase);
    }
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
