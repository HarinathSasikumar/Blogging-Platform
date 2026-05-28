import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import UserAvatar from './UserAvatar';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/explore', label: 'Explore' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="container navbar__inner">
        {/* Logo */}
        <Link to="/" className="navbar__logo" onClick={() => setMenuOpen(false)}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-secondary)' }}>
            <path d="M12 3v18M12 3L6 9h12L12 3Z" />
          </svg>
          <span className="navbar__logo-text gradient-text">HN BlogSphere</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="navbar__links">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Right Side */}
        <div className="navbar__right">
          <ThemeToggle />

          {isAuthenticated ? (
            <>
              <Link to="/write" className="btn btn-primary btn-sm navbar__write-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                </svg>
                Write
              </Link>
              <div className="navbar__avatar-wrap" ref={dropdownRef}>
                <button
                  id="user-avatar-btn"
                  className="navbar__avatar-btn"
                  onClick={() => setDropdownOpen((v) => !v)}
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen}
                >
                  <UserAvatar user={user} size="sm" />
                </button>
                {dropdownOpen && (
                  <div className="navbar__dropdown animate-fade-in" role="menu">
                    <div className="navbar__dropdown-header">
                      <p className="navbar__dropdown-name">{user?.username}</p>
                      <p className="navbar__dropdown-email">{user?.email}</p>
                    </div>
                    <div className="navbar__dropdown-divider" />
                    <Link
                      to="/dashboard"
                      className="navbar__dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>
                      Dashboard
                    </Link>
                    <Link
                      to="/write"
                      className="navbar__dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
                      Write New Post
                    </Link>
                    {user?._id && (
                      <Link
                        to={`/profile/${user._id}`}
                        className="navbar__dropdown-item"
                        onClick={() => setDropdownOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                        My Profile
                      </Link>
                    )}
                    <div className="navbar__dropdown-divider" />
                    <button className="navbar__dropdown-item navbar__dropdown-logout" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="navbar__auth-btns">
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </div>
          )}

          {/* Hamburger */}
          <button
            id="hamburger-btn"
            className={`navbar__hamburger ${menuOpen ? 'navbar__hamburger--open' : ''}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="navbar__mobile glass animate-fade-in">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => `navbar__mobile-link ${isActive ? 'navbar__mobile-link--active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <Link to="/write" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>Write</Link>
              <button className="navbar__mobile-link navbar__mobile-logout" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}

      <style>{`
        .navbar {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 1000;
          height: 70px;
          transition: var(--transition);
        }
        .navbar--scrolled {
          background: rgba(10, 15, 30, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-color);
          box-shadow: 0 4px 24px rgba(0,0,0,0.3);
        }
        [data-theme="light"] .navbar--scrolled {
          background: rgba(248, 250, 252, 0.85);
        }
        .navbar__inner {
          display: flex;
          align-items: center;
          height: 70px;
          gap: 1.5rem;
        }
        .navbar__logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.375rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          flex-shrink: 0;
        }
        .navbar__logo-icon { font-size: 1.25rem; }
        .navbar__links {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          flex: 1;
        }
        .navbar__link {
          padding: 0.4rem 0.875rem;
          border-radius: var(--radius-sm);
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-secondary);
          transition: var(--transition-fast);
          position: relative;
        }
        .navbar__link::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 50%; right: 50%;
          height: 2px;
          background: var(--gradient-primary);
          border-radius: 1px;
          transition: var(--transition-fast);
        }
        .navbar__link:hover,
        .navbar__link--active {
          color: var(--text-primary);
        }
        .navbar__link--active::after {
          left: 0.875rem;
          right: 0.875rem;
        }
        .navbar__right {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          flex-shrink: 0;
        }
        .navbar__auth-btns {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .navbar__write-btn { display: none; }
        .navbar__avatar-wrap { position: relative; }
        .navbar__avatar-btn {
          background: none;
          border: 2px solid var(--border-color);
          border-radius: 50%;
          padding: 2px;
          cursor: pointer;
          transition: var(--transition-fast);
        }
        .navbar__avatar-btn:hover {
          border-color: var(--accent-primary);
        }
        .navbar__dropdown {
          position: absolute;
          top: calc(100% + 0.75rem);
          right: 0;
          min-width: 220px;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-card);
          padding: 0.5rem;
          z-index: 999;
        }
        .navbar__dropdown-header {
          padding: 0.5rem 0.75rem;
        }
        .navbar__dropdown-name {
          font-weight: 600;
          font-size: 0.9rem;
        }
        .navbar__dropdown-email {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 0.125rem;
        }
        .navbar__dropdown-divider {
          height: 1px;
          background: var(--border-color);
          margin: 0.5rem 0;
        }
        .navbar__dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          border-radius: var(--radius-sm);
          font-size: 0.875rem;
          color: var(--text-secondary);
          transition: var(--transition-fast);
          cursor: pointer;
          width: 100%;
          background: none;
          border: none;
          text-align: left;
        }
        .navbar__dropdown-item:hover {
          background: rgba(124,58,237,0.1);
          color: var(--accent-secondary);
        }
        .navbar__dropdown-logout { color: #f87171; }
        .navbar__dropdown-logout:hover {
          background: rgba(248,113,113,0.1);
          color: #f87171;
        }
        /* Hamburger */
        .navbar__hamburger {
          display: none;
          flex-direction: column;
          gap: 4px;
          padding: 6px;
          background: none;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          cursor: pointer;
        }
        .navbar__hamburger span {
          display: block;
          width: 20px;
          height: 2px;
          background: var(--text-secondary);
          border-radius: 1px;
          transition: var(--transition-fast);
        }
        .navbar__hamburger--open span:nth-child(1) {
          transform: translateY(6px) rotate(45deg);
        }
        .navbar__hamburger--open span:nth-child(2) {
          opacity: 0;
        }
        .navbar__hamburger--open span:nth-child(3) {
          transform: translateY(-6px) rotate(-45deg);
        }
        /* Mobile menu */
        .navbar__mobile {
          position: fixed;
          top: 70px; left: 0; right: 0;
          display: flex;
          flex-direction: column;
          padding: 1rem;
          z-index: 999;
          border-bottom: 1px solid var(--border-color);
        }
        .navbar__mobile-link {
          padding: 0.75rem 1rem;
          border-radius: var(--radius-sm);
          font-size: 0.9375rem;
          font-weight: 500;
          color: var(--text-secondary);
          transition: var(--transition-fast);
          cursor: pointer;
          background: none;
          border: none;
          text-align: left;
        }
        .navbar__mobile-link:hover,
        .navbar__mobile-link--active {
          background: rgba(124,58,237,0.1);
          color: var(--accent-secondary);
        }
        .navbar__mobile-logout {
          color: #f87171;
        }
        @media (max-width: 768px) {
          .navbar__links { display: none; }
          .navbar__hamburger { display: flex; }
          .navbar__auth-btns .btn:first-child { display: none; }
          .navbar__write-btn { display: none !important; }
          .navbar__dropdown {
            position: fixed;
            top: 80px;
            right: 1rem;
            left: 1rem;
            width: auto;
            min-width: auto;
          }
        }
        @media (max-width: 480px) {
          .navbar__inner { gap: 1rem; }
          .navbar__logo-text { display: none; }
        }
        @media (min-width: 769px) {
          .navbar__write-btn { display: inline-flex; }
          .navbar__mobile { display: none; }
        }
      `}</style>
    </nav>
  );
}
