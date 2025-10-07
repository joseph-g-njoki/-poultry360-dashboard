import { create } from 'zustand';
import { User } from '@/types';
import api from '@/lib/api';
import { AxiosError } from 'axios';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  clearError: () => void;
}

interface ApiErrorResponse {
  error?: string;
  message?: string;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (username: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.login(username, password);
      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      set({
        error: axiosError.response?.data?.error || 'Login failed',
        isLoading: false,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  logout: () => {
    api.logout();
    set({
      user: null,
      isAuthenticated: false,
      error: null,
    });
  },

  fetchProfile: async () => {
    set({ isLoading: true });
    try {
      const response = await api.getProfile();
      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  updateProfile: async (data: Partial<User>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.updateProfile(data);
      set({
        user: response.user,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      set({
        error: axiosError.response?.data?.error || 'Update failed',
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));