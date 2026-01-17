(() => {
  const listEl = document.querySelector('[data-posts-list]');
  const viewEl = document.querySelector('[data-post-view]');
  if (!listEl || !viewEl || !window.ContentLoader) return;
  const assetBasePath = 'data/posts/';
  const markdownImagePattern = /!\[([^\]]*)\]\(\s*(<[^>]+>|[^)\s]+)\s*(?:(?:"([^"]*)")|(?:'([^']*)'))?\s*\)/g;
  const markdownLinkPattern = /\[([^\]]+)\]\(\s*(<[^>]+>|[^)\s]+)\s*(?:(?:"([^"]*)")|(?:'([^']*)'))?\s*\)/g;

  function isRelativeUrl(url) {
    if (!url) return false;
    return !/^(?:[a-z][a-z0-9+.-]*:|\/\/|#|\/)/i.test(url);
  }

  function normalizeRelativeUrl(url) {
    return url.replace(/^\.\//, '').replace(/^\//, '');
  }

  function resolveAssetUrl(url) {
    if (!url) return url;
    const trimmed = url.trim();
    if (!isRelativeUrl(trimmed)) return trimmed;
    const normalized = normalizeRelativeUrl(trimmed);
    if (normalized.startsWith(assetBasePath)) return normalized;
    return `${assetBasePath}${normalized}`;
  }

  function resolveMarkdownAssets(source) {
    if (!source) return source;
    let updated = source.replace(markdownImagePattern, (match, alt, rawUrl, titleDouble, titleSingle) => {
      const url = rawUrl.startsWith('<') && rawUrl.endsWith('>') ? rawUrl.slice(1, -1).trim() : rawUrl.trim();
      const resolved = resolveAssetUrl(url);
      if (resolved === url) return match;
      const title = titleDouble || titleSingle;
      const wrappedUrl = rawUrl.startsWith('<') && rawUrl.endsWith('>') ? `<${resolved}>` : resolved;
      const titlePart = title ? ` "${title}"` : '';
      return `![${alt}](${wrappedUrl}${titlePart})`;
    });

    updated = updated.replace(markdownLinkPattern, (match, label, rawUrl, titleDouble, titleSingle) => {
      const url = rawUrl.startsWith('<') && rawUrl.endsWith('>') ? rawUrl.slice(1, -1).trim() : rawUrl.trim();
      const resolved = resolveAssetUrl(url);
      if (resolved === url) return match;
      const title = titleDouble || titleSingle;
      const wrappedUrl = rawUrl.startsWith('<') && rawUrl.endsWith('>') ? `<${resolved}>` : resolved;
      const titlePart = title ? ` "${title}"` : '';
      return `[${label}](${wrappedUrl}${titlePart})`;
    });

    return updated;
  }

  function resolveRelativeAssets(container) {
    const images = Array.from(container.querySelectorAll('img[src]'));
    const links = Array.from(container.querySelectorAll('a[href]'));

    images.forEach((img) => {
      const src = img.getAttribute('src');
      const resolved = resolveAssetUrl(src);
      if (resolved && resolved !== src) img.setAttribute('src', resolved);
    });

    links.forEach((link) => {
      const href = link.getAttribute('href');
      const resolved = resolveAssetUrl(href);
      if (resolved && resolved !== href) link.setAttribute('href', resolved);
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
    const resolvedContent = resolveMarkdownAssets(cleanedContent);
    const contentHtml = window.marked
      ? window.marked.parse(resolvedContent)
      : window.renderMarkdown
        ? window.renderMarkdown(resolvedContent)
        : resolvedContent;
    const cover = resolveAssetUrl(post.cover?.trim());

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
