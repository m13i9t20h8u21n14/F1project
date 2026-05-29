import React from 'react';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Gateway from './pages/Gateway';
import Dashboard from './pages/Dashboard';

const AppContent = () => {
  const { user, loading } = useAuth();

  // Render a clean white loading splash screen while checking session state
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', color: '#0f172a' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <div className="spinner" style={{ width: '40px', height: '40px', borderWidth: '3px', borderTopColor: 'var(--primary)', borderLeftColor: 'rgba(79, 70, 229, 0.1)', borderBottomColor: 'rgba(79, 70, 229, 0.1)', borderRightColor: 'rgba(79, 70, 229, 0.1)' }}></div>
          <div style={{ fontSize: '14px', color: '#64748b', letterSpacing: '0.05em', fontWeight: '600' }}>
            SECURE ACCESS GATEWAY VERIFYING...
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Gateway />;
  }

  return <Dashboard />;
};

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
