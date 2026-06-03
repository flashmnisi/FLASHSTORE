// apps/cart-service/src/application/interface/promotion.provider.ts

import { CartEntity } from '../../domain/entities/cart.entity';

export interface PromotionResult {
  discountAmount: number;
  finalAmount: number;
  appliedCoupon?: string;
}

export interface IPromotionProvider {
  applyCoupon(
    cart: CartEntity,
    couponCode: string
  ): Promise<PromotionResult>;
}