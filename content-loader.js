(() => {
  const postIndexPath = 'data/posts/index.json';
  const projectsPath = 'data/projects.json';

  function parseFrontMatter(raw) {
    const normalized = raw.replace(/\r\n/g, '\n');
    const match = normalized.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
    if (!match) {
      return { attributes: {}, body: raw };
    }

    const [, frontMatterBlock, body] = match;
    const attributes = {};

    frontMatterBlock.split('\n').forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) return;
      const separatorIndex = trimmed.indexOf(':');
      if (separatorIndex === -1) return;
      const key = trimmed.slice(0, separatorIndex).trim();
      const value = trimmed.slice(separatorIndex + 1).trim();
      if (!key) return;

      if (key === 'tags') {
        const cleaned = value.replace(/^\[/, '').replace(/\]$/, '');
        const tags = cleaned
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean);
        attributes[key] = tags;
      } else {
        attributes[key] = value;
      }
    });

    return { attributes, body };
  }

  function slugify(filename) {
    return filename.replace(/\.md$/i, '').toLowerCase();
  }

  async function loadPostIndex() {
    try {
      const response = await fetch(postIndexPath, { cache: 'no-store' });
      if (!response.ok) return [];
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  async function loadPosts() {
    const index = await loadPostIndex();
    if (index.length === 0) return [];

    const entries = await Promise.all(
      index.map(async (file) => {
        try {
          const response = await fetch(`data/posts/${file}`, { cache: 'no-store' });
          if (!response.ok) return null;
          const raw = await response.text();
          const parsed = parseFrontMatter(raw);
          const id = parsed.attributes.id || slugify(file);
          return {
            id,
            title: parsed.attributes.title || id,
            readTime: parsed.attributes.readTime || '',
            date: parsed.attributes.date || '',
            cover: parsed.attributes.cover || '',
            tags: parsed.attributes.tags || [],
            summary: parsed.attributes.summary || '',
            content: parsed.body.trim(),
          };
        } catch {
          return null;
        }
      }),
    );

    return entries.filter(Boolean);
  }

  async function loadProjects() {
    try {
      const response = await fetch(projectsPath, { cache: 'no-store' });
      if (!response.ok) return [];
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  window.ContentLoader = {
    loadPosts,
    loadProjects,
  };
})();
