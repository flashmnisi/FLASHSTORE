// apps/inventory-service/src/application/services/stock-adjustment.service.ts

import { IInventoryRepository } from '../interfaces/inventory.repository';
import { OutboxService } from '../../infrastructure/outbox/outbox.service';

import logger from '@org/shared-logger';
import { EVENTS, TOPICS } from '@org/shared-kafka';

export class StockAdjustmentService {
  constructor(
    private readonly inventoryRepository: IInventoryRepository,
    private readonly outboxService: OutboxService
  ) {}

  /**
   * Adjust stock (Add or Subtract)
   */
  async adjustStock(data: {
    productId: string;
    warehouseId: string;
    quantity: number;           // Positive = add, Negative = subtract
    reason?: string;
    referenceId?: string;
  }) {
    try {
      const inventory = await this.inventoryRepository.findByProductAndWarehouse(
        data.productId,
        data.warehouseId
      );

      if (!inventory) {
        throw new Error(`Inventory record not found for product ${data.productId}`);
      }

      const previousStock = inventory.quantity;

      // Adjust stock
      if (data.quantity > 0) {
        inventory.addStock(data.quantity);
      } else {
        inventory.deduct(Math.abs(data.quantity));
      }

      const updatedInventory = await this.inventoryRepository.update(inventory);

      // Publish to Outbox
      await this.outboxService.write({
        topic: TOPICS.INVENTORY,
        event: EVENTS.STOCK_ADJUSTED,
        key: data.productId,
        correlationId: data.referenceId,
        data: {
          productId: data.productId,
          warehouseId: data.warehouseId,
          adjustment: data.quantity,
          previousStock,
          newStock: updatedInventory.quantity,
          availableStock: updatedInventory.availableStock,
          reason: data.reason || 'Manual adjustment',
          referenceId: data.referenceId,
          timestamp: new Date().toISOString(),
        },
      });

      logger.info('📊 Stock adjustment completed and queued', {
        productId: data.productId,
        warehouseId: data.warehouseId,
        adjustment: data.quantity,
        newStock: updatedInventory.quantity,
      });

      return updatedInventory;
    } catch (error: any) {
      logger.error('❌ Stock adjustment failed', {
        productId: data.productId,
        quantity: data.quantity,
        error: error.message,
      });
      throw error;
    }
  }
}