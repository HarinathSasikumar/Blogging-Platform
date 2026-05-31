import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { registerUser } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const validate = () => {
    const errs = {};
    if (!form.username) errs.username = 'Username is required';
    else if (form.username.length < 3) errs.username = 'At least 3 characters';
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'At least 6 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
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
      const res = await registerUser({ username: form.username, email: form.email, password: form.password });
      register(res.data);
      const username = res.data.user?.username || res.data.user?.name || res.data.username || res.data.name;
      toast.success(username ? `Welcome to HN BlogSphere, ${username}! 🎉` : `Welcome to HN BlogSphere! 🎉`);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const strengthScore = () => {
    const p = form.password;
    let score = 0;
    if (p.length >= 6) score++;
    if (p.length >= 10) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  };
  const score = strengthScore();
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][score] || '';
  const strengthColor = ['', '#f87171', '#f59e0b', '#60a5fa', '#34d399', '#10b981'][score] || '';

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
            Your voice,<br />
            <span className="text-gradient">your platform.</span>
          </h2>
          <p className="auth-page__left-sub">
            Start writing for free today. No credit card required.<br />
            Join the HN BlogSphere community of passionate creators.
          </p>
          <div className="register-features">
            {[
              '✨ Publish unlimited articles',
              '💬 Engage with your audience',
              '📊 Track your performance',
              '🔖 Save and organize content',
            ].map((f) => (
              <div key={f} className="register-feature">{f}</div>
            ))}
          </div>
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
            <h1 className="auth-card__title">Create your account ✨</h1>
            <p className="auth-card__sub">Join thousands of writers on HN BlogSphere</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-username">Username</label>
              <input
                id="reg-username"
                type="text"
                name="username"
                className={`form-input ${errors.username ? 'form-input--error' : ''}`}
                placeholder="johndoe"
                value={form.username}
                onChange={handleChange}
                autoComplete="username"
              />
              {errors.username && <p className="form-error">{errors.username}</p>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">Email address</label>
              <input
                id="reg-email"
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
              <label className="form-label" htmlFor="reg-password">Password</label>
              <input
                id="reg-password"
                type="password"
                name="password"
                className={`form-input ${errors.password ? 'form-input--error' : ''}`}
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
              {form.password && (
                <div className="password-strength">
                  <div className="password-strength__bars">
                    {[1,2,3,4,5].map((n) => (
                      <div
                        key={n}
                        className="password-strength__bar"
                        style={{ background: n <= score ? strengthColor : 'var(--border-color)' }}
                      />
                    ))}
                  </div>
                  <span className="password-strength__label" style={{ color: strengthColor }}>
                    {strengthLabel}
                  </span>
                </div>
              )}
              {errors.password && <p className="form-error">{errors.password}</p>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-confirm">Confirm Password</label>
              <input
                id="reg-confirm"
                type="password"
                name="confirmPassword"
                className={`form-input ${errors.confirmPassword ? 'form-input--error' : ''}`}
                placeholder="Repeat your password"
                value={form.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
              {errors.confirmPassword && <p className="form-error">{errors.confirmPassword}</p>}
            </div>

            <button
              id="register-submit-btn"
              type="submit"
              className={`btn btn-primary ${loading ? 'btn-loading' : ''}`}
              style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
              disabled={loading}
            >
              {loading ? <><span className="spinner" /> Creating account...</> : 'Create Account'}
            </button>
          </form>

          <p className="auth-card__switch">
            Already have an account?{' '}
            <Link to="/login" className="auth-card__switch-link">Sign in</Link>
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
          margin-bottom: 2rem;
        }
        .auth-page__logo-icon { font-size: 1.5rem; }
        .auth-page__left-title {
          font-family: var(--font-serif);
          font-size: clamp(1.75rem, 3vw, 2.5rem);
          font-weight: 800;
          line-height: 1.2;
          color: var(--text-primary);
          margin-bottom: 1.25rem;
        }
        .auth-page__left-sub {
          font-size: 1rem;
          color: var(--text-secondary);
          line-height: 1.7;
          margin-bottom: 2rem;
        }
        .register-features {
          display: flex;
          flex-direction: column;
          gap: 0.625rem;
        }
        .register-feature {
          font-size: 0.9rem;
          color: var(--text-secondary);
          padding: 0.5rem 0.75rem;
          background: rgba(255,255,255,0.05);
          border-radius: var(--radius-sm);
          border: 1px solid rgba(255,255,255,0.08);
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
          overflow-y: auto;
        }
        .auth-card {
          width: 100%;
          max-width: 440px;
          border-radius: var(--radius-xl);
          padding: 2.5rem;
        }
        .auth-card__header { margin-bottom: 2rem; }
        .auth-card__title {
          font-size: 1.625rem;
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
          gap: 1.125rem;
        }
        .form-input--error {
          border-color: #f87171 !important;
          box-shadow: 0 0 0 3px rgba(248,113,113,0.15) !important;
        }
        .password-strength {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-top: 0.375rem;
        }
        .password-strength__bars {
          display: flex;
          gap: 4px;
          flex: 1;
        }
        .password-strength__bar {
          flex: 1;
          height: 4px;
          border-radius: 2px;
          transition: background 0.3s;
        }
        .password-strength__label {
          font-size: 0.75rem;
          font-weight: 600;
          white-space: nowrap;
          min-width: 70px;
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
          .auth-page { grid-template-columns: 1fr; }
          .auth-page__left { display: none; }
          .auth-page__right { padding: 6rem 1.5rem 2rem; }
        }
      `}</style>
    </div>
  );
}
