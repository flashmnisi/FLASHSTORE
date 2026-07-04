// apps/inventory-service/src/application/use-cases/deduct-stock.usecase.ts

import { DeductStockDto } from '../dtos/deduct-stock.dto';
import { IInventoryRepository } from '../interfaces/inventory.repository';
import { OutboxService } from '../../infrastructure/outbox/outbox.service';

import logger from '@org/shared-logger';
import { EVENTS, TOPICS } from '@org/shared-kafka';

export class DeductStockUseCase {
  constructor(
    private readonly inventoryRepository: IInventoryRepository,
    private readonly outboxService: OutboxService   // ← Added
  ) {}

  async execute(dto: DeductStockDto) {
    try {
      const inventory = await this.inventoryRepository.findByProductAndWarehouse(
        dto.productId,
        dto.warehouseId
      );

      if (!inventory) {
        throw new Error(`Inventory record not found for product ${dto.productId}`);
      }

      // Deduct stock using entity method
      inventory.deduct(dto.quantity);

      // Save updated inventory
      const updatedInventory = await this.inventoryRepository.update(inventory);

      // Publish event to Outbox
      await this.outboxService.write({
        topic: TOPICS.INVENTORY,
        event: EVENTS.STOCK_DEDUCTED,           
        key: dto.productId,
        correlationId: dto.correlationId,
        data: {
          productId: dto.productId,
          warehouseId: dto.warehouseId,
          quantityDeducted: dto.quantity,
          remainingStock: updatedInventory.availableStock,
          referenceId: dto.referenceId,
          reason: dto.reason || 'Order fulfillment',
        },
      });

      logger.info('📦 Stock deducted successfully', {
        productId: dto.productId,
        warehouseId: dto.warehouseId,
        quantity: dto.quantity,
        remaining: updatedInventory.availableStock,
      });

      return updatedInventory;
    } catch (error: any) {
      logger.error('❌ DeductStockUseCase failed', {
        productId: dto.productId,
        warehouseId: dto.warehouseId,
        quantity: dto.quantity,
        error: error.message,
      });
      throw error;
    }
  }
}