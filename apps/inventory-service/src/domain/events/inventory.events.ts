// apps/inventory-service/src/domain/events/inventory.events.ts

export const INVENTORY_EVENTS = {
  STOCK_RESERVED: 'inventory.stock.reserved',
  STOCK_RELEASED: 'inventory.stock.released',
  STOCK_DEDUCTED: 'inventory.stock.deducted',
  STOCK_ADDED: 'inventory.stock.added',
  STOCK_ADJUSTED: 'inventory.stock.adjusted',
  LOW_STOCK: 'inventory.low.stock',
} as const;

export function createStockReservedEvent(data: {
  productId: string;
  warehouseId: string;
  orderId: string;
  quantity: number;
}) {
  return {
    event: INVENTORY_EVENTS.STOCK_RESERVED,
    occurredAt: new Date(),
    data,
  };
}

export function createStockReleasedEvent(data: {
  productId: string;
  warehouseId: string;
  orderId: string;
  quantity: number;
}) {
  return {
    event: INVENTORY_EVENTS.STOCK_RELEASED,
    occurredAt: new Date(),
    data,
  };
}

export function createStockDeductedEvent(data: {
  productId: string;
  warehouseId: string;
  orderId: string;
  quantity: number;
}) {
  return {
    event: INVENTORY_EVENTS.STOCK_DEDUCTED,
    occurredAt: new Date(),
    data,
  };
}

export function createStockAddedEvent(data: {
  productId: string;
  warehouseId: string;
  quantity: number;
  reason?: string;
}) {
  return {
    event: INVENTORY_EVENTS.STOCK_ADDED,
    occurredAt: new Date(),
    data,
  };
}

export function createStockAdjustedEvent(data: {
  productId: string;
  warehouseId: string;
  previousQuantity: number;
  newQuantity: number;
  reason?: string;
}) {
  return {
    event: INVENTORY_EVENTS.STOCK_ADJUSTED,
    occurredAt: new Date(),
    data,
  };
}

export function createLowStockEvent(data: {
  productId: string;
  warehouseId: string;
  availableStock: number;
}) {
  return {
    event: INVENTORY_EVENTS.LOW_STOCK,
    occurredAt: new Date(),
    data,
  };
}