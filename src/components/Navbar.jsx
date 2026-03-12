import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const sectionLinks = [
  { label: '首页', id: 'hero' },
  { label: '个人信息', id: 'profile' },
  { label: '外部链接', id: 'links' },
  { label: '博客', id: 'blogs' },
  { label: '照片墙', id: 'gallery' },
  { label: '留言板', id: 'guestbook' }
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (id) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSectionClick = (id) => {
    setMenuOpen(false);
    if (location.pathname === '/') {
      scrollToSection(id);
      return;
    }
    navigate('/', { state: { targetId: id } });
  };

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="site-header">
      <nav className="navbar container" aria-label="主导航">
        <button
          className="brand-button"
          onClick={() => handleSectionClick('hero')}
          type="button"
          aria-label="回到首页"
        >
          SYSU·ISEer的小站
        </button>

        <button
          className="nav-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-label="切换导航菜单"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <div className={`nav-menu ${menuOpen ? 'open' : ''}`}>
          {sectionLinks.map((item) => (
            <button
              key={item.id}
              className="nav-link"
              type="button"
              onClick={() => handleSectionClick(item.id)}
            >
              {item.label}
            </button>
          ))}
          <Link className="nav-link nav-link-page" to="/blogs">
            全部文章
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
