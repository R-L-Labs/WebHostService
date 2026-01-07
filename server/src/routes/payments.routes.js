import express from 'express';
import { body } from 'express-validator';
import {
  getClientPayments,
  getPayment,
  createPayment,
  updatePayment,
  deletePayment,
} from '../controllers/payments.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate, validateUUID } from '../middleware/validate.middleware.js';

const router = express.Router();

const paymentMethodValues = ['CASH', 'CHECK', 'CREDIT_CARD', 'BANK_TRANSFER', 'PAYPAL', 'VENMO', 'ZELLE', 'OTHER'];
const paymentStatusValues = ['PENDING', 'PAID', 'REFUNDED', 'FAILED'];

const createPaymentValidation = [
  body('clientId')
    .notEmpty()
    .withMessage('Client ID is required')
    .isUUID()
    .withMessage('clientId must be a valid UUID'),
  body('amount')
    .notEmpty()
    .withMessage('Amount is required')
    .isDecimal({ decimal_digits: '0,2' })
    .withMessage('Amount must be a valid decimal with up to 2 decimal places')
    .custom((value) => {
      if (parseFloat(value) <= 0) {
        throw new Error('Amount must be greater than 0');
      }
      return true;
    }),
  body('paymentDate')
    .notEmpty()
    .withMessage('Payment date is required')
    .isISO8601()
    .withMessage('Payment date must be a valid date'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Description must be 255 characters or less'),
  body('paymentMethod')
    .optional()
    .isIn(paymentMethodValues)
    .withMessage(`paymentMethod must be one of: ${paymentMethodValues.join(', ')}`),
  body('status')
    .optional()
    .isIn(paymentStatusValues)
    .withMessage(`status must be one of: ${paymentStatusValues.join(', ')}`),
  body('notes')
    .optional()
    .trim(),
];

const updatePaymentValidation = [
  ...validateUUID('id'),
  body('amount')
    .optional()
    .isDecimal({ decimal_digits: '0,2' })
    .withMessage('Amount must be a valid decimal with up to 2 decimal places')
    .custom((value) => {
      if (parseFloat(value) <= 0) {
        throw new Error('Amount must be greater than 0');
      }
      return true;
    }),
  body('paymentDate')
    .optional()
    .isISO8601()
    .withMessage('Payment date must be a valid date'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Description must be 255 characters or less'),
  body('paymentMethod')
    .optional()
    .isIn(paymentMethodValues)
    .withMessage(`paymentMethod must be one of: ${paymentMethodValues.join(', ')}`),
  body('status')
    .optional()
    .isIn(paymentStatusValues)
    .withMessage(`status must be one of: ${paymentStatusValues.join(', ')}`),
  body('notes')
    .optional()
    .trim(),
];

// All routes are protected
router.use(protect);

router.get('/client/:clientId', validateUUID('clientId'), validate, getClientPayments);
router.get('/:id', validateUUID('id'), validate, getPayment);
router.post('/', createPaymentValidation, validate, createPayment);
router.put('/:id', updatePaymentValidation, validate, updatePayment);
router.delete('/:id', validateUUID('id'), validate, deletePayment);

export default router;
