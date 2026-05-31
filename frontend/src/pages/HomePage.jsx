import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import PostGrid from '../components/PostGrid';
import TrendingSection from '../components/TrendingSection';
import { getPosts } from '../api/posts';

const CATEGORIES = ['All', 'Technology', 'Programming', 'Design', 'Career', 'Tutorial', 'Business', 'Science', 'Health', 'Lifestyle', 'Travel', 'Other'];

// Category SVGs
const getCategoryIcon = (category, size = 16) => {
  const cat = category.toLowerCase();
  if (cat === 'all') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20" />
      </svg>
    );
  }
  if (cat === 'technology') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="16" height="16" x="4" y="4" rx="2" />
        <rect width="6" height="6" x="9" y="9" rx="1" />
        <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3" />
      </svg>
    );
  }
  if (cat === 'programming') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m18 16 6-6-6-6M6 8l-6 6 6 6M14.5 4l-5 16" />
      </svg>
    );
  }
  if (cat === 'design') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 14.7255 3.09032 17.1962 4.85857 19C5.03463 19.178 5.13243 19.4262 5.11905 19.6756C5.07455 20.5057 5.37894 21.3283 5.95293 21.916C6.54142 22.5181 7.37929 22.8273 8.2223 22.7758C8.46824 22.7608 8.71184 22.8532 8.88713 23.0253C9.72147 23.8443 10.8354 24.2858 12 24.2858" />
        <circle cx="7.5" cy="10.5" r="1.5" fill="currentColor" />
        <circle cx="11.5" cy="7.5" r="1.5" fill="currentColor" />
        <circle cx="16.5" cy="9.5" r="1.5" fill="currentColor" />
        <circle cx="15.5" cy="14.5" r="1.5" fill="currentColor" />
      </svg>
    );
  }
  if (cat === 'career') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        <rect width="20" height="14" x="2" y="6" rx="2" />
      </svg>
    );
  }
  if (cat === 'tutorial') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
        <path d="M6 6h10M6 10h10" />
      </svg>
    );
  }
  if (cat === 'business') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="m19 9-5 5-4-4-3 3" />
      </svg>
    );
  }
  if (cat === 'science') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      </svg>
    );
  }
  if (cat === 'health') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    );
  }
  if (cat === 'lifestyle') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" />
        <path d="M12 6a6 6 0 0 0-6 6c0 3.31 2.69 6 6 6" />
      </svg>
    );
  }
  if (cat === 'travel') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m22 2-7 20-4-9-9-4Z" />
        <path d="M22 2 11 13" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
};

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const params = {};
    if (activeCategory !== 'All') params.category = activeCategory;
    params.limit = 6;
    setLoading(true);
    getPosts(params)
      .then((res) => {
        const postsData = res.data?.data?.posts || res.data?.posts;
        setPosts(Array.isArray(postsData) ? postsData : []);
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [activeCategory]);

  return (
    <div>
      <HeroSection />

      <div className="page-wrapper" style={{ paddingTop: '3rem' }}>
        <div className="container">
          {/* Category Pills */}
          <div className="home-categories" style={{ marginBottom: '2.5rem' }}>
            <div className="home-categories__pills">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  id={`category-${cat.toLowerCase()}`}
                  className={`home-categories__pill ${activeCategory === cat ? 'home-categories__pill--active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  {getCategoryIcon(cat)}
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="home-layout">
            {/* Posts Grid */}
            <div className="home-layout__main">
              <div className="section-header">
                <div>
                  <h2 className="section-title" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                    {getCategoryIcon(activeCategory, 20)}
                    <span>{activeCategory === 'All' ? 'Latest Stories' : activeCategory}</span>
                  </h2>
                  <p className="section-subtitle">Fresh content from our community of writers</p>
                </div>
                <Link to="/explore" className="btn btn-secondary btn-sm">
                  View All →
                </Link>
              </div>

              <PostGrid posts={posts} loading={loading} columns={2} />

              {!loading && posts.length > 0 && (
                <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                  <Link to="/explore" className="btn btn-primary btn-lg">
                    Explore More Stories
                  </Link>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="home-layout__sidebar">
              <TrendingSection />

              {/* Newsletter CTA */}
              <div className="home-newsletter">
                <div className="home-newsletter__icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-secondary)' }}>
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <h3 className="home-newsletter__title">Stay in the loop</h3>
                <p className="home-newsletter__text">
                  Get the best stories delivered to your inbox weekly.
                </p>
                <Link to="/register" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Join HN BlogSphere Free
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .home-categories { overflow-x: auto; padding-bottom: 0.5rem; }
        .home-categories__pills {
          display: flex;
          gap: 0.5rem;
          padding-bottom: 0.25rem;
          min-width: max-content;
        }
        .home-categories__pill {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.5rem 1rem;
          border-radius: 999px;
          font-size: 0.875rem;
          font-weight: 500;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          cursor: pointer;
          transition: var(--transition-fast);
          white-space: nowrap;
        }
        .home-categories__pill:hover {
          border-color: var(--accent-primary);
          color: var(--accent-secondary);
          background: rgba(124,58,237,0.08);
        }
        .home-categories__pill--active {
          background: var(--gradient-primary);
          border-color: transparent;
          color: #fff;
          box-shadow: 0 4px 12px rgba(124,58,237,0.4);
        }
        .home-categories__pill--active:hover {
          color: #fff;
          transform: translateY(-1px);
        }
        .home-layout {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 2.5rem;
          align-items: start;
          padding-bottom: 4rem;
        }
        .home-layout__sidebar {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          position: sticky;
          top: 90px;
        }
        .home-newsletter {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 1.5rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.875rem;
        }
        .home-newsletter__icon { font-size: 2rem; }
        .home-newsletter__title {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .home-newsletter__text {
          font-size: 0.875rem;
          color: var(--text-muted);
          line-height: 1.6;
        }
        @media (max-width: 1024px) {
          .home-layout {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .home-layout__sidebar {
            position: static;
          }
        }
        @media (max-width: 768px) {
          .home-layout {
            gap: 1.5rem;
          }
          .home-newsletter {
            padding: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
}
