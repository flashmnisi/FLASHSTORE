import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  brand: z.string().min(1, 'Brand is required').trim(),
  price: z.number().min(0, 'Price must be positive'),
  oldPrice: z.number().min(0).optional(),
  quantity: z.number().int().min(0, 'Quantity cannot be negative'),
  category: z.string().min(1, 'Category is required'),
  inStock: z.boolean().default(true),
  trends: z.boolean().default(false),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  sale: z.boolean().default(false),
  // images will be handled separately via file upload
});

export type CreateProductDto = z.infer<typeof createProductSchema>;