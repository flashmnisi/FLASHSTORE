// apps/inventory-service/src/application/dtos/reserve-stock.dto.ts

export interface ReserveStockDto {
  productId: string;
  warehouseId: string;

  quantity: number;

  orderId: string;

  correlationId: string;

  referenceId?: string;

  reason?: string;
}