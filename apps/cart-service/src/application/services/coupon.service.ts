import { Coupon } from '../../infrastructure/promotions/coupon.engine';
import { ICouponRepository } from '../interfaces/coupon.repository';
import logger from '@org/shared-logger';

export class CouponService {
  constructor(
    private readonly couponRepo: ICouponRepository
  ) {}

  /**
   * Validate and apply coupon
   */
  async validateAndApply(
    couponCode: string,
    cartTotal: number,
    userId?: string
  ): Promise<{
    success: boolean;
    coupon?: Coupon;
    discountAmount: number;
    message: string;
  }> {

    try {

      const coupon =
        await this.couponRepo.findByCode(
          couponCode.toUpperCase()
        );

      if (!coupon) {
        return {
          success: false,
          discountAmount: 0,
          message: 'Invalid coupon code',
        };
      }

      const isValid =
        await this.couponRepo.isValid(
          couponCode,
          userId
        );

      if (!isValid) {
        return {
          success: false,
          discountAmount: 0,
          message:
            'Coupon is not valid or expired',
        };
      }

      let discountAmount = 0;

      if (coupon.type === 'percentage') {
        discountAmount =
          (cartTotal * coupon.value) / 100;
      } else {
        discountAmount =
          coupon.value;
      }

      if (coupon.maxDiscount) {
        discountAmount = Math.min(
          discountAmount,
          coupon.maxDiscount
        );
      }

      logger.info(
        'Coupon validated successfully',
        {
          couponCode,
          discountAmount,
          userId,
        }
      );

      return {
        success: true,
        coupon,
        discountAmount:
          Math.round(discountAmount * 100) / 100,
        message:
          `Coupon ${couponCode} applied successfully`,
      };

    } catch (error: any) {

      logger.error(
        'Failed to validate coupon',
        {
          couponCode,
          error: error.message,
        }
      );

      return {
        success: false,
        discountAmount: 0,
        message:
          'Failed to apply coupon',
      };
    }
  }

  /**
   * Mark coupon as used
   */
  async markAsUsed(
    couponCode: string
  ): Promise<void> {

    try {

      await this.couponRepo.incrementUsage(
        couponCode
      );

      logger.info(
        'Coupon usage incremented',
        {
          couponCode,
        }
      );

    } catch (error: any) {

      logger.error(
        'Failed to increment coupon usage',
        {
          couponCode,
          error: error.message,
        }
      );
    }
  }
}