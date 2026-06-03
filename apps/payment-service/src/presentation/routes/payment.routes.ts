import { Router } from 'express';
import express from 'express';

import { protect } from '../../middlewares/auth.middleware';

import { PaymentRepositoryImpl } from '../../infrastructure/persistence/repositories/payment.repository.impl';
import { StripeAdapter } from '../../infrastructure/payments/stripe.adaptor';

import { OutboxService } from '../../infrastructure/outbox/outbox.service';

import { PaymentService } from '../../application/services/payment.service';
import { PaymentController } from '../contollers/payment.controller';
import { OutboxRepository } from '../../infrastructure/outbox/outbox.repository';

const router = Router();

/**
 * ======================
 * DEPENDENCIES (DI)
 * ======================
 */

const paymentrepository = new PaymentRepositoryImpl();
const stripeAdapter = new StripeAdapter();

const outboxRepository = new OutboxRepository();
const outboxService = new OutboxService(outboxRepository);

const paymentService = new PaymentService(
  paymentrepository,
  stripeAdapter,
  outboxService
);

const controller = new PaymentController(paymentService);

/**
 * ====================== ROUTES ======================
 */

// Protected: Create payment
router.post(
  '/',
  protect,
  controller.processPayment
);

// Stripe webhook (raw body required)
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  controller.handleWebhook
);

// Get payment
router.get(
  '/:orderId',
  protect,
  controller.getPaymentByOrder
);

export default router;