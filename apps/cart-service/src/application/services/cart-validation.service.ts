// apps/cart-service/src/application/services/cart-validation.service.ts

import logger from '@org/shared-logger';
import { CartEntity } from '../../domain/entities/cart.entity';
import { IProductClient } from '../interfaces/product.client';

export class CartValidationService {
  constructor(private readonly productClient: IProductClient) {}

  /**
   * 🔍 Validate cart before checkout
   */
  async validate(cart: CartEntity) {
    if (!cart.items.length) {
      throw new Error('Cart is empty');
    }

    const productIds = cart.items.map(i => i.productId);

    const products = await this.productClient.getProducts(productIds);

    for (const item of cart.items) {
      const product = products.find(p => p.id === item.productId);

      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }

      if (!product.inStock) {
        throw new Error(`Product ${item.productId} is out of stock`);
      }

      // 🔥 Detect price drift
      if (product.price !== item.price) {
        logger.warn('Price mismatch detected', {
          productId: item.productId,
          oldPrice: item.price,
          newPrice: product.price,
        });

        // Option 1: auto-update
        item.price = product.price;

        // Option 2 (strict mode): throw error instead
        // throw new Error(`Price changed for product ${item.productId}`);
      }
    }

    logger.info('Cart validation passed', {
      itemCount: cart.items.length,
    });

    return true;
  }
}