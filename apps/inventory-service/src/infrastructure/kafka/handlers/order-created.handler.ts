// apps/inventory-service/src/infrastructure/kafka/handlers/order-created.handler.ts

import { ReservationService } from '../../../application/services/reservation.service';
import logger from '@org/shared-logger';

export class OrderCreatedHandler {
  constructor(private readonly reservationService: ReservationService) {}

  async handle(event: any) {
    try {
      const order = event.data;

      if (!order?.items?.length) {
        logger.warn('Order has no items, skipping reservation', {
          orderId: order?.orderId,
        });
        return;
      }

      logger.info('🔄 Reserving stock for order', {
        orderId: order.orderId,
        itemCount: order.items.length,
      });

      for (const item of order.items) {
        await this.reservationService.reserveStock({
          productId: item.productId,
          warehouseId: order.warehouseId || 'default',
          quantity: item.quantity,

          orderId: order.orderId,

          correlationId: event.correlationId || event.metadata?.correlationId,

          referenceId: order.orderId,

          reason: `Order ${order.orderId}`,
        });
      }

      logger.info('✅ Stock reserved successfully for order', {
        orderId: order.orderId,
        totalItems: order.items.length,
      });
    } catch (error: any) {
      logger.error('❌ OrderCreatedHandler failed', {
        orderId: event.data?.orderId,
        error: error.message,
      });

      throw error; 
    }
  }
}
