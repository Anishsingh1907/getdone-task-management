import React, { useState } from 'react';
import { Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';

export default function Login({ onLogin, allUsers = [] }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!email) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      await onLogin(email.trim(), password || 'password123');
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const selectDemoUser = (user) => {
    setEmail(user.email);
    setPassword('password123');
    setError('');
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Left Hero Side */}
        <div style={styles.heroSide}>
          <div style={styles.brandRow}>
            <div style={styles.logoIcon}>
              <Sparkles size={20} color="#ffffff" />
            </div>
            <span style={styles.brandTitle}>GetDone</span>
          </div>

          <div style={styles.heroContent}>
            <h1 style={styles.heroTitle}>
              Simplify management <br />
              with our dashboard
            </h1>
            <p style={styles.heroSubtitle}>
              Projects, people, and daily progress for your entire team — all aligned in one single,
              powerful workplace.
            </p>

            <div style={styles.featurePills}>
              <div style={styles.featurePill}>
                <ShieldCheck size={14} color="#93c5fd" />
                <span>Multi-tier Role Access (RBAC)</span>
              </div>
              <div style={styles.featurePill}>
                <Sparkles size={14} color="#93c5fd" />
                <span>MongoDB & Express API with Swagger</span>
              </div>
            </div>
          </div>

          <div style={styles.heroFooter}>
            <span>Version 1.0.0 • MERN Stack Architecture</span>
          </div>
        </div>

        {/* Right Form Side */}
        <div style={styles.formSide}>
          <div style={styles.formHeader}>
            <h2 style={styles.welcomeTitle}>Welcome back</h2>
            <p style={styles.welcomeSubtitle}>Sign in to your task management workspace</p>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            {error && <div style={styles.errorBox}>{error}</div>}

            <div>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                required
              />
            </div>

            <div>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
              />
            </div>

            <button type="submit" disabled={loading} style={styles.loginBtn}>
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Quick Demo Accounts Selection */}
          <div style={styles.demoSection}>
            <span style={styles.demoLabel}>1-Click Demo Accounts (Fast Testing):</span>
            <div style={styles.demoChips}>
              {allUsers.slice(0, 4).map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => selectDemoUser(u)}
                  style={{
                    ...styles.demoChip,
                    backgroundColor: email === u.email ? '#3157d5' : '#f1f5f9',
                    color: email === u.email ? '#ffffff' : '#334155',
                  }}
                >
                  <strong>{u.role}:</strong> {u.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f4f5fa',
    padding: '24px',
  },
  card: {
    display: 'grid',
    gridTemplateColumns: '1.1fr 1fr',
    backgroundColor: '#ffffff',
    borderRadius: '28px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.06)',
    maxWidth: '960px',
    width: '100%',
    overflow: 'hidden',
    border: '1px solid #edf0f7',
  },
  heroSide: {
    backgroundColor: '#3157d5',
    color: '#ffffff',
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  brandRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logoIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    display: 'grid',
    placeItems: 'center',
  },
  brandTitle: {
    fontSize: '22px',
    fontWeight: '800',
    letterSpacing: '-0.5px',
  },
  heroContent: {
    margin: '40px 0',
  },
  heroTitle: {
    fontSize: '32px',
    fontWeight: '800',
    lineHeight: '1.2',
    letterSpacing: '-0.8px',
    marginBottom: '16px',
  },
  heroSubtitle: {
    fontSize: '14px',
    opacity: 0.88,
    lineHeight: '1.6',
    maxWidth: '380px',
  },
  featurePills: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginTop: '24px',
  },
  featurePill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    padding: '6px 14px',
    borderRadius: '99px',
    width: 'fit-content',
  },
  heroFooter: {
    fontSize: '11px',
    opacity: 0.7,
  },
  formSide: {
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  formHeader: {
    marginBottom: '24px',
  },
  welcomeTitle: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#191d31',
    letterSpacing: '-0.4px',
    marginBottom: '4px',
  },
  welcomeSubtitle: {
    fontSize: '13px',
    color: '#787f95',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  label: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#64748b',
    marginBottom: '6px',
    display: 'block',
  },
  input: {
    width: '100%',
    padding: '11px 14px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    fontSize: '13px',
    color: '#191d31',
    boxSizing: 'border-box',
    backgroundColor: '#f8fafc',
  },
  errorBox: {
    backgroundColor: '#fee2e2',
    color: '#ef4444',
    padding: '10px 14px',
    borderRadius: '10px',
    fontSize: '12px',
    fontWeight: '600',
  },
  loginBtn: {
    backgroundColor: '#3157d5',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '700',
    padding: '12px 18px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    boxShadow: '0 4px 12px rgba(49, 87, 213, 0.28)',
    marginTop: '6px',
  },
  demoSection: {
    marginTop: '28px',
    borderTop: '1px solid #edf0f7',
    paddingTop: '20px',
  },
  demoLabel: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#64748b',
    display: 'block',
    marginBottom: '10px',
  },
  demoChips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  demoChip: {
    fontSize: '11px',
    padding: '6px 12px',
    borderRadius: '8px',
    border: 'none',
    transition: 'all 0.15s ease',
  },
};

