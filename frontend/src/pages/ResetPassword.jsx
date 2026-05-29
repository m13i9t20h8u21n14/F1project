import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import { useToast } from '../context/ToastContext';

const ResetPassword = () => {
  const { resetPassword } = useAuth();
  const { addToast } = useToast();

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  // Read URL parameters on component load to support direct link clicks!
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get('email');
    const tokenParam = params.get('token');
    const codeParam = params.get('code');

    if (emailParam) setEmail(emailParam);
    if (tokenParam) setToken(tokenParam);
    if (codeParam) setCode(codeParam);
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please provide a valid email';
    }

    if (!code && !token) {
      newErrors.code = 'Please provide either the 6-digit code or link token';
    }

    if (code && code.trim().length !== 6 && isNaN(code.trim())) {
      newErrors.code = 'Verification code must be a 6-digit number';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const res = await resetPassword(email, password, code, token);
    setIsSubmitting(false);

    if (res.success) {
      setSuccess(true);
      addToast('Your password was updated successfully. Redirecting in 3 seconds...', 'success');
      setTimeout(() => {
        window.location.href = '/';
      }, 3000);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', background: '#090a10', padding: '20px' }}>
      
      {/* Background ambient highlights */}
      <div className="glow-orb glow-orb-primary" style={{ top: '20%', left: '20%' }}></div>
      <div className="glow-orb glow-orb-secondary" style={{ bottom: '20%', right: '20%' }}></div>

      <div className="form-wrapper" style={{ zIndex: 10 }}>
        <div className="glass-card">
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            {/* Security Shield Icon */}
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(79, 70, 229, 0.1)', border: '1px solid rgba(79, 70, 229, 0.2)', marginBottom: '20px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary-light)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            
            <h2 style={{ fontSize: '28px', color: 'white', fontWeight: 700, marginBottom: '8px' }}>
              Reset Credentials
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              Verify identity to set a new account password.
            </p>
          </div>

          {success ? (
            <div style={{ padding: '24px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.15)', borderRadius: '12px', textAlign: 'center', animation: 'fadeIn 0.5s' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', marginBottom: '16px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h4 style={{ color: 'white', fontSize: '16px', marginBottom: '8px' }}>Password Changed!</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Your security profile has been updated. All sessions on other devices have been securely logged out. Redirecting you to sign in...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <Input
                label="Account Email Address"
                name="email"
                type="email"
                placeholder="jane@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                icon="email"
                disabled={isSubmitting}
              />

              {token ? (
                <div style={{ marginBottom: '24px' }}>
                  <label className="input-label">Reset Token Detected</label>
                  <div style={{ padding: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', borderRadius: '12px', color: 'var(--text-secondary)', fontSize: '13px', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                    🔗 {token.substring(0, 16)}...
                  </div>
                </div>
              ) : (
                <Input
                  label="6-Digit Verification Code"
                  name="code"
                  type="text"
                  placeholder="e.g. 123456"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  error={errors.code}
                  icon="key"
                  disabled={isSubmitting}
                />
              )}

              <Input
                label="New Secure Password"
                name="password"
                type="password"
                placeholder="Min 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                icon="lock"
                disabled={isSubmitting}
              />

              <Input
                label="Confirm New Password"
                name="confirmPassword"
                type="password"
                placeholder="Repeat new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={errors.confirmPassword}
                icon="lock"
                disabled={isSubmitting}
              />

              <button type="submit" className="glass-btn" disabled={isSubmitting}>
                {isSubmitting ? <div className="spinner"></div> : 'Confirm New Password'}
              </button>

              <div style={{ marginTop: '24px', textAlign: 'center' }}>
                <a
                  href="/"
                  style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                  Return to gateway
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
