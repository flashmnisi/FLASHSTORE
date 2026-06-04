// apps/inventory-service/src/infrastructure/persistence/repositories/warehouse.repository.impl.ts

import { WarehouseEntity } from '../../../domain/entities/warehouse.entity';
import { IWarehouseRepository } from '../../../application/interfaces/warehouse.repository';
import { WarehouseModel } from '../models/warehouse.model';

export class WarehouseRepositoryImpl implements IWarehouseRepository {
  private toEntity(doc: any): WarehouseEntity {
    return new WarehouseEntity(
      doc._id?.toString(),
      doc.name,
      doc.code,
      doc.address,
      doc.city,
      doc.country,
      doc.isActive ?? true,
      doc.createdAt,
      doc.updatedAt
    );
  }

  async create(warehouse: WarehouseEntity): Promise<WarehouseEntity> {
    const doc = await WarehouseModel.create({
      name: warehouse.name,
      code: warehouse.code,
      address: warehouse.address,
      city: warehouse.city,
      country: warehouse.country,
      isActive: warehouse.isActive,
    });

    return this.toEntity(doc);
  }

  async findById(id: string): Promise<WarehouseEntity | null> {
    const doc = await WarehouseModel.findById(id);
    return doc ? this.toEntity(doc) : null;
  }

  async findByCode(code: string): Promise<WarehouseEntity | null> {
    const doc = await WarehouseModel.findOne({ code });
    return doc ? this.toEntity(doc) : null;
  }

  async findAll(): Promise<WarehouseEntity[]> {
    const docs = await WarehouseModel.find().sort({ createdAt: -1 });
    return docs.map((doc) => this.toEntity(doc));
  }

  async update(warehouse: WarehouseEntity): Promise<WarehouseEntity> {
    const doc = await WarehouseModel.findByIdAndUpdate(
      warehouse.id,
      {
        name: warehouse.name,
        code: warehouse.code,
        address: warehouse.address,
        city: warehouse.city,
        country: warehouse.country,
        isActive: warehouse.isActive,
      },
      { new: true }
    );

    if (!doc) {
      throw new Error('Warehouse not found');
    }

    return this.toEntity(doc);
  }

  async delete(id: string): Promise<void> {
    const result = await WarehouseModel.findByIdAndDelete(id);
    if (!result) {
      throw new Error('Warehouse not found');
    }
  }
}