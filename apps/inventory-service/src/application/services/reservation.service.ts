// apps/inventory-service/src/application/services/reservation.service.ts

import { ReserveStockUseCase } from '../use-cases/reserve-stock.usecase';
import { ReleaseStockUseCase } from '../use-cases/release-stock.usecase';

import { ReserveStockDto } from '../dtos/reserve-stock.dto';
import { ReleaseStockDto } from '../dtos/release-stock.dto';

import logger from '@org/shared-logger';

export class ReservationService {
  constructor(
    private readonly reserveStockUseCase: ReserveStockUseCase,
    private readonly releaseStockUseCase: ReleaseStockUseCase
  ) {}

  async reserveStock(dto: ReserveStockDto) {
    try {
      const result = await this.reserveStockUseCase.execute(dto);

      logger.info('✅ Stock reserved successfully', {
        productId: dto.productId,
        warehouseId: dto.warehouseId,
        quantity: dto.quantity,
        referenceId: dto.referenceId,
      });

      return result;
    } catch (error: any) {
      logger.error('❌ Failed to reserve stock', {
        productId: dto.productId,
        quantity: dto.quantity,
        error: error.message,
      });
      throw error;
    }
  }

  async releaseStock(dto: ReleaseStockDto) {
    try {
      const result = await this.releaseStockUseCase.execute(dto);

      logger.info('✅ Stock released successfully', {
        productId: dto.productId,
        warehouseId: dto.warehouseId,
        quantity: dto.quantity,
        referenceId: dto.referenceId,
      });

      return result;
    } catch (error: any) {
      logger.error('❌ Failed to release stock', {
        productId: dto.productId,
        quantity: dto.quantity,
        error: error.message,
      });
      throw error;
    }
  }
}