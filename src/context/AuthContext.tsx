'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import api from '../lib/api';

const AuthContext = createContext<any>(null);

const defaultAuthValue = {
  user: null,
  loading: false,
  isAuthenticated: false,
  signup: async () => ({}),
  login: async () => ({}),
  demoLogin: async () => ({}),
  logout: () => {},
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    return defaultAuthValue;
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const logoutTimerRef = useRef(null);

  // Auto logout after 2 hours
  const startLogoutTimer = () => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }

    logoutTimerRef.current = setTimeout(() => {
      handleAutoLogout();
    }, 7200000); // 2 hours

    if (typeof window !== 'undefined') {
      localStorage.setItem('tradexpert_login_time', Date.now().toString());
    }
  };

  const handleAutoLogout = () => {
    api.logout();
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('tradexpert_login_time');
      toast.error('Session expired. Please login again.', {
        duration: 4000,
        icon: '⏰'
      });
      window.location.href = '/login';
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const token = api.getToken();
    const loginTime = localStorage.getItem('tradexpert_login_time');

    if (token) {
      if (loginTime) {
        const elapsed = Date.now() - parseInt(loginTime, 10);
        const twoHours = 7200000;

        if (elapsed >= twoHours) {
          handleAutoLogout();
          setLoading(false);
          return;
        } else {
          const remainingTime = twoHours - elapsed;
          logoutTimerRef.current = setTimeout(() => {
            handleAutoLogout();
          }, remainingTime);
        }
      }

      api.getMe()
        .then(userData => {
          setUser(userData);
          if (!loginTime) {
            startLogoutTimer();
          }
        })
        .catch(err => {
          console.error('Failed to fetch user:', err);
          api.removeToken();
          localStorage.removeItem('tradexpert_login_time');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }

    return () => {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }
    };
  }, []);

  const signup = async (name, email, password) => {
    const data = await api.signup(name, email, password);
    return data;
  };

  const login = async (email, password) => {
    const data = await api.login(email, password);
    setUser(data.user);
    startLogoutTimer();
    return data;
  };

  const demoLogin = async () => {
    const data = await api.demoLogin();
    setUser(data.user);
    startLogoutTimer();
    return data;
  };

  const logout = () => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }
    api.logout();
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('tradexpert_login_time');
    }
  };

  const isAuthenticated = !!user;

  const value = {
    user,
    loading,
    isAuthenticated,
    signup,
    login,
    demoLogin,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
