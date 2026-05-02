// apps/catalog-service/src/domain/value-objects/price.vo.ts

export class Price {
  private readonly _amount: number;
  private readonly _currency: string;

  private constructor(amount: number, currency: string) {
    this._amount = amount;
    this._currency = currency;
  }

  static create(amount: number, currency: string = 'ZAR'): Price {
    if (amount < 0) {
      throw new Error('Price cannot be negative');
    }
    if (!['ZAR', 'USD', 'EUR', 'GBP'].includes(currency)) {
      throw new Error('Unsupported currency');
    }
    return new Price(Math.round(amount * 100) / 100, currency); // 2 decimal places
  }

  get amount(): number {
    return this._amount;
  }

  get currency(): string {
    return this._currency;
  }

  add(other: Price): Price {
    if (this._currency !== other._currency) {
      throw new Error('Cannot add prices with different currencies');
    }
    return Price.create(this._amount + other._amount, this._currency);
  }

  multiply(quantity: number): Price {
    if (quantity < 0) throw new Error('Quantity cannot be negative');
    return Price.create(this._amount * quantity, this._currency);
  }

  toString(): string {
    return `${this._currency} ${this._amount.toFixed(2)}`;
  }

  equals(other: Price): boolean {
    return this._amount === other._amount && this._currency === other._currency;
  }
}