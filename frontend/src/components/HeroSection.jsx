import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

function useCountUp(target, duration = 2000) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    const raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return count;
}

function StatItem({ value, label, suffix = '' }) {
  const count = useCountUp(value);
  return (
    <div className="hero-stat">
      <div className="hero-stat__value">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="hero-stat__label">{label}</div>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="hero">
      {/* Animated gradient background */}
      <div className="hero__bg" />

      {/* Floating orbs */}
      <div className="hero__orb hero__orb--1" />
      <div className="hero__orb hero__orb--2" />
      <div className="hero__orb hero__orb--3" />
      <div className="hero__orb hero__orb--4" />

      <div className="container hero__inner">
        <div className="hero__content">
          {/* Eyebrow */}
          <div className="hero__eyebrow animate-fade-in-up">
            <span className="hero__eyebrow-dot" />
            The Future of Storytelling
          </div>

          {/* Headline */}
          <h1 className="hero__title animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Where Ideas<br />
            <span className="text-gradient">Come Alive</span>
          </h1>

          {/* Subheadline */}
          <p className="hero__subtitle animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            HN BlogSphere is a home for thinkers, writers, and curious minds.
            Publish your stories, discover world-class content, and connect
            with a community that values ideas.
          </p>

          {/* CTA Buttons */}
          <div className="hero__ctas animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Link to="/explore" className="btn btn-primary btn-lg" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
              Start Reading
            </Link>
            <Link to="/register" className="btn btn-secondary btn-lg" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
              Start Writing
            </Link>
          </div>

          {/* Stats */}
          <div className="hero__stats animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <StatItem value={10000} label="Writers" suffix="+" />
            <div className="hero__stats-divider" />
            <StatItem value={50000} label="Articles" suffix="+" />
            <div className="hero__stats-divider" />
            <StatItem value={1000000} label="Readers" suffix="+" />
          </div>
        </div>

        {/* Decorative right side */}
        <div className="hero__visual animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <img src="/homepage-hero.png" alt="Creative Content Portal" className="hero__visual-img animate-float" />
          <div className="hero__card hero__card--1">
            <div className="hero__card-dot" />
            <p className="hero__card-text">"Writing is the painting of the voice."</p>
            <span className="hero__card-author">— Voltaire</span>
          </div>
          <div className="hero__card hero__card--2">
            <div className="hero__card-dot hero__card-dot--pink" />
            <p className="hero__card-text">"A word after a word after a word is power."</p>
            <span className="hero__card-author">— Margaret Atwood</span>
          </div>
          <div className="hero__floating-tags">
            {['#Technology', '#Design', '#Programming', '#Science', '#Lifestyle'].map((tag) => (
              <span key={tag} className="tag hero__float-tag">{tag}</span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
          padding: 8rem 0 4rem;
        }
        .hero__bg {
          position: absolute;
          inset: 0;
          background: var(--gradient-hero);
          z-index: 0;
        }
        /* Orbs */
        .hero__orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          z-index: 0;
        }
        .hero__orb--1 {
          width: 500px; height: 500px;
          background: rgba(124,58,237,0.15);
          top: -100px; left: -100px;
          animation: float 8s ease-in-out infinite;
        }
        .hero__orb--2 {
          width: 400px; height: 400px;
          background: rgba(236,72,153,0.12);
          top: 50%; right: -100px;
          animation: floatReverse 10s ease-in-out infinite;
        }
        .hero__orb--3 {
          width: 300px; height: 300px;
          background: rgba(168,85,247,0.1);
          bottom: -50px; left: 40%;
          animation: float 12s ease-in-out infinite;
        }
        .hero__orb--4 {
          width: 200px; height: 200px;
          background: rgba(245,158,11,0.08);
          top: 20%; left: 50%;
          animation: floatReverse 7s ease-in-out infinite;
        }
        .hero__inner {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }
        /* Eyebrow */
        .hero__eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--accent-secondary);
          padding: 0.375rem 0.875rem;
          border-radius: 999px;
          background: rgba(124,58,237,0.12);
          border: 1px solid rgba(124,58,237,0.25);
          margin-bottom: 1.25rem;
        }
        .hero__eyebrow-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--accent-secondary);
          animation: pulse 2s ease-in-out infinite;
        }
        /* Title */
        .hero__title {
          font-family: var(--font-serif);
          font-size: clamp(2.5rem, 5vw, 4.5rem);
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          color: var(--text-primary);
        }
        .hero__subtitle {
          font-size: 1.125rem;
          color: var(--text-secondary);
          line-height: 1.8;
          margin-bottom: 2rem;
          max-width: 520px;
        }
        .hero__ctas {
          display: flex;
          gap: 1rem;
          margin-bottom: 3rem;
          flex-wrap: wrap;
        }
        /* Stats */
        .hero__stats {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .hero-stat__value {
          font-size: 1.5rem;
          font-weight: 800;
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: countUp 0.5s ease forwards;
        }
        .hero-stat__label {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-top: 2px;
        }
        .hero__stats-divider {
          width: 1px;
          height: 40px;
          background: var(--border-color);
        }
        /* Visual cards */
        .hero__visual {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          position: relative;
          min-height: 420px;
          justify-content: center;
        }
        .hero__visual-img {
          position: absolute;
          width: 90%;
          height: auto;
          max-height: 380px;
          object-fit: contain;
          left: 5%;
          top: 10px;
          z-index: 0;
          opacity: 0.85;
          filter: drop-shadow(0 20px 40px rgba(124,58,237,0.35)) drop-shadow(0 8px 16px rgba(236,72,153,0.2));
          pointer-events: none;
        }
        .hero__card {
          position: relative;
          z-index: 2;
          background: rgba(26,34,53,0.4);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: var(--radius-md);
          padding: 1.5rem;
          transition: var(--transition);
        }
        .hero__card:hover {
          transform: translateX(8px);
          border-color: rgba(124,58,237,0.4);
          box-shadow: var(--shadow-glow);
        }
        .hero__card--1 { animation: float 6s ease-in-out infinite; }
        .hero__card--2 { animation: floatReverse 8s ease-in-out infinite; }
        .hero__card-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: var(--accent-secondary);
          margin-bottom: 0.875rem;
        }
        .hero__card-dot--pink { background: var(--accent-pink); }
        .hero__card-text {
          font-family: var(--font-serif);
          font-style: italic;
          font-size: 1rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 0.75rem;
        }
        .hero__card-author {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-muted);
        }
        .hero__floating-tags {
          position: relative;
          z-index: 2;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }
        .hero__float-tag {
          animation: float 4s ease-in-out infinite;
        }
        .hero__float-tag:nth-child(even) { animation-name: floatReverse; }
        [data-theme="light"] .hero__card {
          background: rgba(255,255,255,0.85);
          border-color: rgba(0,0,0,0.08);
        }
        @media (max-width: 1024px) {
          .hero__inner {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
          .hero__visual { display: none; }
        }
        @media (max-width: 640px) {
          .hero { padding: 6rem 0 3rem; min-height: auto; }
          .hero__ctas { flex-direction: column; }
          .hero__ctas .btn { width: 100%; justify-content: center; }
        }
      `}</style>
    </section>
  );
}
