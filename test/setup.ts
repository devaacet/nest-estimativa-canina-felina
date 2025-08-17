/**
 * Jest setup configuration for all tests
 * This file is loaded before any test files are executed
 */

import { daysToMs, minsToMs } from 'src/shared';

// Global test timeout
jest.setTimeout(30000);

// Mock bcryptjs globally
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('$2a$12$mocked.hashed.password'),
  compare: jest.fn().mockResolvedValue(true),
  genSalt: jest.fn().mockResolvedValue('mocked-salt'),
}));

// Mock console methods to reduce noise in tests
const originalConsole = { ...console };

beforeAll(() => {
  // Suppress console.log/warn/error during tests unless explicitly needed
  console.log = jest.fn();
  console.warn = jest.fn();
  console.error = jest.fn();
});

afterAll(() => {
  // Restore console methods
  Object.assign(console, originalConsole);
});

// Global test environment setup
beforeEach(() => {
  // Set test environment
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-jwt-secret-key';
  process.env.JWT_ACCESS_EXPIRATION_IN_MS = minsToMs(15).toString();
  process.env.JWT_REFRESH_EXPIRATION_IN_MS = daysToMs(7).toString();
});

afterEach(() => {
  // Clear all mocks after each test
  jest.clearAllMocks();

  // Clean up environment variables
  delete process.env.NODE_ENV;
  delete process.env.JWT_SECRET;
  delete process.env.JWT_ACCESS_EXPIRATION_IN_MS;
  delete process.env.JWT_REFRESH_EXPIRATION_IN_MS;
});

// Custom matchers (if needed)
expect.extend({
  toBeValidJWT(received: string) {
    const jwtRegex = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;
    const pass = jwtRegex.test(received);

    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid JWT`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid JWT`,
        pass: false,
      };
    }
  },

  toBeValidEmail(received: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pass = emailRegex.test(received);

    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid email`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid email`,
        pass: false,
      };
    }
  },

  toHaveValidCookie(response: any, cookieName: string) {
    const cookies = response.headers['set-cookie'];
    if (!cookies) {
      return {
        message: () => `expected response to have cookies`,
        pass: false,
      };
    }

    const hasCookie = cookies.some((cookie: string) =>
      cookie.startsWith(`${cookieName}=`),
    );

    if (hasCookie) {
      return {
        message: () => `expected response not to have cookie ${cookieName}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected response to have cookie ${cookieName}`,
        pass: false,
      };
    }
  },
});

// TypeScript declarations for custom matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidJWT(): R;
      toBeValidEmail(): R;
      toHaveValidCookie(cookieName: string): R;
    }
  }
}
