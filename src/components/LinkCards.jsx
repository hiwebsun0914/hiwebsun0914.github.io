function LinkCards({ links }) {
  return (
    <section id="links" className="section">
      <div className="container">
        <div className="section-heading">
          <h2>外部链接</h2>
          <p>这里放我的常用主页，后续可以替换成你的真实链接。</p>
        </div>

        <div className="grid links-grid">
          {links.map((item) => (
            <a
              key={item.title}
              className="card link-card"
              href={item.url}
              target="_blank"
              rel="noreferrer"
            >
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <span>{item.action} →</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default LinkCards;
