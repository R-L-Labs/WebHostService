import express from 'express';
import { body, query } from 'express-validator';
import {
  submitInquiry,
  getInquiries,
  getInquiry,
  updateInquiry,
  deleteInquiry,
} from '../controllers/inquiries.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate, validateUUID, validatePagination } from '../middleware/validate.middleware.js';

const router = express.Router();

const inquiryStatusValues = ['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'DISMISSED'];

const submitInquiryValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 255 })
    .withMessage('Name must be 255 characters or less'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ max: 5000 })
    .withMessage('Message must be 5000 characters or less'),
  body('phone')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Phone must be 50 characters or less'),
  body('businessName')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Business name must be 255 characters or less'),
  body('interestedPackage')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Interested package must be 255 characters or less'),
];

const getInquiriesValidation = [
  ...validatePagination,
  query('status')
    .optional()
    .isIn(['ALL', ...inquiryStatusValues])
    .withMessage(`status must be one of: ALL, ${inquiryStatusValues.join(', ')}`),
];

const updateInquiryValidation = [
  ...validateUUID('id'),
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(inquiryStatusValues)
    .withMessage(`status must be one of: ${inquiryStatusValues.join(', ')}`),
];

// Public route
router.post('/', submitInquiryValidation, validate, submitInquiry);

// Protected routes
router.get('/', protect, getInquiriesValidation, validate, getInquiries);
router.get('/:id', protect, validateUUID('id'), validate, getInquiry);
router.put('/:id', protect, updateInquiryValidation, validate, updateInquiry);
router.delete('/:id', protect, validateUUID('id'), validate, deleteInquiry);

export default router;
