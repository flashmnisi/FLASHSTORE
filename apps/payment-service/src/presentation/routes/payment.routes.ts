import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller';
import { PaymentService } from '../../application/services/payment.service';

// Infrastructure
import { PaymentRepository } from '../../infrastructure/persistence/repositories/payment.repository.impl';
import { StripeAdapter } from '../../infrastructure/payments/stripe.adapter';
import { PaymentProducer } from '../../infrastructure/kafka/producer';

// Middleware (optional)
import { protect } from '../../middlewares/auth.middleware';

const router = Router();

/**
 * Dependency Injection (manual but clean)
 */
const repository = new PaymentRepository();
const stripeAdapter = new StripeAdapter();
const producer = new PaymentProducer();

const paymentService = new PaymentService(
  repository,
  stripeAdapter,
  producer
);

const controller = new PaymentController(paymentService);

/**
 * Routes
 */

// 🔐 Protected payment creation
router.post(
  '/',
  protect,
  controller.processPayment
);

// 🔓 Stripe webhook (must be public)
router.post(
  '/webhook',
  controller.handleWebhook
);

// 🔐 Get payment by order
router.get(
  '/:orderId',
  protect,
  controller.getPaymentByOrder
);

export default router;