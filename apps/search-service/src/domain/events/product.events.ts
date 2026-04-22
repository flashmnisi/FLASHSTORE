// domain/events/product.events.ts

export const PRODUCT_EVENTS = {
  PRODUCT_CREATED: 'product.created',
  PRODUCT_UPDATED: 'product.updated',
  PRODUCT_DELETED: 'product.deleted',
} as const;

export type ProductEventType =
  typeof PRODUCT_EVENTS[keyof typeof PRODUCT_EVENTS];

export interface ProductEventPayload {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  brand?: string;
  tags?: string[];
  images?: string[];
  inStock: boolean;
  rating: number;
  reviewCount: number;
}

export interface ProductEvent {
  event: ProductEventType;
  data: ProductEventPayload;
  metadata?: {
    correlationId?: string;
    source?: string;
    version?: number;
  };
}