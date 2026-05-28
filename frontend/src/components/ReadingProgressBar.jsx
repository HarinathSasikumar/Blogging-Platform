import { useState, useEffect } from 'react';

export default function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = document.documentElement;
      const scrollTop = window.scrollY || el.scrollTop;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      setProgress(Math.min(100, pct));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="reading-progress" aria-hidden="true">
      <div
        className="reading-progress__bar"
        style={{ width: `${progress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
      />

      <style>{`
        .reading-progress {
          position: fixed;
          top: 70px;
          left: 0;
          right: 0;
          height: 3px;
          background: var(--border-color);
          z-index: 999;
        }
        .reading-progress__bar {
          height: 100%;
          background: var(--gradient-primary);
          transition: width 0.1s linear;
          border-radius: 0 2px 2px 0;
          box-shadow: 0 0 8px rgba(168,85,247,0.6);
        }
      `}</style>
    </div>
  );
}
