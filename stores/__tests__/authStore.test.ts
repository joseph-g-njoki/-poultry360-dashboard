import { useAuthStore } from '../authStore';
import api from '@/lib/api';

// Mock the API
jest.mock('@/lib/api');

describe('AuthStore', () => {
  beforeEach(() => {
    // Reset store state
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
    jest.clearAllMocks();
  });

  it('initializes with default state', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('sets loading state during login', async () => {
    const mockUser = { id: 1, username: 'test@example.com', email: 'test@example.com', role: 'admin' as const, is_active: true, created_at: '2024-01-01' };
    (api.login as jest.Mock).mockResolvedValue({ user: mockUser, token: 'test-token' });

    const loginPromise = useAuthStore.getState().login('test@example.com', 'password');

    // Check loading state is true during login
    expect(useAuthStore.getState().isLoading).toBe(true);

    await loginPromise;
  });

  it('sets user and authenticated state on successful login', async () => {
    const mockUser = { id: 1, username: 'test@example.com', email: 'test@example.com', role: 'admin' as const, is_active: true, created_at: '2024-01-01' };
    (api.login as jest.Mock).mockResolvedValue({ user: mockUser, token: 'test-token' });

    await useAuthStore.getState().login('test@example.com', 'password');

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('sets error on failed login', async () => {
    (api.login as jest.Mock).mockRejectedValue({
      response: { data: { error: 'Invalid credentials' } },
    });

    try {
      await useAuthStore.getState().login('test@example.com', 'wrong-password');
    } catch (error) {
      // Expected to throw
    }

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.error).toBe('Invalid credentials');
    expect(state.isLoading).toBe(false);
  });

  it('clears state on logout', () => {
    // Set initial authenticated state
    useAuthStore.setState({
      user: { id: 1, username: 'test@example.com', email: 'test@example.com', role: 'admin' as const, is_active: true, created_at: '2024-01-01' },
      isAuthenticated: true,
    });

    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.error).toBeNull();
  });

  it('clears error when clearError is called', () => {
    useAuthStore.setState({ error: 'Some error' });

    useAuthStore.getState().clearError();

    expect(useAuthStore.getState().error).toBeNull();
  });
});