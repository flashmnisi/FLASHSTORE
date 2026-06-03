// apps/cart-service/src/infrastructure/cache/redis-cart-cache.repository.ts

import { ICartCacheRepository } from '../../application/interfaces/cart-cache.repository';
import { CartEntity } from '../../domain/entities/cart.entity';
import { CartItemEntity } from '../../domain/entities/cart-item.entity';
import { getRedis } from '@org/shared-redis';
import { CartKeyBuilder } from '../../utils/cart-key-builder';
import logger from '@org/shared-logger';

const CART_TTL = 60 * 30;        // 30 minutes
const IDEMPOTENCY_TTL = 60 * 15; // 15 minutes

export class CartCacheRepository implements ICartCacheRepository {
  private redisClient: any = null;

  private async getClient() {
    if (!this.redisClient) {
      this.redisClient = await getRedis();
    }
    return this.redisClient;
  }

  async get(userId: string): Promise<CartEntity | null> {
    try {
      const client = await this.getClient();
      const key = CartKeyBuilder.cart(userId);

      const data = await client.get(key);
      if (!data) return null;

      const parsed = JSON.parse(data);

      return new CartEntity(
        parsed.id || '',
        parsed.userId,
        (parsed.items || []).map(
          (i: any) => new CartItemEntity(
            i.productId, 
            i.quantity, 
            i.price, 
            i.name || '', 
            i.image
          )
        ),
        new Date(parsed.createdAt),
        new Date(parsed.updatedAt)
      );
    } catch (error) {
      logger.error('Failed to parse cart from cache', { userId });
      return null;
    }
  }

  async save(cart: CartEntity): Promise<void> {
    try {
      const client = await this.getClient();
      const key = CartKeyBuilder.cart(cart.userId);

      await client.set(key, JSON.stringify(cart), 'EX', CART_TTL);
    } catch (error) {
      logger.error('Failed to save cart to cache', { userId: cart.userId });
    }
  }

  async delete(userId: string): Promise<void> {
    try {
      const client = await this.getClient();
      const key = CartKeyBuilder.cart(userId);
      await client.del(key);
    } catch (error) {
      logger.warn('Failed to delete cart from cache', { userId });
    }
  }

    // ====================== SNAPSHOTS ======================

  async saveSnapshot(
    orderId: string,
    cart: CartEntity
  ): Promise<void> {

    try {

      const client =
        await this.getClient();

      const key =
        `cart:snapshot:${orderId}`;

      await client.set(
        key,
        JSON.stringify(cart),
        'EX',
        CART_TTL
      );

      logger.info(
        'Cart snapshot saved',
        {
          orderId,
          userId: cart.userId,
        }
      );

    } catch (error) {

      logger.error(
        'Failed to save cart snapshot',
        {
          orderId,
        }
      );
    }
  }

  async getSnapshot(
    orderId: string
  ): Promise<CartEntity | null> {

    try {

      const client =
        await this.getClient();

      const key =
        `cart:snapshot:${orderId}`;

      const data =
        await client.get(key);

      if (!data) return null;

      const parsed =
        JSON.parse(data);

      return new CartEntity(
        parsed.id || '',
        parsed.userId,

        (parsed.items || []).map(
          (i: any) =>
            new CartItemEntity(
              i.productId,
              i.quantity,
              i.price,
              i.name || '',
              i.image
            )
        ),

        new Date(parsed.createdAt),
        new Date(parsed.updatedAt)
      );

    } catch (error) {

      logger.error(
        'Failed to get cart snapshot',
        {
          orderId,
        }
      );

      return null;
    }
  }

  async deleteSnapshot(
    orderId: string
  ): Promise<void> {

    try {

      const client =
        await this.getClient();

      const key =
        `cart:snapshot:${orderId}`;

      await client.del(key);

      logger.info(
        'Cart snapshot deleted',
        {
          orderId,
        }
      );

    } catch (error) {

      logger.warn(
        'Failed to delete cart snapshot',
        {
          orderId,
        }
      );
    }
  }

  // ====================== IDEMPOTENCY ======================

  async getIdempotencyResult(key: string): Promise<any | null> {
    try {
      const client = await this.getClient();
      const data = await client.get(`idempotency:${key}`);
      if (!data) return null;
      return JSON.parse(data);
    } catch (error) {
      logger.error('Failed to get idempotency result from cache', { key });
      return null;
    }
  }

  async saveIdempotencyResult(
    key: string, 
    result: any, 
    ttl: number = IDEMPOTENCY_TTL
  ): Promise<void> {
    try {
      const client = await this.getClient();
      await client.set(
        `idempotency:${key}`,
        JSON.stringify(result),
        'EX',
        ttl
      );
    } catch (error) {
      logger.error('Failed to save idempotency result to cache', { key });
    }
  }
}