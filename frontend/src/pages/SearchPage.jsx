import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PostGrid from '../components/PostGrid';
import SearchBar from '../components/SearchBar';
import { searchPosts } from '../api/posts';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const query = searchParams.get('q') || '';

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    setSearched(true);
    searchPosts(query)
      .then((res) => setResults(res.data?.data || res.data?.posts || []))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [query]);

  const handleSearch = (q) => {
    if (q.trim()) setSearchParams({ q });
    else setSearchParams({});
  };

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingBottom: '4rem' }}>
        {/* Search Header */}
        <div className="search-page-header">
          <h1 className="search-page-title">
            🔍 Search
          </h1>
          <SearchBar onSearch={handleSearch} placeholder="What are you looking for?" />
        </div>

        {/* Results info */}
        {searched && !loading && (
          <p className="search-page-count">
            {results.length > 0
              ? `Found ${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"`
              : `No results for "${query}"`}
          </p>
        )}

        {/* Results */}
        {query ? (
          <PostGrid posts={results} loading={loading} columns={3} />
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3 className="empty-state-title">Search HN BlogSphere</h3>
            <p className="empty-state-text">
              Enter a keyword to find articles, topics, and stories
            </p>
          </div>
        )}
      </div>

      <style>{`
        .search-page-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          padding: 3rem 0 2rem;
          text-align: center;
        }
        .search-page-title {
          font-family: var(--font-serif);
          font-size: 2.25rem;
          font-weight: 800;
        }
        .search-page-header .search-bar {
          max-width: 600px;
        }
        .search-page-count {
          text-align: center;
          font-size: 0.9375rem;
          color: var(--text-muted);
          margin-bottom: 2rem;
        }
      `}</style>
    </div>
  );
}
