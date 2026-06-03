// apps/cart-service/src/infrastructure/providers/pricing.provider.ts

import { IPricingProvider, PricingResult } from '../../application/interfaces/pricing.provider';
import { CartEntity } from '../../domain/entities/cart.entity';

export class PricingProvider
  implements IPricingProvider {

  async calculate(
    cart: CartEntity
  ): Promise<PricingResult> {

    const subtotal = cart.totalAmount;

    const discount = 0;

    const shipping =
      subtotal > 1000
        ? 0
        : 99.99;

    const tax =
      subtotal * 0.15;

    const total =
      subtotal +
      shipping +
      tax -
      discount;

    return {
      subtotal,
      discount,
      tax,
      shipping,
      total,
      currency: 'USD',
    };
  }
}