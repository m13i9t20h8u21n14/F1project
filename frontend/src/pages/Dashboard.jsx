import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout, accessToken } = useAuth();
  const [activeTab, setActiveTab] = useState('console'); // console, status

  return (
    <div className="dashboard-container">
      {/* SIDEBAR: Brand Navigation */}
      <aside className="sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px', paddingLeft: '8px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg, var(--primary) 0%, #312e81 100%)', display: 'flex', alignItems: 'center', justifyItems: 'center', alignContent: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'white' }}>A</span>
          </div>
          <div>
            <h3 style={{ fontSize: '15px', color: 'var(--text-primary)', fontWeight: '700', lineHeight: '1.2' }}>Aegis Portal</h3>
            <span style={{ fontSize: '10px', color: 'var(--accent)', fontWeight: '700' }}>ONLINE</span>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
          <button
            onClick={() => setActiveTab('console')}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer', outline: 'none', fontSize: '13px', fontWeight: '600',
              background: activeTab === 'console' ? 'var(--primary-glow)' : 'transparent',
              color: activeTab === 'console' ? 'var(--primary)' : 'var(--text-secondary)',
              borderLeft: activeTab === 'console' ? '3px solid var(--primary)' : '3px solid transparent',
              transition: 'all 0.15s'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="9"></rect>
              <rect x="14" y="3" width="7" height="5"></rect>
              <rect x="14" y="12" width="7" height="9"></rect>
              <rect x="3" y="16" width="7" height="5"></rect>
            </svg>
            Dashboard
          </button>
          
          <button
            onClick={() => setActiveTab('status')}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer', outline: 'none', fontSize: '13px', fontWeight: '600',
              background: activeTab === 'status' ? 'var(--primary-glow)' : 'transparent',
              color: activeTab === 'status' ? 'var(--primary)' : 'var(--text-secondary)',
              borderLeft: activeTab === 'status' ? '3px solid var(--primary)' : '3px solid transparent',
              transition: 'all 0.15s'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
            System Status
          </button>
        </nav>

        {/* User Badge footer */}
        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary) 0%, #312e81 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold', color: 'white' }}>
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <h5 style={{ color: 'var(--text-primary)', fontSize: '13px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', fontWeight: '600' }}>{user?.name}</h5>
            <span style={{ color: 'var(--text-secondary)', fontSize: '10px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', display: 'block' }}>{user?.email}</span>
          </div>
          <button
            onClick={logout}
            style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', outline: 'none', padding: '4px', borderRadius: '6px' }}
            title="Log out session"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{color: 'var(--error)'}}>
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      </aside>

      {/* MAIN PANEL CONTENT */}
      <main className="main-content">
        {/* Header toolbar */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '16px' }}>
          <div>
            <h1 style={{ fontSize: '28px', color: 'var(--text-primary)' }}>Administrative Hub</h1>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Welcome to your secure gateway dashboard</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontSize: '11px', background: 'rgba(16, 185, 129, 0.08)', color: 'var(--accent)', border: '1px solid rgba(16, 185, 129, 0.15)', padding: '5px 12px', borderRadius: '30px', fontWeight: '700' }}>
              ● SESSION SECURE
            </span>
          </div>
        </header>

        {activeTab === 'console' ? (
          <div className="dashboard-grid">
            
            {/* COLUMN 1: Profile card */}
            <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="glass-card" style={{ padding: '36px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'linear-gradient(135deg, var(--primary) 0%, #312e81 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', fontWeight: '800', color: 'white', boxShadow: '0 4px 12px var(--primary-glow)' }}>
                    {user?.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <div>
                    <h2 style={{ fontSize: '24px', color: 'var(--text-primary)' }}>{user?.name}</h2>
                    <p style={{ color: 'var(--accent)', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent)' }}></span>
                      Authenticated Security Profile
                    </p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', borderTop: '1px solid var(--border-light)', paddingTop: '24px' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Corporate Email</span>
                    <p style={{ fontSize: '15px', color: 'var(--text-primary)', fontWeight: '600', marginTop: '4px' }}>{user?.email}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Profile Reference ID</span>
                    <p style={{ fontSize: '13px', color: 'var(--primary)', fontFamily: 'monospace', fontWeight: '600', marginTop: '4px' }}>{user?.id}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Authorization Access Token</span>
                    <p style={{ fontSize: '13px', color: '#6d28d9', fontFamily: 'monospace', fontWeight: '600', marginTop: '4px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {accessToken ? `Bearer ${accessToken.substring(0, 36)}...` : 'NONE'}
                    </p>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Session Status</span>
                    <p style={{ fontSize: '15px', color: 'var(--text-primary)', fontWeight: '600', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                      Active Session Verified
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMN 2: Terminal / Action Card */}
            <div style={{ gridColumn: 'span 4' }}>
              <div className="glass-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <h3 style={{ color: 'var(--text-primary)', fontSize: '18px', marginBottom: '16px' }}>Security Control</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.6', marginBottom: '24px' }}>
                  Your session is leased securely with automatic short-lived token rotations. Click below to safely close this session.
                </p>
                <button
                  onClick={logout}
                  className="glass-btn glass-btn-danger"
                  style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  Sign Out Session
                </button>
              </div>
            </div>

          </div>
        ) : (
          /* SYSTEM STATUS TAB */
          <div className="glass-card" style={{ marginTop: '24px', padding: '36px' }}>
            <h3 style={{ color: 'var(--text-primary)', fontSize: '20px', marginBottom: '20px' }}>System Diagnostics</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-secondary)', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-light)', textAlign: 'left' }}>
                  <th style={{ padding: '12px 8px', color: 'var(--text-primary)', fontWeight: '700' }}>Component</th>
                  <th style={{ padding: '12px 8px', color: 'var(--text-primary)', fontWeight: '700' }}>Protocol</th>
                  <th style={{ padding: '12px 8px', color: 'var(--text-primary)', fontWeight: '700' }}>Security Level</th>
                  <th style={{ padding: '12px 8px', color: 'var(--text-primary)', fontWeight: '700' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 8px', color: 'var(--text-primary)', fontWeight: '600' }}>Access Credentials</td>
                  <td style={{ padding: '14px 8px' }}>JWT Bearer Token</td>
                  <td style={{ padding: '14px 8px', color: '#6d28d9', fontWeight: '600' }}>Short Lived (15m)</td>
                  <td style={{ padding: '14px 8px', color: 'var(--accent)', fontWeight: '700' }}>● Active</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 8px', color: 'var(--text-primary)', fontWeight: '600' }}>Refresh Session</td>
                  <td style={{ padding: '14px 8px' }}>httpOnly secure lax Cookie</td>
                  <td style={{ padding: '14px 8px', color: '#6d28d9', fontWeight: '600' }}>Long Lived (7d) / Rotating</td>
                  <td style={{ padding: '14px 8px', color: 'var(--accent)', fontWeight: '700' }}>● Active</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 8px', color: 'var(--text-primary)', fontWeight: '600' }}>Session Abuse Protection</td>
                  <td style={{ padding: '14px 8px' }}>Refresh Token Rotation (RTR)</td>
                  <td style={{ padding: '14px 8px', color: 'var(--error)', fontWeight: '600' }}>Revoke-All Device Hooks</td>
                  <td style={{ padding: '14px 8px', color: 'var(--accent)', fontWeight: '700' }}>● Enabled</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
