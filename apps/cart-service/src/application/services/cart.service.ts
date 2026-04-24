// apps/cart-service/src/application/services/cart.service.ts

import { CartEntity } from '../../domain/entities/cart.entity';
import { CartItemEntity } from '../../domain/entities/cart-item.entity';

import { AddToCartDto } from '../dtos/add-to-cart.dto';
import { ApplyCouponDto } from '../dtos/apply-coupon.dto';
import { CheckoutCartDto } from '../dtos/checkout-cart.dto';

import { ICartRepository } from '../interfaces/cart.repository';
import { ICartCacheRepository } from '../interfaces/cart-cache.repository';
import { IProductClient } from '../interfaces/product.client';
import { IPromotionProvider } from '../interfaces/promotion.provider';
import { IPricingProvider } from '../interfaces/pricing.provider';

import { CartCheckoutOrchestrator } from '../../infrastructure/checkout/cart-checkout.orchestrator';

import { CartKeyBuilder } from '../../utils/cart-key-builder';
import logger from '../../utils/logger';

const MAX_RETRIES = 3;

export class CartService {
  constructor(
    private readonly repository: ICartRepository,
    private readonly cache: ICartCacheRepository,
    private readonly productClient: IProductClient,
    private readonly promotionProvider: IPromotionProvider,
    private readonly pricingProvider: IPricingProvider,
    private readonly orchestrator: CartCheckoutOrchestrator
  ) {}

  // =====================================================
  // 🛒 ADD TO CART
  // =====================================================
  async addToCart(userId: string, dto: AddToCartDto): Promise<CartEntity> {
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const product = await this.productClient.getProduct(dto.productId);

        if (!product) throw new Error('Product not found');
        if (!product.inStock) throw new Error('Product out of stock');

        const cart = await this.getOrCreateCart(userId);

        const item = new CartItemEntity(
          dto.productId,
          dto.quantity,
          product.price,
          product.name,
          product.image
        );

        cart.addItem(item);

        await this.repository.save(cart);
        await this.cache.save(cart);

        logger.info('Item added to cart', {
          userId,
          productId: dto.productId,
        });

        return cart;

      } catch (error: any) {
        if (attempt === MAX_RETRIES - 1) throw error;
      }
    }

    throw new Error('Failed to add item');
  }

  // =====================================================
  // ❌ REMOVE FROM CART
  // =====================================================
  async removeFromCart(userId: string, productId: string): Promise<CartEntity> {
    const cart = await this.getOrCreateCart(userId);

    cart.removeItem(productId);

    await this.repository.save(cart);
    await this.cache.save(cart);

    return cart;
  }

  // =====================================================
  // 🎟️ APPLY COUPON
  // =====================================================
  async applyCoupon(userId: string, dto: ApplyCouponDto) {
    const cart = await this.getOrCreateCart(userId);

    if (!cart.items.length) {
      throw new Error('Cart is empty');
    }

    const result = await this.promotionProvider.applyCoupon(
      cart,
      dto.couponCode
    );

    const pricing = await this.pricingProvider.calculate(cart);

    logger.info('Coupon applied', {
      userId,
      coupon: dto.couponCode,
      discount: result.discountAmount,
    });

    return {
      cart,
      pricing: {
        ...pricing,
        discount: result.discountAmount,
        total: result.finalAmount,
      },
    };
  }

  // =====================================================
  // 💰 GET CART WITH PRICING
  // =====================================================
  async getCart(userId: string) {
    const cart = await this.getOrCreateCart(userId);

    const pricing = await this.pricingProvider.calculate(cart);

    return {
      cart,
      pricing,
    };
  }

  // =====================================================
  // 🔥 CHECKOUT (SAGA ENTRY)
  // =====================================================
  async checkout(dto: CheckoutCartDto) {
    const log = logger.withContext({
      userId: dto.userId,
      flow: 'checkout',
    });

    // =============================
    // 🔐 Idempotency (Redis-style)
    // =============================
    const idempotencyKey = CartKeyBuilder.checkout(dto.idempotencyKey);

    // NOTE: replace with Redis in real impl
    const existing = await this.cache.get(idempotencyKey as any);

    if (existing) {
      log.warn('Duplicate checkout prevented');
      return existing;
    }

    // =============================
    // 1. Get cart
    // =============================
    const cart = await this.getOrCreateCart(dto.userId);

    if (!cart.items.length) {
      throw new Error('Cart is empty');
    }

    // =============================
    // 2. Revalidate products (CRITICAL)
    // =============================
    const products = await this.productClient.getProducts(
      cart.items.map(i => i.productId)
    );

    for (const item of cart.items) {
      const product = products.find(p => p.id === item.productId);

      if (!product) throw new Error(`Product ${item.productId} not found`);
      if (!product.inStock) throw new Error(`Product ${item.productId} out of stock`);

      // Optional: detect price changes
      if (product.price !== item.price) {
        log.warn('Price changed before checkout', {
          productId: item.productId,
          old: item.price,
          new: product.price,
        });
      }
    }

    // =============================
    // 3. Pricing
    // =============================
    const pricing = await this.pricingProvider.calculate(cart);

    // =============================
    // 4. Call Orchestrator (Saga)
    // =============================
    const result = await this.orchestrator.checkout(
      dto.userId,
      cart
    );

    // =============================
    // 5. Save idempotency result
    // =============================
    await this.cache.save({
      ...(result as any),
      key: idempotencyKey,
    } as any);

    log.info('Checkout started', {
      orderId: result.orderId,
    });

    return {
      ...result,
      pricing,
    };
  }

  // =====================================================
  // 🧠 INTERNAL HELPERS
  // =====================================================
  private async getOrCreateCart(userId: string): Promise<CartEntity> {
    let cart = await this.cache.get(userId);

    if (!cart) {
      cart = await this.repository.findByUserId(userId);

      if (cart) {
        await this.cache.save(cart);
      }
    }

    return cart || new CartEntity(userId, userId);
  }
}