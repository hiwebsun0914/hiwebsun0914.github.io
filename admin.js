(() => {
  const listEl = document.querySelector('[data-admin-list]');
  const form = document.querySelector('[data-admin-form]');
  const previewEl = document.querySelector('[data-preview]');
  const newButton = document.querySelector('[data-new-post]');
  const deleteButton = document.querySelector('[data-delete-post]');
  const saveLocalButton = document.querySelector('[data-save-local]');
  const downloadButton = document.querySelector('[data-download-json]');
  const resetButton = document.querySelector('[data-reset-data]');

  if (!listEl || !form || !previewEl) return;

  const storageKey = 'postsData';
  let posts = [];
  let activeId = null;

  function safeStorageGet(key) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  function safeStorageSet(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch {}
  }

  async function loadInitial() {
    const raw = safeStorageGet(storageKey);
    if (raw) {
      try {
        const data = JSON.parse(raw);
        if (Array.isArray(data)) return data;
      } catch {
        return [];
      }
    }

    try {
      return await fetch('data/posts.json', { cache: 'no-store' }).then((response) => response.json());
    } catch {
      return [];
    }
  }

  function renderList() {
    listEl.innerHTML = '';

    if (posts.length === 0) {
      listEl.innerHTML = '<p class="muted">暂无文章，点击“新建文章”开始。</p>';
      return;
    }

    for (const post of posts) {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'admin-list-item';
      item.dataset.postId = post.id;
      item.innerHTML = `
        <span class="post-title">${post.title}</span>
        <span class="post-meta">${post.category || '文章'} · ${post.date || ''}</span>
      `;
      if (post.id === activeId) item.classList.add('is-active');
      item.addEventListener('click', () => {
        setActive(post.id);
      });
      listEl.append(item);
    }
  }

  function renderPreview(content) {
    const html = window.marked
      ? window.marked.parse(content || '')
      : window.renderMarkdown
        ? window.renderMarkdown(content || '')
        : content || '';
    previewEl.innerHTML = html || '<p class="muted">暂无预览内容。</p>';
  }

  function setActive(id) {
    activeId = id;
    const post = posts.find((item) => item.id === id);
    if (!post) return;

    form.title.value = post.title || '';
    form.category.value = post.category || '';
    form.date.value = post.date || '';
    form.readTime.value = post.readTime || '';
    form.cover.value = post.cover || '';
    form.tags.value = Array.isArray(post.tags) ? post.tags.join(', ') : '';
    form.summary.value = post.summary || '';
    form.content.value = post.content || '';

    renderPreview(post.content || '');
    renderList();
  }

  function buildPost() {
    const title = form.title.value.trim();
    const summary = form.summary.value.trim();
    const date = form.date.value;

    if (!title || !summary || !date) return null;

    const tags = form.tags.value
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

    const idBase = title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .slice(0, 40);
    const safeBase = idBase || 'post';
    const id = activeId || `${safeBase}-${Date.now()}`;

    return {
      id,
      title,
      category: form.category.value.trim(),
      readTime: form.readTime.value.trim(),
      date,
      cover: form.cover.value.trim(),
      tags,
      summary,
      content: form.content.value.trim(),
    };
  }

  function savePost(post) {
    const index = posts.findIndex((item) => item.id === post.id);
    if (index === -1) {
      posts.unshift(post);
    } else {
      posts[index] = post;
    }
    activeId = post.id;
    renderList();
    setActive(post.id);
  }

  function clearForm() {
    form.reset();
    activeId = null;
    renderPreview('');
    renderList();
  }

  function downloadJson() {
    const blob = new Blob([JSON.stringify(posts, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'posts.json';
    link.click();
    URL.revokeObjectURL(url);
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const post = buildPost();
    if (!post) return;
    savePost(post);
  });

  form.content.addEventListener('input', () => {
    renderPreview(form.content.value);
  });

  newButton?.addEventListener('click', () => {
    clearForm();
  });

  deleteButton?.addEventListener('click', () => {
    if (!activeId) return;
    posts = posts.filter((item) => item.id !== activeId);
    activeId = null;
    clearForm();
  });

  saveLocalButton?.addEventListener('click', () => {
    safeStorageSet(storageKey, JSON.stringify(posts));
  });

  downloadButton?.addEventListener('click', () => {
    downloadJson();
  });

  resetButton?.addEventListener('click', async () => {
    posts = await loadInitial();
    activeId = posts[0]?.id ?? null;
    renderList();
    if (activeId) setActive(activeId);
  });

  async function init() {
    posts = await loadInitial();
    activeId = posts[0]?.id ?? null;
    renderList();
    if (activeId) setActive(activeId);
  }

  init();
})();
