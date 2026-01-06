import { describe, it, expect, beforeEach } from 'vitest';
import jwt from 'jsonwebtoken';
import { generateToken, verifyToken } from './jwt.utils.js';

describe('jwt.utils', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret-key-for-testing';
  });

  describe('generateToken', () => {
    it('should return a string token when given valid user object', () => {
      const user = { id: 'test-uuid-123', email: 'test@test.com', role: 'ADMIN' };

      const token = generateToken(user);

      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3); // JWT has 3 parts
    });

    it('should include userId, email, role in token payload', () => {
      const user = { id: 'test-uuid-123', email: 'test@test.com', role: 'ADMIN' };

      const token = generateToken(user);
      const decoded = jwt.decode(token);

      expect(decoded.userId).toBe('test-uuid-123');
      expect(decoded.email).toBe('test@test.com');
      expect(decoded.role).toBe('ADMIN');
    });
  });

  describe('verifyToken', () => {
    it('should decode a valid token and return payload', () => {
      const user = { id: 'test-uuid-456', email: 'verify@test.com', role: 'USER' };
      const token = generateToken(user);

      const payload = verifyToken(token);

      expect(payload.userId).toBe('test-uuid-456');
      expect(payload.email).toBe('verify@test.com');
      expect(payload.role).toBe('USER');
    });

    it('should throw error for invalid token', () => {
      expect(() => verifyToken('invalid.token.here')).toThrow('Invalid or expired token');
    });

    it('should throw error for token signed with different secret', () => {
      const user = { id: 'test-uuid', email: 'test@test.com', role: 'USER' };
      const tokenWithDifferentSecret = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        'different-secret',
        { expiresIn: '1h' }
      );

      expect(() => verifyToken(tokenWithDifferentSecret)).toThrow('Invalid or expired token');
    });
  });
});
