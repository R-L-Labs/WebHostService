import { describe, it, expect } from 'vitest';
import { validatePasswordStrength } from './validation.utils.js';

describe('validatePasswordStrength', () => {
  describe('length requirements', () => {
    it('should reject passwords shorter than 12 characters', () => {
      const result = validatePasswordStrength('Short1!aB');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must be at least 12 characters');
    });

    it('should accept passwords with exactly 12 characters meeting all requirements', () => {
      const result = validatePasswordStrength('Abcdefgh1!23');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('uppercase requirements', () => {
    it('should reject passwords without uppercase letter', () => {
      const result = validatePasswordStrength('abcdefgh1!234');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one uppercase letter');
    });
  });

  describe('lowercase requirements', () => {
    it('should reject passwords without lowercase letter', () => {
      const result = validatePasswordStrength('ABCDEFGH1!234');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one lowercase letter');
    });
  });

  describe('number requirements', () => {
    it('should reject passwords without number', () => {
      const result = validatePasswordStrength('Abcdefghij!@');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one number');
    });
  });

  describe('special character requirements', () => {
    it('should reject passwords without special character', () => {
      const result = validatePasswordStrength('Abcdefgh12345');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one special character');
    });
  });

  describe('valid passwords', () => {
    it('should accept passwords meeting all requirements', () => {
      const result = validatePasswordStrength('SecurePass123!');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should accept passwords with various special characters', () => {
      const validPasswords = [
        'Password123!',
        'Password123@',
        'Password123#',
        'Password123$',
        'Password123%',
      ];

      validPasswords.forEach(password => {
        const result = validatePasswordStrength(password);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });
  });

  describe('multiple errors', () => {
    it('should return all validation failures at once', () => {
      const result = validatePasswordStrength('short');
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
      expect(result.errors).toContain('Password must be at least 12 characters');
      expect(result.errors).toContain('Password must contain at least one uppercase letter');
      expect(result.errors).toContain('Password must contain at least one number');
      expect(result.errors).toContain('Password must contain at least one special character');
    });
  });
});
