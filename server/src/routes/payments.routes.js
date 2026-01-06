import express from 'express';
import {
  getClientPayments,
  getPayment,
  createPayment,
  updatePayment,
  deletePayment,
} from '../controllers/payments.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/client/:clientId', getClientPayments);
router.get('/:id', getPayment);
router.post('/', createPayment);
router.put('/:id', updatePayment);
router.delete('/:id', deletePayment);

export default router;
