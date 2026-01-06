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

  describe('createPayment', () => {
    it('should return 400 if clientId missing', async () => {
      mockReq.body = { amount: '100.00', paymentDate: '2024-01-01' };

      await createPayment(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Client ID, amount, and payment date are required',
      });
    });

    it('should return 400 if amount missing', async () => {
      mockReq.body = { clientId: 'test-uuid', paymentDate: '2024-01-01' };

      await createPayment(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 if paymentDate missing', async () => {
      mockReq.body = { clientId: 'test-uuid', amount: '100.00' };

      await createPayment(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it('should return 404 if client not found', async () => {
      mockReq.body = { clientId: 'nonexistent-uuid', amount: '100.00', paymentDate: '2024-01-01' };
      mockPrisma.client.findUnique.mockResolvedValue(null);

      await createPayment(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Client not found',
      });
    });

    it('should create payment with correct data', async () => {
      mockReq.body = {
        clientId: 'test-uuid',
        amount: '99.99',
        paymentDate: '2024-01-15',
        description: 'Test payment',
      };
      mockPrisma.client.findUnique.mockResolvedValue({ id: 'test-uuid' });
      mockPrisma.payment.create.mockResolvedValue({
        id: 'payment-uuid',
        clientId: 'test-uuid',
        amount: '99.99',
        paymentDate: new Date('2024-01-15'),
        status: 'PENDING',
      });

      await createPayment(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockPrisma.payment.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          clientId: 'test-uuid',
          amount: 99.99, // parseFloat converts string to number
          description: 'Test payment',
        }),
      });
    });
  });

  describe('updatePayment', () => {
    it('should return 404 if payment not found', async () => {
      mockReq.params = { id: 'nonexistent-uuid' };
      mockReq.body = { amount: '150.00' };
      mockPrisma.payment.findUnique.mockResolvedValue(null);

      await updatePayment(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Payment not found',
      });
    });

    it('should update only provided fields', async () => {
      mockReq.params = { id: 'payment-uuid' };
      mockReq.body = { amount: '200.00', status: 'PAID' };
      mockPrisma.payment.findUnique.mockResolvedValue({
        id: 'payment-uuid',
        amount: '100.00',
        status: 'PENDING',
      });
      mockPrisma.payment.update.mockResolvedValue({
        id: 'payment-uuid',
        amount: '200.00',
        status: 'PAID',
      });

      await updatePayment(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockPrisma.payment.update).toHaveBeenCalledWith({
        where: { id: 'payment-uuid' },
        data: {
          amount: 200, // parseFloat converts
          status: 'PAID',
        },
      });
    });

    it('should handle amount conversion correctly', async () => {
      mockReq.params = { id: 'payment-uuid' };
      mockReq.body = { amount: '99.99' };
      mockPrisma.payment.findUnique.mockResolvedValue({ id: 'payment-uuid' });
      mockPrisma.payment.update.mockResolvedValue({ id: 'payment-uuid', amount: '99.99' });

      await updatePayment(mockReq, mockRes, mockNext);

      expect(mockPrisma.payment.update).toHaveBeenCalledWith({
        where: { id: 'payment-uuid' },
        data: {
          amount: 99.99,
        },
      });
    });
  });
});
