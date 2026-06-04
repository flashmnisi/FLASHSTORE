// apps/inventory-service/src/domain/entities/stock-movement.entity.ts

export type MovementType = 'IN' | 'OUT' | 'RESERVE' | 'RELEASE' | 'ADJUSTMENT';

export class StockMovementEntity {
  constructor(
    public readonly id: string,
    public readonly productId: string,
    public readonly warehouseId: string,
    public readonly type: MovementType,
    public readonly quantity: number,
    public readonly referenceId?: string, 
    public readonly reason?: string,
    public readonly createdAt: Date = new Date()
  ) {}
}