import { guestbookConfig, guestbookSeed } from './data.js';
import { escapeHtml, resolveRepo } from './common.js';

const STORAGE_KEY = 'student-personal-blog-guestbook';

function formatNow() {
  const now = new Date();
  const pad = (num) => String(num).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

function renderLocalGuestbook(root, notice = '') {
  const saved = localStorage.getItem(STORAGE_KEY);
  let list = guestbookSeed;

  if (saved) {
    try {
      list = JSON.parse(saved);
    } catch (_error) {
      list = guestbookSeed;
    }
  }

  root.innerHTML = `
    ${notice ? `<p class="guestbook-notice">${escapeHtml(notice)}</p>` : ''}
    <div class="section-heading section-heading-row">
      <div>
        <h3>本地留言模式</h3>
        <p>当前未识别到 GitHub 仓库，使用 localStorage 保存留言。</p>
      </div>
      <span class="message-count">共 <span id="local-msg-count">${list.length}</span> 条</span>
    </div>
    <div class="guestbook-layout">
      <form id="local-guestbook-form" class="card guestbook-form">
        <label for="local-name">昵称</label>
        <input id="local-name" type="text" placeholder="例如：智能院同学" maxlength="20" />

        <label for="local-message">留言内容</label>
        <textarea id="local-message" placeholder="写下你的想法吧～" maxlength="200" rows="5" required></textarea>

        <button class="primary-btn" type="submit">发布留言</button>
        <p id="local-form-tip" class="form-tips"></p>
      </form>

      <div id="local-message-list" class="message-list"></div>
    </div>
  `;

  const listWrap = document.getElementById('local-message-list');
  const count = document.getElementById('local-msg-count');

  const renderList = () => {
    listWrap.innerHTML = list
      .map(
        (item) => `
          <article class="card message-card">
            <div class="message-top">
              <strong>${escapeHtml(item.nickname)}</strong>
              <time>${escapeHtml(item.createdAt)}</time>
            </div>
            <p>${escapeHtml(item.message)}</p>
          </article>
        `
      )
      .join('');

    count.textContent = String(list.length);
  };

  renderList();

  document.getElementById('local-guestbook-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const nameInput = document.getElementById('local-name');
    const messageInput = document.getElementById('local-message');
    const tip = document.getElementById('local-form-tip');

    const nickname = nameInput.value.trim() || '匿名同学';
    const message = messageInput.value.trim();

    if (!message) {
      tip.textContent = '留言内容不能为空。';
      return;
    }

    list = [{ id: `msg-${Date.now()}`, nickname, message, createdAt: formatNow() }, ...list];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));

    nameInput.value = '';
    messageInput.value = '';
    tip.textContent = '留言发布成功。';

    renderList();
  });
}

function buildIssueUrl({ repo, label, nickname, message }) {
  const safeName = nickname.trim() || '匿名同学';
  const params = new URLSearchParams({
    title: `[留言] ${safeName}`,
    body: `${message.trim()}\n\n---\n来自个人主页留言板`,
    labels: label
  });

  return `https://github.com/${repo}/issues/new?${params.toString()}`;
}

async function renderGithubGuestbook(root, repo) {
  const label = guestbookConfig.label || 'guestbook';

  root.innerHTML = `
    <div class="github-guestbook-layout">
      <form id="github-guestbook-form" class="card guestbook-form">
        <p class="github-guestbook-intro">留言会同步为 GitHub Issue，点击按钮后在 GitHub 页面确认发布即可。</p>
        <p class="github-guestbook-repo">当前留言仓库：${escapeHtml(repo)}</p>

        <label for="github-name">昵称</label>
        <input id="github-name" type="text" placeholder="例如：智能院同学" maxlength="20" />

        <label for="github-message">留言内容</label>
        <textarea id="github-message" placeholder="写下你的想法吧～" maxlength="300" rows="5" required></textarea>

        <button class="primary-btn" type="submit">去 GitHub 提交</button>
        <p id="github-form-tip" class="form-tips"></p>
      </form>

      <div class="message-list" id="github-message-list">
        <p class="github-loading">正在加载 GitHub 留言...</p>
      </div>
    </div>
  `;

  document.getElementById('github-guestbook-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('github-name').value;
    const message = document.getElementById('github-message').value.trim();
    const tip = document.getElementById('github-form-tip');

    if (!message) {
      tip.textContent = '留言内容不能为空。';
      return;
    }

    const url = buildIssueUrl({ repo, label, nickname: name, message });
    tip.textContent = '已打开 GitHub 新建 Issue 页面，请确认发布。';
    window.open(url, '_blank', 'noopener,noreferrer');
  });

  const listWrap = document.getElementById('github-message-list');

  try {
    const query = new URLSearchParams({
      state: 'all',
      sort: 'created',
      direction: 'desc',
      per_page: '30',
      labels: label
    });

    const response = await fetch(`https://api.github.com/repos/${repo}/issues?${query.toString()}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const items = (await response.json()).filter((item) => !item.pull_request);

    if (!items.length) {
      listWrap.innerHTML = '<p class="github-loading">还没有留言，欢迎发布第一条。</p>';
      return;
    }

    listWrap.innerHTML = items
      .map(
        (item) => `
          <article class="card message-card">
            <div class="message-top">
              <strong>${escapeHtml(item.title)}</strong>
              <time>${escapeHtml(new Date(item.created_at).toLocaleString('zh-CN', { hour12: false }))}</time>
            </div>
            <p>${escapeHtml(item.body || '(无正文)')}</p>
            <a class="text-btn" href="${escapeHtml(item.html_url)}" target="_blank" rel="noreferrer">在 GitHub 中查看</a>
          </article>
        `
      )
      .join('');
  } catch (_error) {
    renderLocalGuestbook(root, 'GitHub 留言读取失败，已自动切换本地留言模式。');
  }
}

export async function initGuestbook(rootSelector = '#guestbook-root') {
  const root = document.querySelector(rootSelector);
  if (!root) return;

  const mode = guestbookConfig.mode || 'local';
  const repo = resolveRepo(guestbookConfig.repo);

  if (mode === 'github-issues' && repo) {
    await renderGithubGuestbook(root, repo);
    return;
  }

  renderLocalGuestbook(root, '当前未识别 GitHub 仓库，已启用本地留言。');
}
