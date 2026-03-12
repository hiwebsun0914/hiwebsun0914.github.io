import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { blogs } from '../data/blogs';
import { footerData } from '../data/siteData';

function BlogDetailPage() {
  const { slug } = useParams();
  const blog = blogs.find((item) => item.slug === slug);

  if (!blog) {
    return (
      <>
        <Navbar />
        <main className="sub-page">
          <section className="section page-head">
            <div className="container">
              <h1>文章不存在</h1>
              <p>这篇文章可能已被移动或删除。</p>
              <Link className="text-btn" to="/blogs">
                返回博客列表
              </Link>
            </div>
          </section>
        </main>
        <Footer data={footerData} />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="sub-page">
        <article className="section">
          <div className="container article-wrap card">
            <Link className="text-btn" to="/blogs">
              ← 返回博客列表
            </Link>
            <p className="blog-date">{blog.date}</p>
            <h1>{blog.title}</h1>
            <div className="tag-list compact">
              {blog.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <img className="article-cover" src={blog.cover} alt={blog.title} />
            <div className="article-content">
              {blog.content.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </article>
      </main>
      <Footer data={footerData} />
    </>
  );
}

export default BlogDetailPage;
