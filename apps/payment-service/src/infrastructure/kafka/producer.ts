import { sendToOutbox } from '../outbox/outbox.processor';
import { TOPICS, EVENTS } from '@org/shared-kafka';
import { PaymentEntity } from '../../domain/entities/payment.entity';
import logger from '@org/shared-logger';

export class PaymentProducer {

  /**
   * 🔥 PAYMENT INITIATED (Saga Start)
   */
  async paymentInitiated(payment: PaymentEntity) {
    await sendToOutbox({
      topic: TOPICS.PAYMENTS,
      event: EVENTS.PAYMENT_SUCCESS, // ⚠️ you may want PAYMENT_INITIATED
      key: payment.orderId, // 🔥 ensures partition ordering
      payload: {
        paymentId: payment.id,
        orderId: payment.orderId,
        userId: payment.userId,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        createdAt: payment.createdAt,
      },
    });

    logger.info('📦 Outbox queued: payment initiated', {
      paymentId: payment.id,
      orderId: payment.orderId,
    });
  }

  /**
   * ✅ PAYMENT COMPLETED (Webhook success)
   */
  async paymentCompleted(payment: PaymentEntity) {
    await sendToOutbox({
      topic: TOPICS.PAYMENTS,
      event: EVENTS.PAYMENT_SUCCESS,
      key: payment.orderId,
      payload: {
        paymentId: payment.id,
        orderId: payment.orderId,
        userId: payment.userId,
        amount: payment.amount,
        currency: payment.currency,
        status: 'succeeded',
        updatedAt: new Date(),
      },
    });

    logger.info('📦 Outbox queued: payment completed', {
      paymentId: payment.id,
    });
  }

  /**
   * ❌ PAYMENT FAILED
   */
  async paymentFailed(payment: PaymentEntity) {
    await sendToOutbox({
      topic: TOPICS.PAYMENTS,
      event: EVENTS.PAYMENT_FAILED,
      key: payment.orderId,
      payload: {
        paymentId: payment.id,
        orderId: payment.orderId,
        userId: payment.userId,
        status: 'failed',
        updatedAt: new Date(),
      },
    });

    logger.warn('📦 Outbox queued: payment failed', {
      paymentId: payment.id,
    });
  }
}