import { z } from 'zod';

/**
 * Primitive validators
 */
const id = z.string().min(1);

const amount = z
  .number()
  .positive('Amount must be greater than zero')
  .max(1_000_000, 'Amount too large');

const currency = z
  .enum(['ZAR', 'USD', 'EUR', 'GBP'])
  .default('ZAR');

/**
 * Order item
 */
const orderItem = z.object({
  productId: id,
  name: z.string().min(1),
  price: amount,
  quantity: z.number().int().positive(),
});

/**
 * Composite schemas
 */
const createOrder = z.object({
  userId: id,
  items: z.array(orderItem).min(1),
  totalAmount: amount,
  currency,
  idempotencyKey: z.string().min(1),
});

const updateOrderStatus = z.object({
  orderId: id,
  status: z.enum([
    'pending',
    'confirmed',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
  ]).optional(),

  paymentStatus: z.enum([
    'pending',
    'paid',
    'failed',
    'refunded',
  ]).optional(),
});

/**
 * Express validator middleware
 */
export const validate = (schema: z.ZodSchema) => {
  return (req: any, res: any, next: any) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: result.error.flatten().fieldErrors,
      });
    }

    req.body = result.data;
    next();
  };
};

export const validators = {
  id,
  amount,
  currency,
  orderItem,
  createOrder,
  updateOrderStatus,
};

export default validators;