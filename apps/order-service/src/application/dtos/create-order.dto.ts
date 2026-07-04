// apps/order-service/src/presentation/dtos/create-order.dto.ts

import { z } from 'zod';

const orderItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  name: z.string().min(1, 'Product name is required'),
  price: z.number().positive('Price must be positive'),
  quantity: z.number().int().positive('Quantity must be at least 1'),
});

export const createOrderSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),

  userEmail: z.string().email('Valid email is required for notifications'),

  customerName: z.string().min(1, 'Customer name is required').optional(),

  items: z.array(orderItemSchema).min(1, 'Order must contain at least 1 item'),

  shippingAddress: z.object({
    name: z.string().min(1, 'Recipient name is required'),
    phone: z.string().min(1, 'Phone number is required'),
    city: z.string().min(1, 'City is required'),
    houseNo: z.string().min(1, 'House number is required'),
    streetName: z.string().min(1, 'Street name is required'),
    postalCode: z.string().min(1, 'Postal code is required'),
    country: z.string().min(1, 'Country is required'),
  }),

  paymentMethod: z.enum(['cash', 'card', 'paypal']),

  itemsPrice: z.number().positive('Items price must be positive'),
  shippingPrice: z.number().min(0, 'Shipping price cannot be negative'),
  totalAmount: z.number().positive('Total amount must be positive'),

  deliveryOption: z.string().optional(),

  currency: z.enum(['ZAR', 'USD', 'EUR', 'GBP']).default('ZAR'),

  idempotencyKey: z.string().min(1, 'Idempotency key is required'),

  metadata: z.record(z.string(), z.any()).optional().default({}),
});

export type CreateOrderDto = z.infer<typeof createOrderSchema>;
