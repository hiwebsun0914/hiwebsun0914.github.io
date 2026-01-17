(() => {
  const grid = document.querySelector('[data-projects-grid]');
  if (!grid || !window.ContentLoader) return;

  function renderProjects(projects) {
    grid.innerHTML = '';

    if (projects.length === 0) {
      grid.innerHTML = '<p class="muted">暂无项目内容，请先补充项目文档。</p>';
      return;
    }

    for (const project of projects) {
      const card = document.createElement('article');
      card.className = 'project-card';
      card.dataset.reveal = '';
      card.classList.add('is-visible');
      const tags = Array.isArray(project.tags) ? project.tags : [];
      const cover = project.image || 'img/work.jpg';
      const title = project.title || '未命名项目';
      const summary = project.summary || '';
      const link = project.link || '';

      card.innerHTML = `
        <div class="media-frame">
          <img src="${cover}" alt="${title}展示图" loading="lazy" />
        </div>
        <div class="project-body">
          <h3>${title}</h3>
          <p>${summary}</p>
          ${tags.length ? `<div class="project-tags">${tags.map((tag) => `<span>${tag}</span>`).join('')}</div>` : ''}
          ${link ? `<a class="link" href="${link}" target="_blank" rel="noreferrer">查看详情</a>` : ''}
        </div>
      `;

      grid.append(card);
    }
  }

  async function init() {
    const projects = await window.ContentLoader.loadProjects();
    renderProjects(projects);
  }

  init();
})();
