import PostCard from './PostCard';
import SkeletonCard from './SkeletonCard';

export default function PostGrid({ posts = [], loading = false, columns = 3 }) {
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: '1.5rem',
  };

  if (loading) {
    return (
      <div className="post-grid" style={gridStyle}>
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
        <style>{`
          @media (max-width: 1024px) { .post-grid { grid-template-columns: repeat(2, 1fr) !important; } }
          @media (max-width: 640px) { .post-grid { grid-template-columns: 1fr !important; } }
        `}</style>
      </div>
    );
  }

  if (!posts.length) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📝</div>
        <h3 className="empty-state-title">No posts found</h3>
        <p className="empty-state-text">There are no posts here yet. Be the first to write something!</p>
      </div>
    );
  }

  return (
    <div className="post-grid" style={gridStyle}>
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
      <style>{`
        @media (max-width: 1024px) { .post-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 640px) { .post-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
