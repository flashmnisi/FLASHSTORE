// apps/inventory-service/src/infrastructure/kafka/handlers/order-created.handler.ts

import { ReservationService } from '../../../application/services/reservation.service';
import logger from '@org/shared-logger';
import { v4 as uuid } from 'uuid';

export class OrderCreatedHandler {
  constructor(private readonly reservationService: ReservationService) {}

  async handle(event: any) {
    try {
      const order = event.data;

      for (const item of order.items) {
        await this.reservationService.reserveStock({
          productId: item.productId,
          warehouseId: order.warehouseId,
          quantity: item.quantity,
          orderId: order.orderId,

          correlationId:
            event.correlationId || event.metadata?.correlationId || uuid(),

          referenceId: order.orderId,

          reason: 'Order reservation',
        });
      }

      logger.info('Stock reserved for order', {
        orderId: order.orderId,
      });
    } catch (error: any) {
      logger.error('OrderCreatedHandler failed', {
        error: error.message,
      });

      throw error;
    }
  }
}
