// apps/catalog-service/src/domain/value-objects/stock.vo.ts

export class Stock {
  private readonly _quantity: number;
  private readonly _reserved: number;

  private constructor(quantity: number, reserved = 0) {
    this._quantity = quantity;
    this._reserved = reserved;
  }

  static create(quantity: number, reserved = 0): Stock {
    if (quantity < 0) throw new Error('Stock quantity cannot be negative');
    if (reserved < 0) throw new Error('Reserved quantity cannot be negative');
    if (reserved > quantity) throw new Error('Reserved cannot be more than total quantity');

    return new Stock(Math.floor(quantity), Math.floor(reserved));
  }

  get quantity(): number {
    return this._quantity;
  }

  get reserved(): number {
    return this._reserved;
  }

  get available(): number {
    return this._quantity - this._reserved;
  }

  isInStock(): boolean {
    return this.available > 0;
  }

  isLowStock(threshold = 10): boolean {
    return this.available <= threshold;
  }

  canFulfill(quantity: number): boolean {
    return quantity > 0 && quantity <= this.available;
  }

  // Domain behaviors
  addStock(amount: number): Stock {
    if (amount <= 0) throw new Error('Amount must be positive');
    return Stock.create(this._quantity + amount, this._reserved);
  }

  reserve(amount: number): Stock {
    if (!this.canFulfill(amount)) {
      throw new Error('Insufficient stock to reserve');
    }
    return Stock.create(this._quantity, this._reserved + amount);
  }

  releaseReservation(amount: number): Stock {
    if (amount > this._reserved) throw new Error('Cannot release more than reserved');
    return Stock.create(this._quantity, this._reserved - amount);
  }

  equals(other: Stock): boolean {
    return this._quantity === other._quantity && this._reserved === other._reserved;
  }

  toJSON() {
    return {
      quantity: this._quantity,
      reserved: this._reserved,
      available: this.available,
      inStock: this.isInStock(),
    };
  }
}