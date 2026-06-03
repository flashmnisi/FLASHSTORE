// apps/cart-service/src/infrastructure/providers/promotion.provider.ts


import { IPromotionProvider, PromotionResult } from '../../application/interfaces/promotion.provider';
import { CartEntity } from '../../domain/entities/cart.entity';

import { couponEngine } from '../promotions/coupon.engine';

export class PromotionProvider
  implements IPromotionProvider {

  async applyCoupon(
    cart: CartEntity,
    couponCode: string
  ): Promise<PromotionResult> {

    const result =
      await couponEngine.applyCoupon(
        cart,
        couponCode
      );

    return {
      discountAmount: result.discountAmount,
      finalAmount: result.finalAmount,
      appliedCoupon: couponCode,
    };
  }
}