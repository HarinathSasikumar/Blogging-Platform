import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();

  const links = {
    Platform: [
      { label: 'Home', to: '/' },
      { label: 'Explore', to: '/explore' },
      { label: 'Write a Post', to: '/write' },
      { label: 'Dashboard', to: '/dashboard' },
    ],
    Company: [
      { label: 'About Us', to: '#' },
      { label: 'Blog', to: '/explore' },
      { label: 'Careers', to: '#' },
      { label: 'Privacy Policy', to: '#' },
    ],
    Connect: [
      { label: 'Twitter', to: '#' },
      { label: 'GitHub', to: '#' },
      { label: 'Discord', to: '#' },
      { label: 'Newsletter', to: '#' },
    ],
  };

  return (
    <footer className="footer">
      <div className="footer__gradient-top" />
      <div className="container">
        <div className="footer__inner">
          {/* Brand */}
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-secondary)' }}>
                <path d="M12 3v18M12 3L6 9h12L12 3Z" />
              </svg>
              <span className="gradient-text">HN BlogSphere</span>
            </Link>
            <p className="footer__tagline">
              Where ideas come alive. A home for writers, readers,<br />
              and curious minds exploring the world through words.
            </p>
            <div className="footer__social">
              <a href="#" className="footer__social-link" aria-label="Twitter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
              <a href="#" className="footer__social-link" aria-label="GitHub">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/></svg>
              </a>
              <a href="#" className="footer__social-link" aria-label="Discord">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a3 3 0 0 0-3-3H9a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V8Z"/><circle cx="9" cy="11" r="1" fill="currentColor"/><circle cx="15" cy="11" r="1" fill="currentColor"/><path d="M10 15h4"/></svg>
              </a>
              <a href="#" className="footer__social-link" aria-label="Newsletter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title} className="footer__col">
              <h3 className="footer__col-title">{title}</h3>
              <ul className="footer__col-list">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link to={item.to} className="footer__col-link">{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">
            © {year} <span className="gradient-text">HN BlogSphere</span>. All rights reserved.
          </p>
          <p className="footer__made" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
            Made with <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none" style={{ color: 'var(--accent-pink)' }}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg> for writers everywhere
          </p>
        </div>
      </div>

      <style>{`
        .footer {
          background: var(--bg-secondary);
          border-top: 1px solid var(--border-color);
          padding: 4rem 0 2rem;
          margin-top: 4rem;
          position: relative;
        }
        .footer__gradient-top {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: var(--gradient-primary);
        }
        .footer__inner {
          display: grid;
          grid-template-columns: 1.5fr repeat(3, 1fr);
          gap: 3rem;
          margin-bottom: 3rem;
        }
        .footer__logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.375rem;
          font-weight: 800;
          margin-bottom: 1rem;
        }
        .footer__tagline {
          font-size: 0.875rem;
          color: var(--text-muted);
          line-height: 1.7;
          margin-bottom: 1.5rem;
        }
        .footer__social {
          display: flex;
          gap: 0.75rem;
        }
        .footer__social-link {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-sm);
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          font-size: 1rem;
          transition: var(--transition-fast);
        }
        .footer__social-link:hover {
          border-color: var(--accent-primary);
          background: rgba(124,58,237,0.1);
          transform: translateY(-2px);
        }
        .footer__col-title {
          font-size: 0.875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-primary);
          margin-bottom: 1.25rem;
        }
        .footer__col-list {
          display: flex;
          flex-direction: column;
          gap: 0.625rem;
        }
        .footer__col-link {
          font-size: 0.875rem;
          color: var(--text-muted);
          transition: var(--transition-fast);
        }
        .footer__col-link:hover {
          color: var(--accent-secondary);
        }
        .footer__bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 2rem;
          border-top: 1px solid var(--border-color);
        }
        .footer__copyright,
        .footer__made {
          font-size: 0.8125rem;
          color: var(--text-muted);
        }
        @media (max-width: 768px) {
          .footer__inner {
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
          }
          .footer__brand {
            grid-column: 1 / -1;
          }
          .footer__bottom {
            flex-direction: column;
            gap: 0.75rem;
            text-align: center;
          }
        }
        @media (max-width: 480px) {
          .footer__inner {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </footer>
  );
}
