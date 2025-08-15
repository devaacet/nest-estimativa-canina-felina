/**
 * Shared test utilities and helpers for unit tests
 * Used by both backend-expert (services) and qa-expert (controllers)
 */

import { Test, TestingModule } from '@nestjs/testing';

// Mock data factories
export const mockUserData = {
  id: 'test-user-id',
  email: 'test@example.com',
  name: 'Test User',
  role: 'pesquisador',
  phone: '+5511999999999',
  institution: 'Test Institution',
  active: true,
  password_hash: '$2a$12$hashed.password.here',
  last_login_at: new Date(),
  created_at: new Date(),
  updated_at: new Date(),
};

export const mockTokens = {
  accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.access.token',
  refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.refresh.token',
};

export const mockJwtPayload = {
  sub: mockUserData.id,
  email: mockUserData.email,
  role: mockUserData.role,
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + 900, // 15 minutes
};

// Repository mock factory
export const createMockRepository = () => ({
  findOne: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findById: jest.fn(),
  findByEmail: jest.fn(),
  updateLastLogin: jest.fn(),
  markAsUsed: jest.fn(),
  findByToken: jest.fn(),
});

// Service mock factories
export const createMockJwtService = () => ({
  sign: jest.fn().mockReturnValue(mockTokens.accessToken),
  verify: jest.fn().mockReturnValue(mockJwtPayload),
  decode: jest.fn().mockReturnValue(mockJwtPayload),
});

export const createMockConfigService = () => ({
  get: jest.fn().mockImplementation((key: string, defaultValue?: any) => {
    const config = {
      JWT_SECRET: 'test-secret-key',
      JWT_ACCESS_EXPIRATION: '15m',
      JWT_REFRESH_EXPIRATION: '7d',
      NODE_ENV: 'test',
    };
    return config[key] || defaultValue;
  }),
});

// Bcrypt mock setup
export const setupBcryptMocks = () => {
  const bcrypt = require('bcryptjs');
  bcrypt.hash = jest.fn().mockResolvedValue('$2a$12$hashed.password.here');
  bcrypt.compare = jest.fn().mockResolvedValue(true);
  return bcrypt;
};

// Test module builder helper
export const createTestModule = async (providers: any[]) => {
  const module: TestingModule = await Test.createTestingModule({
    providers,
  }).compile();

  return module;
};

// Common test data
export const validLoginCredentials = {
  email: 'test@example.com',
  password: 'password123',
};

export const validRegisterData = {
  email: 'newuser@example.com',
  password: 'password123',
  name: 'New User',
  phone: '+5511888888888',
  institution: 'Test Institution',
  role: 'pesquisador' as any,
};

export const invalidCredentials = {
  email: 'wrong@example.com',
  password: 'wrongpassword',
};

// HTTP response helpers
export const createSuccessResponse = (data: any) => ({
  success: true,
  data,
});

export const createErrorResponse = (message: string, statusCode: number) => ({
  success: false,
  error: message,
  statusCode,
});

// Test database setup (if needed)
export const setupTestDatabase = async () => {
  // Add test database configuration if needed
  // This can be used for integration tests
};

// Clean up helpers
export const cleanupMocks = () => {
  jest.clearAllMocks();
  jest.resetAllMocks();
};

// Environment helpers
export const setTestEnvironment = (
  env: 'development' | 'production' | 'test' = 'test',
) => {
  process.env.NODE_ENV = env;
};

export const restoreEnvironment = () => {
  delete process.env.NODE_ENV;
};

// Cookie testing helpers
export const parseCookies = (setCookieHeaders: string[]) => {
  const cookies = {};
  setCookieHeaders.forEach((cookie) => {
    const [nameValue] = cookie.split(';');
    const [name, value] = nameValue.split('=');
    cookies[name.trim()] = value || '';
  });
  return cookies;
};

export const assertCookieProperties = (
  cookie: string,
  expectedProps: string[],
) => {
  expectedProps.forEach((prop) => {
    expect(cookie).toContain(prop);
  });
};

// Async test helpers
export const waitForAsync = (ms: number = 10) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Error assertion helpers
export const expectToThrow = async (
  asyncFn: () => Promise<any>,
  expectedError: any,
) => {
  await expect(asyncFn()).rejects.toThrow(expectedError);
};

export const expectToThrowWithMessage = async (
  asyncFn: () => Promise<any>,
  expectedMessage: string,
) => {
  await expect(asyncFn()).rejects.toThrow(expectedMessage);
};

// Permission helpers
export const getUserPermissions = (role: string): string[] => {
  const permissions: Record<string, string[]> = {
    pesquisador: ['forms:create', 'forms:edit_own', 'exports:generate'],
    gerente: [
      'forms:create',
      'forms:edit_own',
      'forms:view_all',
      'users:manage_team',
      'exports:generate',
    ],
    administrador: ['*'],
    cliente: ['forms:view_own', 'exports:generate'],
  };

  return permissions[role] || [];
};

// Date helpers
export const createMockDate = (daysFromNow: number = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date;
};

export const createExpiredDate = () => createMockDate(-1);
export const createFutureDate = () => createMockDate(1);
