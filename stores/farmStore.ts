import { create } from 'zustand';
import { Farm, FarmFormData } from '@/types';
import api from '@/lib/api';
import { AxiosError } from 'axios';

interface ApiErrorResponse {
  error?: string;
  message?: string;
}

interface FarmState {
  farms: Farm[];
  currentFarm: Farm | null;
  isLoading: boolean;
  error: string | null;
  fetchFarms: () => Promise<void>;
  fetchFarm: (id: number) => Promise<void>;
  createFarm: (data: FarmFormData) => Promise<void>;
  updateFarm: (id: number, data: Partial<FarmFormData>) => Promise<void>;
  deleteFarm: (id: number) => Promise<void>;
  clearError: () => void;
}

export const useFarmStore = create<FarmState>((set) => ({
  farms: [],
  currentFarm: null,
  isLoading: false,
  error: null,

  fetchFarms: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.getFarms();
      set({ farms: response.data, isLoading: false });
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      set({
        error: axiosError.response?.data?.error || 'Failed to fetch farms',
        isLoading: false,
      });
    }
  },

  fetchFarm: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const farm = await api.getFarm(id);
      set({ currentFarm: farm, isLoading: false });
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      set({
        error: axiosError.response?.data?.error || 'Failed to fetch farm',
        isLoading: false,
      });
    }
  },

  createFarm: async (data: FarmFormData) => {
    set({ isLoading: true, error: null });
    try {
      await api.createFarm(data);
      set({ isLoading: false });
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      set({
        error: axiosError.response?.data?.error || 'Failed to create farm',
        isLoading: false,
      });
      throw error;
    }
  },

  updateFarm: async (id: number, data: Partial<FarmFormData>) => {
    set({ isLoading: true, error: null });
    try {
      await api.updateFarm(id, data);
      set({ isLoading: false });
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      set({
        error: axiosError.response?.data?.error || 'Failed to update farm',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteFarm: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await api.deleteFarm(id);
      set({ isLoading: false });
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      set({
        error: axiosError.response?.data?.error || 'Failed to delete farm',
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));