// apps/payment-service/src/domain/value-objects/money.vo.ts

export class Money {
  private constructor(
    private readonly _amount: number,
    private readonly _currency: string
  ) {}

  /**
   * Factory method - the only way to create Money
   */
  static create(amount: number, currency: string): Money {
    if (amount < 0) throw new Error('Amount cannot be negative');
    if (!currency || currency.length !== 3) throw new Error('Invalid currency');

    return new Money(amount, currency.toUpperCase());
  }

  getAmount(): number {
    return this._amount;
  }

  getCurrency(): string {
    return this._currency;
  }

  add(other: Money): Money {
    if (this._currency !== other._currency) throw new Error('Currency mismatch');
    return Money.create(this._amount + other._amount, this._currency);
  }

  toString(): string {
    return `${this._amount} ${this._currency}`;
  }
}