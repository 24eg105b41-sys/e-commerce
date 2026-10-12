import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('shopsphere_token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize and verify session on initial mount
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('shopsphere_token');
      if (storedToken) {
        try {
          const response = await axiosClient.get('/api/auth/me');
          if (response.success && response.data) {
            setUser(response.data);
          } else {
            logout();
          }
        } catch (err) {
          console.error('Session verification failed:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();

    const handleExternalLogout = () => {
      setUser(null);
      setToken(null);
    };
    window.addEventListener('auth-logout', handleExternalLogout);
    return () => window.removeEventListener('auth-logout', handleExternalLogout);
  }, []);

  const login = async (email, password) => {
    const response = await axiosClient.post('/api/auth/login', { email, password });
    if (response.success && response.data) {
      const authData = response.data;
      localStorage.setItem('shopsphere_token', authData.token);
      setToken(authData.token);
      const userProfile = {
        id: authData.id,
        fullName: authData.fullName,
        email: authData.email,
        role: authData.role,
      };
      setUser(userProfile);
      localStorage.setItem('shopsphere_user', JSON.stringify(userProfile));
      return userProfile;
    }
    throw new Error(response.message || 'Login failed');
  };

  const register = async (fullName, email, password, phone) => {
    const response = await axiosClient.post('/api/auth/register', {
      fullName,
      email,
      password,
      phone,
    });
    if (response.success && response.data) {
      const authData = response.data;
      localStorage.setItem('shopsphere_token', authData.token);
      setToken(authData.token);
      const userProfile = {
        id: authData.id,
        fullName: authData.fullName,
        email: authData.email,
        role: authData.role,
      };
      setUser(userProfile);
      localStorage.setItem('shopsphere_user', JSON.stringify(userProfile));
      return userProfile;
    }
    throw new Error(response.message || 'Registration failed');
  };

  const logout = () => {
    localStorage.removeItem('shopsphere_token');
    localStorage.removeItem('shopsphere_user');
    setUser(null);
    setToken(null);
  };

  const isAdmin = user?.role === 'ROLE_ADMIN';
  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        login,
        register,
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
