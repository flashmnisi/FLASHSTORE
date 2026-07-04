// apps/inventory-service/src/infrastructure/persistence/repositories/inventory.repository.impl.ts

import { InventoryEntity } from '../../../domain/entities/inventory.entity';
import { IInventoryRepository } from '../../../application/interfaces/inventory.repository';
import { InventoryModel } from '../models/inventory.model';

export class InventoryRepositoryImpl implements IInventoryRepository {
  private toEntity(doc: any): InventoryEntity {
    return new InventoryEntity(
      doc._id?.toString(),
      doc.productId,
      doc.warehouseId,
      doc.quantity,
      doc.reserved,
      doc.lastUpdated
    );
  }

  // ====================== EXISTING METHODS ======================

  async create(inventory: InventoryEntity): Promise<InventoryEntity> {
    const doc = await InventoryModel.create({
      productId: inventory.productId,
      warehouseId: inventory.warehouseId,
      quantity: inventory.quantity,
      reserved: inventory.reserved,
      lastUpdated: inventory.lastUpdated,
    });

    return this.toEntity(doc);
  }

  async findById(id: string): Promise<InventoryEntity | null> {
    const doc = await InventoryModel.findById(id);
    return doc ? this.toEntity(doc) : null;
  }

  async findByProductAndWarehouse(
    productId: string,
    warehouseId: string
  ): Promise<InventoryEntity | null> {
    const doc = await InventoryModel.findOne({ productId, warehouseId });
    return doc ? this.toEntity(doc) : null;
  }

  async findByProduct(productId: string): Promise<InventoryEntity[]> {
    const docs = await InventoryModel.find({ productId });
    return docs.map((doc) => this.toEntity(doc));
  }

  async findAll(): Promise<InventoryEntity[]> {
    const docs = await InventoryModel.find();
    return docs.map((doc) => this.toEntity(doc));
  }

  async findLowStock(threshold: number = 10): Promise<InventoryEntity[]> {
    const docs = await InventoryModel.find({
      $expr: { $lt: ['$quantity', threshold] },
    }).sort({ quantity: 1 });

    return docs.map((doc) => this.toEntity(doc));
  }

  async update(inventory: InventoryEntity): Promise<InventoryEntity> {
    const doc = await InventoryModel.findByIdAndUpdate(
      inventory.id,
      {
        quantity: inventory.quantity,
        reserved: inventory.reserved,
        lastUpdated: inventory.lastUpdated,
      },
      { new: true }
    );

    if (!doc) throw new Error('Inventory not found');

    return this.toEntity(doc);
  }

  async delete(id: string): Promise<void> {
    await InventoryModel.findByIdAndDelete(id);
  }

  // ====================== NEW METHODS (Added) ======================

  async adjustStock(
    productId: string,
    quantity: number
  ): Promise<InventoryEntity> {
    const inventory = await this.findByProductAndWarehouse(
      productId,
      'default'
    ); // Adjust as needed
    if (!inventory) throw new Error('Inventory not found');

    inventory.quantity += quantity;
    inventory.lastUpdated = new Date();

    return this.update(inventory);
  }

  async deductStock(
    productId: string,
    quantity: number
  ): Promise<InventoryEntity> {
    const inventory = await this.findByProductAndWarehouse(
      productId,
      'default'
    );
    if (!inventory) throw new Error('Inventory not found');

    inventory.deduct(quantity);
    return this.update(inventory);
  }

  async reserveStock(
    productId: string,
    quantity: number
  ): Promise<InventoryEntity> {
    const inventory = await this.findByProductAndWarehouse(
      productId,
      'default'
    );
    if (!inventory) throw new Error('Inventory not found');

    inventory.reserve(quantity);
    return this.update(inventory);
  }

  async releaseStock(
    productId: string,
    quantity: number
  ): Promise<InventoryEntity> {
    const inventory = await this.findByProductAndWarehouse(
      productId,
      'default'
    );
    if (!inventory) throw new Error('Inventory not found');

    inventory.release(quantity);
    return this.update(inventory);
  }
}
