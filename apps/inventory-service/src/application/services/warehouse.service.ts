// apps/inventory-service/src/application/services/warehouse.service.ts

import { WarehouseEntity } from '../../domain/entities/warehouse.entity';
import { IWarehouseRepository } from '../interfaces/warehouse.repository';

import logger from '@org/shared-logger';

export class WarehouseService {
  constructor(private readonly warehouseRepository: IWarehouseRepository) {}

  async createWarehouse(data: {
    name: string;
    location: string;
    city?: string;
    country?: string;
    code?: string;
  }): Promise<WarehouseEntity> {
    try {
      const code = data.code || this.generateWarehouseCode(data.name);

      const warehouse = new WarehouseEntity(
        '',
        data.name,
        code,
        data.location,
        data.city || '',
        data.country || 'South Africa',
        true
      );

      const created = await this.warehouseRepository.create(warehouse);

      logger.info('🏬 Warehouse created successfully', {
        warehouseId: created.id,
        name: created.name,
        code: created.code,
      });

      return created;
    } catch (error: any) {
      logger.error('❌ Failed to create warehouse', {
        name: data.name,
        error: error.message,
      });
      throw error;
    }
  }

  async getWarehouse(id: string): Promise<WarehouseEntity | null> {
    return this.warehouseRepository.findById(id);
  }

  async getAllWarehouses(): Promise<WarehouseEntity[]> {
    return this.warehouseRepository.findAll();
  }

  async updateWarehouse(
    id: string,
    data: Partial<{
      name: string;
      location: string;
      city: string;
      country: string;
      active: boolean;
    }>
  ): Promise<WarehouseEntity> {
    try {
      const warehouse = await this.warehouseRepository.findById(id);
      if (!warehouse) {
        throw new Error('Warehouse not found');
      }

      warehouse.updateDetails({
        name: data.name,
        address: data.location,
        city: data.city,
        country: data.country,
      });

      if (data.active !== undefined) {
        data.active ? warehouse.activate() : warehouse.deactivate();
      }

      const updated = await this.warehouseRepository.update(warehouse);

      logger.info('🏬 Warehouse updated successfully', {
        warehouseId: id,
        name: updated.name,
      });

      return updated;
    } catch (error: any) {
      logger.error('❌ Failed to update warehouse', {
        warehouseId: id,
        error: error.message,
      });
      throw error;
    }
  }

  async deleteWarehouse(id: string): Promise<void> {
    try {
      await this.warehouseRepository.delete(id);

      logger.info('🗑️ Warehouse deleted', { warehouseId: id });
    } catch (error: any) {
      logger.error('❌ Failed to delete warehouse', {
        warehouseId: id,
        error: error.message,
      });
      throw error;
    }
  }

  private generateWarehouseCode(name: string): string {
    const prefix = name
      .substring(0, 3)
      .toUpperCase()
      .replace(/[^A-Z]/g, '');

    const random = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}${random}`;
  }
}
