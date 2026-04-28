export type ProductEventType =
  | 'product.created'
  | 'product.updated'
  | 'product.deleted';

export interface ProductEventPayload {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  category?: string;
  brand?: string;
  tags?: string[];
  images?: string[];
  inStock: boolean;
  rating?: number;
  reviewCount?: number;
}

export interface ProductKafkaEvent {
  event: ProductEventType;
  data: ProductEventPayload;
  timestamp?: string;
}