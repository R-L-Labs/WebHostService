import { validationResult, param, query } from 'express-validator';

/**
 * Middleware to handle express-validator results
 * Returns 400 with validation errors if any, otherwise continues
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }

  next();
};

/**
 * Validates that a route parameter is a valid UUID
 * @param {string} paramName - Name of the route parameter (e.g., 'id', 'clientId')
 * @returns {Array} Array of express-validator middleware
 */
export const validateUUID = (paramName = 'id') => [
  param(paramName)
    .isUUID()
    .withMessage(`${paramName} must be a valid UUID`),
];

/**
 * Validates common pagination query parameters
 */
export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('page must be a positive integer')
    .toInt(),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('limit must be between 1 and 100')
    .toInt(),
];

/**
 * Validates search query parameter
 */
export const validateSearch = [
  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('search must be 100 characters or less'),
];
