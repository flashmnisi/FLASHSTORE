// apps/inventory-service/src/application/dtos/adjust-stock.dto.ts

export interface AdjustStockDto {
  productId: string;
  warehouseId: string;
  quantity: number;
  reason?: string;
}