// apps/payment-service/src/infrastructure/kafka/handlers/order-completed.handler.ts

import { PaymentService } from '../../../application/services/payment.service';
import logger from '@org/shared-logger';

export class OrderCompletedHandler {
  constructor(
    private readonly paymentService: PaymentService
  ) {}

  async handle(message: any) {
    try {
      const order = message.data || message.payload || message;

      if (!order?.orderId) {
        logger.warn('Invalid order completed data');
        return;
      }

      logger.info('🎉 Processing order completion', {
        orderId: order.orderId,
      });

      await this.paymentService.handleOrderCompleted(order.orderId);

      logger.info('✅ Order completion processed successfully', {
        orderId: order.orderId,
      });

    } catch (error: any) {
      logger.error('❌ OrderCompletedHandler failed', {
        orderId: message.data?.orderId,
        error: error.message,
      });
      throw error;
    }
  }
}