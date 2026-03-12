import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import BlogList from '../components/BlogList';
import Footer from '../components/Footer';
import { blogs } from '../data/blogs';
import { footerData } from '../data/siteData';

function BlogListPage() {
  return (
    <>
      <Navbar />
      <main className="sub-page">
        <section className="section page-head">
          <div className="container">
            <h1>全部博客文章</h1>
            <p>共 {blogs.length} 篇，按时间倒序展示。</p>
            <Link className="text-btn" to="/">
              ← 返回首页
            </Link>
          </div>
        </section>
        <BlogList blogs={blogs} showAll />
      </main>
      <Footer data={footerData} />
    </>
  );
}

export default BlogListPage;
