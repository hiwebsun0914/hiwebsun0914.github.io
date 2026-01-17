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
  initGuestName();
})();
