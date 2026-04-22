import { z } from 'zod';
import { indexProductSchema } from './index-product.dto';

export const bulkIndexSchema = z.object({
  products: z.array(indexProductSchema).min(1),
});

export type BulkIndexDto = z.infer<typeof bulkIndexSchema>;