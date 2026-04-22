export type Currency = 'ZAR' | 'USD' | 'EUR' | 'GBP';

export class Money {
  private readonly amount: number; // stored in cents
  private readonly currency: Currency;

  private constructor(amount: number, currency: Currency) {
    if (amount < 0) {
      throw new Error('Amount cannot be negative');
    }

    if (!Number.isInteger(amount)) {
      throw new Error('Amount must be in smallest currency unit (cents)');
    }

    this.amount = amount;
    this.currency = currency;
  }

  /**
   * Create from major unit (e.g. 100.50 ZAR)
   */
  static fromDecimal(value: number, currency: Currency = 'ZAR'): Money {
    return new Money(Math.round(value * 100), currency);
  }

  /**
   * Create from cents directly
   */
  static fromCents(amount: number, currency: Currency = 'ZAR'): Money {
    return new Money(amount, currency);
  }

  /**
   * Get value in cents
   */
  getAmount(): number {
    return this.amount;
  }

  /**
   * Get decimal value
   */
  toDecimal(): number {
    return this.amount / 100;
  }

  getCurrency(): Currency {
    return this.currency;
  }

  /**
   * Add money safely
   */
  add(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this.amount + other.amount, this.currency);
  }

  /**
   * Subtract money safely
   */
  subtract(other: Money): Money {
    this.assertSameCurrency(other);

    if (this.amount < other.amount) {
      throw new Error('Insufficient amount');
    }

    return new Money(this.amount - other.amount, this.currency);
  }

  /**
   * Compare values
   */
  equals(other: Money): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }

  private assertSameCurrency(other: Money) {
    if (this.currency !== other.currency) {
      throw new Error('Currency mismatch');
    }
  }
}