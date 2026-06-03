// apps/cart-service/src/infrastructure/cache/redis-cart-cache.repository.ts

import { ICartCacheRepository } from '../../application/interfaces/cart-cache.repository';
import { CartEntity } from '../../domain/entities/cart.entity';
import { CartItemEntity } from '../../domain/entities/cart-item.entity';
import { getRedis } from '@org/shared-redis';

export class RedisCartCacheRepository implements ICartCacheRepository {
  private redisClient: any = null;
  private readonly TTL = 3600; // 1 hour

  private async getClient() {
    if (!this.redisClient) {
      this.redisClient = await getRedis();
    }
    return this.redisClient;
  }

  async save(cart: CartEntity): Promise<void> {
    const client = await this.getClient();
    const key = `cart:${cart.userId}`;

    await client.set(
      key,
      JSON.stringify(cart),
      'EX',
      this.TTL
    );
  }

  async get(userId: string): Promise<CartEntity | null> {
    const client = await this.getClient();
    const key = `cart:${userId}`;

    const data = await client.get(key);

    if (!data) return null;

    const parsed = JSON.parse(data);

    const items = (parsed.items || []).map(
      (item: any) =>
        new CartItemEntity(
          item.productId,
          item.quantity,
          item.price,
          item.name || '',
          item.image
        )
    );

    return new CartEntity(
      parsed.id,
      parsed.userId,
      items,
      new Date(parsed.createdAt),
      new Date(parsed.updatedAt)
    );
  }

  async delete(userId: string): Promise<void> {
    const client = await this.getClient();
    await client.del(`cart:${userId}`);
  }

  async saveIdempotencyResult(
    key: string,
    result: any,
    ttl: number = this.TTL
  ): Promise<void> {
    const client = await this.getClient();
    await client.set(
      `idempotency:${key}`,
      JSON.stringify(result),
      'EX',
      ttl
    );
  }

  async getIdempotencyResult(key: string): Promise<any | null> {
    const client = await this.getClient();
    const data = await client.get(`idempotency:${key}`);

    if (!data) return null;

    return JSON.parse(data);
  }

    // =========================
  // CART SNAPSHOTS
  // =========================

  async saveSnapshot(
    orderId: string,
    cart: CartEntity
  ): Promise<void> {

    const client =
      await this.getClient();

    await client.set(
      `cart:snapshot:${orderId}`,
      JSON.stringify(cart),
      'EX',
      this.TTL
    );
  }

  async getSnapshot(
    orderId: string
  ): Promise<CartEntity | null> {

    const client =
      await this.getClient();

    const data =
      await client.get(
        `cart:snapshot:${orderId}`
      );

    if (!data) return null;

    const parsed =
      JSON.parse(data);

    const items =
      (parsed.items || []).map(
        (item: any) =>
          new CartItemEntity(
            item.productId,
            item.quantity,
            item.price,
            item.name || '',
            item.image
          )
      );

    return new CartEntity(
      parsed.id,
      parsed.userId,
      items,
      new Date(parsed.createdAt),
      new Date(parsed.updatedAt)
    );
  }

  async deleteSnapshot(
    orderId: string
  ): Promise<void> {

    const client =
      await this.getClient();

    await client.del(
      `cart:snapshot:${orderId}`
    );
  }
}