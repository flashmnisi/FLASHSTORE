// apps/catalog-service/src/infrastructure/kafka/topics.ts

/**
 * Centralized Kafka Topics & Events for Catalog Service
 */

export const TOPICS = {
  PRODUCTS: 'flashstore.products',
  CATEGORIES: 'flashstore.categories',
  INVENTORY: 'flashstore.inventory',
  SEARCH: 'flashstore.search',          
} as const;

export const EVENTS = {
  // Product Events
  PRODUCT_CREATED: 'product.created',
  PRODUCT_UPDATED: 'product.updated',
  PRODUCT_DELETED: 'product.deleted',
  STOCK_UPDATED: 'product.stock.updated',

  // Category Events
  CATEGORY_CREATED: 'category.created',
  CATEGORY_UPDATED: 'category.updated',
  CATEGORY_DELETED: 'category.deleted',

  // Search / Indexing Events
  PRODUCT_INDEXED: 'product.indexed',
  PRODUCT_REINDEX_REQUESTED: 'product.reindex.requested',
} as const;

// Type exports for better type safety
export type CatalogTopic = typeof TOPICS[keyof typeof TOPICS];
export type CatalogEvent = typeof EVENTS[keyof typeof EVENTS];

// Helper functions
export const isProductEvent = (event: string): boolean => 
  event.startsWith('product.');

export const isCategoryEvent = (event: string): boolean => 
  event.startsWith('category.');

export default {
  TOPICS,
  EVENTS,
};