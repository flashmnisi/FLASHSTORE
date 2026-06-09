// apps/order-service/src/infrastructure/kafka/handlers/payment-failed.handler.ts

import logger from '@org/shared-logger';
import { OrderService } from '../../../application/sevices/order.service';

export class PaymentFailedHandler {
  constructor(private readonly orderService: OrderService) {}

  async handle(message: any) {
    try {
      const data = message.data || message.payload || message;

      await this.orderService.handlePaymentFailed(data);

      logger.info('✅ Payment failed processed', {
        orderId: data.orderId,
      });
    } catch (error: any) {
      logger.error('❌ PaymentFailedHandler failed', {
        orderId: message.data?.orderId,
        error: error.message,
      });
      throw error;
    }
  }
}