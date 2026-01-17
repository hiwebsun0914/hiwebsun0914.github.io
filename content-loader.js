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

  function normalizeAssetUrl(url, basePath = 'data/posts/') {
    if (!url) return url;
    const trimmed = url.trim();
    const normalizedBase = basePath.endsWith('/') ? basePath : `${basePath}/`;
    if (trimmed.startsWith(normalizedBase)) {
      return trimmed;
    }
    if (
      /^(?:[a-z][a-z0-9+.-]*:|\/|#)/i.test(trimmed) ||
      trimmed.startsWith('//')
    ) {
      return trimmed;
    }
    return `${normalizedBase}${trimmed.replace(/^\.\//, '')}`;
  }

  function normalizeMarkdownPaths(markdown, basePath = 'data/posts/') {
    if (!markdown) return markdown;
    const imagePattern = /!\[([^\]]*)\]\(\s*(<[^>]+>|[^)\s]+)\s*(?:(?:"([^"]*)")|(?:'([^']*)'))?\s*\)/g;
    const linkPattern = /\[([^\]]+)\]\(\s*(<[^>]+>|[^)\s]+)\s*(?:(?:"([^"]*)")|(?:'([^']*)'))?\s*\)/g;

    const normalizeMatch = (rawUrl) => {
      const hasAngle = rawUrl.startsWith('<') && rawUrl.endsWith('>');
      const url = hasAngle ? rawUrl.slice(1, -1).trim() : rawUrl.trim();
      const normalizedUrl = normalizeAssetUrl(url, basePath);
      return hasAngle ? `<${normalizedUrl}>` : normalizedUrl;
    };

    let updated = markdown.replace(imagePattern, (match, alt, rawUrl, titleDouble, titleSingle) => {
      const title = titleDouble || titleSingle;
      const normalizedUrl = normalizeMatch(rawUrl);
      const titlePart = title ? ` "${title}"` : '';
      return `![${alt}](${normalizedUrl}${titlePart})`;
    });

    updated = updated.replace(linkPattern, (match, label, rawUrl, titleDouble, titleSingle) => {
      const title = titleDouble || titleSingle;
      const normalizedUrl = normalizeMatch(rawUrl);
      const titlePart = title ? ` "${title}"` : '';
      return `[${label}](${normalizedUrl}${titlePart})`;
    });

    return updated;
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
            category: parsed.attributes.category || '文章',
            readTime: parsed.attributes.readTime || '',
            date: parsed.attributes.date || '',
            cover: parsed.attributes.cover || '',
            tags: parsed.attributes.tags || [],
            summary: parsed.attributes.summary || '',
            content: normalizeMarkdownPaths(parsed.body.trim()),
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
