import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import PostGrid from '../components/PostGrid';
import SearchBar from '../components/SearchBar';
import { getPosts, searchPosts } from '../api/posts';

const CATEGORIES = ['All', 'Technology', 'Programming', 'Design', 'Career', 'Tutorial', 'Business', 'Science', 'Health', 'Lifestyle', 'Travel', 'Other'];

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'All');
  const [searchQuery, setSearchQuery] = useState('');
  const observerRef = useRef(null);
  const sentinelRef = useRef(null);

  const fetchPosts = useCallback(async (pageNum = 1, reset = false) => {
    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      let res;
      if (searchQuery.trim()) {
        res = await searchPosts(searchQuery);
        const data = res.data?.data || res.data?.posts || [];
        setPosts(data);
        setHasMore(false);
      } else {
        const params = { page: pageNum, limit: 9 };
        if (activeCategory !== 'All') params.category = activeCategory;
        res = await getPosts(params);
        const data = res.data?.data?.posts || res.data?.posts || [];
        setPosts((prev) => reset || pageNum === 1 ? data : [...prev, ...data]);
        setHasMore(data.length === 9);
      }
    } catch {
      if (pageNum === 1) setPosts([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [activeCategory, searchQuery]);

  // Reset on category or search change
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchPosts(1, true);
  }, [activeCategory, searchQuery]);

  // Infinite scroll sentinel
  useEffect(() => {
    if (!sentinelRef.current || !hasMore || loadingMore) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !loadingMore) {
          setPage((prev) => {
            const next = prev + 1;
            fetchPosts(next, false);
            return next;
          });
        }
      },
      { threshold: 0.1 }
    );

    observerRef.current.observe(sentinelRef.current);
    return () => observerRef.current?.disconnect();
  }, [hasMore, loadingMore, fetchPosts]);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setSearchQuery('');
    if (cat !== 'All') setSearchParams({ category: cat });
    else setSearchParams({});
  };

  const handleSearch = (q) => {
    setSearchQuery(q);
    setActiveCategory('All');
  };

  const totalText = searchQuery
    ? `Results for "${searchQuery}"`
    : activeCategory !== 'All'
    ? `${activeCategory} Articles`
    : 'All Stories';

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingBottom: '4rem' }}>
        {/* Header */}
        <div className="explore-header">
          <div>
            <h1 className="explore-header__title" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-secondary)' }}><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20" /></svg>
              <span className="text-gradient">Explore</span>
            </h1>
            <p className="explore-header__subtitle">Discover stories from our global community</p>
          </div>
          <SearchBar onSearch={handleSearch} placeholder="Search stories, topics, authors..." />
        </div>

        {/* Category Tabs */}
        <div className="explore-tabs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              id={`explore-tab-${cat.toLowerCase()}`}
              className={`explore-tab ${activeCategory === cat ? 'explore-tab--active' : ''}`}
              onClick={() => handleCategoryChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results count */}
        {!loading && (
          <p className="explore-results-count">
            {posts.length > 0
              ? `${posts.length} ${posts.length === 1 ? 'post' : 'posts'} — ${totalText}`
              : totalText}
          </p>
        )}

        {/* Post Grid */}
        <PostGrid posts={posts} loading={loading} columns={3} />

        {/* Load More Sentinel */}
        {hasMore && !searchQuery && (
          <div ref={sentinelRef} style={{ height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {loadingMore && <div className="spinner spinner-lg" />}
          </div>
        )}

        {!hasMore && posts.length > 0 && (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem', fontSize: '0.875rem' }}>
            You've reached the end!
          </p>
        )}
      </div>

      <style>{`
        .explore-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 2rem;
          margin-bottom: 2rem;
          padding-top: 2rem;
          flex-wrap: wrap;
        }
        .explore-header__title {
          font-family: var(--font-serif);
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 0.25rem;
        }
        .explore-header__subtitle {
          color: var(--text-muted);
          font-size: 0.9375rem;
        }
        .explore-tabs {
          display: flex;
          gap: 0.375rem;
          margin-bottom: 2rem;
          overflow-x: auto;
          padding-bottom: 0.5rem;
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .explore-tabs::-webkit-scrollbar { display: none; }
        .explore-tab {
          padding: 0.5rem 1.25rem;
          border-radius: 999px;
          font-size: 0.875rem;
          font-weight: 500;
          white-space: nowrap;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          cursor: pointer;
          transition: var(--transition-fast);
        }
        .explore-tab:hover {
          border-color: var(--accent-primary);
          color: var(--accent-secondary);
        }
        .explore-tab--active {
          background: var(--gradient-primary);
          border-color: transparent;
          color: #fff;
          box-shadow: 0 4px 12px rgba(124,58,237,0.3);
        }
        .explore-results-count {
          font-size: 0.875rem;
          color: var(--text-muted);
          margin-bottom: 1.5rem;
        }
      `}</style>
    </div>
  );
}
