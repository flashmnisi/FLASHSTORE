// apps/inventory-service/src/infrastructure/kafka/handlers/payment-success.handler.ts

import { InventoryService } from '../../../application/services/inventory.service';
import logger from '@org/shared-logger';

export class PaymentSuccessHandler {
  constructor(private readonly inventoryService: InventoryService) {}

  async handle(event: any) {
    try {
      const payment = event.data;

      for (const item of payment.items) {
        await this.inventoryService.deductStock({
          productId: item.productId,
          warehouseId: payment.warehouseId,
          quantity: item.quantity,
          referenceId: payment.orderId,
        });
      }

      logger.info('Inventory deducted after payment', {
        orderId: payment.orderId,
      });
    } catch (error: any) {
      logger.error('PaymentSuccessHandler failed', {
        error: error.message,
      });

      throw error;
    }
  }
}
