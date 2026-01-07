import express from 'express';
import { body, query } from 'express-validator';
import {
  getClients,
  getClient,
  createClient,
  updateClient,
  deleteClient,
  getClientStats,
} from '../controllers/clients.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate, validateUUID, validatePagination, validateSearch } from '../middleware/validate.middleware.js';

const router = express.Router();

const clientStatusValues = ['PROSPECT', 'ACTIVE', 'INACTIVE', 'CANCELLED'];

const getClientsValidation = [
  ...validatePagination,
  ...validateSearch,
  query('status')
    .optional()
    .isIn(['ALL', ...clientStatusValues])
    .withMessage(`status must be one of: ALL, ${clientStatusValues.join(', ')}`),
];

const createClientValidation = [
  body('businessName')
    .trim()
    .notEmpty()
    .withMessage('Business name is required')
    .isLength({ max: 255 })
    .withMessage('Business name must be 255 characters or less'),
  body('contactName')
    .trim()
    .notEmpty()
    .withMessage('Contact name is required')
    .isLength({ max: 255 })
    .withMessage('Contact name must be 255 characters or less'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  body('phone')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Phone must be 50 characters or less'),
  body('website')
    .optional()
    .trim()
    .isURL()
    .withMessage('Invalid website URL'),
  body('status')
    .optional()
    .isIn(clientStatusValues)
    .withMessage(`status must be one of: ${clientStatusValues.join(', ')}`),
  body('packageId')
    .optional()
    .isUUID()
    .withMessage('packageId must be a valid UUID'),
  body('notes')
    .optional()
    .trim(),
];

const updateClientValidation = [
  ...validateUUID('id'),
  body('businessName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Business name must be 1-255 characters'),
  body('contactName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Contact name must be 1-255 characters'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  body('phone')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Phone must be 50 characters or less'),
  body('website')
    .optional()
    .trim()
    .isURL()
    .withMessage('Invalid website URL'),
  body('status')
    .optional()
    .isIn(clientStatusValues)
    .withMessage(`status must be one of: ${clientStatusValues.join(', ')}`),
  body('packageId')
    .optional({ values: 'null' })
    .isUUID()
    .withMessage('packageId must be a valid UUID'),
];

// All routes are protected
router.use(protect);

router.get('/stats', getClientStats);
router.get('/', getClientsValidation, validate, getClients);
router.get('/:id', validateUUID('id'), validate, getClient);
router.post('/', createClientValidation, validate, createClient);
router.put('/:id', updateClientValidation, validate, updateClient);
router.delete('/:id', validateUUID('id'), validate, deleteClient);

export default router;
