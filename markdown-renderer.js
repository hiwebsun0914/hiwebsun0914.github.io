(() => {
  const codeFenceRegex = /^```(\w+)?\s*$/;

  function escapeHtml(value) {
    return value
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

  function parseInline(text) {
    if (!text) return '';
    const codeSpans = [];

    let working = text.replace(/`([^`]+)`/g, (match, code) => {
      const token = `__CODESPAN_${codeSpans.length}__`;
      codeSpans.push(`<code>${escapeHtml(code)}</code>`);
      return token;
    });

    working = escapeHtml(working);

    working = working.replace(/!\[([^\]]*)\]\(([^\s)]+)\)/g, (_match, alt, url) => {
      const safeAlt = escapeHtml(alt);
      return `<img src="${url}" alt="${safeAlt}" loading="lazy" />`;
    });

    working = working.replace(/\[([^\]]+)\]\(([^\s)]+)\)/g, (_match, label, url) => {
      return `<a href="${url}" target="_blank" rel="noopener">${label}</a>`;
    });

    working = working.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    working = working.replace(/__([^_]+)__/g, '<strong>$1</strong>');
    working = working.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    working = working.replace(/_([^_]+)_/g, '<em>$1</em>');

    codeSpans.forEach((code, index) => {
      working = working.replace(`__CODESPAN_${index}__`, code);
    });

    return working;
  }

  function renderMarkdown(source) {
    if (!source) return '';
    const normalized = source.replace(/\r\n/g, '\n');
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

      if (/^#{1,6}\s+/.test(line)) {
        const level = line.match(/^#{1,6}/)[0].length;
        const text = line.replace(/^#{1,6}\s+/, '');
        output.push(`<h${level}>${parseInline(text)}</h${level}>`);
        index += 1;
        continue;
      }

      if (/^>\s?/.test(line)) {
        const quoteLines = [];
        while (index < lines.length && /^>\s?/.test(lines[index])) {
          quoteLines.push(lines[index].replace(/^>\s?/, ''));
          index += 1;
        }
        output.push(`<blockquote><p>${parseInline(quoteLines.join('\n'))}</p></blockquote>`);
        continue;
      }

      if (/^(\*|-|\+)\s+/.test(line)) {
        const items = [];
        while (index < lines.length && /^(\*|-|\+)\s+/.test(lines[index])) {
          items.push(`<li>${parseInline(lines[index].replace(/^(\*|-|\+)\s+/, ''))}</li>`);
          index += 1;
        }
        output.push(`<ul>${items.join('')}</ul>`);
        continue;
      }

      if (/^\d+\.\s+/.test(line)) {
        const items = [];
        while (index < lines.length && /^\d+\.\s+/.test(lines[index])) {
          items.push(`<li>${parseInline(lines[index].replace(/^\d+\.\s+/, ''))}</li>`);
          index += 1;
        }
        output.push(`<ol>${items.join('')}</ol>`);
        continue;
      }

      if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
        output.push('<hr />');
        index += 1;
        continue;
      }

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
})();
