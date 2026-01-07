import { Prisma } from '@prisma/client';
import logger from '../utils/logger.utils.js';

/**
 * Global error handling middleware
 */
export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for development
  if (process.env.NODE_ENV === 'development') {
    logger.error({ err, path: req.path, method: req.method }, 'request error');
  }

  // Prisma validation error
  if (err instanceof Prisma.PrismaClientValidationError) {
    error.message = 'Invalid data provided';
    error.statusCode = 400;
  }

  // Prisma unique constraint error
  if (err.code === 'P2002') {
    const field = err.meta?.target?.[0] || 'field';
    error.message = `${field} already exists`;
    error.statusCode = 400;
  }

  // Prisma record not found error
  if (err.code === 'P2025') {
    error.message = 'Resource not found';
    error.statusCode = 404;
  }

  // Prisma foreign key constraint error
  if (err.code === 'P2003') {
    error.message = 'Related record not found';
    error.statusCode = 400;
  }

  // Default error response
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

/**
 * Handle 404 errors (route not found)
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};
