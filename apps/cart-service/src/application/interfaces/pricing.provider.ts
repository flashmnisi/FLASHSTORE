// apps/cart-service/src/application/interface/pricing.provider.ts

import { CartEntity } from '../../domain/entities/cart.entity';

export interface PricingResult {
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  currency: string;
}

export interface IPricingProvider {
  calculate(cart: CartEntity): Promise<PricingResult>;
}