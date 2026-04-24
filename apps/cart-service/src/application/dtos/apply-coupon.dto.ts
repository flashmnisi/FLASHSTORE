import { z } from 'zod';

export const applyCouponSchema = z.object({
  couponCode: z.string().min(3, 'Coupon code is required'),
});

export type ApplyCouponDto = z.infer<typeof applyCouponSchema>;