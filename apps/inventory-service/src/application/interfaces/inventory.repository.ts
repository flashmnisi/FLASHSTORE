// apps/inventory-service/src/application/interfaces/inventory.repository.ts

import { InventoryEntity } from '../../domain/entities/inventory.entity';

export interface IInventoryRepository {
  /**
   * Create inventory record
   */
  create(
    inventory: InventoryEntity
  ): Promise<InventoryEntity>;

  /**
   * Find by inventory id
   */
  findById(
    id: string
  ): Promise<InventoryEntity | null>;

  /**
   * Find inventory by product + warehouse
   */
  findByProductAndWarehouse(
    productId: string,
    warehouseId: string
  ): Promise<InventoryEntity | null>;

  /**
   * Find all inventory for a product
   */
  findByProduct(
    productId: string
  ): Promise<InventoryEntity[]>;

  /**
   * Find all inventory records
   */
  findAll(): Promise<InventoryEntity[]>;

  /**
   * Update inventory
   */
  update(
    inventory: InventoryEntity
  ): Promise<InventoryEntity>;

  /**
   * Delete inventory
   */
  delete(
    id: string
  ): Promise<void>;

  findLowStock(threshold: number): Promise<InventoryEntity[]>;
    adjustStock(
    productId: string,
    quantity: number
  ): Promise<InventoryEntity>;

  deductStock(
    productId: string,
    quantity: number
  ): Promise<InventoryEntity>;

  reserveStock(
    productId: string,
    quantity: number
  ): Promise<InventoryEntity>;

  releaseStock(
    productId: string,
    quantity: number
  ): Promise<InventoryEntity>;
}