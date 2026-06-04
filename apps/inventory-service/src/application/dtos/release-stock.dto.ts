// apps/inventory-service/src/application/dtos/release-stock.dto.ts

export interface ReleaseStockDto {
  productId: string;
  warehouseId: string;

  quantity: number;

  orderId: string;

  correlationId: string;

  referenceId?: string;

  reason?: string;
}