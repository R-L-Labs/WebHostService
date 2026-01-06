import express from 'express';
import {
  submitInquiry,
  getInquiries,
  getInquiry,
  updateInquiry,
  deleteInquiry,
} from '../controllers/inquiries.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public route
router.post('/', submitInquiry);

// Protected routes
router.get('/', protect, getInquiries);
router.get('/:id', protect, getInquiry);
router.put('/:id', protect, updateInquiry);
router.delete('/:id', protect, deleteInquiry);

export default router;
