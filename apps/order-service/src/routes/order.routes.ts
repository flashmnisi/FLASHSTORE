import { Router } from 'express';
import { createOrder, getUserOrders, clearUserOrders } from '../controllers/order.controller';
import { protect } from '../middlewares/order.middleware';

const router = Router();

// Protected routes
router.post('/', protect, createOrder);
router.get('/', protect, getUserOrders);
router.delete('/clear', protect, clearUserOrders);

export default router;