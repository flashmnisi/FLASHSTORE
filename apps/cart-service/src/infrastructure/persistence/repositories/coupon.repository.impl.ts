import { ICouponRepository } from '../../../application/interfaces/coupon.repository';
import logger from '@org/shared-logger';
import { Coupon } from '../../promotions/coupon.engine';
import { CouponModel } from '../models/coupon.model';

export class CouponRepositoryImpl implements ICouponRepository {

  /**
   * Find coupon by code
   */
  async findByCode(code: string): Promise<Coupon | null> {
    try {
      const doc = await CouponModel.findOne({ 
        code: code.toUpperCase(),
        validUntil: { $gte: new Date() }
      }).lean();

      if (!doc) return null;

      return {
        code: doc.code,
        type: doc.type,
        value: doc.value,
        minOrderAmount: doc.minOrderAmount,
        maxDiscount: doc.maxDiscount,
        validUntil: doc.validUntil,
        usageLimit: doc.usageLimit,
        usedCount: doc.usedCount || 0,
        applicableTo: doc.applicableTo || [],
      };
    } catch (error: any) {
      logger.error('Failed to find coupon by code', {
        code,
        error: error.message,
      });
      return null;
    }
  }

  /**
   * Increment coupon usage count
   */
  async incrementUsage(code: string): Promise<void> {
    try {
      await CouponModel.updateOne(
        { code: code.toUpperCase() },
        { $inc: { usedCount: 1 } }
      );
    } catch (error: any) {
      logger.error('Failed to increment coupon usage', {
        code,
        error: error.message,
      });
    }
  }

  /**
   * Check if coupon is valid for user
   */
  async isValid(code: string, userId?: string): Promise<boolean> {
    try {
      const coupon = await this.findByCode(code);
      if (!coupon) return false;

      // You can add user-specific validation here later (e.g. one-time use per user)
      return true;
    } catch (error: any) {
      logger.error('Failed to validate coupon', { code, userId });
      return false;
    }
  }
}