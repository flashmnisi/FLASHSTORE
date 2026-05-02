// apps/payment-service/src/infrastructure/kafka/producer/payment.producer.ts

import { publish } from '@org/shared-kafka';
import logger from '@org/shared-logger';
import { PaymentEntity } from '../../domain/entities/payment.entity';
import { TOPICS, EVENTS } from './topics';

export class PaymentProducer {
  /**
   * Publish when payment is initiated (Saga Start)
   */
  async paymentInitiatedOutbox(payment: PaymentEntity): Promise<void> {
    try {
      await publish({
        topic: TOPICS.PAYMENTS,
        key: payment.orderId,
        message: {
          event: EVENTS.PAYMENT_INITIATED,
          data: {
            paymentId: payment.id,
            orderId: payment.orderId,
            userId: payment.userId,
            amount: payment.amount,
            currency: payment.currency,
            status: payment.status,
            paymentMethod: payment.paymentMethod,
          },
          timestamp: new Date().toISOString(),
          source: 'payment-service',
        },
      });

      logger.info('Payment initiated event published to Outbox', {
        paymentId: payment.id,
        orderId: payment.orderId,
      });
    } catch (error: any) {
      logger.error('Failed to publish payment_initiated event', {
        paymentId: payment.id,
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Publish when payment is completed successfully
   */
  async paymentCompletedOutbox(payment: PaymentEntity): Promise<void> {
    try {
      await publish({
        topic: TOPICS.PAYMENTS,
        key: payment.orderId,
        message: {
          event: EVENTS.PAYMENT_SUCCEEDED,
          data: {
            paymentId: payment.id,
            orderId: payment.orderId,
            userId: payment.userId,
            amount: payment.amount,
            currency: payment.currency,
            stripePaymentIntentId: payment.stripePaymentIntentId,
          },
          timestamp: new Date().toISOString(),
          source: 'payment-service',
        },
      });

      logger.info('Payment succeeded event published', {
        paymentId: payment.id,
        orderId: payment.orderId,
      });
    } catch (error: any) {
      logger.error('Failed to publish payment_succeeded event', {
        paymentId: payment.id,
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Publish when payment fails
   */
  async paymentFailedOutbox(payment: PaymentEntity): Promise<void> {
    try {
      await publish({
        topic: TOPICS.PAYMENTS,
        key: payment.orderId,
        message: {
          event: EVENTS.PAYMENT_FAILED,
          data: {
            paymentId: payment.id,
            orderId: payment.orderId,
            userId: payment.userId,
            amount: payment.amount,
            currency: payment.currency,
            failureReason: payment.metadata?.failureReason,
          },
          timestamp: new Date().toISOString(),
          source: 'payment-service',
        },
      });

      logger.warn('Payment failed event published', {
        paymentId: payment.id,
        orderId: payment.orderId,
      });
    } catch (error: any) {
      logger.error('Failed to publish payment_failed event', {
        paymentId: payment.id,
        error: error.message,
      });
      throw error;
    }
  }
}

// Singleton instance
export const paymentProducer = new PaymentProducer();