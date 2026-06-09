// apps/order-service/src/infrastructure/kafka/handlers/payment-completed.handler.ts

import logger from '@org/shared-logger';
import { OrderService } from '../../../application/sevices/order.service';

export class PaymentCompletedHandler {
  constructor(private readonly orderService: OrderService) {}

  async handle(message: any) {
    try {
      const data = message.data || message.payload || message;

      await this.orderService.handlePaymentCompleted(data);

      logger.info('✅ Payment completed processed', {
        orderId: data.orderId,
        paymentId: data.paymentId,
      });
    } catch (error: any) {
      logger.error('❌ PaymentCompletedHandler failed', {
        orderId: message.data?.orderId,
        error: error.message,
      });
      throw error;
    }
  }
}