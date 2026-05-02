// apps/payment-service/src/container.ts
import { PaymentService } from './application/services/payment.service';
import { PaymentConsumer } from './infrastructure/kafka/consumer';
import { PaymentProducer } from './infrastructure/kafka/payment.producer';

import logger from '@org/shared-logger';
import { OutboxService } from './infrastructure/outbox/outbox.service';
import { StripeAdapter } from './infrastructure/payments/stripe.adaptor';
import { OutboxRepositoryImpl } from './infrastructure/persistence/repositories/outbox.repository.impl';
import { PaymentRepositoryImpl } from './infrastructure/persistence/repositories/payment.repository.impl';

// ====================== REPOSITORIES ======================
const paymentRepository = new PaymentRepositoryImpl();
const outboxRepository = new OutboxRepositoryImpl();

// ====================== INFRASTRUCTURE ======================
const stripeAdapter = new StripeAdapter();
const paymentProducer = new PaymentProducer();

// ====================== SERVICES ======================
export const outboxService = new OutboxService(outboxRepository);

export const paymentService = new PaymentService(
  paymentRepository,
  stripeAdapter,
  paymentProducer
);

export const paymentConsumer = new PaymentConsumer(paymentService);

// ====================== LOG ======================
logger.info('✅ Payment Service Dependency Injection Container initialized successfully');