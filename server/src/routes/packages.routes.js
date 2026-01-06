import express from 'express';
import { getPackages, getPackage } from '../controllers/packages.controller.js';

const router = express.Router();

// All routes are public (for now)
router.get('/', getPackages);
router.get('/:id', getPackage);

export default router;
