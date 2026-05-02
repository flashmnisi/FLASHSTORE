// apps/catalog-service/src/domain/entities/inventory.entity.ts

export class InventoryEntity {
  constructor(
    public readonly id: string = '',
    public readonly productId: string,
    private _quantity: number,
    private _reserved: number = 0,
    private _lowStockThreshold: number = 10,
    private _isActive: boolean = true,
    public readonly createdAt: Date = new Date(),
    private _updatedAt?: Date
  ) {}

  get quantity(): number { return this._quantity; }
  get reserved(): number { return this._reserved; }
  get available(): number { return this._quantity - this._reserved; }
  get lowStockThreshold(): number { return this._lowStockThreshold; }
  get isActive(): boolean { return this._isActive; }
  get updatedAt(): Date | undefined { return this._updatedAt; }

  /** Increase stock */
  increaseStock(quantity: number): void {
    if (quantity <= 0) throw new Error('Quantity must be positive');
    this._quantity += quantity;
    this._updatedAt = new Date();
  }

  /** Decrease stock (for sales) */
  decreaseStock(quantity: number): void {
    if (quantity <= 0) throw new Error('Quantity must be positive');
    if (quantity > this.available) throw new Error('Insufficient stock');
    this._quantity -= quantity;
    this._updatedAt = new Date();
  }

  /** Reserve stock (during checkout) */
  reserve(quantity: number): void {
    if (quantity > this.available) throw new Error('Insufficient stock to reserve');
    this._reserved += quantity;
    this._updatedAt = new Date();
  }

  /** Release reserved stock */
  releaseReservation(quantity: number): void {
    if (quantity > this._reserved) throw new Error('Cannot release more than reserved');
    this._reserved -= quantity;
    this._updatedAt = new Date();
  }

  updateLowStockThreshold(threshold: number): void {
    if (threshold < 0) throw new Error('Threshold cannot be negative');
    this._lowStockThreshold = threshold;
    this._updatedAt = new Date();
  }

  activate(): void {
    this._isActive = true;
    this._updatedAt = new Date();
  }

  deactivate(): void {
    this._isActive = false;
    this._updatedAt = new Date();
  }

  isLowStock(): boolean {
    return this.available <= this._lowStockThreshold;
  }

  toJSON() {
    return {
      id: this.id,
      productId: this.productId,
      quantity: this._quantity,
      reserved: this._reserved,
      available: this.available,
      lowStockThreshold: this._lowStockThreshold,
      isLowStock: this.isLowStock(),
      isActive: this._isActive,
      createdAt: this.createdAt,
      updatedAt: this._updatedAt,
    };
  }
}