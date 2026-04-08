export const TOPICS = {
  PRODUCTS: 'flashstore.products',
  CATEGORIES: 'flashstore.categories',
  INVENTORY: 'flashstore.inventory',
} as const;

export const PRODUCT_EVENTS = {
  PRODUCT_CREATED: 'product.created',
  PRODUCT_UPDATED: 'product.updated',
  PRODUCT_DELETED: 'product.deleted',
  STOCK_UPDATED: 'stock.updated',
} as const;

export const CATEGORY_EVENTS = {
  CATEGORY_CREATED: 'category.created',
  CATEGORY_UPDATED: 'category.updated',
} as const;