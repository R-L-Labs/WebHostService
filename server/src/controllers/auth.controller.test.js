import { describe, it, expect, vi, beforeEach } from 'vitest';
import { login } from './auth.controller.js';
import { mockPrisma } from '../test/mocks/prisma.js';
import { hashPassword } from '../utils/password.utils.js';

describe('auth.controller', () => {
  describe('login', () => {
    let mockReq;
    let mockRes;
    let mockNext;

    beforeEach(() => {
      mockReq = {
        body: {},
      };
      mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };
      mockNext = vi.fn();
    });

    it('should return 400 if email missing', async () => {
      mockReq.body = { password: 'testpassword' };

      await login(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Please provide email and password',
      });
    });

    it('should return 400 if password missing', async () => {
      mockReq.body = { email: 'test@test.com' };

      await login(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Please provide email and password',
      });
    });

    it('should return 401 if user not found', async () => {
      mockReq.body = { email: 'notfound@test.com', password: 'testpassword' };
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await login(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid email or password',
      });
    });

    it('should return 401 if password incorrect', async () => {
      const hashedPassword = await hashPassword('correctpassword');
      mockReq.body = { email: 'test@test.com', password: 'wrongpassword' };
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'test-uuid',
        email: 'test@test.com',
        password: hashedPassword,
        role: 'ADMIN',
      });

      await login(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid email or password',
      });
    });

    it('should return 200 with token and user if credentials valid', async () => {
      const plainPassword = 'correctpassword';
      const hashedPassword = await hashPassword(plainPassword);
      mockReq.body = { email: 'test@test.com', password: plainPassword };
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'test-uuid',
        email: 'test@test.com',
        password: hashedPassword,
        role: 'ADMIN',
        createdAt: new Date(),
      });

      await login(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Login successful',
          data: expect.objectContaining({
            user: expect.objectContaining({
              id: 'test-uuid',
              email: 'test@test.com',
              role: 'ADMIN',
            }),
            token: expect.any(String),
          }),
        })
      );
      // Ensure password is not in response
      const responseData = mockRes.json.mock.calls[0][0];
      expect(responseData.data.user.password).toBeUndefined();
    });
  });
});
