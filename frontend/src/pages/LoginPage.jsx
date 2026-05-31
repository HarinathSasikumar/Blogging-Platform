import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { loginUser } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    return errs;
  };

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((er) => ({ ...er, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const res = await loginUser(form);
      login(res.data);
      const username = res.data.user?.username || res.data.user?.name || res.data.username || res.data.name;
      toast.success(username ? `Welcome back, ${username}! 🎉` : `Welcome back! 🎉`);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid credentials';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left Panel */}
      <div className="auth-page__left">
        <div className="auth-page__left-content">
          <div className="auth-page__logo">
            <span className="auth-page__logo-icon">✍</span>
            <span className="gradient-text">HN BlogSphere</span>
          </div>
          <h2 className="auth-page__left-title">
            Craft stories that<br />
            <span className="text-gradient">move the world.</span>
          </h2>
          <p className="auth-page__left-sub">
            Join 10,000+ writers sharing ideas, experiences,<br />
            and knowledge on HN BlogSphere.
          </p>
          <div className="auth-page__left-orbs">
            <div className="auth-orb auth-orb--1" />
            <div className="auth-orb auth-orb--2" />
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="auth-page__right">
        <div className="auth-card glass animate-fade-in-up">
          <div className="auth-card__header">
            <h1 className="auth-card__title">Welcome back 👋</h1>
            <p className="auth-card__sub">Sign in to your HN BlogSphere account</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">Email address</label>
              <input
                id="login-email"
                type="email"
                name="email"
                className={`form-input ${errors.email ? 'form-input--error' : ''}`}
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
              {errors.email && <p className="form-error">{errors.email}</p>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                name="password"
                className={`form-input ${errors.password ? 'form-input--error' : ''}`}
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
              {errors.password && <p className="form-error">{errors.password}</p>}
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              className={`btn btn-primary ${loading ? 'btn-loading' : ''}`}
              style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
              disabled={loading}
            >
              {loading ? (
                <><span className="spinner" /> Signing in...</>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="auth-card__switch">
            Don't have an account?{' '}
            <Link to="/register" className="auth-card__switch-link">Create one free</Link>
          </p>
        </div>
      </div>

      <style>{`
        .auth-page {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
        }
        .auth-page__left {
          background: var(--gradient-hero);
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4rem;
        }
        .auth-page__left-content {
          position: relative;
          z-index: 1;
          max-width: 440px;
        }
        .auth-page__logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.75rem;
          font-weight: 800;
          margin-bottom: 3rem;
        }
        .auth-page__logo-icon { font-size: 1.5rem; }
        .auth-page__left-title {
          font-family: var(--font-serif);
          font-size: clamp(2rem, 3vw, 2.75rem);
          font-weight: 800;
          line-height: 1.2;
          color: var(--text-primary);
          margin-bottom: 1.5rem;
        }
        .auth-page__left-sub {
          font-size: 1.0625rem;
          color: var(--text-secondary);
          line-height: 1.7;
        }
        .auth-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
        }
        .auth-orb--1 {
          width: 350px; height: 350px;
          background: rgba(124,58,237,0.2);
          top: -80px; left: -80px;
          animation: float 10s ease-in-out infinite;
        }
        .auth-orb--2 {
          width: 250px; height: 250px;
          background: rgba(236,72,153,0.15);
          bottom: -60px; right: -40px;
          animation: floatReverse 12s ease-in-out infinite;
        }
        .auth-page__right {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          background: var(--bg-primary);
        }
        .auth-card {
          width: 100%;
          max-width: 440px;
          border-radius: var(--radius-xl);
          padding: 2.5rem;
        }
        .auth-card__header { margin-bottom: 2rem; }
        .auth-card__title {
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .auth-card__sub {
          color: var(--text-muted);
          font-size: 0.9375rem;
        }
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .form-input--error {
          border-color: #f87171 !important;
          box-shadow: 0 0 0 3px rgba(248,113,113,0.15) !important;
        }
        .auth-card__switch {
          text-align: center;
          font-size: 0.9rem;
          color: var(--text-muted);
          margin-top: 1.75rem;
        }
        .auth-card__switch-link {
          color: var(--accent-secondary);
          font-weight: 600;
          text-decoration: underline;
          text-decoration-color: rgba(168,85,247,0.4);
        }
        .auth-card__switch-link:hover { color: var(--accent-pink); }
        @media (max-width: 768px) {
          .auth-page {
            grid-template-columns: 1fr;
          }
          .auth-page__left { display: none; }
          .auth-page__right { padding: 6rem 1.5rem 2rem; }
        }
      `}</style>
    </div>
  );
}
