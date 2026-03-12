import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <main className="not-found">
      <h1>404</h1>
      <p>你访问的页面不存在。</p>
      <Link to="/">回到首页</Link>
    </main>
  );
}

export default NotFoundPage;
