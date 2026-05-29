import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';

const Gateway = () => {
  const [view, setView] = useState('login'); // login, signup
  const { login, signup } = useAuth();

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setErrors({});
  };

  const validate = () => {
    const newErrors = {};
    if (view === 'signup') {
      if (!name.trim()) newErrors.name = 'Name is required';
    }
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please provide a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (view === 'signup') {
      if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    if (view === 'login') {
      const res = await login(email, password);
      if (!res.success) {
        setIsSubmitting(false);
      }
    } else if (view === 'signup') {
      const res = await signup(name, email, password);
      if (!res.success) {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-main)', padding: '20px' }}>
      <div className="form-wrapper">
        <div className="glass-card">
          
          {/* Logo Brand Icon */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--primary) 0%, #312e81 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }}>
              <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>A</span>
            </div>
          </div>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '24px', color: 'var(--text-primary)', fontWeight: 700, marginBottom: '6px' }}>
              {view === 'login' ? 'Sign In' : 'Create Account'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
              {view === 'login' ? 'Provide your credentials to access your session' : 'Sign up to enroll in our secure system'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            {view === 'signup' && (
              <Input
                label="Full Name"
                name="name"
                type="text"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={errors.name}
                icon="user"
                disabled={isSubmitting}
              />
            )}

            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="jane@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              icon="email"
              disabled={isSubmitting}
            />

            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              icon="lock"
              disabled={isSubmitting}
            />

            {view === 'signup' && (
              <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="••••••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={errors.confirmPassword}
                icon="lock"
                disabled={isSubmitting}
              />
            )}

            <button type="submit" className="glass-btn" disabled={isSubmitting} style={{ marginTop: '10px' }}>
              {isSubmitting ? (
                <div className="spinner"></div>
              ) : (
                <>{view === 'login' ? 'Sign In' : 'Sign Up'}</>
              )}
            </button>
          </form>

          {/* Footer View Switchers */}
          <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)' }}>
            {view === 'login' ? (
              <>
                New here?{' '}
                <button
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '700', cursor: 'pointer', outline: 'none' }}
                  onClick={() => { setView('signup'); resetForm(); }}
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already registered?{' '}
                <button
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '700', cursor: 'pointer', outline: 'none' }}
                  onClick={() => { setView('login'); resetForm(); }}
                >
                  Sign in here
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Gateway;
