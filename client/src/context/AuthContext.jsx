import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService.js';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('auth_token'));
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    async function initAuth() {
      const savedToken = localStorage.getItem('auth_token');
      if (savedToken) {
        try {
          const res = await authService.getMe();
          setUser(res.data);
        } catch {
          // Invalid or expired token
          localStorage.removeItem('auth_token');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    }
    initAuth();
  }, []);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    const { user: userData, token: jwtToken } = res.data;
    localStorage.setItem('auth_token', jwtToken);
    setToken(jwtToken);
    setUser(userData);
    return userData;
  };

  const register = async (formData) => {
    const res = await authService.register(formData);
    const { user: userData, token: jwtToken } = res.data;
    localStorage.setItem('auth_token', jwtToken);
    setToken(jwtToken);
    setUser(userData);
    return userData;
  };

  const loginWithGoogle = async (googleProfile) => {
    const res = await authService.loginWithGoogle(googleProfile);
    const { user: userData, token: jwtToken } = res.data;
    localStorage.setItem('auth_token', jwtToken);
    setToken(jwtToken);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);
  };

  const updateUserProfile = (updatedFields) => {
    setUser((prev) => (prev ? { ...prev, ...updatedFields } : prev));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        register,
        loginWithGoogle,
        logout,
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
