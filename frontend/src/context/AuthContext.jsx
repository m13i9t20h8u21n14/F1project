import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/auth';
// Normalize URL to always end with /api/auth to prevent configuration errors in hosting platforms
const BACKEND_URL = rawApiUrl.endsWith('/api/auth') 
  ? rawApiUrl 
  : `${rawApiUrl.replace(/\/$/, '')}/api/auth`;

export const authApi = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  // Request interceptor: Inject Access Token
  useEffect(() => {
    const requestInterceptor = authApi.interceptors.request.use(
      (config) => {
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      authApi.interceptors.request.eject(requestInterceptor);
    };
  }, [accessToken]);

  // Response interceptor: Silent Refresh on token expiration (401)
  useEffect(() => {
    const responseInterceptor = authApi.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        if (
          error.response &&
          error.response.status === 401 &&
          error.response.data.code === 'TOKEN_EXPIRED' &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;

          try {
            const res = await axios.post(`${BACKEND_URL}/refresh-token`, {}, { withCredentials: true });
            const newAccessToken = res.data.accessToken;
            setAccessToken(newAccessToken);
            
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return authApi(originalRequest);
          } catch (refreshError) {
            setAccessToken(null);
            setUser(null);
            addToast('Your session has expired. Please log in again.', 'error');
            return Promise.reject(refreshError);
          }
        }

        if (error.response && error.response.status === 403 && error.response.data.message.includes('suspected')) {
          setAccessToken(null);
          setUser(null);
          addToast('Multiple logins detected, sessions invalidated for security.', 'error');
        }

        return Promise.reject(error);
      }
    );

    return () => {
      authApi.interceptors.response.eject(responseInterceptor);
    };
  }, [addToast]);

  // Silent refresh check on application boot
  const checkAuth = useCallback(async () => {
    try {
      const res = await axios.post(`${BACKEND_URL}/refresh-token`, {}, { withCredentials: true });
      const newAccessToken = res.data.accessToken;
      setAccessToken(newAccessToken);
      
      const profileRes = await axios.get(`${BACKEND_URL}/me`, {
        headers: { Authorization: `Bearer ${newAccessToken}` },
      });
      
      setUser(profileRes.data.user);
    } catch (err) {
      // No active refresh session found (expected on clean boot)
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Signup operation
  const signup = async (name, email, password) => {
    try {
      const res = await authApi.post('/signup', { name, email, password });
      setAccessToken(res.data.accessToken);
      setUser(res.data.user);
      addToast(`Welcome to Aegis, ${name}!`, 'success');
      return { success: true };
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Registration failed';
      addToast(errorMsg, 'error');
      return { success: false, error: errorMsg };
    }
  };

  // Login operation
  const login = async (email, password) => {
    try {
      const res = await authApi.post('/login', { email, password });
      setAccessToken(res.data.accessToken);
      setUser(res.data.user);
      addToast(`Welcome back, ${res.data.user.name}`, 'success');
      return { success: true };
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Login failed';
      addToast(errorMsg, 'error');
      return { success: false, error: errorMsg };
    }
  };

  // Logout operation
  const logout = async () => {
    try {
      await authApi.post('/logout');
      addToast('Logged out successfully', 'success');
    } catch (error) {
      // Force clean states anyway
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        signup,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
