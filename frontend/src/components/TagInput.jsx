import { useState, useRef, useCallback } from 'react';

const MAX_TAGS = 10;

export default function TagInput({ tags = [], onChange }) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);

  const addTag = useCallback((raw) => {
    const tag = raw.trim().toLowerCase().replace(/\s+/g, '-');
    if (!tag || tags.includes(tag) || tags.length >= MAX_TAGS) return;
    onChange([...tags, tag]);
    setInputValue('');
  }, [tags, onChange]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const removeTag = (tag) => {
    onChange(tags.filter((t) => t !== tag));
  };

  return (
    <div
      className="tag-input"
      onClick={() => inputRef.current?.focus()}
    >
      {tags.map((tag) => (
        <div key={tag} className="tag-input__chip">
          #{tag}
          <button
            type="button"
            className="tag-input__remove"
            onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
            aria-label={`Remove ${tag}`}
          >
            ×
          </button>
        </div>
      ))}

      {tags.length < MAX_TAGS && (
        <input
          ref={inputRef}
          id="tag-input-field"
          type="text"
          className="tag-input__field"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => { if (inputValue.trim()) addTag(inputValue); }}
          placeholder={tags.length === 0 ? 'Add tags (press Enter or comma)' : 'Add tag...'}
        />
      )}

      <style>{`
        .tag-input {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.375rem;
          min-height: 44px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          padding: 0.5rem 0.75rem;
          cursor: text;
          transition: var(--transition);
        }
        .tag-input:focus-within {
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 3px rgba(124,58,237,0.15);
        }
        .tag-input__chip {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.2rem 0.5rem 0.2rem 0.625rem;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 500;
          background: var(--gradient-primary);
          color: #fff;
          animation: scaleIn 0.2s ease forwards;
        }
        .tag-input__remove {
          background: rgba(255,255,255,0.25);
          border: none;
          color: #fff;
          border-radius: 50%;
          width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.875rem;
          cursor: pointer;
          padding: 0;
          line-height: 1;
          transition: var(--transition-fast);
        }
        .tag-input__remove:hover {
          background: rgba(255,255,255,0.4);
        }
        .tag-input__field {
          flex: 1;
          min-width: 140px;
          background: none;
          border: none;
          color: var(--text-primary);
          font-size: 0.875rem;
          outline: none;
        }
        .tag-input__field::placeholder {
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}
