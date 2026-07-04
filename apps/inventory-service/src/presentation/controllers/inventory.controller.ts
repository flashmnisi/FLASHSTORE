// apps/inventory-service/src/presentation/controllers/inventory.controller.ts

import { Request, Response, NextFunction } from 'express';
import { InventoryService } from '../../application/services/inventory.service';
import { ReservationService } from '../../application/services/reservation.service';
import { StockAdjustmentService } from '../../application/services/stock-adjustment.service';
import { WarehouseService } from '../../application/services/warehouse.service';
import logger from '@org/shared-logger';

export class InventoryController {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly reservationService: ReservationService,
    private readonly stockAdjustmentService: StockAdjustmentService,
    private readonly warehouseService: WarehouseService
  ) {}

  /**
   * ======================================
   * GET INVENTORY
   * ======================================
   */
  getInventory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { productId } = req.params;

      const inventory = await this.inventoryService.getInventory(productId);

      res.status(200).json({
        success: true,
        data: inventory,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * ======================================
   * RESERVE STOCK
   * ======================================
   */
  reserveStock = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.reservationService.reserveStock(req.body);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * ======================================
   * RELEASE STOCK
   * ======================================
   */
  releaseStock = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.reservationService.releaseStock(req.body);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * ======================================
   * DEDUCT STOCK
   * ======================================
   */
  deductStock = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.stockAdjustmentService.adjustStock(req.body);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * ======================================
   * ADJUST STOCK
   * ======================================
   */
  adjustStock = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.stockAdjustmentService.adjustStock(req.body);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * ======================================
   * GET ALL WAREHOUSES
   * ======================================
   */
  getWarehouses = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const warehouses = await this.warehouseService.getAllWarehouses();

      res.status(200).json({
        success: true,
        count: warehouses.length,
        data: warehouses,
      });
    } catch (error: any) {
      logger.error('Failed to fetch warehouses', { error: error.message });
      next(error);
    }
  };
}
