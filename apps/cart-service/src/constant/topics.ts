export const TOPICS = {
  CART: 'flashstore.cart',
  ORDER: 'flashstore.orders',
} as const;

export const CART_EVENTS = {
  CART_UPDATED: 'cart.updated',
  CART_CLEARED: 'cart.cleared',
  ITEM_ADDED: 'cart.item.added',
  ITEM_REMOVED: 'cart.item.removed',
} as const;