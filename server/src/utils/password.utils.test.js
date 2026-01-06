import { describe, it, expect } from 'vitest';
import { hashPassword, comparePassword } from './password.utils.js';

describe('password.utils', () => {
  describe('hashPassword', () => {
    it('should return a hashed string different from input', async () => {
      const plainPassword = 'testpassword123';

      const hashedPassword = await hashPassword(plainPassword);

      expect(typeof hashedPassword).toBe('string');
      expect(hashedPassword).not.toBe(plainPassword);
    });

    it('should return hash in bcrypt format', async () => {
      const plainPassword = 'testpassword123';

      const hashedPassword = await hashPassword(plainPassword);

      // bcrypt hashes start with $2a$ or $2b$
      expect(hashedPassword.startsWith('$2')).toBe(true);
    });

    it('should produce different hashes for same password (salt)', async () => {
      const plainPassword = 'samepassword';

      const hash1 = await hashPassword(plainPassword);
      const hash2 = await hashPassword(plainPassword);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('comparePassword', () => {
    it('should return true for matching password', async () => {
      const plainPassword = 'correctpassword';
      const hashedPassword = await hashPassword(plainPassword);

      const result = await comparePassword(plainPassword, hashedPassword);

      expect(result).toBe(true);
    });

    it('should return false for non-matching password', async () => {
      const plainPassword = 'correctpassword';
      const hashedPassword = await hashPassword(plainPassword);

      const result = await comparePassword('wrongpassword', hashedPassword);

      expect(result).toBe(false);
    });
  });
});
