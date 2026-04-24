// apps/cart-service/src/infrastructure/cache/cart.cache.ts

import { ICartCacheRepository } from '../../application/interfaces/cart-cache.repository';
import { CartEntity } from '../../domain/entities/cart.entity';
import { CartItemEntity } from '../../domain/entities/cart-item.entity';
import redis from './redis.client';
import { CartKeyBuilder } from '../../utils/cart-key-builder';

const TTL = 60 * 30; // 30 minutes

export class CartCacheRepository implements ICartCacheRepository {

  async get(userId: string): Promise<CartEntity | null> {
    const key = CartKeyBuilder.cart(userId);

    const data = await redis.get(key);

    if (!data) return null;

    const parsed = JSON.parse(data);

    return new CartEntity(
      parsed.id,
      parsed.userId,
      parsed.items.map(
        (i: any) => new CartItemEntity(i.productId, i.quantity, i.price, i.name, i.image)
      ),
      new Date(parsed.createdAt),
      new Date(parsed.updatedAt)
    );
  }

  async save(cart: CartEntity): Promise<void> {
    const key = CartKeyBuilder.cart(cart.userId);

    await redis.set(key, JSON.stringify(cart), 'EX', TTL);
  }

  async delete(userId: string): Promise<void> {
    const key = CartKeyBuilder.cart(userId);
    await redis.del(key);
  }
}