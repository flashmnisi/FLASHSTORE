import { z } from 'zod';

export const checkoutCartSchema = z.object({
  userId: z.string().min(1),
  paymentMethod: z.enum(['card']).default('card'),
  currency: z.enum(['ZAR', 'USD', 'EUR', 'GBP']).default('ZAR'),
   couponCode: z.string().optional(),
  shippingAddressId: z.string().optional(),
  billingAddressId: z.string().optional(),
  idempotencyKey: z.string().min(10),
});

export type CheckoutCartDto = z.infer<typeof checkoutCartSchema>;