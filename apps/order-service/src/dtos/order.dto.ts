import { z } from 'zod';

export const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string().min(1),
    quantity: z.number().int().min(1),
    price: z.number().min(0),
  })),
  shippingAddress: z.object({
    name: z.string().min(1),
    phone: z.string().min(1),
    city: z.string().min(1),
    houseNo: z.string().min(1),
    streetName: z.string().min(1),
    postalCode: z.string().min(1),
    country: z.string().min(1),
  }),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']),
});

export type CreateOrderDto = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusDto = z.infer<typeof updateOrderStatusSchema>;