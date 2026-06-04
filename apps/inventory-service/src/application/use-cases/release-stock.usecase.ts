// apps/inventory-service/src/application/use-cases/release-stock.usecase.ts

import { ReleaseStockDto } from '../dtos/release-stock.dto';
import { IInventoryRepository } from '../interfaces/inventory.repository';
import { OutboxService } from '../../infrastructure/outbox/outbox.service';

import logger from '@org/shared-logger';
import { EVENTS, TOPICS } from '@org/shared-kafka';

export class ReleaseStockUseCase {
  constructor(
    private readonly inventoryRepository: IInventoryRepository,
    private readonly outboxService: OutboxService
  ) {}

  async execute(dto: ReleaseStockDto) {
    try {
      const inventory = await this.inventoryRepository.findByProductAndWarehouse(
        dto.productId,
        dto.warehouseId
      );

      if (!inventory) {
        throw new Error(`Inventory not found for product ${dto.productId}`);
      }

      inventory.release(dto.quantity);

      const updated = await this.inventoryRepository.update(inventory);

      await this.outboxService.write({
        topic: TOPICS.INVENTORY,
        event: EVENTS.STOCK_RELEASED,
        key: dto.productId,
        correlationId: dto.correlationId,
        data: {
          productId: dto.productId,
          warehouseId: dto.warehouseId,
          quantityReleased: dto.quantity,
          remainingAvailable: updated.availableStock,
          referenceId: dto.referenceId,
          reason: dto.reason || 'Order cancellation / release',
        },
      });

      logger.info('📦 Stock released successfully', {
        productId: dto.productId,
        warehouseId: dto.warehouseId,
        quantity: dto.quantity,
      });

      return updated;
    } catch (error: any) {
      logger.error('❌ ReleaseStockUseCase failed', {
        productId: dto.productId,
        quantity: dto.quantity,
        error: error.message,
      });
      throw error;
    }
  }
}