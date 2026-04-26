// apps/cart-service/src/application/services/cart-pricing.service.ts

import logger from '@org/shared-logger';
import { CartEntity } from '../../domain/entities/cart.entity';
import { IPromotionProvider } from '../interfaces/promotion.provider';

export interface CartPricing {
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  currency: string;
}

export class CartPricingService {
  constructor(private readonly promotionProvider: IPromotionProvider) {}

  /**
   * 💰 Calculate full pricing
   */
  async calculate(cart: CartEntity, couponCode?: string): Promise<CartPricing> {
    const subtotal = cart.totalAmount;

    // =============================
    // 1. Apply promotions
    // =============================
    let discount = 0;

    if (couponCode) {
      const promo = await this.promotionProvider.applyCoupon(cart, couponCode);
      discount = promo.discountAmount;
    }

    // =============================
    // 2. Tax (simple example)
    // =============================
    const taxRate = 0.15; // 15% VAT (SA)
    const tax = (subtotal - discount) * taxRate;

    // =============================
    // 3. Shipping logic
    // =============================
    const shipping = subtotal > 500 ? 0 : 50;

    // =============================
    // 4. Final total
    // =============================
    const total = subtotal - discount + tax + shipping;

    logger.info('Cart pricing calculated', {
      subtotal,
      discount,
      tax,
      shipping,
      total,
    });

    return {
      subtotal,
      discount,
      tax,
      shipping,
      total,
      currency: 'ZAR',
    };
  }
}