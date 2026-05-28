import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="page-wrapper not-found">
      {/* Floating orbs */}
      <div className="nf-orb nf-orb--1" />
      <div className="nf-orb nf-orb--2" />
      <div className="nf-orb nf-orb--3" />

      <div className="container nf-inner">
        <div className="nf-number">
          <span className="text-gradient">4</span>
          <span className="nf-emoji animate-fade-in" style={{ display: 'inline-flex', alignItems: 'center' }}>
            <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-primary)' }}>
              <circle cx="12" cy="12" r="10"></circle>
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
            </svg>
          </span>
          <span className="text-gradient">4</span>
        </div>

        <h1 className="nf-title animate-fade-in-up">Page not found</h1>
        <p className="nf-text animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          Looks like this page drifted out to sea.<br />
          The content you're looking for doesn't exist.
        </p>

        <div className="nf-actions animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <Link to="/" className="btn btn-primary btn-lg">
            🏠 Back to Home
          </Link>
          <Link to="/explore" className="btn btn-secondary btn-lg">
            🌍 Explore Stories
          </Link>
        </div>

        {/* Floating elements */}
        <div className="nf-floating">
          {[
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path></svg>,
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>,
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>,
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>,
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>,
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
          ].map((icon, i) => (
            <div
              key={i}
              className="nf-floating-item"
              style={{
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${4 + i}s`,
                color: 'var(--text-secondary)'
              }}
            >
              {icon}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .not-found {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }
        .nf-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
        }
        .nf-orb--1 {
          width: 400px; height: 400px;
          background: rgba(124,58,237,0.12);
          top: 10%; left: -100px;
          animation: float 8s ease-in-out infinite;
        }
        .nf-orb--2 {
          width: 300px; height: 300px;
          background: rgba(236,72,153,0.1);
          bottom: 10%; right: -80px;
          animation: floatReverse 10s ease-in-out infinite;
        }
        .nf-orb--3 {
          width: 200px; height: 200px;
          background: rgba(245,158,11,0.08);
          top: 50%; right: 20%;
          animation: float 6s ease-in-out infinite;
        }
        .nf-inner {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 1.5rem;
          padding: 4rem 0;
        }
        .nf-number {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-serif);
          font-size: clamp(6rem, 18vw, 12rem);
          font-weight: 800;
          line-height: 1;
        }
        .nf-emoji {
          font-size: clamp(4rem, 12vw, 8rem);
          animation: float 4s ease-in-out infinite;
        }
        .nf-title {
          font-family: var(--font-serif);
          font-size: clamp(1.5rem, 4vw, 2.5rem);
          font-weight: 700;
          color: var(--text-primary);
        }
        .nf-text {
          font-size: 1.0625rem;
          color: var(--text-secondary);
          line-height: 1.7;
          max-width: 500px;
        }
        .nf-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          justify-content: center;
          margin-top: 0.5rem;
        }
        .nf-floating {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }
        .nf-floating-item {
          position: absolute;
          font-size: 2rem;
          opacity: 0.12;
          animation: float ease-in-out infinite;
        }
        .nf-floating-item:nth-child(1) { top: 15%; left: 8%; }
        .nf-floating-item:nth-child(2) { top: 25%; right: 10%; }
        .nf-floating-item:nth-child(3) { top: 60%; left: 5%; }
        .nf-floating-item:nth-child(4) { top: 70%; right: 8%; }
        .nf-floating-item:nth-child(5) { top: 45%; left: 80%; }
        .nf-floating-item:nth-child(6) { top: 80%; left: 70%; }
      `}</style>
    </div>
  );
}
