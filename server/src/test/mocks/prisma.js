import { vi } from 'vitest';

/**
 * Mock PrismaClient for controller testing
 * Usage:
 *   mockPrisma.user.findUnique.mockResolvedValue({ id: '1', email: 'test@test.com' });
 */
export const mockPrisma = {
  user: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  client: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  inquiry: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  payment: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  package: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
};

/**
 * Reset all mock implementations and calls
 * Call this in beforeEach to ensure clean state between tests
 */
export const resetMocks = () => {
  Object.values(mockPrisma).forEach((model) => {
    Object.values(model).forEach((mockFn) => {
      mockFn.mockReset();
    });
  });
};
