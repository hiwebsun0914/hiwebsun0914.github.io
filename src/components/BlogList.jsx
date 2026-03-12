import { Link } from 'react-router-dom';

function BlogList({ blogs, showAll = false }) {
  const displayBlogs = showAll ? blogs : blogs.slice(0, 4);

  return (
    <section id="blogs" className="section">
      <div className="container">
        <div className="section-heading section-heading-row">
          <div>
            <h2>博客文章</h2>
            <p>记录学习过程，也记录普通但珍贵的大学生活。</p>
          </div>
          {!showAll && (
            <Link className="text-btn" to="/blogs">
              查看全部
            </Link>
          )}
        </div>

        <div className="grid blog-grid">
          {displayBlogs.map((blog) => (
            <article className="card blog-card" key={blog.id}>
              <img className="blog-cover" src={blog.cover} alt={blog.title} />
              <div className="blog-body">
                <p className="blog-date">{blog.date}</p>
                <h3>{blog.title}</h3>
                <p>{blog.excerpt}</p>
                <div className="tag-list compact">
                  {blog.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <Link className="text-btn" to={`/blogs/${blog.slug}`}>
                  阅读全文
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BlogList;
