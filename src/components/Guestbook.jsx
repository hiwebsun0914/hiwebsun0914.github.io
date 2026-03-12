import { useEffect, useMemo, useState } from 'react';
import GitHubIssueGuestbook from './GitHubIssueGuestbook';
import { guestbookSeed } from '../data/guestbookSeed';
import { guestbookConfig } from '../data/siteData';

const STORAGE_KEY = 'student-personal-blog-guestbook';

function isRepoConfigured(repo) {
  const normalized = String(repo || '').trim();
  const basicPattern = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;
  return basicPattern.test(normalized) && !normalized.includes('YOUR_');
}

function inferRepoFromGithubPages() {
  if (typeof window === 'undefined') return '';

  const host = window.location.hostname.toLowerCase();
  if (!host.endsWith('.github.io')) return '';

  const owner = host.split('.')[0];
  const segments = window.location.pathname.split('/').filter(Boolean);
  const repo = segments[0] || `${owner}.github.io`;

  const candidate = `${owner}/${repo}`;
  return isRepoConfigured(candidate) ? candidate : '';
}

function resolveGuestbookRepo(configRepo) {
  // 1) 显式配置优先（非 auto）
  if (configRepo && configRepo !== 'auto' && isRepoConfigured(configRepo)) {
    return configRepo;
  }

  // 2) GitHub Actions 构建时注入（推荐）
  const envRepo = import.meta.env.VITE_GITHUB_REPO;
  if (isRepoConfigured(envRepo)) {
    return envRepo;
  }

  // 3) 线上 GitHub Pages 地址推断
  return inferRepoFromGithubPages();
}

function LocalGuestbook({ notice }) {
  const [nickname, setNickname] = useState('');
  const [message, setMessage] = useState('');
  const [tips, setTips] = useState('');
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        return guestbookSeed;
      }
    }
    return guestbookSeed;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  const totalCount = useMemo(() => messages.length, [messages]);

  const formatNow = () => {
    const now = new Date();
    const pad = (num) => String(num).padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedName = nickname.trim();
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      setTips('留言内容不能为空，请写点什么再提交。');
      return;
    }

    const newMessage = {
      id: `msg-${Date.now()}`,
      nickname: trimmedName || '匿名同学',
      message: trimmedMessage,
      createdAt: formatNow()
    };

    setMessages((prev) => [newMessage, ...prev]);
    setNickname('');
    setMessage('');
    setTips('留言发布成功，感谢你的分享！');
  };

  return (
    <>
      {notice ? <p className="guestbook-notice">{notice}</p> : null}
      <div className="section-heading section-heading-row">
        <div>
          <h2>留言板</h2>
          <p>当前为本地留言模式（localStorage），刷新页面后仍会保留。</p>
        </div>
        <span className="message-count">共 {totalCount} 条留言</span>
      </div>

      <div className="guestbook-layout">
        <form className="card guestbook-form" onSubmit={handleSubmit}>
          <label htmlFor="nickname">昵称</label>
          <input
            id="nickname"
            type="text"
            placeholder="例如：热心同学"
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
            maxLength={20}
          />

          <label htmlFor="message">留言内容</label>
          <textarea
            id="message"
            placeholder="写下你的想法吧～"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            maxLength={200}
            rows={5}
            required
          />

          <button className="primary-btn" type="submit">
            发布留言
          </button>

          {tips && <p className="form-tips">{tips}</p>}
        </form>

        <div className="message-list">
          {messages.map((item) => (
            <article className="card message-card" key={item.id}>
              <div className="message-top">
                <strong>{item.nickname}</strong>
                <time>{item.createdAt}</time>
              </div>
              <p>{item.message}</p>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}

function Guestbook() {
  const wantsGitHubIssues = guestbookConfig.mode === 'github-issues';
  const resolvedRepo = resolveGuestbookRepo(guestbookConfig.repo);
  const canUseGitHubIssues = wantsGitHubIssues && isRepoConfigured(resolvedRepo);

  return (
    <section id="guestbook" className="section">
      <div className="container">
        {canUseGitHubIssues ? (
          <>
            <div className="section-heading">
              <h2>留言板</h2>
              <p>已接入 GitHub Issues 联动留言，评论会公开显示在仓库的 Issue 中。</p>
            </div>
            <GitHubIssueGuestbook config={{ ...guestbookConfig, repo: resolvedRepo }} />
          </>
        ) : (
          <LocalGuestbook
            notice={
              wantsGitHubIssues
                ? '提示：当前无法自动识别 GitHub 仓库，暂时回退到本地留言模式。发布到 GitHub Pages 后会自动切换到 Issues 联动。'
                : ''
            }
          />
        )}
      </div>
    </section>
  );
}

export default Guestbook;
