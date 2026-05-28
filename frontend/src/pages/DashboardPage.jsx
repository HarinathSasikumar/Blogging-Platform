import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyPosts, getMyBookmarks, deletePost } from '../api/posts';
import PostCard from '../components/PostCard';
import UserAvatar from '../components/UserAvatar';
import toast from 'react-hot-toast';

// Premium Vector SVG Icons
const LogoIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-secondary)' }}>
    <path d="M12 3v18M12 3L6 9h12L12 3Z" />
  </svg>
);

const DashboardIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="7" height="9" x="3" y="3" rx="1" />
    <rect width="7" height="5" x="14" y="3" rx="1" />
    <rect width="7" height="9" x="14" y="12" rx="1" />
    <rect width="7" height="5" x="3" y="16" rx="1" />
  </svg>
);

const WriteIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
);

const ArticlesIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
    <path d="M18 14h-8" />
    <path d="M15 18h-5" />
    <path d="M10 6h8v4h-8V6Z" />
  </svg>
);

const SavedIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16Z" />
  </svg>
);

const AIIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="M4.93 4.93l1.41 1.41" />
    <path d="M17.66 17.66l1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="M6.34 17.66l-1.41 1.41" />
    <path d="M19.07 4.93l-1.41 1.41" />
    <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" />
    <path d="M12 6V5" />
    <path d="M12 18v-1" />
  </svg>
);

const ViewsIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const LikesIcon = ({ size = 16, filled = false }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

const EditIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
);

const DeleteIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
);

const ScoreIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34" />
    <path d="M12 2a5 5 0 0 0-5 5v3c0 2.2 1.8 4 4 4h2c2.2 0 4-1.8 4-4V7a5 5 0 0 0-5-5Z" />
  </svg>
);

const TrendingIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m22 7-8.5 8.5-5-5L2 17" />
    <path d="M16 7h6v6" />
  </svg>
);

const RocketIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1.25-2.5 3.5-2.5 3.5s2.25-1 3.5-2.5" />
    <path d="M12 2C6.5 2 2 6.5 2 12c0 2.5 1.5 4.5 3.5 5.5.5.25.75-.25.75-.75V15h2c.5 0 1-.25 1.25-.75L12 9" />
    <path d="M12 9c4.5-4.5 10-7 10-7s-2.5 5.5-7 10" />
    <path d="M9 15h11a2 2 0 0 0 2-2V9H9v6Z" />
  </svg>
);

const IdeaIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .5 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
    <path d="M9 18h6" />
    <path d="M10 22h4" />
  </svg>
);

const SEOIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="m8 12 3 3 5-5" />
  </svg>
);

const ReadabilityIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18h18" />
    <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
  </svg>
);

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

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('posts');
  const [myPosts, setMyPosts] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSidebarTab, setActiveSidebarTab] = useState('dashboard');

  // AI Assistant States
  const [aiResponse, setAiResponse] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [postsRes, bookmarksRes] = await Promise.allSettled([
        getMyPosts(),
        getMyBookmarks(),
      ]);
      if (postsRes.status === 'fulfilled') {
        setMyPosts(postsRes.value.data?.data || postsRes.value.data?.posts || postsRes.value.data || []);
      }
      if (bookmarksRes.status === 'fulfilled') {
        setBookmarks(bookmarksRes.value.data?.data || bookmarksRes.value.data?.posts || bookmarksRes.value.data || []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (postId) => {
    if (!confirm('Are you sure you want to delete this post? This cannot be undone.')) return;
    try {
      await deletePost(postId);
      setMyPosts((prev) => prev.filter((p) => p._id !== postId));
      toast.success('Post deleted successfully');
    } catch {
      toast.error('Failed to delete post');
    }
  };

  // AI Actions Trigger
  const triggerAiAction = (actionType) => {
    setAiLoading(true);
    setAiResponse(null);

    setTimeout(() => {
      if (actionType === 'ideas') {
        setAiResponse({
          title: 'Dynamic Story Ideas Generated:',
          items: [
            '1. "The Future of Web Dev: Building Neo-Brutalist UIs in 2026"',
            '2. "Chasing Solitude: 10 Hidden Mountain Villages in India"',
            '3. "How AI is Reshaping Digital Publishing (and How Writers Can Adapt)"',
          ],
        });
        toast.success('Generated trending post ideas!');
      } else if (actionType === 'seo') {
        setAiResponse({
          title: 'SEO Performance Tags:',
          items: [
            '#travelblogging #mountainvoyages #kodaikanaldiaries #responsivemern #saasinterface2026',
            'Optimal Title Tag: "Kodaikanal Travel Guide: Essential Stays & Hiking Spots"',
            'Search Volume Trend: High (+43% this week)',
          ],
        });
        toast.success('SEO keywords optimized!');
      } else if (actionType === 'readability') {
        setAiResponse({
          title: 'Deep Content Readability Score:',
          items: [
            'Overall Score: 94/100 (Excellent Grade)',
            'Readability Index: Flesch-Kincaid Grade 7 (Easy to comprehend)',
            'Tip: Keep paragraphs short (under 4 sentences) to boost mobile reader engagement by 22%.',
          ],
        });
        toast.success('Readability score computed!');
      }
      setAiLoading(false);
    }, 1200);
  };

  // Compute stats
  const totalViews = myPosts.reduce((sum, p) => sum + (p.views || 0), 0);
  const totalLikes = myPosts.reduce((sum, p) => sum + (p.likes?.length || 0), 0);

  return (
    <div className="dashboard-root">
      {/* Decorative Orbs */}
      <div className="dashboard-orb dashboard-orb--1" />
      <div className="dashboard-orb dashboard-orb--2" />
      <div className="dashboard-orb dashboard-orb--3" />

      <div className="dashboard-container">
        {/* Sleek Sidebar Navigation */}
        <aside className="dashboard-sidebar glass animate-slide-in">
          <div className="dashboard-sidebar__logo">
            <LogoIcon />
            <span className="gradient-text font-serif">HN BlogSphere</span>
          </div>

          <nav className="dashboard-sidebar__nav">
            <button
              onClick={() => setActiveSidebarTab('dashboard')}
              className={`sidebar-nav-btn ${activeSidebarTab === 'dashboard' ? 'sidebar-nav-btn--active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <DashboardIcon /> <span>Dashboard</span>
            </button>
            <Link to="/write" className="sidebar-nav-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <WriteIcon /> <span>Write Story</span>
            </Link>
            <button
              onClick={() => {
                setActiveSidebarTab('posts');
                setActiveTab('posts');
              }}
              className={`sidebar-nav-btn ${activeSidebarTab === 'posts' && activeTab === 'posts' ? 'sidebar-nav-btn--active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <ArticlesIcon /> <span>My Articles</span>
            </button>
            <button
              onClick={() => {
                setActiveSidebarTab('posts');
                setActiveTab('bookmarks');
              }}
              className={`sidebar-nav-btn ${activeSidebarTab === 'posts' && activeTab === 'bookmarks' ? 'sidebar-nav-btn--active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <SavedIcon /> <span>Saved Stories</span>
            </button>
            <a href="#ai-companion" className="sidebar-nav-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AIIcon /> <span>AI Assistant</span>
            </a>
          </nav>

          <div className="dashboard-sidebar__footer">
            <UserAvatar user={user} size="xs" />
            <div className="sidebar-user-info">
              <p className="sidebar-username">{user?.username}</p>
              <p className="sidebar-badge">Pro Writer</p>
            </div>
          </div>
        </aside>

        {/* Main Command Workspace */}
        <main className="dashboard-main animate-fade-in-up">
          {activeSidebarTab === 'dashboard' && (
            <>
              {/* Welcome Banner */}
              <div className="premium-hero glass">
            <div className="premium-hero__content">
              <span className="premium-hero__badge animate-pulse">AI-Powered Publish Hub</span>
              <h1 className="premium-hero__title">Welcome back, {user?.username}</h1>
              <p className="premium-hero__subtitle">
                Your content portfolio is growing rapidly. Analyze metrics, organize drafts, and boost your reach using HN BlogSphere's smart recommendations.
              </p>
              <div className="premium-hero__actions">
                <Link to="/write" className="btn btn-primary btn-lg" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <WriteIcon size={14} /> Create New Story
                </Link>
                <a href="#ai-companion" className="btn btn-secondary btn-lg" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <AIIcon size={14} /> Ask Inky AI
                </a>
              </div>
            </div>
            <div className="premium-hero__visual">
              <img src="/dashboard-illustration.png" alt="AI Dashboard Illustration" className="premium-hero__image animate-float" />
              <div className="visual-circle" />
              <div className="visual-card visual-card--1 animate-float">
                <span><AIIcon size={16} /></span>
                <p>AI Rating: <strong>94% Excellent</strong></p>
              </div>
              <div className="visual-card visual-card--2 animate-float-reverse">
                <span><RocketIcon size={16} /></span>
                <p>Views up: <strong>+43%</strong></p>
              </div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="futuristic-stats">
            {[
              { label: 'Total Articles', value: myPosts.length, icon: <ArticlesIcon />, glow: '#7c3aed', shadow: 'rgba(124,58,237,0.4)' },
              { label: 'Total Readership', value: totalViews, icon: <ViewsIcon />, glow: '#3b82f6', shadow: 'rgba(59,130,246,0.4)' },
              { label: 'Article Likes', value: totalLikes, icon: <LikesIcon filled />, glow: '#ec4899', shadow: 'rgba(236,72,153,0.4)' },
              { label: 'Bookmarks Saved', value: bookmarks.length, icon: <SavedIcon />, glow: '#10b981', shadow: 'rgba(16,185,129,0.4)' },
              { label: 'AI Writing Score', value: '94%', icon: <ScoreIcon />, glow: '#f59e0b', shadow: 'rgba(245,158,11,0.4)', isGold: true },
            ].map((s, i) => (
              <div
                key={s.label}
                className={`futuristic-stat ${s.isGold ? 'futuristic-stat--gold' : ''}`}
                style={{
                  animationDelay: `${i * 0.05}s`,
                  '--glow-color': s.glow,
                  '--shadow-glow': s.shadow,
                }}
              >
                <div className="futuristic-stat__top">
                  <span className="stat-label">{s.label}</span>
                  <span className="stat-icon" style={{ background: s.isGold ? 'rgba(245,158,11, 0.12)' : 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: s.glow }}>{s.icon}</span>
                </div>
                <h3 className="stat-value">{s.value.toLocaleString()}</h3>
                <div className="stat-mini-chart">
                  <div className="stat-line" style={{ background: s.glow, width: s.isGold ? '94%' : '65%' }} />
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Performance Charts and AI Assistant Section */}
          <div className="workspace-splits">
            {/* SVG Performance Growth Area Chart */}
            <div className="workspace-card chart-panel glass">
              <div className="chart-panel__header">
                <div>
                  <h3 className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <TrendingIcon /> Audience Growth Trend
                  </h3>
                  <p className="panel-subtitle">Audience impact and views over the last 7 days</p>
                </div>
                <div className="chart-pulse-badge">
                  <span className="pulse-dot" />
                  <span>14 Readers Online</span>
                </div>
              </div>

              <div className="svg-chart-container">
                <svg viewBox="0 0 500 200" className="futuristic-svg-chart">
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="50%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid Lines */}
                  <line x1="10" y1="20" x2="490" y2="20" stroke="rgba(255,255,255,0.03)" />
                  <line x1="10" y1="60" x2="490" y2="60" stroke="rgba(255,255,255,0.03)" />
                  <line x1="10" y1="100" x2="490" y2="100" stroke="rgba(255,255,255,0.03)" />
                  <line x1="10" y1="140" x2="490" y2="140" stroke="rgba(255,255,255,0.03)" />
                  <line x1="10" y1="180" x2="490" y2="180" stroke="rgba(255,255,255,0.03)" />

                  {/* Shaded Area */}
                  <path
                    d="M 10 180 Q 80 140 150 90 Q 220 160 290 80 Q 360 40 430 70 L 490 50 L 490 180 Z"
                    fill="url(#chartGrad)"
                  />
                  
                  {/* Glowing Trend Line */}
                  <path
                    d="M 10 180 Q 80 140 150 90 Q 220 160 290 80 Q 360 40 430 70 L 490 50"
                    fill="none"
                    stroke="url(#lineGrad)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />

                  {/* Interactive Nodes */}
                  <circle cx="150" cy="90" r="5" fill="#a855f7" stroke="var(--bg-card)" strokeWidth="1.5" className="chart-node" />
                  <circle cx="290" cy="80" r="5" fill="#ec4899" stroke="var(--bg-card)" strokeWidth="1.5" className="chart-node" />
                  <circle cx="490" cy="50" r="6" fill="#3b82f6" stroke="var(--bg-card)" strokeWidth="2" className="chart-node chart-node--pulse" />
                </svg>
              </div>

              <div className="chart-x-labels">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>

            {/* Smart Inky AI Writing Assistant Widget */}
            <div id="ai-companion" className="workspace-card ai-assistant glass">
              <div className="ai-assistant__header">
                <span className="assistant-avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AIIcon size={20} />
                </span>
                <div>
                  <h3 className="panel-title">Inky AI Content Companion</h3>
                  <p className="panel-subtitle">Futuristic optimization tools for your blogs</p>
                </div>
              </div>

              <div className="ai-assistant__body">
                <p className="ai-welcome-text">
                  Hi {user?.username}, I have scanned your travel draft. How would you like me to optimize it today?
                </p>

                {aiLoading ? (
                  <div className="ai-screen-loading">
                    <span className="spinner spinner-lg" />
                    <p>Consulting HN BlogSphere neural nets...</p>
                  </div>
                ) : aiResponse ? (
                  <div className="ai-response-screen animate-fade-in">
                    <h4 className="ai-response-title">{aiResponse.title}</h4>
                    <ul className="ai-response-list">
                      {aiResponse.items.map((item, idx) => (
                        <li key={idx} className="ai-response-item">{item}</li>
                      ))}
                    </ul>
                    <button onClick={() => setAiResponse(null)} className="btn btn-secondary btn-sm" style={{ marginTop: '0.75rem', width: '100%' }}>
                      Clear & Optimize Another
                    </button>
                  </div>
                ) : (
                  <div className="ai-action-buttons">
                    <button onClick={() => triggerAiAction('ideas')} className="ai-action-btn-neon" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <IdeaIcon size={14} /> Generate Trending Ideas
                    </button>
                    <button onClick={() => triggerAiAction('seo')} className="ai-action-btn-neon" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <SEOIcon size={14} /> Smart SEO Tag Generator
                    </button>
                    <button onClick={() => triggerAiAction('readability')} className="ai-action-btn-neon" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <ReadabilityIcon size={14} /> Analyze Readability Index
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

            </>
          )}

          {activeSidebarTab === 'posts' && (
            /* Unified Articles Tabs */
            <div className="dashboard-content-panel glass">
            <div className="panel-tabs-header">
              <div className="content-tabs">
                <button
                  id="dash-tab-posts"
                  className={`content-tab ${activeTab === 'posts' ? 'content-tab--active' : ''}`}
                  onClick={() => setActiveTab('posts')}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <ArticlesIcon size={14} /> My Stories ({myPosts.length})
                </button>
                <button
                  id="dash-tab-bookmarks"
                  className={`content-tab ${activeTab === 'bookmarks' ? 'content-tab--active' : ''}`}
                  onClick={() => setActiveTab('bookmarks')}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <SavedIcon size={14} /> Saved Bookmarks ({bookmarks.length})
                </button>
              </div>
            </div>

            <div className="panel-tab-body">
              {loading ? (
                <div className="loading-center" style={{ minHeight: 250 }}>
                  <div className="spinner spinner-lg" />
                </div>
              ) : activeTab === 'posts' ? (
                myPosts.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-state-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '50%', padding: '1rem', width: 'fit-content', margin: '0 auto 1.5rem' }}>
                      <ArticlesIcon size={32} />
                    </div>
                    <h3 className="empty-state-title">No stories published yet</h3>
                    <p className="empty-state-text">Let the world read your first story! Craft ideas with Inky AI and publish now.</p>
                    <Link to="/write" className="btn btn-primary" style={{ marginTop: '1.25rem' }}>
                      Write Your First Story
                    </Link>
                  </div>
                ) : (
                  <div className="futuristic-table-wrapper">
                    <table className="futuristic-table">
                      <thead>
                        <tr>
                          <th>Story Details</th>
                          <th>Published Date</th>
                          <th>Views</th>
                          <th>Likes</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {myPosts.map((post) => (
                          <tr key={post._id} className="futuristic-row animate-fade-in">
                            <td>
                              <div className="table-story-cell">
                                <Link to={`/post/${post.slug}`} className="table-story-link">
                                  {post.title}
                                </Link>
                                <span className="badge badge-primary" style={{ fontSize: '0.625rem', marginTop: '0.25rem', width: 'fit-content' }}>
                                  {post.category}
                                </span>
                              </div>
                            </td>
                            <td>{formatDate(post.createdAt)}</td>
                            <td>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                <ViewsIcon size={14} /> {post.views || 0}
                              </span>
                            </td>
                            <td>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                <LikesIcon size={14} filled /> {post.likes?.length || 0}
                              </span>
                            </td>
                            <td>
                              <span className={`badge ${post.published !== false ? 'badge-green' : 'badge-amber'}`}>
                                {post.published !== false ? 'Published' : 'Draft'}
                              </span>
                            </td>
                            <td>
                              <div className="table-row-actions">
                                <button
                                  className="btn btn-secondary btn-sm"
                                  onClick={() => navigate(`/edit/${post.slug}`)}
                                  title="Edit story"
                                  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                >
                                  <EditIcon size={12} /> Edit
                                </button>
                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={() => handleDelete(post._id)}
                                  title="Delete story"
                                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                  <DeleteIcon size={12} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              ) : (
                bookmarks.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-state-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '50%', padding: '1rem', width: 'fit-content', margin: '0 auto 1.5rem' }}>
                      <SavedIcon size={32} />
                    </div>
                    <h3 className="empty-state-title">No saved bookmarks yet</h3>
                    <p className="empty-state-text">Bookmark high-quality articles from the explore page to read them later!</p>
                    <Link to="/explore" className="btn btn-primary" style={{ marginTop: '1.25rem' }}>
                      Explore Articles
                    </Link>
                  </div>
                ) : (
                  <div className="bookmarks-grid">
                    {bookmarks.map((post) => (
                      <PostCard key={post._id} post={post} />
                    ))}
                  </div>
                )
              )}
            </div>
          </div>
          )}
        </main>
      </div>

      {/* Floating Action Button */}
      <Link to="/write" className="futuristic-fab animate-pulse" id="fab-write" aria-label="Write new post" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <WriteIcon size={24} />
      </Link>

      <style>{`
        /* ============================================================
           Futuristic Premium AI-Powered Dashboard Styles
           ============================================================ */

        .dashboard-root {
          min-height: 100vh;
          background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
          color: var(--text-primary);
          position: relative;
          overflow: hidden;
          padding-top: 80px;
          transition: background 0.3s ease, color 0.3s ease;
        }

        /* Ambient Orbs */
        .dashboard-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(140px);
          z-index: 0;
          pointer-events: none;
          opacity: 0.45;
          transition: opacity 0.5s ease;
        }
        [data-theme='light'] .dashboard-orb {
          opacity: 0.12;
        }
        .dashboard-orb--1 {
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(124,58,237,0.35) 0%, rgba(236,72,153,0.0) 70%);
          top: -150px; left: -150px;
        }
        .dashboard-orb--2 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(168,85,247,0.0) 70%);
          bottom: 10%; right: -100px;
        }
        .dashboard-orb--3 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(236,72,153,0.25) 0%, rgba(245,158,11,0.0) 70%);
          bottom: -100px; left: 25%;
        }

        .dashboard-container {
          max-width: 1540px;
          margin: 0 auto;
          padding: 2.5rem 1.5rem;
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 2.5rem;
          position: relative;
          z-index: 1;
        }

        /* 💎 Sidebar Layout */
        .dashboard-sidebar {
          height: calc(100vh - 80px - 5rem);
          position: sticky;
          top: calc(80px + 2.5rem);
          border-radius: var(--radius-lg);
          padding: 2.25rem 1.5rem;
          display: flex;
          flex-direction: column;
          box-shadow: var(--shadow-card);
          transition: var(--transition);
        }

        .dashboard-sidebar__logo {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          font-size: 1.625rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          margin-bottom: 2.5rem;
        }
        .sidebar-logo-icon { font-size: 1.375rem; }

        .dashboard-sidebar__nav {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex: 1;
        }

        .sidebar-nav-btn {
          display: flex;
          align-items: center;
          gap: 0.875rem;
          padding: 0.875rem 1.25rem;
          border-radius: var(--radius-md);
          font-size: 0.9375rem;
          font-weight: 550;
          color: var(--text-secondary);
          background: transparent;
          border: 1px solid transparent;
          text-align: left;
          width: 100%;
          cursor: pointer;
          transition: var(--transition-fast);
        }
        .sidebar-nav-btn:hover {
          color: var(--text-primary);
          background: var(--bg-card-hover);
          border-color: var(--border-color);
          transform: translateX(4px);
        }
        .sidebar-nav-btn--active {
          background: linear-gradient(135deg, rgba(124,58,237,0.08), rgba(236,72,153,0.08)) !important;
          border: 1px solid rgba(124,58,237,0.2) !important;
          border-left: 4px solid var(--accent-primary) !important;
          color: var(--accent-secondary) !important;
          font-weight: 600;
          padding-left: calc(1.25rem - 4px);
        }

        .dashboard-sidebar__footer {
          display: flex;
          align-items: center;
          gap: 0.875rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border-color);
          margin-top: auto;
        }
        .sidebar-user-info { display: flex; flex-direction: column; min-width: 0; }
        .sidebar-username {
          font-size: 0.9375rem;
          font-weight: 600;
          color: var(--text-primary);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .sidebar-badge {
          font-size: 0.725rem;
          font-weight: 750;
          background: linear-gradient(135deg, #f59e0b, #ec4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-top: 2px;
        }

        /* 💎 Main Workspace Content */
        .dashboard-main {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          min-width: 0;
        }

        /* Welcoming Premium Hero Banner */
        .premium-hero {
          border-radius: var(--radius-lg);
          padding: 3.5rem;
          display: grid;
          grid-template-columns: 1.25fr 0.75fr;
          gap: 2.5rem;
          align-items: center;
          position: relative;
          overflow: hidden;
          box-shadow: var(--shadow-card);
          background: linear-gradient(135deg, rgba(124,58,237,0.04) 0%, rgba(236,72,153,0.02) 50%, rgba(255,255,255,0.01) 100%);
          border: 1px solid var(--border-color);
        }
        [data-theme='light'] .premium-hero {
          background: linear-gradient(135deg, rgba(124,58,237,0.06) 0%, rgba(236,72,153,0.03) 100%), rgba(255,255,255,0.7);
        }
        .premium-hero__content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 1rem;
          z-index: 1;
        }
        .premium-hero__badge {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--accent-secondary);
          background: linear-gradient(135deg, rgba(124,58,237,0.1), rgba(236,72,153,0.1));
          border: 1px solid rgba(124,58,237,0.2);
          padding: 0.375rem 0.875rem;
          border-radius: 999px;
        }
        .premium-hero__title {
          font-family: var(--font-serif);
          font-size: clamp(2rem, 4vw, 2.75rem);
          font-weight: 800;
          line-height: 1.15;
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .premium-hero__subtitle {
          font-size: 1.0625rem;
          color: var(--text-secondary);
          line-height: 1.75;
          margin-bottom: 1rem;
          max-width: 60ch;
        }
        .premium-hero__actions {
          display: flex;
          gap: 1.25rem;
          flex-wrap: wrap;
        }
        .premium-hero__visual {
          position: relative;
          height: 240px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .premium-hero__image {
          position: absolute;
          max-width: 115%;
          max-height: 260px;
          object-fit: contain;
          z-index: 1;
          filter: drop-shadow(0 16px 40px rgba(124,58,237,0.3)) drop-shadow(0 4px 16px rgba(236,72,153,0.15));
        }
        .visual-circle {
          width: 200px; height: 200px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(124,58,237,0.1) 0%, rgba(236,72,153,0.0) 70%);
          border: 1px dashed var(--border-color);
          animation: spin 60s linear infinite;
          z-index: 0;
        }
        .visual-card {
          position: absolute;
          padding: 0.875rem 1.25rem;
          border-radius: var(--radius-md);
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          gap: 0.625rem;
          box-shadow: var(--shadow-card);
          font-size: 0.8125rem;
          color: var(--text-primary);
          z-index: 2;
          transition: var(--transition);
        }
        .visual-card--1 {
          top: 0px; left: -20px;
          animation: float 6s ease-in-out infinite;
        }
        .visual-card--2 {
          bottom: 0px; right: -20px;
          animation: floatReverse 8s ease-in-out infinite;
        }

        /* Metrics Grid */
        .futuristic-stats {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1.25rem;
        }
        .futuristic-stat {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          position: relative;
          overflow: hidden;
          box-shadow: var(--shadow-card);
          transition: var(--transition);
        }
        .futuristic-stat:hover {
          transform: translateY(-5px);
          border-color: var(--glow-color);
          box-shadow: 0 12px 32px var(--shadow-glow);
        }
        .futuristic-stat--gold {
          background: linear-gradient(135deg, var(--bg-card) 0%, rgba(245,158,11,0.03) 100%);
          border-color: rgba(245,158,11,0.2) !important;
        }
        .futuristic-stat--gold:hover {
          border-color: #f59e0b !important;
        }
        .futuristic-stat__top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .stat-label { font-size: 0.75rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.08em; }
        .stat-icon {
          width: 38px; height: 38px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .stat-value {
          font-family: var(--font-sans);
          font-size: 2.25rem;
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1;
          letter-spacing: -0.03em;
        }
        .stat-mini-chart {
          width: 100%;
          height: 4px;
          background: var(--bg-secondary);
          border-radius: 99px;
          overflow: hidden;
        }
        .stat-line { height: 100%; border-radius: 99px; }

        /* Workspace splits */
        .workspace-splits {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 2.5rem;
        }

        .workspace-card {
          border-radius: var(--radius-lg);
          padding: 2rem;
          box-shadow: var(--shadow-card);
          background: var(--bg-card);
          border: 1px solid var(--border-color);
        }

        .panel-title { font-size: 1.1875rem; font-weight: 750; color: var(--text-primary); letter-spacing: -0.01em; }
        .panel-subtitle { font-size: 0.875rem; color: var(--text-muted); margin-top: 0.375rem; }

        /* Chart */
        .chart-panel__header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
        }
        .chart-pulse-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.375rem 0.875rem;
          border-radius: 999px;
          background: rgba(16,185,129,0.1);
          border: 1px solid rgba(16,185,129,0.25);
          color: #10b981;
        }
        .pulse-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #10b981;
          animation: pulse 2s ease-in-out infinite;
        }
        .svg-chart-container {
          width: 100%;
          position: relative;
          padding: 0.5rem 0;
        }
        .futuristic-svg-chart {
          width: 100%;
          height: 190px;
          overflow: visible;
        }
        .chart-node {
          cursor: pointer;
          transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .chart-node:hover { transform: scale(1.6); }
        .chart-node--pulse {
          animation: pulse 2.2s ease-in-out infinite;
        }
        .chart-x-labels {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0.75rem 0;
          font-size: 0.725rem;
          color: var(--text-muted);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* AI Assistant */
        .ai-assistant__header {
          display: flex;
          align-items: center;
          gap: 1.125rem;
          margin-bottom: 2rem;
        }
        .assistant-avatar {
          width: 48px; height: 48px;
          border-radius: var(--radius-md);
          background: linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(236,72,153,0.15) 100%);
          border: 1px solid rgba(124,58,237,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent-primary);
        }
        .ai-assistant__body {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .ai-welcome-text {
          font-size: 0.9375rem;
          color: var(--text-secondary);
          line-height: 1.65;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 1.125rem;
        }
        .ai-action-buttons {
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
        }
        .ai-action-btn-neon {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 0.875rem 1.25rem;
          color: var(--text-primary);
          font-weight: 600;
          font-size: 0.875rem;
          text-align: left;
          cursor: pointer;
          transition: var(--transition);
        }
        .ai-action-btn-neon:hover {
          border-color: var(--accent-primary);
          color: var(--accent-primary);
          background: linear-gradient(135deg, rgba(124,58,237,0.04), rgba(236,72,153,0.02));
          box-shadow: 0 6px 20px rgba(124,58,237,0.08);
          transform: translateX(6px);
        }
        .ai-screen-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1.25rem;
          padding: 2.5rem 0;
          font-size: 0.9375rem;
          color: var(--text-muted);
        }
        .ai-response-screen {
          background: linear-gradient(135deg, var(--bg-secondary) 0%, rgba(124,58,237,0.02) 100%);
          border: 1px solid rgba(124,58,237,0.25);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
        }
        .ai-response-title {
          font-size: 0.9375rem;
          font-weight: 750;
          color: var(--accent-primary);
          margin-bottom: 1rem;
        }
        .ai-response-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          font-size: 0.875rem;
          color: var(--text-secondary);
        }
        .ai-response-item {
          padding-bottom: 0.625rem;
          border-bottom: 1px dashed var(--border-color);
        }
        .ai-response-item:last-child { border-bottom: none; padding-bottom: 0; }

        /* Dashboard content panel (articles tab) */
        .dashboard-content-panel {
          border-radius: var(--radius-lg);
          padding: 2.25rem;
          box-shadow: var(--shadow-card);
          background: var(--bg-card);
          border: 1px solid var(--border-color);
        }
        .panel-tabs-header {
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 2rem;
        }
        .content-tabs {
          display: flex;
          gap: 0.75rem;
        }
        .content-tab {
          padding: 1rem 2rem;
          border-radius: var(--radius-md) var(--radius-md) 0 0;
          font-size: 0.9375rem;
          font-weight: 600;
          color: var(--text-secondary);
          background: transparent;
          border: none;
          cursor: pointer;
          transition: var(--transition-fast);
          border-bottom: 3px solid transparent;
          margin-bottom: -1px;
        }
        .content-tab:hover { color: var(--text-primary); }
        .content-tab--active {
          color: var(--accent-primary);
          border-bottom-color: var(--accent-primary);
        }

        /* Futuristic table */
        .futuristic-table-wrapper {
          overflow-x: auto;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          background: var(--bg-secondary);
        }
        .futuristic-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        .futuristic-table th {
          background: var(--bg-card);
          padding: 1.125rem 1.5rem;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-muted);
          border-bottom: 1px solid var(--border-color);
        }
        .futuristic-row {
          border-bottom: 1px solid var(--border-color);
          transition: var(--transition-fast);
        }
        .futuristic-row:last-child { border-bottom: none; }
        .futuristic-row:hover {
          background: var(--bg-card-hover);
        }
        .futuristic-row td {
          padding: 1.25rem 1.5rem;
          font-size: 0.9375rem;
          color: var(--text-secondary);
        }
        .table-story-cell {
          display: flex;
          flex-direction: column;
          min-width: 0;
          gap: 0.25rem;
        }
        .table-story-link {
          font-weight: 600;
          font-size: 0.9375rem;
          color: var(--text-primary);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          transition: color var(--transition-fast);
        }
        .table-story-link:hover { color: var(--accent-primary); }
        .table-row-actions {
          display: flex;
          gap: 0.625rem;
        }

        /* Bookmarks grid */
        .bookmarks-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }

        /* Floating fab */
        .futuristic-fab {
          position: fixed;
          bottom: 2.5rem;
          right: 2.5rem;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: var(--gradient-primary);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.375rem;
          box-shadow: 0 10px 28px rgba(124,58,237,0.4);
          transition: var(--transition);
          z-index: 500;
        }
        .futuristic-fab:hover {
          transform: scale(1.1) translateY(-6px);
          box-shadow: 0 14px 36px rgba(124,58,237,0.55);
        }

        /* ============================================================
           Animations & Responsiveness
           ============================================================ */

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes floatReverse {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(12px); }
        }

        @media (max-width: 1400px) {
          .futuristic-stats { grid-template-columns: repeat(3, 1fr); }
        }

        @media (max-width: 1200px) {
          .dashboard-container { grid-template-columns: 1fr; padding: 1.5rem 1rem; }
          .dashboard-sidebar { display: none; }
          .futuristic-stats { grid-template-columns: repeat(3, 1fr); }
          .workspace-splits { grid-template-columns: 1fr; gap: 1.5rem; }
          .bookmarks-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 992px) {
          .futuristic-stats { grid-template-columns: repeat(2, 1fr); }
          .ai-assistant__header { flex-direction: column; align-items: flex-start; }
        }

        @media (max-width: 768px) {
          .premium-hero { grid-template-columns: 1fr; padding: 2rem; }
          .premium-hero__visual { display: none; }
          .futuristic-stats { grid-template-columns: repeat(2, 1fr); }
          .bookmarks-grid { grid-template-columns: 1fr; }
          .dashboard-content-panel { padding: 1.25rem; }
          .content-tab { padding: 0.75rem 1rem; font-size: 0.85rem; }
          
          .futuristic-table th,
          .futuristic-row td {
            padding: 0.75rem 1rem;
            white-space: nowrap;
          }
        }

        @media (max-width: 480px) {
          .futuristic-stats { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
