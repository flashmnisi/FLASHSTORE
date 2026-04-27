import { ICartCacheRepository } from '../../application/interfaces/cart-cache.repository';
import { CartEntity } from '../../domain/entities/cart.entity';
import { CartItemEntity } from '../../domain/entities/cart-item.entity';
import redis from './redis.client';
import { CartKeyBuilder } from '../../utils/cart-key-builder';
import logger from '@org/shared-logger';

const CART_TTL = 60 * 30;        // 30 minutes
const IDEMPOTENCY_TTL = 60 * 15; // 15 minutes for idempotency results

export class CartCacheRepository implements ICartCacheRepository {

  async get(userId: string): Promise<CartEntity | null> {
    const key = CartKeyBuilder.cart(userId);

    const data = await redis.get(key);
    if (!data) return null;

    try {
      const parsed = JSON.parse(data);

      return new CartEntity(
        parsed.id || '',
        parsed.userId,
        parsed.items.map(
          (i: any) => new CartItemEntity(
            i.productId, 
            i.quantity, 
            i.price, 
            i.name, 
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
    const key = CartKeyBuilder.cart(cart.userId);

    try {
      await redis.set(key, JSON.stringify(cart), 'EX', CART_TTL);
    } catch (error) {
      logger.error('Failed to save cart to cache', { userId: cart.userId });
    }
  }

  async delete(userId: string): Promise<void> {
    const key = CartKeyBuilder.cart(userId);
    try {
      await redis.del(key);
    } catch (error) {
      logger.warn('Failed to delete cart from cache', { userId });
    }
  }

  // ====================== IDEMPOTENCY METHODS ======================

  /**
   * Get stored idempotency result
   */
  async getIdempotencyResult(key: string): Promise<any | null> {
    try {
      const data = await redis.get(`idempotency:${key}`);
      if (!data) return null;
      return JSON.parse(data);
    } catch (error) {
      logger.error('Failed to get idempotency result from cache', { key });
      return null;
    }
  }

  /**
   * Save idempotency result
   */
  async saveIdempotencyResult(
    key: string, 
    result: any, 
    ttl: number = IDEMPOTENCY_TTL
  ): Promise<void> {
    try {
      await redis.set(
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