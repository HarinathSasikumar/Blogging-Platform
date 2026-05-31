import { useNavigate } from 'react-router-dom';
import UserAvatar from './UserAvatar';

const CATEGORY_COLORS = {
  Technology: { bg: 'rgba(124,58,237,0.15)', color: '#a855f7', border: 'rgba(124,58,237,0.3)' },
  Programming: { bg: 'rgba(59,130,246,0.15)', color: '#60a5fa', border: 'rgba(59,130,246,0.3)' },
  Design: { bg: 'rgba(236,72,153,0.15)', color: '#f472b6', border: 'rgba(236,72,153,0.3)' },
  Career: { bg: 'rgba(249,115,22,0.15)', color: '#fb923c', border: 'rgba(249,115,22,0.3)' },
  Tutorial: { bg: 'rgba(6,182,212,0.15)', color: '#22d3ee', border: 'rgba(6,182,212,0.3)' },
  Business: { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: 'rgba(245,158,11,0.3)' },
  Science: { bg: 'rgba(16,185,129,0.15)', color: '#34d399', border: 'rgba(16,185,129,0.3)' },
  Health: { bg: 'rgba(239,68,68,0.15)', color: '#f87171', border: 'rgba(239,68,68,0.3)' },
  Lifestyle: { bg: 'rgba(251,146,60,0.15)', color: '#fb923c', border: 'rgba(251,146,60,0.3)' },
  Travel: { bg: 'rgba(20,184,166,0.15)', color: '#2dd4bf', border: 'rgba(20,184,166,0.3)' },
  default: { bg: 'rgba(100,116,139,0.15)', color: '#94a3b8', border: 'rgba(100,116,139,0.3)' },
};

function estimateReadingTime(content = '') {
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(d);
  } catch {
    return '';
  }
}

const FALLBACK_GRADIENTS = [
  'linear-gradient(135deg, #7c3aed, #ec4899)',
  'linear-gradient(135deg, #3b82f6, #7c3aed)',
  'linear-gradient(135deg, #10b981, #3b82f6)',
  'linear-gradient(135deg, #f59e0b, #ef4444)',
  'linear-gradient(135deg, #ec4899, #f59e0b)',
];

export default function PostCard({ post, featured = false }) {
  const navigate = useNavigate();
  if (!post) return null;

  const catStyle = CATEGORY_COLORS[post.category] || CATEGORY_COLORS.default;
  const readTime = estimateReadingTime(post.content);
  const gradientIndex = (post.title?.charCodeAt(0) || 0) % FALLBACK_GRADIENTS.length;
  const getCoverImage = () => {
    if (post.featuredImage) {
      if (post.featuredImage.startsWith('http') || post.featuredImage.startsWith('/')) {
        return post.featuredImage;
      }
      return `${import.meta.env.VITE_BACKEND_URL || ''}/uploads/${post.featuredImage}`;
    }
    const cat = post.category ? post.category.toLowerCase() : 'other';
    const supportedCategories = ['technology', 'programming', 'design', 'career', 'tutorial', 'business', 'science', 'health', 'lifestyle', 'travel'];
    if (supportedCategories.includes(cat)) {
      return `/default-${cat}.png`;
    }
    return '/default-other.png';
  };

  const imgSrc = getCoverImage();

  const handleClick = () => navigate(`/post/${post.slug}`);

  return (
    <article
      className={`post-card ${featured ? 'post-card--featured' : ''}`}
      onClick={handleClick}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      aria-label={`Read post: ${post.title}`}
    >
      {/* Thumbnail */}
      <div className="post-card__img-wrap">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={post.title}
            className="post-card__img"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div
          className="post-card__img-fallback"
          style={{
            background: FALLBACK_GRADIENTS[gradientIndex],
            display: imgSrc ? 'none' : 'flex',
          }}
        >
          <span className="post-card__img-fallback-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
              <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
              <path d="M2 2l7.586 7.586"></path>
              <circle cx="11" cy="11" r="2"></circle>
            </svg>
          </span>
        </div>
        {/* Category overlay badge */}
        <div
          className="post-card__category"
          style={{ background: catStyle.bg, color: catStyle.color, border: `1px solid ${catStyle.border}` }}
        >
          {post.category || 'General'}
        </div>
      </div>

      {/* Content */}
      <div className="post-card__body">
        <h2 className={`post-card__title ${featured ? 'post-card__title--featured' : ''}`}>
          {post.title}
        </h2>

        {post.description && (
          <p className="post-card__desc text-clamp-2">{post.description}</p>
        )}

        {post.tags?.length > 0 && (
          <div className="post-card__tags">
            {(Array.isArray(post.tags) ? post.tags : []).slice(0, 3).map((tag) => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="post-card__footer">
          <div className="post-card__author">
            <UserAvatar user={post.author} size="xs" />
            <div className="post-card__author-info">
              <span className="post-card__author-name">{post.author?.username || 'Anonymous'}</span>
              <span className="post-card__meta">
                {formatDate(post.createdAt)} · {readTime} min read
              </span>
            </div>
          </div>
          <div className="post-card__stats">
            <span className="post-card__stat">❤ {post.likes?.length || 0}</span>
          </div>
        </div>
      </div>

      <style>{`
        .post-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          overflow: hidden;
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          flex-direction: column;
          animation: fadeInUp 0.5s ease forwards;
        }
        .post-card:hover {
          background: var(--bg-card-hover);
          box-shadow: var(--shadow-hover);
          transform: translateY(-6px);
        }
        .post-card:hover .post-card__img {
          transform: scale(1.06);
        }
        .post-card__img-wrap {
          position: relative;
          height: 200px;
          overflow: hidden;
          flex-shrink: 0;
        }
        .post-card--featured .post-card__img-wrap {
          height: 260px;
        }
        .post-card__img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.4,0,0.2,1);
        }
        .post-card__img-fallback {
          width: 100%;
          height: 100%;
          align-items: center;
          justify-content: center;
        }
        .post-card__img-fallback-icon {
          font-size: 3rem;
          opacity: 0.4;
        }
        .post-card__category {
          position: absolute;
          top: 0.875rem;
          left: 0.875rem;
          padding: 0.2rem 0.6rem;
          border-radius: 999px;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .post-card__body {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.625rem;
          flex: 1;
        }
        .post-card__title {
          font-family: var(--font-serif);
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          transition: color var(--transition-fast);
        }
        .post-card__title--featured {
          font-size: 1.35rem;
        }
        .post-card:hover .post-card__title {
          color: var(--accent-secondary);
        }
        .post-card__desc {
          font-size: 0.875rem;
          color: var(--text-muted);
          line-height: 1.6;
        }
        .post-card__tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.375rem;
          margin-top: 0.125rem;
        }
        .post-card__footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          padding-top: 0.75rem;
          border-top: 1px solid var(--border-color);
        }
        .post-card__author {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .post-card__author-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .post-card__author-name {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-secondary);
        }
        .post-card__meta {
          font-size: 0.7rem;
          color: var(--text-muted);
        }
        .post-card__stats {
          display: flex;
          gap: 0.75rem;
        }
        .post-card__stat {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
      `}</style>
    </article>
  );
}
