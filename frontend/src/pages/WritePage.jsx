import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RichTextEditor from '../components/RichTextEditor';
import TagInput from '../components/TagInput';
import { useAuth } from '../context/AuthContext';
import { createPost, updatePost, getPostBySlug } from '../api/posts';
import { uploadImage } from '../api/users';
import toast from 'react-hot-toast';

const CATEGORIES = ['Technology', 'Programming', 'Design', 'Career', 'Tutorial', 'Business', 'Science', 'Health', 'Lifestyle', 'Travel', 'Other'];

function wordCount(content = '') {
  return content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length;
}

export default function WritePage() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({
    title: '',
    description: '',
    content: '',
    category: '',
    tags: [],
    published: true,
  });
  const [featuredImage, setFeaturedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [loading, setLoading] = useState(isEditMode);
  const [errors, setErrors] = useState({});
  const [autoSaveTimer, setAutoSaveTimer] = useState(null);

  // Load existing post in edit mode
  useEffect(() => {
    if (!isEditMode) return;
    getPostBySlug(id)
      .then((res) => {
        const p = res.data?.data?.post || res.data?.data || res.data?.post || res.data;
        setForm({
          title: p.title || '',
          description: p.description || '',
          content: p.content || '',
          category: p.category || 'Technology',
          tags: p.tags || [],
          published: p.published !== false,
        });
        if (p.featuredImage) setImagePreview(`/uploads/${p.featuredImage}`);
      })
      .catch(() => toast.error('Failed to load post'))
      .finally(() => setLoading(false));
  }, [id, isEditMode]);

  // Auto-save indicator
  const triggerSaveStatus = useCallback(() => {
    setSaveStatus('unsaved');
    if (autoSaveTimer) clearTimeout(autoSaveTimer);
    const t = setTimeout(() => setSaveStatus(''), 3000);
    setAutoSaveTimer(t);
  }, [autoSaveTimer]);

  const handleFieldChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: '' }));
    triggerSaveStatus();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
    setImagePreview(URL.createObjectURL(file));
    setFeaturedImage(file);
  };

  const handleImageUpload = async () => {
    if (!featuredImage) return null;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', featuredImage);
      const res = await uploadImage(fd);
      return res.data?.filename || res.data?.image || null;
    } catch {
      toast.error('Image upload failed');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    else if (form.title.length < 5) errs.title = 'Title must be at least 5 characters';
    
    if (!form.description.trim()) errs.description = 'Description is required';
    else if (form.description.length < 10) errs.description = 'Description must be at least 10 characters';
    
    if (!form.category) errs.category = 'Please select a category';
    
    if (!form.content || form.content === '<p><br></p>') errs.content = 'Content is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); toast.error('Please fix the errors'); return; }

    setSaving(true);
    setSaveStatus('saving');

    try {
      let uploadedImage = null;
      if (featuredImage) {
        uploadedImage = await handleImageUpload();
      }

      const payload = {
        ...form,
        ...(uploadedImage && { featuredImage: uploadedImage }),
      };

      if (isEditMode) {
        await updatePost(id, payload);
        toast.success('Post updated successfully!');
      } else {
        const res = await createPost(payload);
        const slug = res.data?.post?.slug || res.data?.slug;
        toast.success('Post published! 🎉');
        if (slug) navigate(`/post/${slug}`);
        else navigate('/dashboard');
        return;
      }
      setSaveStatus('saved');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save post');
      setSaveStatus('unsaved');
    } finally {
      setSaving(false);
    }
  };

  const wc = wordCount(form.content);
  const readTime = Math.max(1, Math.round(wc / 200));

  if (loading) {
    return (
      <div className="page-wrapper loading-center">
        <div className="spinner spinner-lg" />
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <form onSubmit={handleSubmit}>
        <div className="write-header">
          <div className="container write-header__inner">
            <div className="write-header__left">
              <button type="button" onClick={() => navigate(-1)} className="btn btn-ghost btn-sm">
                ← Back
              </button>
              <h1 className="write-header__title">
                {isEditMode ? '✏ Edit Post' : '✍ New Story'}
              </h1>
            </div>
            <div className="write-header__right">
              {saveStatus === 'unsaved' && <span className="write-save-status write-save-status--unsaved">● Unsaved changes</span>}
              {saveStatus === 'saved' && <span className="write-save-status write-save-status--saved">✓ Saved</span>}
              {saveStatus === 'saving' && <span className="write-save-status">Saving...</span>}
              <button
                id="publish-btn"
                type="submit"
                className={`btn btn-primary ${saving ? 'btn-loading' : ''}`}
                disabled={saving || uploading}
              >
                {saving ? <><span className="spinner" /> Saving...</> : isEditMode ? 'Update Post' : (form.published ? 'Publish' : 'Save Draft')}
              </button>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="write-layout">
            {/* Main Editor */}
            <div className="write-main">
              {/* Title */}
              <div className="form-group">
                <input
                  id="post-title"
                  type="text"
                  className={`write-title-input ${errors.title ? 'form-input--error' : ''}`}
                  placeholder="Your story title..."
                  value={form.title}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  maxLength={200}
                />
                {errors.title && <p className="form-error">{errors.title}</p>}
              </div>

              {/* Description */}
              <div className="form-group">
                <textarea
                  id="post-description"
                  className={`form-input form-textarea write-desc-input ${errors.description ? 'form-input--error' : ''}`}
                  placeholder="Brief description of your story (shown in previews)..."
                  value={form.description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  rows={2}
                  maxLength={300}
                />
                {errors.description && <p className="form-error">{errors.description}</p>}
              </div>

              {/* Rich Text Editor */}
              <div className="form-group">
                <RichTextEditor
                  value={form.content}
                  onChange={(v) => handleFieldChange('content', v)}
                />
                {errors.content && <p className="form-error">{errors.content}</p>}
              </div>

              {/* Word count */}
              <div className="write-stats">
                <span>📝 {wc.toLocaleString()} words</span>
                <span>⏱ ~{readTime} min read</span>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="write-sidebar">
              {/* Featured Image */}
              <div className="write-panel">
                <h3 className="write-panel__title">Featured Image</h3>
                <label htmlFor="image-upload" className="write-image-upload">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="write-image-preview" />
                  ) : (
                    <div className="write-image-placeholder">
                      <span className="write-image-placeholder__icon">🖼</span>
                      <span>Click to upload image</span>
                      <span className="write-image-placeholder__sub">PNG, JPG up to 5MB</span>
                    </div>
                  )}
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                </label>
                {imagePreview && (
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    style={{ width: '100%', marginTop: '0.5rem' }}
                    onClick={() => { setImagePreview(''); setFeaturedImage(null); }}
                  >
                    Remove image
                  </button>
                )}
              </div>

              {/* Category */}
              <div className="write-panel">
                <h3 className="write-panel__title">Category</h3>
                <select
                  id="post-category"
                  className={`form-input form-select ${errors.category ? 'form-input--error' : ''}`}
                  value={form.category}
                  onChange={(e) => handleFieldChange('category', e.target.value)}
                >
                  <option value="" disabled>Select a category</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.category && <p className="form-error" style={{ fontSize: '0.75rem', color: 'var(--danger-color)', marginTop: '0.25rem' }}>{errors.category}</p>}
              </div>

              {/* Tags */}
              <div className="write-panel">
                <h3 className="write-panel__title">Tags</h3>
                <TagInput
                  tags={form.tags}
                  onChange={(tags) => handleFieldChange('tags', tags)}
                />
                <p className="write-panel__hint">Press Enter or comma to add a tag</p>
              </div>

              {/* Publish Toggle */}
              <div className="write-panel">
                <h3 className="write-panel__title">Visibility</h3>
                <div className="write-toggle">
                  <label className="write-toggle__label">
                    <input
                      id="published-toggle"
                      type="checkbox"
                      checked={form.published}
                      onChange={(e) => handleFieldChange('published', e.target.checked)}
                      className="write-toggle__input"
                    />
                    <div className="write-toggle__track">
                      <div className="write-toggle__thumb" />
                    </div>
                    <span className="write-toggle__text">
                      {form.published ? '🌐 Published' : '📝 Draft'}
                    </span>
                  </label>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </form>

      <style>{`
        .write-header {
          background: var(--bg-secondary);
          border-bottom: 1px solid var(--border-color);
          padding: 0.875rem 0;
          position: sticky;
          top: 70px;
          z-index: 100;
        }
        .write-header__inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }
        .write-header__left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .write-header__title {
          font-size: 1.125rem;
          font-weight: 700;
        }
        .write-header__right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .write-save-status {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .write-save-status--unsaved { color: var(--accent-amber); }
        .write-save-status--saved { color: var(--accent-green); }
        .write-layout {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 2rem;
          padding: 2rem 0 4rem;
          align-items: start;
        }
        .write-main {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          min-width: 0;
        }
        .write-title-input {
          width: 100%;
          background: none;
          border: none;
          border-bottom: 2px solid var(--border-color);
          border-radius: 0;
          padding: 0.5rem 0;
          font-family: var(--font-serif);
          font-size: clamp(1.5rem, 3vw, 2.25rem);
          font-weight: 800;
          color: var(--text-primary);
          transition: border-color var(--transition-fast);
        }
        .write-title-input:focus {
          border-color: var(--accent-primary);
          box-shadow: none;
          background: none;
        }
        .write-title-input::placeholder { color: var(--text-muted); }
        .write-desc-input {
          font-size: 1rem;
          min-height: 64px;
        }
        .write-stats {
          display: flex;
          gap: 1.5rem;
          font-size: 0.8rem;
          color: var(--text-muted);
          padding: 0.5rem 0;
        }
        /* Sidebar panels */
        .write-sidebar {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          position: sticky;
          top: 130px;
        }
        .write-panel {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .write-panel__title {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .write-panel__hint {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: -0.25rem;
        }
        /* Image upload */
        .write-image-upload {
          display: block;
          border: 2px dashed var(--border-color);
          border-radius: var(--radius-sm);
          cursor: pointer;
          overflow: hidden;
          transition: border-color var(--transition-fast);
        }
        .write-image-upload:hover { border-color: var(--accent-primary); }
        .write-image-preview {
          width: 100%;
          height: 150px;
          object-fit: cover;
        }
        .write-image-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.375rem;
          padding: 2rem 1rem;
          font-size: 0.8125rem;
          color: var(--text-muted);
          text-align: center;
        }
        .write-image-placeholder__icon { font-size: 2rem; opacity: 0.5; }
        .write-image-placeholder__sub { font-size: 0.7rem; }
        /* Toggle */
        .write-toggle__label {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
        }
        .write-toggle__input { display: none; }
        .write-toggle__track {
          width: 44px;
          height: 24px;
          border-radius: 12px;
          background: var(--border-color);
          position: relative;
          transition: background var(--transition-fast);
          flex-shrink: 0;
        }
        .write-toggle__input:checked + .write-toggle__track {
          background: var(--gradient-primary);
        }
        .write-toggle__thumb {
          position: absolute;
          top: 3px; left: 3px;
          width: 18px; height: 18px;
          border-radius: 50%;
          background: #fff;
          transition: transform var(--transition-fast);
          box-shadow: 0 1px 4px rgba(0,0,0,0.3);
        }
        .write-toggle__input:checked ~ .write-toggle__track .write-toggle__thumb,
        .write-toggle__input:checked + .write-toggle__track .write-toggle__thumb {
          transform: translateX(20px);
        }
        .write-toggle__text {
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-primary);
        }
        @media (max-width: 900px) {
          .write-layout { grid-template-columns: 1fr; }
          .write-sidebar { position: static; }
        }
      `}</style>
    </div>
  );
}
