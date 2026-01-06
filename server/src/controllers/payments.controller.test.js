import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getClientPayments, createPayment, updatePayment } from './payments.controller.js';
import { mockPrisma } from '../test/mocks/prisma.js';

describe('payments.controller', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {
      params: {},
      body: {},
    };
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    mockNext = vi.fn();
  });

  describe('getClientPayments', () => {
    it('should return 404 if client not found', async () => {
      mockReq.params = { clientId: 'nonexistent-uuid' };
      mockPrisma.client.findUnique.mockResolvedValue(null);

      await getClientPayments(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Client not found',
      });
    });

    it('should return empty array with zero totals if no payments', async () => {
      mockReq.params = { clientId: 'test-uuid' };
      mockPrisma.client.findUnique.mockResolvedValue({ id: 'test-uuid' });
      mockPrisma.payment.findMany.mockResolvedValue([]);

      await getClientPayments(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: {
          payments: [],
          summary: {
            totalPaid: 0,
            totalPending: 0,
            count: 0,
          },
        },
      });
    });

    it('should calculate totalPaid correctly for PAID payments', async () => {
      mockReq.params = { clientId: 'test-uuid' };
      mockPrisma.client.findUnique.mockResolvedValue({ id: 'test-uuid' });
      mockPrisma.payment.findMany.mockResolvedValue([
        { amount: '100.00', status: 'PAID' },
        { amount: '50.50', status: 'PAID' },
      ]);

      await getClientPayments(mockReq, mockRes, mockNext);

      const responseData = mockRes.json.mock.calls[0][0];
      expect(responseData.data.summary.totalPaid).toBe(150.5);
    });

    it('should calculate totalPending correctly for PENDING payments', async () => {
      mockReq.params = { clientId: 'test-uuid' };
      mockPrisma.client.findUnique.mockResolvedValue({ id: 'test-uuid' });
      mockPrisma.payment.findMany.mockResolvedValue([
        { amount: '75.25', status: 'PENDING' },
        { amount: '24.75', status: 'PENDING' },
      ]);

      await getClientPayments(mockReq, mockRes, mockNext);

      const responseData = mockRes.json.mock.calls[0][0];
      expect(responseData.data.summary.totalPending).toBe(100);
    });

    it('should handle mixed payment statuses correctly', async () => {
      mockReq.params = { clientId: 'test-uuid' };
      mockPrisma.client.findUnique.mockResolvedValue({ id: 'test-uuid' });
      mockPrisma.payment.findMany.mockResolvedValue([
        { amount: '100.00', status: 'PAID' },
        { amount: '50.50', status: 'PAID' },
        { amount: '75.25', status: 'PENDING' },
        { amount: '200.00', status: 'OVERDUE' }, // Should not be counted in either
      ]);

      await getClientPayments(mockReq, mockRes, mockNext);

      const responseData = mockRes.json.mock.calls[0][0];
      expect(responseData.data.summary.totalPaid).toBe(150.5);
      expect(responseData.data.summary.totalPending).toBe(75.25);
      expect(responseData.data.summary.count).toBe(4);
    });
  });
});
