import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getComments, addComment, deleteComment } from '../api/comments';
import { useAuth } from '../context/AuthContext';
import UserAvatar from './UserAvatar';
import toast from 'react-hot-toast';

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

export default function CommentSection({ postId }) {
  const { isAuthenticated, user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      const res = await getComments(postId);
      setComments(res.data?.data || res.data?.comments || []);
    } catch {
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    if (postId) fetchComments();
  }, [postId, fetchComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      const res = await addComment(postId, { content: text.trim() });
      const newComment = res.data?.data || res.data?.comment || res.data;
      setComments((prev) => [newComment, ...prev]);
      setText('');
      toast.success('Comment posted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!confirm('Delete this comment?')) return;
    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      toast.success('Comment deleted');
    } catch {
      toast.error('Failed to delete comment');
    }
  };

  return (
    <div className="comments">
      <h2 className="comments__title">
        💬 {comments.length} Comment{comments.length !== 1 ? 's' : ''}
      </h2>

      {/* Add Comment */}
      {isAuthenticated ? (
        <form className="comments__form" onSubmit={handleSubmit}>
          <div className="comments__form-header">
            <UserAvatar user={user} size="sm" />
            <textarea
              id="comment-input"
              className="form-input form-textarea comments__textarea"
              placeholder="Share your thoughts..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
              maxLength={1000}
            />
          </div>
          <div className="comments__form-footer">
            <span className="comments__char-count">{text.length}/1000</span>
            <button
              type="submit"
              className={`btn btn-primary btn-sm ${submitting ? 'btn-loading' : ''}`}
              disabled={submitting || !text.trim()}
            >
              {submitting ? <span className="spinner" /> : 'Post Comment'}
            </button>
          </div>
        </form>
      ) : (
        <div className="comments__auth-prompt">
          <p>
            <Link to="/login" className="comments__auth-link">Sign in</Link>{' '}
            to join the conversation
          </p>
        </div>
      )}

      <div className="divider" />

      {/* Comment List */}
      {loading ? (
        <div className="comments__list">
          {[1, 2, 3].map((i) => (
            <div key={i} className="comment comment--loading">
              <div className="skeleton" style={{ width: 36, height: 36, borderRadius: '50%' }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div className="skeleton" style={{ height: 14, width: 120 }} />
                <div className="skeleton" style={{ height: 14, width: '80%' }} />
                <div className="skeleton" style={{ height: 14, width: '60%' }} />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="empty-state" style={{ padding: '2rem', minHeight: 'auto' }}>
          <div className="empty-state-icon">💬</div>
          <p className="empty-state-title">No comments yet</p>
          <p className="empty-state-text">Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="comments__list">
          {comments.map((comment, i) => (
            <div
              key={comment._id}
              className="comment animate-fade-in-up"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <UserAvatar user={comment.author} size="sm" />
              <div className="comment__body">
                <div className="comment__header">
                  <div>
                    <span className="comment__author">{comment.author?.username || 'Anonymous'}</span>
                    <span className="comment__date">{formatDate(comment.createdAt)}</span>
                  </div>
                  {user && comment.author?._id === user._id && (
                    <button
                      className="btn btn-ghost btn-sm comment__delete"
                      onClick={() => handleDelete(comment._id)}
                      aria-label="Delete comment"
                    >
                      🗑
                    </button>
                  )}
                </div>
                <p className="comment__text">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .comments { }
        .comments__title {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: var(--text-primary);
        }
        .comments__form {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 1.25rem;
          margin-bottom: 1.5rem;
        }
        .comments__form-header {
          display: flex;
          gap: 0.875rem;
          margin-bottom: 0.75rem;
        }
        .comments__textarea {
          flex: 1;
          resize: vertical;
          min-height: 80px;
        }
        .comments__form-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-left: calc(34px + 0.875rem);
        }
        .comments__char-count {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .comments__auth-prompt {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 1.25rem;
          text-align: center;
          font-size: 0.9375rem;
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
        }
        .comments__auth-link {
          color: var(--accent-secondary);
          font-weight: 600;
          text-decoration: underline;
          text-decoration-color: rgba(168,85,247,0.4);
        }
        .comments__auth-link:hover { color: var(--accent-pink); }
        .comments__list {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .comment {
          display: flex;
          gap: 0.875rem;
        }
        .comment--loading { align-items: center; }
        .comment__body {
          flex: 1;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 1rem;
        }
        .comment__header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.5rem;
          gap: 0.5rem;
        }
        .comment__author {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-right: 0.625rem;
        }
        .comment__date {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .comment__delete {
          opacity: 0.6;
          font-size: 0.875rem;
          padding: 0.2rem 0.4rem;
        }
        .comment__delete:hover { opacity: 1; }
        .comment__text {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.6;
          white-space: pre-wrap;
          word-break: break-word;
        }
      `}</style>
    </div>
  );
}
