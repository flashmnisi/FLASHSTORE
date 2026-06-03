import { ICouponRepository } from "../../../application/interfaces/coupon.repository";
import { Coupon } from "../../promotions/coupon.engine";


export class InMemoryCouponRepository
  implements ICouponRepository {

  /**
   * =====================================
   * MOCK COUPONS
   * =====================================
   */
  private readonly coupons:
    Record<string, Coupon> = {

    WELCOME10: {
      code: 'WELCOME10',
      type: 'percentage',
      value: 10,
      minOrderAmount: 50,
      maxDiscount: 30,
      validUntil: new Date('2026-12-31'),
      usageLimit: 1000,
      usedCount: 0,
      applicableTo: [],
    },

    SAVE20: {
      code: 'SAVE20',
      type: 'fixed',
      value: 20,
      minOrderAmount: 100,
      validUntil: new Date('2026-12-31'),
      usageLimit: 500,
      usedCount: 0,
      applicableTo: [],
    },

    FLASH50: {
      code: 'FLASH50',
      type: 'percentage',
      value: 50,
      minOrderAmount: 500,
      maxDiscount: 200,
      validUntil: new Date('2026-12-31'),
      usageLimit: 100,
      usedCount: 0,
      applicableTo: [],
    },
  };

  /**
   * =====================================
   * FIND COUPON
   * =====================================
   */
  async findByCode(
    code: string
  ): Promise<Coupon | null> {

    return (
      this.coupons[
        code.toUpperCase()
      ] || null
    );
  }

  /**
   * =====================================
   * INCREMENT USAGE
   * =====================================
   */
  async incrementUsage(
    code: string
  ): Promise<void> {

    const coupon =
      this.coupons[
        code.toUpperCase()
      ];

    if (coupon) {
      coupon.usedCount += 1;
    }
  }

  /**
   * =====================================
   * VALIDATE COUPON
   * =====================================
   */
  async isValid(
    code: string,
    userId?: string
  ): Promise<boolean> {

    const coupon =
      this.coupons[
        code.toUpperCase()
      ];

    if (!coupon) {
      return false;
    }

    /**
     * Expired
     */
    if (
      new Date() >
      coupon.validUntil
    ) {
      return false;
    }

    /**
     * Usage limit
     */
    if (
      coupon.usageLimit &&
      coupon.usedCount >=
        coupon.usageLimit
    ) {
      return false;
    }

    return true;
  }
}