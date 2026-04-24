// apps/cart-service/src/utils/cart-key-builder.ts

export const CartKeyBuilder = {
  /**
   * Main cart key
   */
  cart: (userId: string) => `cart:${userId}`,

  /**
   * Lock key (for concurrency control)
   */
  lock: (userId: string) => `cart:lock:${userId}`,

  /**
   * Checkout idempotency key
   */
  checkout: (idempotencyKey: string) =>
    `cart:checkout:${idempotencyKey}`,

  /**
   * Coupon usage key
   */
  coupon: (userId: string, code: string) =>
    `cart:coupon:${userId}:${code}`,
};