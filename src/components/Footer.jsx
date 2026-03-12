function Footer({ data }) {
  return (
    <footer className="site-footer">
      <div className="container footer-row">
        <div>
          <p>{data.copyright}</p>
          <p>{data.slogan}</p>
        </div>

        <div className="footer-socials">
          {data.socials.map((item) => (
            <a key={item.label} href={item.url} target="_blank" rel="noreferrer">
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
