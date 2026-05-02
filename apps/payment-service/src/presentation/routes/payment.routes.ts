// apps/payment-service/src/presentation/routes/payment.routes.ts

import { Router } from 'express';
import express from 'express'; // ← Needed for raw body parser

import { protect } from '../../middlewares/auth.middleware';

// Import infrastructure for DI
import { PaymentRepositoryImpl } from '../../infrastructure/persistence/repositories/payment.repository.impl';
import { StripeAdapter } from '../../infrastructure/payments/stripe.adaptor';
import { PaymentProducer } from '../../infrastructure/kafka/payment.producer';
import { PaymentService } from '../../application/services/payment.service';
import { PaymentController } from '../contollers/payment.controller';

const router = Router();

/**
 * Manual Dependency Injection (Clean & Explicit)
 */
const repository = new PaymentRepositoryImpl();
const stripeAdapter = new StripeAdapter();
const producer = new PaymentProducer();

const paymentService = new PaymentService(
  repository,
  stripeAdapter,
  producer
);

const controller = new PaymentController(paymentService);

/**
 * ====================== ROUTES ======================
 */

// Protected: Create a new payment (Saga start)
router.post(
  '/',
  protect,
  controller.processPayment
);

// Public: Stripe Webhook (MUST be public + raw body)
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),   // Important for signature verification
  controller.handleWebhook
);

// Protected: Get payment details by order ID
router.get(
  '/:orderId',
  protect,
  controller.getPaymentByOrder
);

export default router;