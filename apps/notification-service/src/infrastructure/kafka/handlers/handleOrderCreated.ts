// apps/notification-service/src/infrastructure/kafka/handlers/handleOrderCreated.ts

import { NotificationService } from '../../../application/services/notification.service';
import logger from '@org/shared-logger';

export class OrderCreatedHandler {
  constructor(private readonly notificationService: NotificationService) {}

  async handle(rawMessage: any) {
    try {
      // Robust message extraction
      const envelope =
        rawMessage?.payload?.event ||
        rawMessage?.data?.event ||
        rawMessage?.event ||
        rawMessage;

      const order = envelope?.data?.data || envelope?.data || envelope;

      if (!order?.orderId || !order?.userId) {
        logger.warn('⚠️ order.created missing required fields', {
          orderId: order?.orderId,
          userId: order?.userId,
        });
        return;
      }

      // Extract email with multiple fallbacks
      const email =
        order.userEmail ||
        order.email ||
        order.shippingAddress?.email ||
        order.recipient?.email;

      const customerName =
        order.customerName ||
        order.shippingAddress?.name ||
        order.name ||
        'Customer';

      if (!email) {
        logger.error('❌ order.created missing recipient email', {
          orderId: order.orderId,
          userId: order.userId,
          availableFields: Object.keys(order),
          shippingAddress: order.shippingAddress,
        });
        return;
      }

      await this.notificationService.send({
        userId: order.userId,
        type: 'order.created',
        templateName: 'order-confirmation',
        templateData: {
          orderId: order.orderId,
          email: email,
          name: customerName,
          items: order.items || [],
          totalAmount: order.totalAmount,
          currency: order.currency || 'ZAR',
        },
        title: `Order #${order.orderId} Confirmed`,
        message: `Your order has been placed successfully.`,
        channel: 'email',
      });

      logger.info('✅ Order created notification sent', {
        orderId: order.orderId,
        userId: order.userId,
        email,
      });
    } catch (error: any) {
      logger.error('❌ OrderCreatedHandler failed', {
        error: error.message,
        orderId: rawMessage?.data?.orderId,
      });
    }
  }
}
