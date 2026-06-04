// apps/inventory-service/src/container.ts

import logger from '@org/shared-logger';

// ====================== REPOSITORIES ======================
import { InventoryRepositoryImpl } from './infrastructure/persistance/repositories/inventory.repository.impl';
import { WarehouseRepositoryImpl } from './infrastructure/persistance/repositories/warehouse.repository.impl';
//import { OutboxRepositoryImpl } from './infrastructure/outbox/outbox.repository.impl';

// ====================== OUTBOX ======================
import { OutboxService } from './infrastructure/outbox/outbox.service';

// ====================== USE CASES ======================
import { ReserveStockUseCase } from './application/use-cases/reserve-stock.usecase';
import { ReleaseStockUseCase } from './application/use-cases/release-stock.usecase';

// ====================== SERVICES ======================
import { InventoryService } from './application/services/inventory.service';
import { WarehouseService } from './application/services/warehouse.service';
import { ReservationService } from './application/services/reservation.service';
import { StockAdjustmentService } from './application/services/stock-adjustment.service';
import { OutboxRepositoryImpl } from './infrastructure/persistance/repositories/outbox.repository.impl';

// ====================== REPOSITORY INSTANCES ======================
const inventoryRepository = new InventoryRepositoryImpl();
const warehouseRepository = new WarehouseRepositoryImpl();
const outboxRepository = new OutboxRepositoryImpl();

// ====================== OUTBOX ======================
export const outboxService = new OutboxService(outboxRepository);

// ====================== USE CASES ======================
const reserveStockUseCase = new ReserveStockUseCase(
  inventoryRepository,
  outboxService
);

const releaseStockUseCase = new ReleaseStockUseCase(
  inventoryRepository,
  outboxService
);

// ====================== SERVICES ======================
export const inventoryService = new InventoryService(
  inventoryRepository,
  outboxService
);

export const warehouseService = new WarehouseService(
  warehouseRepository,
  
);

export const reservationService = new ReservationService(
  reserveStockUseCase,     
  releaseStockUseCase       
);

export const stockAdjustmentService = new StockAdjustmentService(
  inventoryRepository,
  outboxService
);

logger.info('✅ Inventory Service Container initialized successfully');