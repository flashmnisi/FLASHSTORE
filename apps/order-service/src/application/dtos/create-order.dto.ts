import { z } from 'zod';

const orderItemSchema = z.object({
  productId: z.string().min(1),
  name: z.string().min(1),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
});

export const createOrderSchema = z.object({
  userId: z.string().min(1),

  items: z
    .array(orderItemSchema)
    .min(1, 'Order must contain at least 1 item'),

  shippingAddress: z.object({
    name: z.string().min(1),
    phone: z.string().min(1),
    city: z.string().min(1),
    houseNo: z.string().min(1),
    streetName: z.string().min(1),
    postalCode: z.string().min(1),
    country: z.string().min(1),
  }),

  paymentMethod: z.enum([
    'cash',
    'card',
    'paypal',
  ]),

  itemsPrice: z.number().positive(),

  shippingPrice: z.number().min(0),

  totalAmount: z.number().positive(),

  deliveryOption: z.string().optional(),

  currency: z
    .enum(['ZAR', 'USD', 'EUR', 'GBP'])
    .default('ZAR'),

  idempotencyKey: z.string().min(1),

  metadata: z
    .record(z.string(), z.any())
    .optional()
    .default({}),
});

export type CreateOrderDto =
  z.infer<typeof createOrderSchema>;