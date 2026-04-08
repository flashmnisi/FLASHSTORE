// apps/order-service/src/modules/order/order.dto.ts
import { z } from 'zod';

export const createOrderSchema = z.object({
  orderItems: z.array(z.object({
    product: z.string().min(1, 'Product ID is required'),    
    qty: z.number().int().min(1, 'Quantity must be at least 1'), 
    price: z.number().min(0, 'Price is required'),            
  })).min(1, 'At least one item is required'),

  shippingAddress: z.object({
    name: z.string().min(1, 'Name is required'),
    surname: z.string().optional(),
    phone: z.string().min(1, 'Phone is required'),
    city: z.string().min(1, 'City is required'),
    houseNo: z.string().min(1, 'House number is required'),
    streetName: z.string().min(1, 'Street name is required'),
    postalCode: z.string().min(1, 'Postal code is required'),
    country: z.string().min(1, 'Country is required'),
  }),

  paymentMethod: z.enum(['cash', 'card', 'paypal']),
  itemsPrice: z.number().min(0, 'Items price is required'),
  shippingPrice: z.number().min(0, 'Shipping price is required'),
  totalPrice: z.number().min(0, 'Total price is required'),
  deliveryOption: z.string().optional(),
  paymentData: z.object({}).optional().default({}),
});

export type CreateOrderDto = z.infer<typeof createOrderSchema>;