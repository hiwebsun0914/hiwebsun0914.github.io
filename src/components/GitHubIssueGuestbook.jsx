import { useEffect, useMemo, useState } from 'react';

function buildNewIssueUrl({ repo, label, nickname, message }) {
  const safeNick = nickname.trim() || '匿名同学';
  const issueTitle = `[留言] ${safeNick}`;
  const issueBody = `${message.trim()}\n\n---\n来自个人主页留言板`;

  const query = new URLSearchParams({
    title: issueTitle,
    body: issueBody,
    labels: label || 'guestbook'
  });

  return `https://github.com/${repo}/issues/new?${query.toString()}`;
}

function GitHubIssueGuestbook({ config }) {
  const [nickname, setNickname] = useState('');
  const [message, setMessage] = useState('');
  const [tips, setTips] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [issues, setIssues] = useState([]);

  const label = config.label || 'guestbook';
  const fetchUrl = useMemo(() => {
    const query = new URLSearchParams({
      state: 'all',
      sort: 'created',
      direction: 'desc',
      per_page: '30',
      labels: label
    });
    return `https://api.github.com/repos/${config.repo}/issues?${query.toString()}`;
  }, [config.repo, label]);

  useEffect(() => {
    let cancelled = false;

    const loadIssues = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(fetchUrl);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        const pureIssues = data.filter((item) => !item.pull_request);

        if (!cancelled) {
          setIssues(pureIssues);
        }
      } catch (err) {
        if (!cancelled) {
          setError('读取 GitHub 留言失败，请稍后刷新重试。');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadIssues();
    return () => {
      cancelled = true;
    };
  }, [fetchUrl]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!message.trim()) {
      setTips('留言内容不能为空，请先输入内容。');
      return;
    }

    const url = buildNewIssueUrl({
      repo: config.repo,
      label,
      nickname,
      message
    });

    setTips('即将跳转到 GitHub Issue 提交页面，请在 GitHub 页面确认发布。');
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="github-guestbook-layout">
      <form className="card guestbook-form" onSubmit={handleSubmit}>
        <p className="github-guestbook-intro">
          留言会以 Issue 形式同步到 GitHub。点击“去 GitHub 提交”后，在打开的页面确认发布即可。
        </p>
        <p className="github-guestbook-repo">当前留言仓库：{config.repo}</p>

        <label htmlFor="github-nickname">昵称</label>
        <input
          id="github-nickname"
          type="text"
          placeholder="例如：热心同学"
          value={nickname}
          onChange={(event) => setNickname(event.target.value)}
          maxLength={20}
        />

        <label htmlFor="github-message">留言内容</label>
        <textarea
          id="github-message"
          placeholder="写下你的想法吧～"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          maxLength={300}
          rows={5}
          required
        />

        <button className="primary-btn" type="submit">
          去 GitHub 提交
        </button>

        {tips && <p className="form-tips">{tips}</p>}
      </form>

      <div className="message-list">
        {loading ? <p className="github-loading">正在加载 GitHub 留言...</p> : null}
        {error ? <p className="guestbook-notice">{error}</p> : null}

        {!loading && !error && issues.length === 0 ? (
          <p className="github-loading">还没有留言，来发布第一条吧。</p>
        ) : null}

        {issues.map((item) => (
          <article className="card message-card" key={item.id}>
            <div className="message-top">
              <strong>{item.title}</strong>
              <time>{new Date(item.created_at).toLocaleString('zh-CN', { hour12: false })}</time>
            </div>
            <p>{item.body || '(无正文)'}</p>
            <a className="text-btn" href={item.html_url} target="_blank" rel="noreferrer">
              在 GitHub 中查看
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}

export default GitHubIssueGuestbook;
