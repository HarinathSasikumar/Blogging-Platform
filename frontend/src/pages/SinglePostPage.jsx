import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPostBySlug, toggleLike, toggleBookmark, getPosts } from '../api/posts';
import { useAuth } from '../context/AuthContext';
import ReadingProgressBar from '../components/ReadingProgressBar';
import CommentSection from '../components/CommentSection';
import UserAvatar from '../components/UserAvatar';
import PostCard from '../components/PostCard';
import toast from 'react-hot-toast';

function estimateReadingTime(content = '') {
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(d);
  } catch {
    return '';
  }
}

export default function SinglePostPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [relatedPosts, setRelatedPosts] = useState([]);

  const fetchPost = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getPostBySlug(slug);
      const data = res.data?.data?.post || res.data?.data || res.data?.post || res.data;
      setPost(data);
      setLikeCount(data.likes?.length || 0);
      if (isAuthenticated && user) {
        setLiked(data.likes?.includes(user._id) || false);
        setBookmarked(data.bookmarks?.includes(user._id) || false);
      }
      // Fetch related posts
      if (data.category) {
        try {
          const related = await getPosts({ category: data.category, limit: 3 });
          const relatedData = related.data?.data?.posts || related.data?.posts || [];
          setRelatedPosts(relatedData.filter((p) => p._id !== data._id).slice(0, 3));
        } catch { /* ignore */ }
      }
    } catch {
      setError('Post not found');
    } finally {
      setLoading(false);
    }
  }, [slug, isAuthenticated, user]);

  useEffect(() => {
    fetchPost();
    window.scrollTo(0, 0);
  }, [fetchPost]);

  const handleLike = async () => {
    if (!isAuthenticated) { toast.error('Sign in to like posts'); return; }
    const prev = liked;
    setLiked(!prev);
    setLikeCount((c) => prev ? c - 1 : c + 1);
    try {
      await toggleLike(post._id);
    } catch {
      setLiked(prev);
      setLikeCount((c) => prev ? c + 1 : c - 1);
    }
  };

  const handleBookmark = async () => {
    if (!isAuthenticated) { toast.error('Sign in to bookmark posts'); return; }
    const prev = bookmarked;
    setBookmarked(!prev);
    try {
      await toggleBookmark(post._id);
      toast.success(prev ? 'Removed from bookmarks' : 'Added to bookmarks');
    } catch {
      setBookmarked(prev);
      toast.error('Failed to update bookmark');
    }
  };

  const readTime = post ? estimateReadingTime(post.content) : 0;

  if (loading) {
    return (
      <div className="page-wrapper">
        <ReadingProgressBar />
        <div className="container">
          <div style={{ paddingTop: '4rem' }}>
            <div className="skeleton" style={{ height: 400, borderRadius: 'var(--radius-lg)', marginBottom: '2rem' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 760 }}>
              <div className="skeleton" style={{ height: 40, width: '80%' }} />
              <div className="skeleton" style={{ height: 24, width: '40%' }} />
              {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 18, width: `${90 - i*5}%` }} />)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h2 className="empty-state-title">Post not found</h2>
            <p className="empty-state-text">The post you're looking for doesn't exist or has been removed.</p>
            <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>Back to Home</Link>
          </div>
        </div>
      </div>
    );
  }

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

  return (
    <div>
      <ReadingProgressBar />

      <div className="page-wrapper">
        {/* Hero Image */}
        <div className="sp-hero">
          {imgSrc ? (
            <img src={imgSrc} alt={post.title} className="sp-hero__img" />
          ) : (
            <div className="sp-hero__fallback" />
          )}
          <div className="sp-hero__overlay" />
          <div className="container sp-hero__content">
            <button onClick={() => navigate(-1)} className="sp-hero__back btn btn-ghost">
              ← Back
            </button>
            {post.category && (
              <span className="badge badge-primary sp-hero__category">{post.category}</span>
            )}
            <h1 className="sp-hero__title">{post.title}</h1>
            {post.description && (
              <p className="sp-hero__desc">{post.description}</p>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="container">
          <div className="sp-layout">
            {/* Article */}
            <article className="sp-article">
              {/* Meta bar */}
              <div className="sp-meta">
                <div className="sp-meta__author">
                  <UserAvatar user={post.author} size="md" />
                  <div>
                    <p className="sp-meta__author-name">{post.author?.username || 'Anonymous'}</p>
                    <p className="sp-meta__details">
                      {formatDate(post.createdAt)} · {readTime} min read
                      {post.views > 0 && ` · 👁 ${post.views} views`}
                    </p>
                  </div>
                </div>
                <div className="sp-meta__actions">
                  <button
                    id="like-btn"
                    className={`sp-action-btn ${liked ? 'sp-action-btn--active' : ''}`}
                    onClick={handleLike}
                    aria-label={`${liked ? 'Unlike' : 'Like'} post`}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                    </svg>
                    <span>{likeCount}</span>
                  </button>
                  <button
                    id="bookmark-btn"
                    className={`sp-action-btn ${bookmarked ? 'sp-action-btn--active' : ''}`}
                    onClick={handleBookmark}
                    aria-label={`${bookmarked ? 'Remove bookmark' : 'Bookmark'} post`}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill={bookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16Z" />
                    </svg>
                    <span>{bookmarked ? 'Saved' : 'Save'}</span>
                  </button>
                </div>
              </div>

              <div className="divider" />

              {/* Content */}
              <div
                className="prose sp-content"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags */}
              {post.tags?.length > 0 && (
                <div className="sp-tags">
                  {post.tags.map((tag) => (
                    <Link key={tag} to={`/explore?q=${tag}`} className="tag">#{tag}</Link>
                  ))}
                </div>
              )}

              <div className="divider-gradient" />

              {/* Like/Bookmark repeat */}
              <div className="sp-bottom-actions">
                <p className="sp-bottom-actions__label">Was this helpful?</p>
                <div className="sp-bottom-actions__btns">
                  <button
                    className={`sp-action-btn ${liked ? 'sp-action-btn--active' : ''}`}
                    onClick={handleLike}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                    </svg>
                    <span>{likeCount} Likes</span>
                  </button>
                  <button
                    className={`sp-action-btn ${bookmarked ? 'sp-action-btn--active' : ''}`}
                    onClick={handleBookmark}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill={bookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16Z" />
                    </svg>
                    <span>{bookmarked ? 'Saved' : 'Save for Later'}</span>
                  </button>
                </div>
              </div>

              <div className="divider" />

              {/* Comments */}
              <CommentSection postId={post._id} />
            </article>

            {/* Sidebar */}
            <aside className="sp-sidebar">
              {/* Author card */}
              <div className="sp-author-card">
                <UserAvatar user={post.author} size="lg" />
                <div className="sp-author-card__info">
                  <h3 className="sp-author-card__name">{post.author?.username || 'Anonymous'}</h3>
                  {post.author?.bio && (
                    <p className="sp-author-card__bio">{post.author.bio}</p>
                  )}
                  {post.author?._id && (
                    <Link to={`/profile/${post.author._id}`} className="btn btn-secondary btn-sm" style={{ marginTop: '0.75rem' }}>
                      View Profile
                    </Link>
                  )}
                </div>
              </div>

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <div className="sp-related">
                  <h3 className="sp-related__title">Related Stories</h3>
                  <div className="sp-related__list">
                    {relatedPosts.map((rp) => (
                      <PostCard key={rp._id} post={rp} />
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>

      <style>{`
        .sp-hero {
          position: relative;
          height: clamp(300px, 50vw, 520px);
          overflow: hidden;
          margin-top: -70px;
        }
        .sp-hero__img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .sp-hero__fallback {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #1a1040 0%, #0a0f1e 100%);
        }
        .sp-hero__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(10,15,30,0.95) 0%, rgba(10,15,30,0.4) 50%, rgba(10,15,30,0.1) 100%);
        }
        .sp-hero__content {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding-bottom: 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
        }
        .sp-hero__back {
          width: fit-content;
          color: rgba(255,255,255,0.7);
          font-size: 0.875rem;
          padding: 0.375rem 0.75rem;
          margin-bottom: 0.5rem;
        }
        .sp-hero__back:hover { color: #fff; }
        .sp-hero__category { width: fit-content; }
        .sp-hero__title {
          font-family: var(--font-serif);
          font-size: clamp(1.75rem, 4vw, 3rem);
          font-weight: 800;
          line-height: 1.2;
          color: #fff;
          max-width: 800px;
        }
        .sp-hero__desc {
          font-size: 1.1rem;
          color: rgba(255,255,255,0.75);
          max-width: 600px;
          line-height: 1.6;
        }
        .sp-layout {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 3rem;
          padding: 3rem 0 4rem;
          align-items: start;
        }
        .sp-article { min-width: 0; }
        .sp-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }
        .sp-meta__author {
          display: flex;
          align-items: center;
          gap: 0.875rem;
        }
        .sp-meta__author-name {
          font-weight: 600;
          font-size: 0.9375rem;
          color: var(--text-primary);
        }
        .sp-meta__details {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-top: 2px;
        }
        .sp-meta__actions {
          display: flex;
          gap: 0.75rem;
        }
        .sp-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.5rem 0.875rem;
          border-radius: var(--radius-sm);
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          font-size: 0.875rem;
          color: var(--text-secondary);
          cursor: pointer;
          transition: var(--transition-fast);
        }
        .sp-action-btn:hover {
          border-color: var(--accent-primary);
          color: var(--accent-secondary);
        }
        .sp-action-btn--active {
          background: rgba(124,58,237,0.12);
          border-color: var(--accent-primary);
          color: var(--accent-secondary);
        }
        .sp-content {
          padding: 1rem 0;
        }
        .sp-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 2rem;
        }
        .sp-bottom-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .sp-bottom-actions__label {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-secondary);
        }
        .sp-bottom-actions__btns {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        /* Sidebar */
        .sp-sidebar {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          position: sticky;
          top: 90px;
        }
        .sp-author-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 1rem;
        }
        .sp-author-card__name {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .sp-author-card__bio {
          font-size: 0.875rem;
          color: var(--text-muted);
          line-height: 1.6;
          margin-top: 0.25rem;
        }
        .sp-related__title {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 1rem;
        }
        .sp-related__list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        @media (max-width: 1024px) {
          .sp-layout {
            grid-template-columns: 1fr;
            gap: 2rem;
            padding: 2rem 0 3rem;
          }
          .sp-sidebar { position: static; }
        }
        @media (max-width: 768px) {
          .sp-layout {
            gap: 1.5rem;
          }
        }
        @media (max-width: 640px) {
          .sp-meta { flex-direction: column; align-items: flex-start; }
          .sp-bottom-actions { flex-direction: column; align-items: flex-start; }
        }
      `}</style>
    </div>
  );
}
