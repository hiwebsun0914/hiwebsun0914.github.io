(() => {
  const root = document.documentElement;
  const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;

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

  function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const storageKey = 'theme';

    function applyTheme(theme) {
      root.dataset.theme = theme;

      if (!themeToggle) return;
      const isDark = theme === 'dark';
      themeToggle.setAttribute('aria-pressed', String(isDark));
      themeToggle.setAttribute('aria-label', isDark ? '切换到浅色模式' : '切换到深色模式');
      themeToggle.setAttribute('title', isDark ? '切换到浅色' : '切换到深色');
    }

    const storedTheme = safeStorageGet(storageKey);
    const initialTheme = storedTheme === 'dark' ? 'dark' : 'light';
    applyTheme(initialTheme);

    themeToggle?.addEventListener('click', () => {
      const currentTheme = root.dataset.theme === 'light' ? 'light' : 'dark';
      const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
      safeStorageSet(storageKey, nextTheme);
      applyTheme(nextTheme);
    });
  }

  function initReveal() {
    const revealTargets = Array.from(document.querySelectorAll('[data-reveal]'));
    if (revealTargets.length === 0) return;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      for (const target of revealTargets) target.classList.add('is-visible');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
    );

    revealTargets.forEach((target) => {
      observer.observe(target);
    });
  }

  function initDragScroll() {
    const scrollers = Array.from(document.querySelectorAll('[data-drag-scroll]'));
    if (scrollers.length === 0) return;

    for (const scroller of scrollers) {
      let isDragging = false;
      let startX = 0;
      let startScrollLeft = 0;
      let dragPointerId = null;

      scroller.addEventListener('pointerdown', (event) => {
        if (event.button !== 0) return;
        if (event.pointerType !== 'mouse') return;
        if (scroller.scrollWidth <= scroller.clientWidth) return;

        isDragging = true;
        dragPointerId = event.pointerId;
        startX = event.clientX;
        startScrollLeft = scroller.scrollLeft;
        scroller.classList.add('is-dragging');
        scroller.setPointerCapture(dragPointerId);
      });

      scroller.addEventListener('pointermove', (event) => {
        if (!isDragging) return;
        if (event.pointerId !== dragPointerId) return;
        const deltaX = event.clientX - startX;
        scroller.scrollLeft = startScrollLeft - deltaX;
      });

      function stopDragging(event) {
        if (!isDragging) return;
        if (event && dragPointerId !== null && event.pointerId !== dragPointerId) return;

        isDragging = false;
        scroller.classList.remove('is-dragging');

        if (dragPointerId !== null) {
          try {
            scroller.releasePointerCapture(dragPointerId);
          } catch {}
        }
        dragPointerId = null;
      }

      scroller.addEventListener('pointerup', stopDragging);
      scroller.addEventListener('pointercancel', stopDragging);
    }
  }

  function initTilt() {
    const shouldTilt = window.matchMedia?.('(pointer: fine)')?.matches ?? false;
    if (!shouldTilt || prefersReducedMotion) return;

    const tiltTargets = Array.from(document.querySelectorAll('[data-tilt]'));
    if (tiltTargets.length === 0) return;

    for (const target of tiltTargets) {
      let rafId = null;
      let latestEvent = null;
      const maxTilt = 8;

      function updateTilt() {
        rafId = null;
        if (!latestEvent) return;

        const rect = target.getBoundingClientRect();
        const x = (latestEvent.clientX - rect.left) / rect.width - 0.5;
        const y = (latestEvent.clientY - rect.top) / rect.height - 0.5;

        const tiltX = (-y * maxTilt).toFixed(2);
        const tiltY = (x * maxTilt).toFixed(2);

        target.style.setProperty('--tilt-x', `${tiltX}deg`);
        target.style.setProperty('--tilt-y', `${tiltY}deg`);
      }

      target.addEventListener('pointerenter', () => {
        target.classList.add('is-tilting');
      });

      target.addEventListener('pointermove', (event) => {
        latestEvent = event;
        if (rafId) return;
        rafId = window.requestAnimationFrame(updateTilt);
      });

      target.addEventListener('pointerleave', () => {
        latestEvent = null;
        target.classList.remove('is-tilting');
        target.style.removeProperty('--tilt-x');
        target.style.removeProperty('--tilt-y');
      });
    }
  }

  async function initDynamicCounts() {
    const postTargets = Array.from(document.querySelectorAll('[data-count="posts"]'));
    const projectTargets = Array.from(document.querySelectorAll('[data-count="projects"]'));
    if (postTargets.length === 0 && projectTargets.length === 0) return;
    if (!window.ContentLoader) return;

    const [posts, projects] = await Promise.all([
      window.ContentLoader.loadPosts(),
      window.ContentLoader.loadProjects(),
    ]);

    if (postTargets.length) {
      const count = posts.length;
      postTargets.forEach((target) => {
        target.textContent = String(count);
      });
    }

    if (projectTargets.length) {
      const count = projects.length;
      projectTargets.forEach((target) => {
        target.textContent = String(count);
      });
    }
  }

  async function initLatestPosts() {
    const latestContainer = document.querySelector('[data-latest-posts]');
    if (!latestContainer) return;
    if (!window.ContentLoader) return;
    const posts = await window.ContentLoader.loadPosts();

    latestContainer.innerHTML = '';

    if (posts.length === 0) {
      latestContainer.innerHTML = '<p class="muted">暂时没有文章内容，请在管理页新增。</p>';
      return;
    }

    const sorted = posts
      .slice()
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);

    for (const post of sorted) {
      const card = document.createElement('article');
      card.className = 'post-card';
      card.dataset.reveal = '';
      card.classList.add('is-visible');
      const cover = post.cover || 'img/tech-blog.jpg';
      card.innerHTML = `
        <div class="media-frame">
          <img src="${cover}" alt="${post.title}封面" loading="lazy" />
        </div>
        <div class="post-body">
          <p class="post-meta">${post.category || '文章'} · ${post.readTime || ''}</p>
          <h3>${post.title}</h3>
          <p>${post.summary || ''}</p>
          <a class="link" href="posts.html?id=${post.id}">阅读全文</a>
        </div>
      `;
      latestContainer.append(card);
    }
  }

  initThemeToggle();
  initReveal();
  initDragScroll();
  initTilt();
  initDynamicCounts();
  initLatestPosts();
})();
