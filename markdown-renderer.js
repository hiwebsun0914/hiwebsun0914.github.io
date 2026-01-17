(() => {
  const codeFenceRegex = /^```(\w+)?\s*$/;

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function splitTableRow(line) {
    const trimmed = line.trim().replace(/^\|/, '').replace(/\|$/, '');
    return trimmed.split('|').map((cell) => cell.trim());
  }

  function stripHtmlComments(value) {
    return String(value ?? '').replace(/<!--([\s\S]*?)-->/g, '');
  }

  function isAbsoluteUrl(url) {
    // scheme: http:, https:, mailto:, data:, etc.
    // or protocol-relative //
    // or absolute path /
    // or hash #
    return /^(?:[a-z][a-z0-9+.-]*:|\/\/|\/|#)/i.test(url);
  }

  function normalizeBase(basePath) {
    const base = String(basePath ?? '').trim();
    if (!base) return '';
    return base.endsWith('/') ? base : `${base}/`;
  }

  function normalizeImageUrl(url, basePath = 'data/posts/') {
    if (!url) return url;

    const trimmed = String(url).trim();
    if (!trimmed) return trimmed;

    // Do not touch absolute urls/paths/fragments
    if (isAbsoluteUrl(trimmed)) return trimmed;

    // Remove leading "./"
    const relative = trimmed.replace(/^\.\//, '');

    const normalizedBase = normalizeBase(basePath);

    // Avoid double prefix: already starts with data/posts/
    if (normalizedBase && relative.startsWith(normalizedBase)) return relative;

    // If basePath is empty, return relative as-is
    if (!normalizedBase) return relative;

    return `${normalizedBase}${relative}`;
  }

  function parseInline(text) {
    if (!text) return '';
    const tokens = [];
    const tokenPrefix = '@@MARKDOWN_TOKEN_';
    const tokenSuffix = '@@';

    const stashToken = (html) => {
      const token = `${tokenPrefix}${tokens.length}${tokenSuffix}`;
      tokens.push(html);
      return token;
    };

    let working = stripHtmlComments(text);

    // inline code
    working = working.replace(/`([^`]+)`/g, (_match, code) => {
      return stashToken(`<code>${escapeHtml(code)}</code>`);
    });

    // images: ![alt](url "title")
    const imagePattern =
      /!\[([^\]]*)\]\(\s*(<[^>]+>|[^)\s]+)\s*(?:(?:"([^"]*)")|(?:'([^']*)'))?\s*\)/g;
    working = working.replace(
      imagePattern,
      (_match, alt, rawUrl, titleDouble, titleSingle) => {
        const url =
          rawUrl.startsWith('<') && rawUrl.endsWith('>')
            ? rawUrl.slice(1, -1).trim()
            : rawUrl.trim();

        const normalizedUrl = normalizeImageUrl(url);
        const title = titleDouble || titleSingle;

        const safeAlt = escapeHtml(alt);
        const safeUrl = escapeHtml(normalizedUrl);
        const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';

        return stashToken(
          `<img src="${safeUrl}" alt="${safeAlt}" loading="lazy"${titleAttr} />`
        );
      }
    );

    // links: [label](url "title")
    const linkPattern =
      /\[([^\]]+)\]\(\s*(<[^>]+>|[^)\s]+)\s*(?:(?:"([^"]*)")|(?:'([^']*)'))?\s*\)/g;
    working = working.replace(
      linkPattern,
      (_match, label, rawUrl, titleDouble, titleSingle) => {
        const url =
          rawUrl.startsWith('<') && rawUrl.endsWith('>')
            ? rawUrl.slice(1, -1).trim()
            : rawUrl.trim();
        const title = titleDouble || titleSingle;

        const safeLabel = escapeHtml(label);
        const safeUrl = escapeHtml(url);
        const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';

        return stashToken(
          `<a href="${safeUrl}" target="_blank" rel="noopener"${titleAttr}>${safeLabel}</a>`
        );
      }
    );

    // Escape remaining text, then restore tokens
    working = escapeHtml(working);

    // bold / italic
    working = working.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    working = working.replace(/__([^_]+)__/g, '<strong>$1</strong>');
    working = working.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    working = working.replace(/_([^_]+)_/g, '<em>$1</em>');

    tokens.forEach((tokenHtml, index) => {
      working = working.replace(`${tokenPrefix}${index}${tokenSuffix}`, tokenHtml);
    });

    return working;
  }

  function renderMarkdown(source) {
    if (!source) return '';
    const normalized = String(source).replace(/\r\n/g, '\n');
    const lines = normalized.split('\n');
    const output = [];
    let index = 0;

    while (index < lines.length) {
      const line = lines[index];
      const fenceMatch = line.match(codeFenceRegex);

      if (fenceMatch) {
        const language = fenceMatch[1] || '';
        index += 1;
        const codeLines = [];
        while (index < lines.length && !lines[index].match(codeFenceRegex)) {
          codeLines.push(lines[index]);
          index += 1;
        }
        index += 1;
        const codeContent = escapeHtml(codeLines.join('\n'));
        const languageClass = language ? ` class="language-${language}"` : '';
        output.push(`<pre><code${languageClass}>${codeContent}</code></pre>`);
        continue;
      }

      if (!line.trim()) {
        index += 1;
        continue;
      }

      // single-line html comment
      if (/^<!--([\s\S]*?)-->$/.test(line.trim())) {
        index += 1;
        continue;
      }

      // headings
      if (/^#{1,6}\s+/.test(line)) {
        const level = line.match(/^#{1,6}/)[0].length;
        const text = line.replace(/^#{1,6}\s+/, '');
        output.push(`<h${level}>${parseInline(text)}</h${level}>`);
        index += 1;
        continue;
      }

      // blockquote
      if (/^>\s?/.test(line)) {
        const quoteLines = [];
        while (index < lines.length && /^>\s?/.test(lines[index])) {
          quoteLines.push(lines[index].replace(/^>\s?/, ''));
          index += 1;
        }
        output.push(`<blockquote><p>${parseInline(quoteLines.join('\n'))}</p></blockquote>`);
        continue;
      }

      // unordered list
      if (/^(\*|-|\+)\s+/.test(line)) {
        const items = [];
        while (index < lines.length && /^(\*|-|\+)\s+/.test(lines[index])) {
          items.push(`<li>${parseInline(lines[index].replace(/^(\*|-|\+)\s+/, ''))}</li>`);
          index += 1;
        }
        output.push(`<ul>${items.join('')}</ul>`);
        continue;
      }

      // ordered list
      if (/^\d+\.\s+/.test(line)) {
        const items = [];
        while (index < lines.length && /^\d+\.\s+/.test(lines[index])) {
          items.push(`<li>${parseInline(lines[index].replace(/^\d+\.\s+/, ''))}</li>`);
          index += 1;
        }
        output.push(`<ol>${items.join('')}</ol>`);
        continue;
      }

      // hr
      if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
        output.push('<hr />');
        index += 1;
        continue;
      }

      // table
      if (line.includes('|') && index + 1 < lines.length && /^\s*\|?\s*[-:]+/.test(lines[index + 1])) {
        const headerCells = splitTableRow(line);
        index += 2;
        const bodyRows = [];
        while (index < lines.length && lines[index].includes('|') && lines[index].trim()) {
          bodyRows.push(splitTableRow(lines[index]));
          index += 1;
        }

        const headerHtml = headerCells.map((cell) => `<th>${parseInline(cell)}</th>`).join('');
        const bodyHtml = bodyRows
          .map((row) => `<tr>${row.map((cell) => `<td>${parseInline(cell)}</td>`).join('')}</tr>`)
          .join('');

        output.push(`<table><thead><tr>${headerHtml}</tr></thead><tbody>${bodyHtml}</tbody></table>`);
        continue;
      }

      // paragraph
      const paragraphLines = [line];
      index += 1;
      while (index < lines.length && lines[index].trim()) {
        paragraphLines.push(lines[index]);
        index += 1;
      }
      const paragraph = parseInline(paragraphLines.join('\n').replace(/\n{2,}/g, '\n'));
      output.push(`<p>${paragraph.replace(/\n/g, '<br />')}</p>`);
    }

    return output.join('\n');
  }

  window.renderMarkdown = renderMarkdown;

  // If marked exists, configure its renderer too
  if (window.marked) {
    window.marked.setOptions({ gfm: true, breaks: true });
    window.marked.use({
      renderer: {
        image(href, title, text) {
          if (!href) return '';
          const safeHref = escapeHtml(normalizeImageUrl(href));
          const safeAlt = escapeHtml(text || '');
          const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
          return `<img src="${safeHref}" alt="${safeAlt}" loading="lazy"${titleAttr} />`;
        },
        link(href, title, text) {
          if (!href) return text || '';
          const safeHref = escapeHtml(href);
          const safeText = escapeHtml(text || '');
          const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
          return `<a href="${safeHref}" target="_blank" rel="noopener"${titleAttr}>${safeText}</a>`;
        },
      },
    });
  }
})();
