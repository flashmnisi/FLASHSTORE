//utils/validators.ts

import { Request, Response, NextFunction, RequestHandler } from 'express';

import { z } from 'zod';

/**
 * =================================
 * Primitive Validators
 * =================================
 */
const id = z.string().min(1);

const amount = z
  .number()
  .positive('Amount must be greater than zero')
  .max(1_000_000, 'Amount too large');

const currency = z.enum(['ZAR', 'USD', 'EUR', 'GBP']).default('ZAR');

/**
 * =================================
 * Order Item Schema
 * =================================
 */
const orderItem = z.object({
  productId: id,

  name: z.string().min(1),

  price: amount,

  quantity: z.number().int().positive(),
});

/**
 * =================================
 * Create Order Schema
 * =================================
 */

export const createOrder = z.object({
  items: z.array(orderItem).min(1),

  shippingAddress: z.object({
    name: z.string().min(1),
    phone: z.string().min(1),
    city: z.string().min(1),
    houseNo: z.string().min(1),
    streetName: z.string().min(1),
    postalCode: z.string().min(1),
    country: z.string().min(1),
  }),

  paymentMethod: z.enum(['cash', 'card', 'paypal']),

  itemsPrice: amount,
  shippingPrice: z.number().min(0),
  totalAmount: amount,

  deliveryOption: z.string().optional(),
  currency,

  idempotencyKey: z.string().min(1),

  metadata: z.record(z.string(), z.any()).optional().default({}),
});
/**
 * =================================
 * Update Order Status Schema
 * =================================
 */
const updateOrderStatus = z.object({
  orderId: id,

  status: z
    .enum([
      'pending',
      'confirmed',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
    ])
    .optional(),

  paymentStatus: z.enum(['pending', 'paid', 'failed', 'refunded']).optional(),
});

/**
 * =================================
 * Express Validator Middleware
 * =================================
 */
export const validate = (schema: z.ZodSchema): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: result.error.flatten().fieldErrors,
      });

      return;
    }

    req.body = result.data;

    next();
  };
};

/**
 * =================================
 * Export Validators
 * =================================
 */
export const validators = {
  id,
  amount,
  currency,
  orderItem,
  createOrder,
  updateOrderStatus,
};

export default validators;
