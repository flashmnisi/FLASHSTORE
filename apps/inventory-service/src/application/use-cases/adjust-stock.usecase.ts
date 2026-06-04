// apps/inventory-service/src/application/use-cases/adjust-stock.usecase.ts

import { EVENTS, TOPICS } from '@org/shared-kafka';
import logger from '@org/shared-logger';
import { v4 as uuid } from 'uuid';

import { IInventoryRepository } from '../interfaces/inventory.repository';
import { OutboxService } from '../../infrastructure/outbox/outbox.service';

export class AdjustStockUseCase {
  constructor(
    private readonly inventoryRepository: IInventoryRepository,
    private readonly outboxService: OutboxService
  ) {}

  async execute(productId: string, quantity: number, reason?: string) {
    try {
      const inventory = await this.inventoryRepository.adjustStock(
        productId,
        quantity
      );

      // Send to Outbox (Correct format)
      await this.outboxService.write({
        topic: TOPICS.INVENTORY,
        event: EVENTS.STOCK_ADJUSTED,
        key: productId,
        correlationId: uuid(),
        data: {
          productId,
          quantity,
          availableStock: inventory.availableStock,
          reservedStock: inventory.reserved || 0,
          reason: reason || 'Manual adjustment',
          timestamp: new Date().toISOString(),
        },
      });

      logger.info('📦 Stock adjusted successfully and queued in outbox', {
        productId,
        quantity,
        availableStock: inventory.availableStock,
      });

      return inventory;
    } catch (error: any) {
      logger.error('❌ AdjustStockUseCase failed', {
        productId,
        quantity,
        error: error.message,
      });
      throw error;
    }
  }
}