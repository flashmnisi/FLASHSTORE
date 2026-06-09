// apps/notification-service/src/infrastructure/kafka/handlers/handlePaymentCompleted.ts

import { NotificationService } from '../../../application/services/notification.service';
import logger from '@org/shared-logger';

export class PaymentCompletedHandler {
  constructor(
    private readonly notificationService: NotificationService
  ) {}

  async handle(rawMessage: any) {
    try {
      // === ROBUST PAYLOAD NORMALIZATION ===
      const message = rawMessage?.data?.data || rawMessage?.data || rawMessage;
      const payload = message?.data || message;

      if (!payload?.userId) {
        logger.warn('⚠️ payment.completed missing userId', { raw: rawMessage });
        return;
      }

      await this.notificationService.send({
        userId: payload.userId,
        type: 'payment.completed',
        templateName: 'payment-success',
        templateData: {
          orderId: payload.orderId,
          amount: payload.amount,
          currency: payload.currency || 'ZAR',
          paymentId: payload.paymentId,
          userEmail: payload.userEmail || payload.email,
        },
        title: 'Payment Successful',
        message: `Payment for order #${payload.orderId} was successful.`,
        channel: 'email',
      });

      logger.info('✅ Payment completed notification sent', {
        orderId: payload.orderId,
        userId: payload.userId,
      });

    } catch (error: any) {
      logger.error('❌ PaymentCompletedHandler failed', {
        error: error.message,
      });
    }
  }
}