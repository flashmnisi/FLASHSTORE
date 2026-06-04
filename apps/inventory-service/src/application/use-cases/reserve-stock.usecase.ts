// apps/inventory-service/src/application/use-cases/reserve-stock.usecase.ts

import { ReserveStockDto } from '../dtos/reserve-stock.dto';
import { IInventoryRepository } from '../interfaces/inventory.repository';
import { OutboxService } from '../../infrastructure/outbox/outbox.service';

import logger from '@org/shared-logger';
import { EVENTS, TOPICS } from '@org/shared-kafka';

export class ReserveStockUseCase {
  constructor(
    private readonly inventoryRepository: IInventoryRepository,
    private readonly outboxService: OutboxService
  ) {}

  async execute(dto: ReserveStockDto) {
    try {
      const inventory = await this.inventoryRepository.findByProductAndWarehouse(
        dto.productId,
        dto.warehouseId
      );

      if (!inventory) {
        throw new Error(`Inventory not found for product ${dto.productId}`);
      }

      inventory.reserve(dto.quantity);

      const updated = await this.inventoryRepository.update(inventory);

      await this.outboxService.write({
        topic: TOPICS.INVENTORY,
        event: EVENTS.STOCK_RESERVED,
        key: dto.productId,
        correlationId: dto.correlationId,
        data: {
          productId: dto.productId,
          warehouseId: dto.warehouseId,
          quantityReserved: dto.quantity,
          remainingAvailable: updated.availableStock,
          referenceId: dto.referenceId,
          reason: dto.reason || 'Order reservation',
        },
      });

      logger.info('📦 Stock reserved successfully', {
        productId: dto.productId,
        warehouseId: dto.warehouseId,
        quantity: dto.quantity,
      });

      return updated;
    } catch (error: any) {
      logger.error('❌ ReserveStockUseCase failed', {
        productId: dto.productId,
        quantity: dto.quantity,
        error: error.message,
      });
      throw error;
    }
  }
}