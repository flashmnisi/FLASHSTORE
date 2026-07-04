import logger from '@org/shared-logger';
import { CartEntity } from '../../domain/entities/cart.entity';
//import { CartEntity } from '../entities/cart.entity';

export interface Coupon {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;                  
  minOrderAmount?: number;
  maxDiscount?: number;
  validUntil: Date;
  usageLimit?: number;
  usedCount: number;
  applicableTo?: string[];        
}

export class CouponEngine {
  /**
   * Apply coupon to cart and return updated total + discount info
   */
  async applyCoupon(cart: CartEntity, couponCode: string): Promise<{
    success: boolean;
    discountAmount: number;
    finalAmount: number;
    message: string;
    coupon?: Coupon;
  }> {
    try {
    
      const coupon = await this.getCouponByCode(couponCode);

      if (!coupon) {
        return {
          success: false,
          discountAmount: 0,
          finalAmount: cart.totalAmount,
          message: 'Invalid or expired coupon code',
        };
      }

      // Validate coupon
      const validation = this.validateCoupon(coupon, cart);
      if (!validation.valid) {
        return {
          success: false,
          discountAmount: 0,
          finalAmount: cart.totalAmount,
          message: validation.message,
        };
      }

      // Calculate discount
      const discountAmount = this.calculateDiscount(coupon, cart.totalAmount);

      const finalAmount = Math.max(0, cart.totalAmount - discountAmount);

      logger.info('Coupon applied successfully', {
        couponCode,
        discountAmount,
        finalAmount,
        originalAmount: cart.totalAmount,
      });

      return {
        success: true,
        discountAmount,
        finalAmount,
        message: `Coupon ${couponCode} applied successfully`,
        coupon,
      };

    } catch (error: any) {
      logger.error('Failed to apply coupon', {
        couponCode,
        error: error.message,
      });

      return {
        success: false,
        discountAmount: 0,
        finalAmount: cart.totalAmount,
        message: 'Failed to apply coupon. Please try again.',
      };
    }
  }

  /**
   * Validate coupon rules
   */
  private validateCoupon(coupon: Coupon, cart: CartEntity): { valid: boolean; message: string } {
    const now = new Date();

    if (now > coupon.validUntil) {
      return { valid: false, message: 'Coupon has expired' };
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return { valid: false, message: 'Coupon usage limit reached' };
    }

    if (coupon.minOrderAmount && cart.totalAmount < coupon.minOrderAmount) {
      return { 
        valid: false, 
        message: `Minimum order amount of ${coupon.minOrderAmount} required` 
      };
    }

    return { valid: true, message: 'Coupon is valid' };
  }

  /**
   * Calculate discount amount
   */
  private calculateDiscount(coupon: Coupon, totalAmount: number): number {
    let discount = 0;

    if (coupon.type === 'percentage') {
      discount = (totalAmount * coupon.value) / 100;
    } else {
      discount = coupon.value;
    }

    // Apply max discount cap if set
    if (coupon.maxDiscount) {
      discount = Math.min(discount, coupon.maxDiscount);
    }

    return Math.round(discount * 100) / 100; // round to 2 decimals
  }

  /**
   * Get coupon by code (stub - replace with real DB/cache call)
   */
  private async getCouponByCode(code: string): Promise<Coupon | null> {
   
    const mockCoupons: Record<string, Coupon> = {
      'WELCOME10': {
        code: 'WELCOME10',
        type: 'percentage',
        value: 10,
        minOrderAmount: 50,
        maxDiscount: 30,
        validUntil: new Date('2026-12-31'),
        usageLimit: 1000,
        usedCount: 245,
        applicableTo: [],
      },
      'SAVE20': {
        code: 'SAVE20',
        type: 'fixed',
        value: 20,
        minOrderAmount: 100,
        validUntil: new Date('2026-06-30'),
        usageLimit: 500,
        usedCount: 87,
        applicableTo: [],
      },
    };

    return mockCoupons[code.toUpperCase()] || null;
  }
}

// Singleton
export const couponEngine = new CouponEngine();