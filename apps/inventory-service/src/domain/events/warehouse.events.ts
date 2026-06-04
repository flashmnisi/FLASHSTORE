// apps/inventory-service/src/domain/events/warehouse.events.ts

export const WAREHOUSE_EVENTS = {
  WAREHOUSE_CREATED: 'warehouse.created',
  WAREHOUSE_UPDATED: 'warehouse.updated',
  WAREHOUSE_ACTIVATED: 'warehouse.activated',
  WAREHOUSE_DEACTIVATED: 'warehouse.deactivated',
} as const;

export function createWarehouseCreatedEvent(data: {
  warehouseId: string;
  name: string;
  code: string;
}) {
  return {
    event: WAREHOUSE_EVENTS.WAREHOUSE_CREATED,
    occurredAt: new Date(),
    data,
  };
}

export function createWarehouseUpdatedEvent(data: {
  warehouseId: string;
  name: string;
  code: string;
}) {
  return {
    event: WAREHOUSE_EVENTS.WAREHOUSE_UPDATED,
    occurredAt: new Date(),
    data,
  };
}

export function createWarehouseActivatedEvent(data: {
  warehouseId: string;
}) {
  return {
    event: WAREHOUSE_EVENTS.WAREHOUSE_ACTIVATED,
    occurredAt: new Date(),
    data,
  };
}

export function createWarehouseDeactivatedEvent(data: {
  warehouseId: string;
}) {
  return {
    event: WAREHOUSE_EVENTS.WAREHOUSE_DEACTIVATED,
    occurredAt: new Date(),
    data,
  };
}