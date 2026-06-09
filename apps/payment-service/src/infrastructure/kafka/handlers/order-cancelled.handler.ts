// apps/payment-service/src/infrastructure/kafka/handlers/order-cancelled.handler.ts

import { PaymentService } from '../../../application/services/payment.service';
import logger from '@org/shared-logger';

export class OrderCancelledHandler {
  constructor(
    private readonly paymentService: PaymentService
  ) {}

  async handle(message: any) {
    try {
      const order = message.data || message.payload || message;

      if (!order?.orderId) {
        logger.warn('Invalid order cancellation data');
        return;
      }

      logger.info('🔄 Processing order cancellation', {
        orderId: order.orderId,
      });

      await this.paymentService.handleOrderCancelled(order.orderId);

      logger.info('✅ Order cancellation processed', {
        orderId: order.orderId,
      });

    } catch (error: any) {
      logger.error('❌ OrderCancelledHandler failed', {
        orderId: message.data?.orderId,
        error: error.message,
      });
      throw error;
    }
  }
}