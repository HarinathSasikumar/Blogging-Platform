import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTrendingPosts } from '../api/posts';

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(d);
  } catch {
    return '';
  }
}

export default function TrendingSection() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getTrendingPosts()
      .then((res) => setPosts(res.data?.data || res.data || []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  const numLabels = ['01', '02', '03', '04', '05'];

  return (
    <div className="trending">
      <div className="trending__header">
        <div className="trending__title-wrap">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-pink)' }}>
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
          </svg>
          <h2 className="trending__title">Trending Now</h2>
        </div>
      </div>

      <div className="trending__list">
        {loading
          ? numLabels.map((n) => (
              <div key={n} className="trending__item trending__item--loading">
                <div className="skeleton" style={{ width: 32, height: 32, borderRadius: 8 }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div className="skeleton" style={{ height: 14, width: '90%' }} />
                  <div className="skeleton" style={{ height: 14, width: '60%' }} />
                  <div className="skeleton" style={{ height: 12, width: '40%' }} />
                </div>
              </div>
            ))
          : posts.slice(0, 5).map((post, i) => (
              <div
                key={post._id}
                className="trending__item"
                onClick={() => navigate(`/post/${post.slug}`)}
                role="link"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && navigate(`/post/${post.slug}`)}
              >
                <div className="trending__number">{numLabels[i]}</div>
                <div className="trending__item-content">
                  <h3 className="trending__item-title">{post.title}</h3>
                  <div className="trending__item-meta">
                    <span>{post.author?.username || 'Anonymous'}</span>
                    <span className="trending__dot">·</span>
                    <span>{formatDate(post.createdAt)}</span>
                    {post.views > 0 && (
                      <>
                        <span className="trending__dot">·</span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" />
                          </svg>
                          {post.views}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}

        {!loading && posts.length === 0 && (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', padding: '1rem 0' }}>
            No trending posts yet.
          </p>
        )}
      </div>

      <style>{`
        .trending {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 1.5rem;
        }
        .trending__header {
          margin-bottom: 1.25rem;
        }
        .trending__title-wrap {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .trending__fire { font-size: 1.25rem; }
        .trending__title {
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .trending__list {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .trending__item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 0.875rem 0;
          border-bottom: 1px solid var(--border-color);
          cursor: pointer;
          transition: var(--transition-fast);
          border-radius: var(--radius-sm);
        }
        .trending__item:last-child { border-bottom: none; }
        .trending__item:hover {
          padding-left: 0.5rem;
          background: rgba(124,58,237,0.05);
        }
        .trending__item--loading {
          pointer-events: none;
        }
        .trending__number {
          font-size: 1.25rem;
          font-weight: 800;
          font-family: var(--font-serif);
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          min-width: 28px;
          line-height: 1.2;
          flex-shrink: 0;
        }
        .trending__item-content {
          flex: 1;
          min-width: 0;
        }
        .trending__item-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1.4;
          margin-bottom: 0.375rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          transition: color var(--transition-fast);
        }
        .trending__item:hover .trending__item-title {
          color: var(--accent-secondary);
        }
        .trending__item-meta {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.7rem;
          color: var(--text-muted);
          flex-wrap: wrap;
        }
        .trending__dot {
          opacity: 0.5;
        }
      `}</style>
    </div>
  );
}
