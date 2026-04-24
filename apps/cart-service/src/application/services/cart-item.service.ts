// apps/cart-service/src/application/services/cart-item.service.ts

import { CartEntity } from '../../domain/entities/cart.entity';
import { CartItemEntity } from '../../domain/entities/cart-item.entity';
import { IProductClient } from '../interfaces/product.client';
import logger from '../../utils/logger';

export class CartItemService {
  constructor(private readonly productClient: IProductClient) {}

  /**
   * ➕ Add item
   */
  async addItem(cart: CartEntity, productId: string, quantity: number) {
    const product = await this.productClient.getProduct(productId);

    if (!product) throw new Error('Product not found');
    if (!product.inStock) throw new Error('Product out of stock');

    const item = new CartItemEntity(
      product.id,
      quantity,
      product.price,
      product.name,
      product.image
    );

    cart.addItem(item);

    logger.info('Cart item added', { productId, quantity });

    return cart;
  }

  /**
   * 🔄 Update quantity
   */
  updateQuantity(cart: CartEntity, productId: string, quantity: number) {
    cart.updateQuantity(productId, quantity);

    logger.info('Cart item quantity updated', {
      productId,
      quantity,
    });

    return cart;
  }

  /**
   * ❌ Remove item
   */
  removeItem(cart: CartEntity, productId: string) {
    cart.removeItem(productId);

    logger.info('Cart item removed', { productId });

    return cart;
  }
}