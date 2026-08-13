// apps/inventory-service/src/application/services/inventory.service.ts

import { IInventoryRepository } from '../interfaces/inventory.repository';
import { OutboxService } from '../../infrastructure/outbox/outbox.service';
import logger from '@org/shared-logger';
import { EVENTS, TOPICS } from '@org/shared-kafka';
import {
  inventoryUpdatesTotal,
  inventoryProductsGauge,
  inventoryOutOfStockGauge,
  inventoryLowStockGauge,
} from '@org/shared-metrics';

const LOW_STOCK_THRESHOLD = 10;

export class InventoryService {
  constructor(
    private readonly inventoryRepository: IInventoryRepository,
    private readonly outboxService: OutboxService
  ) {}

  async getInventory(productId: string) {
    return this.inventoryRepository.findByProduct(productId);
  }

  async getInventoryByWarehouse(productId: string, warehouseId: string) {
    return this.inventoryRepository.findByProductAndWarehouse(
      productId,
      warehouseId
    );
  }

  async getLowStock(threshold = LOW_STOCK_THRESHOLD) {
    return this.inventoryRepository.findLowStock(threshold);
  }

  async deductStock(data: {
    productId: string;
    warehouseId: string;
    quantity: number;
    referenceId?: string;
    reason?: string;
  }) {
    try {
      const inventory =
        await this.inventoryRepository.findByProductAndWarehouse(
          data.productId,
          data.warehouseId
        );

      if (!inventory) {
        throw new Error(
          `Inventory record not found for product ${data.productId}`
        );
      }

      inventory.deduct(data.quantity);
      const updated = await this.inventoryRepository.update(inventory);

      inventoryUpdatesTotal.inc({
        service: 'inventory-service',
        operation: 'deduct',
      });

      // Refresh gauges if repository supports listing all records
      await this.refreshInventoryGauges();

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

  /**
   * Call after stock mutations. Requires repository.findAll() or similar.
   * If you don't have findAll yet, skip gauges and only use the counter.
   */
  private async refreshInventoryGauges() {
    try {
      // Adjust to your repository API, e.g. findAll() / listAll()
      const all =
        typeof (this.inventoryRepository as any).findAll === 'function'
          ? await (this.inventoryRepository as any).findAll()
          : null;

      if (!all || !Array.isArray(all)) {
        return;
      }

      const total = all.length;
      const outOfStock = all.filter(
        (i: any) => (i.availableStock ?? i.quantity ?? 0) <= 0
      ).length;
      const lowStock = all.filter((i: any) => {
        const stock = i.availableStock ?? i.quantity ?? 0;
        return stock > 0 && stock <= LOW_STOCK_THRESHOLD;
      }).length;

      inventoryProductsGauge.set({ service: 'inventory-service' }, total);
      inventoryOutOfStockGauge.set({ service: 'inventory-service' }, outOfStock);
      inventoryLowStockGauge.set({ service: 'inventory-service' }, lowStock);
    } catch (error: any) {
      logger.warn('Could not refresh inventory gauges', {
        error: error.message,
      });
    }
  }
}