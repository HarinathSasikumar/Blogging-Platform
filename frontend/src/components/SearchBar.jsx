import { useState, useEffect, useRef, useCallback } from 'react';

export default function SearchBar({ onSearch, placeholder = 'Search posts...' }) {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const debounceRef = useRef(null);
  const inputRef = useRef(null);

  const handleChange = useCallback((e) => {
    const v = e.target.value;
    setValue(v);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearch?.(v.trim());
    }, 300);
  }, [onSearch]);

  const handleClear = () => {
    setValue('');
    onSearch?.('');
    inputRef.current?.focus();
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <div className={`search-bar ${focused ? 'search-bar--focused' : ''}`}>
      <span className="search-bar__icon">🔍</span>
      <input
        ref={inputRef}
        id="search-input"
        type="text"
        className="search-bar__input"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoComplete="off"
      />
      {value && (
        <button
          className="search-bar__clear"
          onClick={handleClear}
          aria-label="Clear search"
          type="button"
        >
          ✕
        </button>
      )}

      <style>{`
        .search-bar {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 0.625rem 1rem;
          transition: var(--transition);
          width: 100%;
          max-width: 520px;
        }
        .search-bar--focused {
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 3px rgba(124,58,237,0.15);
          background: var(--bg-secondary);
        }
        .search-bar__icon {
          font-size: 0.9rem;
          flex-shrink: 0;
          opacity: 0.6;
          transition: var(--transition-fast);
        }
        .search-bar--focused .search-bar__icon {
          opacity: 1;
        }
        .search-bar__input {
          flex: 1;
          background: none;
          border: none;
          color: var(--text-primary);
          font-size: 0.9375rem;
          outline: none;
          min-width: 0;
        }
        .search-bar__input::placeholder {
          color: var(--text-muted);
        }
        .search-bar__clear {
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 0.75rem;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: var(--transition-fast);
        }
        .search-bar__clear:hover {
          background: var(--border-color);
          color: var(--text-primary);
        }
      `}</style>
    </div>
  );
}
