import { Request, Response } from 'express';
import { CartService } from '../../application/services/cart.service';
import logger from '@org/shared-logger';

export class CartController {
  constructor(private readonly cartService: CartService) {}

  // =============================
  // 🛒 ADD TO CART
  // =============================
  addToCart = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const cart = await this.cartService.addToCart(userId, req.body);

      res.status(200).json({
        success: true,
        data: cart,
      });
    } catch (error: any) {
      logger.error('Add to cart failed', { error: error.message });

      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  // =============================
  // 📦 GET CART
  // =============================
  getCart = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const result = await this.cartService.getCart(userId);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  // =============================
  // ✏️ UPDATE ITEM
  // =============================
  updateCartItem = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const { productId } = req.params;
      const { quantity } = req.body;

      const cart = await this.cartService.addToCart(userId, {
        productId,
        quantity,
      });

      res.status(200).json({
        success: true,
        data: cart,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  // =============================
  // ❌ REMOVE ITEM
  // =============================
  removeFromCart = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const { productId } = req.params;

      const cart = await this.cartService.removeFromCart(userId, productId);

      res.status(200).json({
        success: true,
        data: cart,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  // =============================
  // 🧹 CLEAR CART
  // =============================
  clearCart = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const cart = await this.cartService.clearCart(userId);

      res.status(200).json({
        success: true,
        data: cart,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  // =============================
  // 💳 CHECKOUT
  // =============================
  checkout = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const result = await this.cartService.checkout({
        ...req.body,
        userId,
      });

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      logger.error('Checkout failed', { error: error.message });

      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };
}