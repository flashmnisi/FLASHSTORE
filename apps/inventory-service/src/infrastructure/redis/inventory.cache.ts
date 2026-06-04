// apps/inventory-service/src/infrastructure/redis/inventory.cache.ts

import { createClient } from 'redis';
import logger from '@org/shared-logger';

export class InventoryCache {
  private client = createClient({
    url: process.env.REDIS_URL,
  });

  constructor() {
    this.client.on('error', (err) => {
      logger.error('❌ Redis Client Error', { error: err.message });
    });
  }

  async connect() {
    if (!this.client.isOpen) {
      await this.client.connect();
      logger.info('✅ Redis connected (Inventory Cache)');
    }
  }

  /**
   * ==========================
   * STOCK CACHE KEY
   * ==========================
   */
  private stockKey(productId: string, warehouseId: string) {
    return `inventory:stock:${productId}:${warehouseId}`;
  }

  /**
   * Cache stock
   */
  async setStock(
    productId: string,
    warehouseId: string,
    quantity: number,
    ttl = 60
  ) {
    const key = this.stockKey(productId, warehouseId);

    await this.client.setEx(key, ttl, JSON.stringify({ quantity }));

    logger.info('📦 Stock cached', {
      productId,
      warehouseId,
      quantity,
    });
  }

  /**
   * Get cached stock
   */
  async getStock(
    productId: string,
    warehouseId: string
  ): Promise<number | null> {
    const key = this.stockKey(productId, warehouseId);

    const data = await this.client.get(key);

    if (!data) return null;

    return JSON.parse(data).quantity;
  }

  /**
   * Invalidate cache
   */
  async invalidateStock(
    productId: string,
    warehouseId: string
  ) {
    const key = this.stockKey(productId, warehouseId);

    await this.client.del(key);

    logger.info('🧹 Stock cache invalidated', {
      productId,
      warehouseId,
    });
  }

  /**
   * ==========================
   * RESERVATION LOCK (important for saga)
   * ==========================
   */
  async lockReservation(
    productId: string,
    warehouseId: string,
    orderId: string,
    ttl = 30
  ) {
    const key = `inventory:lock:${productId}:${warehouseId}`;

    const result = await this.client.set(
      key,
      orderId,
      {
        NX: true, // only set if not exists
        EX: ttl,  // auto-expire lock
      }
    );

    return result === 'OK';
  }

  async releaseReservationLock(
    productId: string,
    warehouseId: string
  ) {
    const key = `inventory:lock:${productId}:${warehouseId}`;

    await this.client.del(key);
  }
}