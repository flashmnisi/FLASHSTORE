//aaps/cart-service/application/services/cart.service.ts

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

import { OutboxService } from '../../infrastructure/outbox/outbox.service';   // ← Added

import { CartKeyBuilder } from '../../utils/cart-key-builder';
import logger from '@org/shared-logger';
import { EVENTS, TOPICS } from '@org/shared-kafka';

const MAX_RETRIES = 3;

export class CartService {
  constructor(
    private readonly repository: ICartRepository,
    private readonly cache: ICartCacheRepository,
    private readonly productClient: IProductClient,
    private readonly promotionProvider: IPromotionProvider,
    private readonly pricingProvider: IPricingProvider,
    private readonly orchestrator: CartCheckoutOrchestrator,
    private readonly outboxService: OutboxService   
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

        item.assertValid();

        cart.addItem(item);

        await this.repository.save(cart);
        await this.cache.save(cart);

        //  Publish cart updated event
        await this.outboxService.write({
          topic: TOPICS.CARTS,
          event: EVENTS.CART_UPDATED,
          data: {
            userId,
            itemCount: cart.items.length,
            totalAmount: cart.totalAmount,
          },
          key: userId,
        });

        logger.info('Item added to cart', {
          userId,
          productId: dto.productId,
          quantity: dto.quantity,
        });

        return cart;

      } catch (error: any) {
        if (attempt === MAX_RETRIES - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 100 * (attempt + 1)));
      }
    }

    throw new Error('Failed to add item to cart after retries');
  }

  // =====================================================
  // 🧹 CLEAR CART
  // =====================================================
  async clearCart(userId: string): Promise<CartEntity> {
    const cart = await this.getOrCreateCart(userId);
    cart.clear();

    await this.repository.save(cart);
    await this.cache.save(cart);

    // Publish cart cleared event
    await this.outboxService.write({
      topic: TOPICS.CARTS,
      event: EVENTS.CART_CLEARED,
      data: { userId },
      key: userId,
    });

    logger.info('Cart cleared', { userId });

    return cart;
  }

  // =====================================================
  // 🔥 CHECKOUT
  // =====================================================
  async checkout(dto: CheckoutCartDto) {
    logger.info('Checkout started', {
      userId: dto.userId,
      couponCode: dto.couponCode,
    });

    const idempotencyKey = CartKeyBuilder.checkout(
      dto.idempotencyKey || `checkout:${dto.userId}`
    );

    const existing = await this.cache.getIdempotencyResult(idempotencyKey);
    if (existing) {
      logger.warn('Duplicate checkout prevented', { idempotencyKey });
      return existing;
    }

    const cart = await this.getOrCreateCart(dto.userId);

    if (!cart.items.length) {
      throw new Error('Cart is empty');
    }

    // Revalidate products...
    const products = await this.productClient.getProducts(
      cart.items.map(i => i.productId)
    );

    for (const item of cart.items) {
      const product = products.find(p => p.id === item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);
      if (!product.inStock) throw new Error(`Product ${item.productId} out of stock`);
    }

    const result = await this.orchestrator.checkout(
      dto.userId,
      cart,
      dto.couponCode,
      dto.idempotencyKey
    );

    await this.cache.saveIdempotencyResult(idempotencyKey, result);

    logger.info('Checkout initiated successfully', {
      orderId: result.orderId,
      userId: dto.userId,
    });

    return {
      ...result,
      pricing: await this.pricingProvider.calculate(cart),
    };
  }


  // =====================================================
  // ❌ REMOVE FROM CART
  // =====================================================
  async removeFromCart(userId: string, productId: string): Promise<CartEntity> {
    const cart = await this.getOrCreateCart(userId);
    cart.removeItem(productId);

    await this.repository.save(cart);
    await this.cache.save(cart);

    logger.info('Item removed from cart', { userId, productId });

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

    const result = await this.promotionProvider.applyCoupon(cart, dto.couponCode);

    const pricing = await this.pricingProvider.calculate(cart);

    logger.info('Coupon applied', {
      userId,
      couponCode: dto.couponCode,
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

    return cart || new CartEntity('', userId);
  }

}