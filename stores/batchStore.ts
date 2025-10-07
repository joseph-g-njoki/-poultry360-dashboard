import { create } from 'zustand';
import { PoultryBatch, BatchFormData } from '@/types';
import api from '@/lib/api';
import { AxiosError } from 'axios';

interface ApiErrorResponse {
  error?: string;
  message?: string;
}

interface BatchState {
  batches: PoultryBatch[];
  currentBatch: PoultryBatch | null;
  isLoading: boolean;
  error: string | null;
  fetchBatches: (farmId?: number, status?: string) => Promise<void>;
  fetchBatch: (id: number) => Promise<void>;
  createBatch: (data: BatchFormData) => Promise<void>;
  updateBatch: (id: number, data: Partial<BatchFormData>) => Promise<void>;
  deleteBatch: (id: number) => Promise<void>;
  clearError: () => void;
}

export const useBatchStore = create<BatchState>((set) => ({
  batches: [],
  currentBatch: null,
  isLoading: false,
  error: null,

  fetchBatches: async (farmId?: number, status?: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.getBatches(1, 100);
      set({ batches: response.data, isLoading: false });
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      set({
        error: axiosError.response?.data?.error || 'Failed to fetch batches',
        isLoading: false,
      });
    }
  },

  fetchBatch: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.getBatches(1, 100);
      const batch = response.data.find((b: PoultryBatch) => b.id === id) || null;
      set({ currentBatch: batch, isLoading: false });
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      set({
        error: axiosError.response?.data?.error || 'Failed to fetch batch',
        isLoading: false,
      });
    }
  },

  createBatch: async (data: BatchFormData) => {
    set({ isLoading: true, error: null });
    try {
      await api.createBatch(data);
      set({ isLoading: false });
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      set({
        error: axiosError.response?.data?.error || 'Failed to create batch',
        isLoading: false,
      });
      throw error;
    }
  },

  updateBatch: async (id: number, data: Partial<BatchFormData>) => {
    set({ isLoading: true, error: null });
    try {
      await api.updateBatch(id, data);
      set({ isLoading: false });
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      set({
        error: axiosError.response?.data?.error || 'Failed to update batch',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteBatch: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await api.deleteBatch(id);
      set({ isLoading: false });
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      set({
        error: axiosError.response?.data?.error || 'Failed to delete batch',
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));