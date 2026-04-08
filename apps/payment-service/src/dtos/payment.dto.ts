import { z } from 'zod';

export const createPaymentIntentSchema = z.object({
  amount: z.number().min(50, 'Amount must be at least 50 cents'),
  currency: z.string().default('usd'),
});

export const createOrderWithPaymentSchema = z.object({
  orderItems: z.array(
    z.object({
      product: z.string(),
      qty: z.number().min(1),
      price: z.number().min(0),
    })
  ),
  shippingAddress: z.object({
    name: z.string(),
    surname: z.string().optional(),
    phone: z.string(),
    city: z.string(),
    houseNo: z.string(),
    streetName: z.string(),
    postalCode: z.string(),
    country: z.string(),
  }),
  paymentMethod: z.enum(['card', 'cash']),
  itemsPrice: z.number().min(0),
  shippingPrice: z.number().min(0),
  totalPrice: z.number().min(0),
  deliveryOption: z.string(),
});

export type CreatePaymentIntentDto = z.infer<typeof createPaymentIntentSchema>;
export type CreateOrderWithPaymentDto = z.infer<typeof createOrderWithPaymentSchema>;