// apps/payment-service/src/infrastructure/kafka/topics.ts

import { TOPICS, EVENTS } from '@org/shared-kafka';

export const PAYMENT_TOPICS = {
  PAYMENTS: TOPICS.PAYMENTS,
  ORDERS: TOPICS.ORDERS,
} as const;

export const PAYMENT_EVENTS = {
  PAYMENT_INITIATED: 'payment.initiated',
  PAYMENT_COMPLETED: 'payment.completed',
  PAYMENT_FAILED: 'payment.failed',

  // External events we listen to
  ORDER_CREATED: EVENTS.ORDER_CREATED,
} as const;