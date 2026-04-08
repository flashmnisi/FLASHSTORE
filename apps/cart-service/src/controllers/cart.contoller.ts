import { Request, Response } from 'express';
import logger from '@org/shared-logger';
import { addToCartSchema, updateCartItemSchema } from '../dtos/cart.dto';
import { cartService } from '../service/cart.service';

export const getUserCart = async (req: Request & { user?: any }, res: Response) => {
  try {
    const cart = await cartService.getCart(req.user.userId);
    res.json({ success: true, cart });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Get cart failed');
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const addToCart = async (req: Request & { user?: any }, res: Response) => {
  try {
    const dto = addToCartSchema.parse(req.body);
    const cart = await cartService.addToCart(req.user.userId, dto);
    res.status(200).json({ success: true, cart });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Add to cart failed');
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateCartItem = async (req: Request & { user?: any }, res: Response) => {
  try {
    const dto = updateCartItemSchema.parse(req.body);
    const cart = await cartService.updateCartItem(req.user.userId, dto);
    res.json({ success: true, cart });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Update cart item failed');
    res.status(400).json({ success: false, message: error.message });
  }
};

export const removeFromCart = async (req: Request & { user?: any }, res: Response) => {
  try {
    const { productId } = req.params;
    const cart = await cartService.removeFromCart(req.user.userId, productId);
    res.json({ success: true, cart });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Remove from cart failed');
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const clearCart = async (req: Request & { user?: any }, res: Response) => {
  try {
    const cart = await cartService.clearCart(req.user.userId);
    res.json({ success: true, message: 'Cart cleared', cart });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Clear cart failed');
    res.status(500).json({ success: false, message: 'Server error' });
  }
};