import axios, { AxiosInstance, AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://poultry360-api.onrender.com/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      timeout: 15000, // Increased to 15 seconds for better reliability
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          this.clearToken();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('adminToken');
    }
    return null;
  }

  private setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('adminToken', token);
    }
  }

  private clearToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
    }
  }

  // Auth endpoints
  async login(email: string, password: string, organizationSlug?: string) {
    interface LoginRequest {
      username: string;
      password: string;
      organizationSlug?: string;
    }

    const loginData: LoginRequest = { username: email, password };
    if (organizationSlug) {
      loginData.organizationSlug = organizationSlug;
    }

    const response = await this.client.post<import('@/types').AuthResponse>('/auth/login', loginData);
    if (response.data.token) {
      this.setToken(response.data.token);
      if (response.data.user && typeof window !== 'undefined') {
        localStorage.setItem('adminUser', JSON.stringify(response.data.user));
      }
    }
    return response.data;
  }

  async register(userData: Record<string, unknown>) {
    const response = await this.client.post<import('@/types').AuthResponse>('/auth/register', userData);
    // Don't automatically set tokens on registration
    // Let the application handle login flow explicitly
    return response.data;
  }

  async getProfile() {
    const response = await this.client.get<{ user: import('@/types').User }>('/auth/profile');
    return response.data;
  }

  async verifyToken() {
    const response = await this.client.get<{ valid: boolean; user?: import('@/types').User }>('/auth/verify');
    return response.data;
  }

  async updateProfile(data: Partial<import('@/types').User>) {
    const response = await this.client.put<{ user: import('@/types').User }>('/auth/profile', data);
    return response.data;
  }

  logout() {
    this.clearToken();
  }

  // Farm endpoints
  async getFarms(page = 1, limit = 20) {
    const response = await this.client.get<import('@/types').PaginationResponse<import('@/types').Farm>>('/farms', {
      params: { page, limit },
    });
    return response.data;
  }

  async getFarm(id: number) {
    const response = await this.client.get<import('@/types').Farm>(`/farms/${id}`);
    return response.data;
  }

  async createFarm(data: import('@/types').FarmFormData) {
    const response = await this.client.post<import('@/types').Farm>('/farms', data);
    return response.data;
  }

  async updateFarm(id: number, data: Partial<import('@/types').FarmFormData>) {
    const response = await this.client.put<import('@/types').Farm>(`/farms/${id}`, data);
    return response.data;
  }

  async deleteFarm(id: number) {
    const response = await this.client.delete<{ message: string }>(`/farms/${id}`);
    return response.data;
  }

  // Dashboard endpoints
  async getDashboardOverview() {
    const response = await this.client.get<import('@/types').DashboardOverview>('/dashboard/overview');
    return response.data;
  }

  // Users endpoints
  async getUsers(page = 1, limit = 20) {
    const response = await this.client.get('/users', {
      params: { page, limit },
    });
    return response.data;
  }

  async createUser(userData: Record<string, unknown>) {
    const response = await this.client.post('/users', userData);
    return response.data;
  }

  async updateUser(id: number, userData: Record<string, unknown>) {
    const response = await this.client.put(`/users/${id}`, userData);
    return response.data;
  }

  async deleteUser(id: number) {
    const response = await this.client.delete(`/users/${id}`);
    return response.data;
  }

  // Organizations endpoints (admin only)
  async getOrganizations(page = 1, limit = 20) {
    const response = await this.client.get('/super-admin/organizations', {
      params: { page, limit },
    });
    return response.data;
  }

  async createOrganization(orgData: Record<string, unknown>) {
    const response = await this.client.post('/super-admin/organizations', orgData);
    return response.data;
  }

  async updateOrganization(id: number, orgData: Record<string, unknown>) {
    const response = await this.client.put(`/super-admin/organizations/${id}`, orgData);
    return response.data;
  }

  async deleteOrganization(id: number) {
    const response = await this.client.delete(`/super-admin/organizations/${id}`);
    return response.data;
  }

  // Poultry Batches endpoints
  async getBatches(page = 1, limit = 20) {
    const response = await this.client.get('/flocks', {
      params: { page, limit },
    });
    return response.data;
  }

  async createBatch(batchData: import('@/types').BatchFormData | Record<string, unknown>) {
    const response = await this.client.post('/flocks', batchData);
    return response.data;
  }

  async updateBatch(id: number, batchData: Partial<import('@/types').BatchFormData> | Record<string, unknown>) {
    const response = await this.client.put(`/flocks/${id}`, batchData);
    return response.data;
  }

  async deleteBatch(id: number) {
    const response = await this.client.delete(`/flocks/${id}`);
    return response.data;
  }

  // Production Records endpoints
  async getProductionRecords(page = 1, limit = 20) {
    const response = await this.client.get('/production-records', {
      params: { page, limit },
    });
    return response.data;
  }

  async createProductionRecord(recordData: Record<string, unknown>) {
    const response = await this.client.post('/production-records', recordData);
    return response.data;
  }

  async updateProductionRecord(id: number, recordData: Record<string, unknown>) {
    const response = await this.client.put(`/production-records/${id}`, recordData);
    return response.data;
  }

  async deleteProductionRecord(id: number) {
    const response = await this.client.delete(`/production-records/${id}`);
    return response.data;
  }

  // Health Records endpoints
  async getHealthRecords(page = 1, limit = 20) {
    const response = await this.client.get('/health-records', {
      params: { page, limit },
    });
    return response.data;
  }

  async createHealthRecord(recordData: Record<string, unknown>) {
    const response = await this.client.post('/health-records', recordData);
    return response.data;
  }

  async updateHealthRecord(id: number, recordData: Record<string, unknown>) {
    const response = await this.client.put(`/health-records/${id}`, recordData);
    return response.data;
  }

  async deleteHealthRecord(id: number) {
    const response = await this.client.delete(`/health-records/${id}`);
    return response.data;
  }

  // Mortality Records endpoints
  async getMortalityRecords(page = 1, limit = 20) {
    const response = await this.client.get('/mortality-records', {
      params: { page, limit },
    });
    return response.data;
  }

  async createMortalityRecord(recordData: Record<string, unknown>) {
    const response = await this.client.post('/mortality-records', recordData);
    return response.data;
  }

  async deleteMortalityRecord(id: number) {
    const response = await this.client.delete(`/mortality-records/${id}`);
    return response.data;
  }

  // Feed Records endpoints
  async getFeedRecords(page = 1, limit = 20) {
    const response = await this.client.get('/feed-records', {
      params: { page, limit },
    });
    return response.data;
  }

  async createFeedRecord(recordData: Record<string, unknown>) {
    const response = await this.client.post('/feed-records', recordData);
    return response.data;
  }

  async deleteFeedRecord(id: number) {
    const response = await this.client.delete(`/feed-records/${id}`);
    return response.data;
  }

  // Sales Records endpoints
  async getSalesRecords(page = 1, limit = 20) {
    const response = await this.client.get('/v1/sales', {
      params: { page, limit },
    });
    return response.data;
  }

  async createSalesRecord(recordData: Record<string, unknown>) {
    const response = await this.client.post('/v1/sales', recordData);
    return response.data;
  }

  async updateSalesRecord(id: number, recordData: Record<string, unknown>) {
    const response = await this.client.put(`/v1/sales/${id}`, recordData);
    return response.data;
  }

  async deleteSalesRecord(id: number) {
    const response = await this.client.delete(`/v1/sales/${id}`);
    return response.data;
  }

  // Expenses endpoints
  async getExpenses(page = 1, limit = 20) {
    const response = await this.client.get('/v1/expenses', {
      params: { page, limit },
    });
    return response.data;
  }

  async createExpense(expenseData: Record<string, unknown>) {
    const response = await this.client.post('/v1/expenses', expenseData);
    return response.data;
  }

  async updateExpense(id: number, expenseData: Record<string, unknown>) {
    const response = await this.client.put(`/v1/expenses/${id}`, expenseData);
    return response.data;
  }

  async deleteExpense(id: number) {
    const response = await this.client.delete(`/v1/expenses/${id}`);
    return response.data;
  }

  // Analytics endpoints
  async getAnalytics(period = '30days') {
    const response = await this.client.get('/analytics', {
      params: { period },
    });
    return response.data;
  }

  async getRecentActivities(limit = 10) {
    const response = await this.client.get('/activities/recent', {
      params: { limit },
    });
    return response.data;
  }

  async getProductionPerformance(period = '30days') {
    const response = await this.client.get('/analytics/production-performance', {
      params: { period },
    });
    return response.data;
  }

  // Subscription Plans endpoints (admin only)
  async getSubscriptionPlans() {
    const response = await this.client.get('/subscription-plans');
    return response.data;
  }

  async createSubscriptionPlan(planData: Record<string, unknown>) {
    const response = await this.client.post('/subscription-plans', planData);
    return response.data;
  }

  async updateSubscriptionPlan(id: number, planData: Record<string, unknown>) {
    const response = await this.client.put(`/subscription-plans/${id}`, planData);
    return response.data;
  }

  async deleteSubscriptionPlan(id: number) {
    const response = await this.client.delete(`/subscription-plans/${id}`);
    return response.data;
  }

  // Subscriptions endpoints
  async getSubscriptions(page = 1, limit = 20) {
    const response = await this.client.get('/subscriptions', {
      params: { page, limit },
    });
    return response.data;
  }

  async createSubscription(subscriptionData: Record<string, unknown>) {
    const response = await this.client.post('/subscriptions', subscriptionData);
    return response.data;
  }

  async updateSubscription(id: number, subscriptionData: Record<string, unknown>) {
    const response = await this.client.put(`/subscriptions/${id}`, subscriptionData);
    return response.data;
  }

  async cancelSubscription(id: number) {
    const response = await this.client.post(`/subscriptions/${id}/cancel`);
    return response.data;
  }

  // Reports endpoints
  async generateReport(reportType: string, parameters: Record<string, unknown>) {
    const response = await this.client.post('/reports/generate', {
      type: reportType,
      parameters,
    });
    return response.data;
  }

  async getReports(page = 1, limit = 20) {
    const response = await this.client.get('/reports', {
      params: { page, limit },
    });
    return response.data;
  }

  async downloadReport(reportId: number) {
    const response = await this.client.get(`/reports/${reportId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  }
}

export const api = new ApiClient();
export default api;
