import { Router } from 'express';
import { createPaymentIntent, createOrderWithPayment } from '../controller/payment.controller';
import { protect } from '../middleware/payment.auth';

const router = Router();

router.use(protect);

router.post('/create-intent', createPaymentIntent);
router.post('/create-order', createOrderWithPayment);

export default router;