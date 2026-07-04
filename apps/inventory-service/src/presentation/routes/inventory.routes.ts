// apps/inventory-service/src/presentation/routes/inventory.routes.ts

import { Router } from 'express';

import { InventoryController } from '../controllers/inventory.controller';

import { OutboxService } from '../../infrastructure/outbox/outbox.service';

import { InventoryService } from '../../application/services/inventory.service';
import { ReservationService } from '../../application/services/reservation.service';
import { StockAdjustmentService } from '../../application/services/stock-adjustment.service';
import { WarehouseService } from '../../application/services/warehouse.service';

import { InventoryRepositoryImpl } from '../../infrastructure/persistance/repositories/inventory.repository.impl';
import { WarehouseRepositoryImpl } from '../../infrastructure/persistance/repositories/warehouse.repository.impl';
import { OutboxRepository } from '../../infrastructure/outbox/outbox.repository.impl';
import { ReleaseStockUseCase } from '../../application/use-cases/release-stock.usecase';
import { ReserveStockUseCase } from '../../application/use-cases/reserve-stock.usecase';

const router = Router();

/**
 * =====================================
 * REPOSITORIES
 * =====================================
 */
const inventoryRepository = new InventoryRepositoryImpl();

const warehouseRepository = new WarehouseRepositoryImpl();

const outboxRepository = new OutboxRepository();

const outboxService = new OutboxService(outboxRepository);

/**
 * =====================================
 * USE CASES
 * =====================================
 */

const reserveStockUseCase = new ReserveStockUseCase(
  inventoryRepository,
  outboxService
);

const releaseStockUseCase = new ReleaseStockUseCase(
  inventoryRepository,
  outboxService
);

/**
 * =====================================
 * SERVICES
 * =====================================
 */

const inventoryService = new InventoryService(
  inventoryRepository,
  outboxService
);

const reservationService = new ReservationService(
  reserveStockUseCase,
  releaseStockUseCase
);

const stockAdjustmentService = new StockAdjustmentService(
  inventoryRepository,
  outboxService
);

const warehouseService = new WarehouseService(warehouseRepository);

/**
 * =====================================
 * CONTROLLER
 * =====================================
 */
const controller = new InventoryController(
  inventoryService,
  reservationService,
  stockAdjustmentService,
  warehouseService
);

/**
 * =====================================
 * ROUTES
 * =====================================
 */

router.get('/product/:productId', controller.getInventory);

router.post('/reserve', controller.reserveStock);

router.post('/release', controller.releaseStock);

router.post('/deduct', controller.deductStock);

router.post('/adjust', controller.adjustStock);

router.get('/warehouses', controller.getWarehouses);

export default router;
