import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      id="theme-toggle-btn"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <span className={`theme-toggle__icon ${isDark ? 'theme-toggle__icon--moon' : 'theme-toggle__icon--sun'}`}>
        {isDark ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#a855f7' }}>
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#f59e0b' }}>
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        )}
      </span>

      <style>{`
        .theme-toggle {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-sm);
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition);
          flex-shrink: 0;
        }
        .theme-toggle:hover {
          border-color: var(--accent-primary);
          background: rgba(124,58,237,0.1);
          transform: scale(1.05);
        }
        .theme-toggle__icon {
          font-size: 1rem;
          display: block;
          transition: transform 0.5s cubic-bezier(0.4,0,0.2,1);
        }
        .theme-toggle__icon--moon {
          transform: rotate(0deg);
        }
        .theme-toggle__icon--sun {
          transform: rotate(180deg);
        }
      `}</style>
    </button>
  );
}
