import { z } from 'zod';

// ====================== COMMON VALIDATORS ======================
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

// ====================== CART VALIDATORS ======================

export const addToCartSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').default(1),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
});

export const checkoutSchema = z.object({
  couponCode: z.string().optional(),
  idempotencyKey: z.string().optional(),
});

// ====================== ORDER VALIDATORS ======================

export const createOrderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().min(1),
      quantity: z.number().int().min(1),
      price: z.number().min(0),
    })
  ).min(1, 'Order must contain at least one item'),
  totalAmount: z.number().min(0, 'Total amount must be positive'),
  idempotencyKey: z.string().optional(),
});

// ====================== COUPON VALIDATORS ======================

export const applyCouponSchema = z.object({
  couponCode: z.string().min(1, 'Coupon code is required').toUpperCase(),
});

// ====================== Export all validators ======================
export const validators = {
  addToCart: addToCartSchema,
  updateCartItem: updateCartItemSchema,
  checkout: checkoutSchema,
  createOrder: createOrderSchema,
  applyCoupon: applyCouponSchema,
};