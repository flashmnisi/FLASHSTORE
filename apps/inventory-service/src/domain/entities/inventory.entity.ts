// apps/inventory-service/src/domain/entities/inventory.entity.ts

export class InventoryEntity {
  constructor(
    public readonly id: string,
    public readonly productId: string,
    public readonly warehouseId: string,
    public quantity: number,
    public reserved = 0,
    public lastUpdated: Date = new Date()
  ) {}

  get availableStock(): number {
    return this.quantity - this.reserved;
  }

  isStockAvailable(quantity: number): boolean {
    return this.availableStock >= quantity;
  }

  reserve(quantity: number): void {
    if (!this.isStockAvailable(quantity)) {
      throw new Error(`Insufficient stock for product ${this.productId}`);
    }
    this.reserved += quantity;
    this.lastUpdated = new Date();
  }

  release(quantity: number): void {
    this.reserved = Math.max(0, this.reserved - quantity);
    this.lastUpdated = new Date();
  }

  deduct(quantity: number): void {
    if (this.quantity < quantity) {
      throw new Error('Not enough stock to deduct');
    }
    this.quantity -= quantity;
    this.reserved = Math.max(0, this.reserved - quantity);
    this.lastUpdated = new Date();
  }

  addStock(quantity: number): void {
    this.quantity += quantity;
    this.lastUpdated = new Date();
  }
}