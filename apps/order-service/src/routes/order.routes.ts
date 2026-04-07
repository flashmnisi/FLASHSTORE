import { Router } from 'express';
import { createOrder, getOrder } from '../controllers/order.controller';
import { protect } from '../middlewares/order.middleware';

const router = Router();

router.post('/', protect, createOrder);
router.get('/:orderId', protect, getOrder);

export default router;