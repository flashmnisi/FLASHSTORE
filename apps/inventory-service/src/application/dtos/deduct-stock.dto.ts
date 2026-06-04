// apps/inventory-service/src/application/dtos/deduct-stock.dto.ts

export interface DeductStockDto {
  productId: string;
  warehouseId: string;

  quantity: number;

  orderId: string;

  correlationId: string;

  referenceId?: string;

  reason?: string;
}