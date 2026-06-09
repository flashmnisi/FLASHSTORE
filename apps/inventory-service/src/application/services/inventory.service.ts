// apps/inventory-service/src/application/services/inventory.service.ts

import { IInventoryRepository } from '../interfaces/inventory.repository';
import { OutboxService } from '../../infrastructure/outbox/outbox.service';

import logger from '@org/shared-logger';
import { EVENTS, TOPICS } from '@org/shared-kafka';

export class InventoryService {
  constructor(
    private readonly inventoryRepository: IInventoryRepository,
    private readonly outboxService: OutboxService    
  ) {}

  async getInventory(productId: string) {
    return this.inventoryRepository.findByProduct(productId);
  }

  async getInventoryByWarehouse(productId: string, warehouseId: string) {
    return this.inventoryRepository.findByProductAndWarehouse(productId, warehouseId);
  }

  async getLowStock(threshold = 10) {
    return this.inventoryRepository.findLowStock(threshold);
  }

  /**
   * Deduct stock after successful payment/order
   */
  async deductStock(data: {
    productId: string;
    warehouseId: string;
    quantity: number;
    referenceId?: string;
    reason?: string;
  }) {
    try {
      const inventory = await this.inventoryRepository.findByProductAndWarehouse(
        data.productId,
        data.warehouseId
      );

      if (!inventory) {
        throw new Error(`Inventory record not found for product ${data.productId}`);
      }

      inventory.deduct(data.quantity);

      const updated = await this.inventoryRepository.update(inventory);

      // Publish to Outbox
      await this.outboxService.write({
        topic: TOPICS.INVENTORY,
        event: EVENTS.STOCK_DEDUCTED,
        key: data.productId,
        correlationId: data.referenceId,
        data: {
          productId: data.productId,
          warehouseId: data.warehouseId,
          quantityDeducted: data.quantity,
          remainingStock: updated.availableStock,
          referenceId: data.referenceId,
          reason: data.reason || 'Order fulfillment',
        },
      });

      logger.info('📦 Stock deducted successfully and queued in outbox', {
        productId: data.productId,
        warehouseId: data.warehouseId,
        quantity: data.quantity,
        remainingStock: updated.availableStock,
      });

      return updated;
    } catch (error: any) {
      logger.error('Failed to deduct stock', {
        productId: data.productId,
        error: error.message,
      });
      throw error;
    }
  }
}