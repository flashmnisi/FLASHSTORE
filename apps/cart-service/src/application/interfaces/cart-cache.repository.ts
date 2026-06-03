// apps/cart-service/src/application/interface/cart-cache.repository.ts

import { CartEntity } from '../../domain/entities/cart.entity';

export interface ICartCacheRepository {

  // =========================
  // CART CACHE
  // =========================

  get(
    userId: string
  ): Promise<CartEntity | null>;

  save(
    cart: CartEntity
  ): Promise<void>;

  delete(
    userId: string
  ): Promise<void>;

  // =========================
  // CART SNAPSHOTS
  // =========================

  saveSnapshot(
    orderId: string,
    cart: CartEntity
  ): Promise<void>;

  getSnapshot(
    orderId: string
  ): Promise<CartEntity | null>;

  deleteSnapshot(
    orderId: string
  ): Promise<void>;

  // =========================
  // IDEMPOTENCY
  // =========================

  getIdempotencyResult(
    key: string
  ): Promise<any | null>;

  saveIdempotencyResult(
    key: string,
    result: any,
    ttl?: number
  ): Promise<void>;
}