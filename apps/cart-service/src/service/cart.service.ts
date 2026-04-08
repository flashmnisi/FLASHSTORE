import mongoose from 'mongoose';
import logger from '@org/shared-logger';
import { CART_EVENTS } from '../constant/topics';
import { publishCartEvent } from '../kafka/producer';
import { Cart } from '../model/cart.model';

export class CartService {
  async getCart(userId: string) {
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    return cart || { user: userId, items: [] };
  }

  async addToCart(userId: string, dto: { productId: string; count: number }) {
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const productObjectId = new mongoose.Types.ObjectId(dto.productId);

    const existingItem = cart.items.find(
      item => item.product.toString() === dto.productId
    );

    if (existingItem) {
      existingItem.count += dto.count;
    } else {
      cart.items.push({
        product: productObjectId,
        count: dto.count,
      });
    }

    await cart.save();
    
    await publishCartEvent(CART_EVENTS.ITEM_ADDED, {
      userId,
      productId: dto.productId,
      count: dto.count,
    });

    logger.info(
      { userId, productId: dto.productId, count: dto.count },
      'Item added to cart'
    );

    return cart;
  }

  async updateCartItem(userId: string, dto: { productId: string; count: number }) {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) throw new Error('Cart not found');


    const itemIndex = cart.items.findIndex(
      i => i.product.toString() === dto.productId
    );

    if (itemIndex === -1) throw new Error('Item not found in cart');

    if (dto.count === 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].count = dto.count;
    }

    await cart.save();

    await publishCartEvent(CART_EVENTS.CART_UPDATED, {
      userId,
      productId: dto.productId,
      count: dto.count,
    });

    return cart;
  }

  async removeFromCart(userId: string, productId: string) {
    const cart = await Cart.findOneAndUpdate(
      { user: userId },
      { $pull: { items: { product: new mongoose.Types.ObjectId(productId) } } },
      { new: true }
    );

    if (cart) {
      await publishCartEvent(CART_EVENTS.ITEM_REMOVED, { userId, productId });
    }

    return cart;
  }

  async clearCart(userId: string) {
    const cart = await Cart.findOneAndUpdate(
      { user: userId },
      { items: [] },
      { new: true }
    );

    if (cart) {
      await publishCartEvent(CART_EVENTS.CART_CLEARED, { userId });
    }

    return cart;
  }
}

export const cartService = new CartService();