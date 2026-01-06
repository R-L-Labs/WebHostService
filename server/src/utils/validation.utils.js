/**
 * Validate password strength with complexity requirements
 * @param {string} password - Password to validate
 * @returns {{ isValid: boolean, errors: string[] }} Validation result with specific error messages
 */
export const validatePasswordStrength = (password) => {
  const errors = [];

  // Check minimum length (12 characters)
  if (!password || password.length < 12) {
    errors.push('Password must be at least 12 characters');
  }

  // Check for uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  // Check for lowercase letter
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  // Check for number
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  // Check for special character
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
