// apps/analytics-service/src/infrastructure/kafka/handlers/inventory.handler.ts

import logger from '@org/shared-logger';
import { EVENTS } from '@org/shared-kafka';

export class InventoryHandler {
  async handle(message: any) {
    try {
      const eventType =
        message.event ||
        message.type;

      const data =
        message.data ||
        message.payload ||
        {};

      switch (eventType) {

        case EVENTS.STOCK_ADJUSTED:
        case EVENTS.STOCK_DEDUCTED:
        case EVENTS.STOCK_RESERVED:
        case EVENTS.STOCK_RELEASED:

          logger.info('📦 Inventory event tracked', {
            eventType,
            productId: data.productId,
            warehouseId: data.warehouseId,
            quantity:
              data.quantity ||
              data.stockQuantity ||
              data.adjustment ||
              data.remainingStock,
          });

          break;

        default:

          logger.warn('⚠️ Unknown inventory event received', {
            eventType,
            productId: data.productId,
          });
      }

    } catch (error: any) {

      logger.error('❌ Error in InventoryHandler', {
        eventType: message?.event,
        error: error.message,
      });
    }
  }
}