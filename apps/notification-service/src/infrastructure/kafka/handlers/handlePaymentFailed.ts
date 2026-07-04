// apps/notification-service/src/infrastructure/kafka/handlers/handlePaymentFailed.ts

import { NotificationService } from '../../../application/services/notification.service';
import logger from '@org/shared-logger';

export class PaymentFailedHandler {
  constructor(private readonly notificationService: NotificationService) {}

  async handle(rawMessage: any) {
    try {
      // === ROBUST PAYLOAD NORMALIZATION ===
      const message = rawMessage?.data?.data || rawMessage?.data || rawMessage;
      const payload = message?.data || message;

      if (!payload?.userId) {
        logger.warn('⚠️ payment.failed missing userId', { raw: rawMessage });
        return;
      }

      await this.notificationService.send({
        userId: payload.userId,
        type: 'payment.failed',
        templateName: 'payment-failed',
        templateData: {
          orderId: payload.orderId,
          amount: payload.amount,
          currency: payload.currency || 'ZAR',
          paymentId: payload.paymentId,
          reason: payload.reason || 'Payment declined',
          userEmail: payload.userEmail || payload.email,
        },
        title: 'Payment Failed',
        message: `Payment for order #${payload.orderId} has failed. Please try again.`,
        channel: 'email',
      });

      logger.info('✅ Payment failed notification sent', {
        orderId: payload.orderId,
        userId: payload.userId,
      });
    } catch (error: any) {
      logger.error('❌ PaymentFailedHandler failed', {
        error: error.message,
      });
    }
  }
}
