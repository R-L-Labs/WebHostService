import { vi, beforeEach } from 'vitest';
import { mockPrisma, resetMocks } from './mocks/prisma.js';

// Mock @prisma/client module
vi.mock('@prisma/client', () => {
  // Create a constructor function that returns mockPrisma
  const MockPrismaClient = function () {
    return mockPrisma;
  };
  return {
    PrismaClient: MockPrismaClient,
  };
});

// Reset all mocks before each test
beforeEach(() => {
  resetMocks();
  // Set default JWT_SECRET for tests
  process.env.JWT_SECRET = 'test-secret-key-for-testing';
});

// Re-export mock utilities for test files
export { mockPrisma, resetMocks };
