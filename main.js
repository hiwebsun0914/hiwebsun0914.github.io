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
      const isDark = theme !== 'light';
      themeToggle.setAttribute('aria-pressed', String(isDark));
      themeToggle.setAttribute('aria-label', isDark ? '切换到浅色模式' : '切换到深色模式');
      themeToggle.setAttribute('title', isDark ? '切换到浅色' : '切换到深色');
    }

    const storedTheme = safeStorageGet(storageKey);
    const initialTheme = storedTheme === 'light' ? 'light' : 'dark';
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

  function initScrollSpy() {
    const navLinks = Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));
    if (navLinks.length === 0 || !('IntersectionObserver' in window)) return;

    const sectionTargets = navLinks
      .map((link) => document.querySelector(link.getAttribute('href')))
      .filter(Boolean);

    if (sectionTargets.length === 0) return;

    const ratiosById = new Map(sectionTargets.map((target) => [target.id, 0]));

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratiosById.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }

        let activeId = null;
        let bestRatio = 0;
        for (const [id, ratio] of ratiosById.entries()) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            activeId = id;
          }
        }

        if (!activeId) return;

        for (const link of navLinks) {
          link.classList.toggle('current-page', link.getAttribute('href') === `#${activeId}`);
        }
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] },
    );

    for (const target of sectionTargets) observer.observe(target);
  }

  function initPagination() {
    const posts = Array.from(document.querySelectorAll('[data-posts-grid] .post-card'));
    const pagination = document.querySelector('[data-pagination]');
    if (posts.length === 0 || !pagination) return;

    const buttons = Array.from(pagination.querySelectorAll('.page-button'));
    if (buttons.length === 0) return;

    const pages = new Set(posts.map((post) => Number(post.dataset.page || '1')));
    const sortedPages = Array.from(pages).sort((a, b) => a - b);

    function setPage(page) {
      const currentPage = sortedPages.includes(page) ? page : sortedPages[0];
      for (const post of posts) {
        const postPage = Number(post.dataset.page || '1');
        post.hidden = postPage !== currentPage;
      }
      for (const button of buttons) {
        const isActive = Number(button.dataset.page) === currentPage;
        button.classList.toggle('is-active', isActive);
        if (isActive) {
          button.setAttribute('aria-current', 'page');
        } else {
          button.removeAttribute('aria-current');
        }
      }

      const url = new URL(window.location.href);
      url.searchParams.set('page', String(currentPage));
      window.history.replaceState({}, '', url);
    }

    for (const button of buttons) {
      const page = Number(button.dataset.page);
      button.addEventListener('click', () => setPage(page));
    }

    const initialPage = Number(new URLSearchParams(window.location.search).get('page'));
    setPage(Number.isFinite(initialPage) ? initialPage : sortedPages[0]);
  }

  function initGuestbook() {
    const form = document.getElementById('guestbookForm');
    const list = document.getElementById('guestbookList');
    if (!form || !list) return;

    const storageKey = 'guestbookMessages';

    function readMessages() {
      const raw = safeStorageGet(storageKey);
      if (!raw) return [];
      try {
        const data = JSON.parse(raw);
        return Array.isArray(data) ? data : [];
      } catch {
        return [];
      }
    }

    function writeMessages(messages) {
      safeStorageSet(storageKey, JSON.stringify(messages));
    }

    function render() {
      const messages = readMessages();
      list.innerHTML = '';

      if (messages.length === 0) {
        const empty = document.createElement('p');
        empty.className = 'offline-note';
        empty.textContent = '暂时还没有留言，欢迎留下第一条。';
        list.append(empty);
        return;
      }

      for (const message of messages) {
        const item = document.createElement('article');
        item.className = 'guestbook-item';

        const header = document.createElement('header');
        const name = document.createElement('span');
        name.textContent = message.name;
        const time = document.createElement('time');
        time.dateTime = message.date;
        time.textContent = message.displayDate;
        header.append(name, time);

        const body = document.createElement('p');
        body.textContent = message.message;

        item.append(header, body);
        list.append(item);
      }
    }

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const name = String(formData.get('guestName') || '').trim();
      const message = String(formData.get('guestMessage') || '').trim();
      if (!name || !message) return;

      const now = new Date();
      const entry = {
        name,
        message,
        date: now.toISOString(),
        displayDate: now.toLocaleString('zh-CN', { hour12: false }),
      };

      const messages = readMessages();
      messages.unshift(entry);
      writeMessages(messages.slice(0, 20));
      form.reset();
      render();
    });

    render();
  }

  async function initGuestName() {
    const nameElement = document.getElementById('name');
    if (!nameElement) return;

    const fallbackElement = document.getElementById('fallback');

    const url = new URL(window.location.href);
    let token = url.searchParams.get('token');
    if (!token) {
      const match = window.location.pathname.match(/(?:^|\/)token=([^\/?#]+)/i);
      if (match) token = decodeURIComponent(match[1]);
    }

    try {
      const mapping = await fetch('./names.json', { cache: 'no-store' }).then((response) => response.json());
      const name = token ? mapping[token] : null;
      if (name) {
        nameElement.textContent = name;
      } else {
        nameElement.textContent = '尊敬的来宾';
        if (fallbackElement) fallbackElement.style.display = '';
      }
    } catch {
      nameElement.textContent = '尊敬的来宾';
      if (fallbackElement) fallbackElement.style.display = '';
    }
  }

  initThemeToggle();
  initReveal();
  initDragScroll();
  initTilt();
  initScrollSpy();
  initPagination();
  initGuestbook();
  initGuestName();
})();
