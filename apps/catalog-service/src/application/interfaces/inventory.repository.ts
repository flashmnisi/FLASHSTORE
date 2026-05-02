// apps/catalog-service/src/domain/repositories/inventory.repository.ts

import { InventoryEntity } from "../../domain/entities/inventory.entity";

export interface IInventoryRepository {
  findByProductId(productId: string): Promise<InventoryEntity | null>;
  create(inventory: InventoryEntity): Promise<InventoryEntity>;
  update(productId: string, inventory: Partial<InventoryEntity>): Promise<InventoryEntity | null>;
  increaseStock(productId: string, quantity: number): Promise<InventoryEntity | null>;
  decreaseStock(productId: string, quantity: number): Promise<InventoryEntity | null>;
  reserveStock(productId: string, quantity: number): Promise<InventoryEntity | null>;
  releaseReservation(productId: string, quantity: number): Promise<InventoryEntity | null>;
}