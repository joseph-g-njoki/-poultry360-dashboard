'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, organizationSlug?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = !!user;

  // Check if user is already logged in on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setIsLoading(false);
        return;
      }

      // Verify token and get user data
      const userData = await api.verifyToken();
      if (userData.user) {
        setUser(userData.user as User);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string, organizationSlug?: string) => {
    try {
      setIsLoading(true);
      const response = await api.login(email, password, organizationSlug);

      // Store token and user data
      localStorage.setItem('adminToken', response.token);
      localStorage.setItem('adminUser', JSON.stringify(response.user));

      setUser(response.user);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Clear local storage
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');

      setUser(null);

      // Redirect to login
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const refreshUser = async () => {
    try {
      const userData = await api.getProfile();
      setUser(userData.user);
    } catch (error) {
      console.error('Failed to refresh user:', error);
      await logout();
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};