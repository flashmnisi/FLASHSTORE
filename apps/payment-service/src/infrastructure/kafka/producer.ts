// apps/payment-service/src/infrastructure/kafka/producer.ts

import { publish } from '@org/shared-kafka';
import { PAYMENT_TOPICS, PAYMENT_EVENTS } from './topics';
import { PaymentEntity } from '../../domain/entities/payment.entity';
import logger from '@org/shared-logger';

export class PaymentProducer {

  async paymentInitiated(payment: PaymentEntity) {
    await publish({
      topic: PAYMENT_TOPICS.PAYMENTS,
      key: payment.id,
      message: {
        event: PAYMENT_EVENTS.PAYMENT_INITIATED,
        data: {
          paymentId: payment.id,
          orderId: payment.orderId,
          userId: payment.userId,
          amount: payment.amount,
          currency: payment.currency,
          status: payment.status,
        },
      },
    });

    logger.info('📤 payment.initiated event published', {
      paymentId: payment.id,
      orderId: payment.orderId,
    });
  }

  async paymentCompleted(payment: PaymentEntity) {
    await publish({
      topic: PAYMENT_TOPICS.PAYMENTS,
      key: payment.id,
      message: {
        event: PAYMENT_EVENTS.PAYMENT_COMPLETED,
        data: {
          paymentId: payment.id,
          orderId: payment.orderId,
          userId: payment.userId,
          amount: payment.amount,
          currency: payment.currency,
          stripePaymentIntentId: payment.stripePaymentIntentId,
        },
      },
    });

    logger.info('💰 payment.completed event published', {
      paymentId: payment.id,
      orderId: payment.orderId,
    });
  }

  async paymentFailed(payment: PaymentEntity, reason?: string) {
    await publish({
      topic: PAYMENT_TOPICS.PAYMENTS,
      key: payment.id,
      message: {
        event: PAYMENT_EVENTS.PAYMENT_FAILED,
        data: {
          paymentId: payment.id,
          orderId: payment.orderId,
          userId: payment.userId,
          reason,
        },
      },
    });

    logger.warn('❌ payment.failed event published', {
      paymentId: payment.id,
      orderId: payment.orderId,
      reason,
    });
  }
}