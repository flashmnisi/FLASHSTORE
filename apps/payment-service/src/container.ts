// apps/payment-service/src/container.ts
import { PaymentService } from './application/services/payment.service';
import { PaymentConsumer } from './infrastructure/kafka/consumer';

import logger from '@org/shared-logger';
import { OutboxService } from './infrastructure/outbox/outbox.service';
import { StripeAdapter } from './infrastructure/payments/stripe.adaptor';
//import { OutboxRepository } from './infrastructure/persistence/repositories/outbox.repository.impl';
import { PaymentRepositoryImpl } from './infrastructure/persistence/repositories/payment.repository.impl';
import { OutboxRepository } from './infrastructure/outbox/outbox.repository';

// ====================== REPOSITORIES ======================
const paymentRepository = new PaymentRepositoryImpl();
const outboxRepository = new OutboxRepository();

// ====================== INFRASTRUCTURE ======================
const stripeAdapter = new StripeAdapter();

// ====================== SERVICES ======================
export const outboxService = new OutboxService(outboxRepository);

export const paymentService = new PaymentService(
  paymentRepository,
  stripeAdapter,
  outboxService
);

export const paymentConsumer = new PaymentConsumer(paymentService);

// ====================== LOG ======================
logger.info('✅ Payment Service Dependency Injection Container initialized successfully');