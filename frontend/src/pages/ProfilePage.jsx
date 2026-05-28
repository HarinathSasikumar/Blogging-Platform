import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUserProfile, getUserPosts } from '../api/users';
import UserAvatar from '../components/UserAvatar';
import PostGrid from '../components/PostGrid';

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(d);
  } catch {
    return '';
  }
}

export default function ProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setPostsLoading(true);
    getUserProfile(id)
      .then((res) => setProfile(res.data?.data?.user || res.data?.data || res.data))
      .catch(() => setError('User not found'))
      .finally(() => setLoading(false));

    getUserPosts(id)
      .then((res) => setPosts(res.data?.data?.posts || res.data?.data || res.data || []))
      .catch(() => setPosts([]))
      .finally(() => setPostsLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="page-wrapper loading-center">
        <div className="spinner spinner-lg" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="empty-state">
            <div className="empty-state-icon">👤</div>
            <h2 className="empty-state-title">User not found</h2>
            <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>Back to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  const totalLikes = posts.reduce((sum, p) => sum + (p.likes?.length || 0), 0);
  const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0);

  return (
    <div className="page-wrapper">
      {/* Profile Header */}
      <div className="profile-hero">
        <div className="profile-hero__bg" />
        <div className="container profile-hero__inner">
          <UserAvatar user={profile} size="xl" className="profile-hero__avatar" />
          <div className="profile-hero__info">
            <h1 className="profile-hero__name">{profile.username}</h1>
            {profile.bio && <p className="profile-hero__bio">{profile.bio}</p>}
            <div className="profile-hero__meta">
              <span>📅 Joined {formatDate(profile.createdAt)}</span>
              <span>📝 {posts.length} posts</span>
              {totalViews > 0 && <span>👁 {totalViews.toLocaleString()} views</span>}
              {totalLikes > 0 && <span>❤ {totalLikes.toLocaleString()} likes</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="container" style={{ paddingBottom: '4rem', paddingTop: '2rem' }}>
        <div className="section-header">
          <div>
            <h2 className="section-title">Stories by {profile.username}</h2>
          </div>
        </div>
        <PostGrid posts={posts} loading={postsLoading} columns={3} />
      </div>

      <style>{`
        .profile-hero {
          position: relative;
          padding: 4rem 0 3rem;
          overflow: hidden;
        }
        .profile-hero__bg {
          position: absolute;
          inset: 0;
          background: var(--gradient-hero);
        }
        .profile-hero__inner {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 2.5rem;
          flex-wrap: wrap;
        }
        .profile-hero__avatar {
          border: 4px solid rgba(124,58,237,0.5);
          box-shadow: 0 0 0 8px rgba(124,58,237,0.1);
        }
        .profile-hero__info { flex: 1; }
        .profile-hero__name {
          font-family: var(--font-serif);
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 0.75rem;
        }
        .profile-hero__bio {
          font-size: 1.0625rem;
          color: var(--text-secondary);
          line-height: 1.7;
          max-width: 600px;
          margin-bottom: 1.25rem;
        }
        .profile-hero__meta {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          font-size: 0.875rem;
          color: var(--text-muted);
        }
        @media (max-width: 640px) {
          .profile-hero__inner { flex-direction: column; text-align: center; }
          .profile-hero__meta { justify-content: center; }
        }
      `}</style>
    </div>
  );
}
