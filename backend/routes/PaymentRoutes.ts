import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { createPaymentOrder } from '../controllers/PaymentController';
const router = express.Router();

router.post('/create-order', protect, createPaymentOrder);

export default router;