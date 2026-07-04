// apps/payment-service/src/infrastructure/kafka/handlers/order-created.handler.ts

import { PaymentService } from '../../../application/services/payment.service';
import logger from '@org/shared-logger';

export class OrderCreatedHandler {
  constructor(
    private readonly paymentService: PaymentService
  ) {}

  async handle(message: any) {
    try {
      const order = message.data || message.payload || message;

      if (!order?.orderId || !order?.userId) {
        logger.warn('Invalid order data received', { orderId: order?.orderId });
        return;
      }

      logger.info('💰 Processing payment for new order', {
        orderId: order.orderId,
        userId: order.userId,
        totalAmount: order.totalAmount,
      });

      await this.paymentService.createPaymentFromOrder({
        orderId: order.orderId,
        userId: order.userId,
        amount: order.totalAmount,
        currency: order.currency || 'ZAR',
        items: order.items || [],
        correlationId: message.correlationId,
      });

      logger.info('✅ Payment initiated successfully', {
        orderId: order.orderId,
      });

    } catch (error: any) {
      logger.error('❌ OrderCreatedHandler failed', {
        orderId: message.data?.orderId,
        error: error.message,
      });
      throw error;
    }
  }
}