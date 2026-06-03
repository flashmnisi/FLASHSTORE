// apps/cart-service/src/application/interface/coupon.repository.ts

import { Coupon } from "../../infrastructure/promotions/coupon.engine";

export interface ICouponRepository {
  findByCode(code: string): Promise<Coupon | null>;
  incrementUsage(code: string): Promise<void>;
  isValid(code: string, userId?: string): Promise<boolean>;
}