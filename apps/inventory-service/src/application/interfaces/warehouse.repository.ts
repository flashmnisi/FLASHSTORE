// apps/inventory-service/src/application/interfaces/warehouse.repository.ts

import { WarehouseEntity } from '../../domain/entities/warehouse.entity';

export interface IWarehouseRepository {
  /**
   * Create warehouse
   */
  create(
    warehouse: WarehouseEntity
  ): Promise<WarehouseEntity>;

  /**
   * Find warehouse by id
   */
  findById(
    id: string
  ): Promise<WarehouseEntity | null>;

  /**
   * Find warehouse by code
   */
  findByCode(
    code: string
  ): Promise<WarehouseEntity | null>;

  /**
   * Get all warehouses
   */
  findAll(): Promise<WarehouseEntity[]>;

  /**
   * Update warehouse
   */
  update(
    warehouse: WarehouseEntity
  ): Promise<WarehouseEntity>;

  /**
   * Delete warehouse
   */
  delete(
    id: string
  ): Promise<void>;
}