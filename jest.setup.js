// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      pathname: '/',
      query: {},
    };
  },
  usePathname() {
    return '/';
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  useParams() {
    return {};
  },
}));

// Mock environment variables
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3006/api';
process.env.NEXT_PUBLIC_APP_NAME = 'Poultry360 Admin Dashboard';
process.env.NEXT_PUBLIC_APP_VERSION = '1.0.0';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};
Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
});

// Suppress console errors in tests (optional)
const originalConsole = global.console;
global.console = {
  ...originalConsole,
  error: jest.fn(), // Mock console.error to reduce noise in test output
  warn: jest.fn(),  // Mock console.warn
};