import { Price } from './price.vo';

describe('Price', () => {
  describe('create', () => {
    it('creates a price using ZAR by default', () => {
      const price = Price.create(100);

      expect(price.amount).toBe(100);
      expect(price.currency).toBe('ZAR');
    });

    it('supports all configured currencies', () => {
      for (const currency of ['ZAR', 'USD', 'EUR', 'GBP']) {
        expect(Price.create(100, currency).currency).toBe(currency);
      }
    });

    it('rounds amounts to two decimal places', () => {
      expect(Price.create(10.239).amount).toBe(10.24);
    });

    it('allows a zero price', () => {
      expect(Price.create(0).amount).toBe(0);
    });

    it('rejects negative amounts', () => {
      expect(() => Price.create(-1)).toThrow('Price cannot be negative');
    });

    it('rejects unsupported currencies', () => {
      expect(() => Price.create(100, 'JPY')).toThrow('Unsupported currency');
    });

    it.each([NaN, Infinity, -Infinity])(
      'rejects non-finite amounts: %s',
      (amount) => {
        expect(() => Price.create(amount)).toThrow(
          'Price amount must be a finite number',
        );
      },
    );
  });

  describe('add', () => {
    it('adds prices with the same currency', () => {
      const result = Price.create(100).add(Price.create(50));

      expect(result.amount).toBe(150);
      expect(result.currency).toBe('ZAR');
    });

    it('rejects prices with different currencies', () => {
      expect(() => Price.create(100, 'ZAR').add(Price.create(50, 'USD')))
        .toThrow('Cannot add prices with different currencies');
    });
  });

  describe('multiply', () => {
    it('multiplies a price by a quantity', () => {
      const result = Price.create(25).multiply(4);

      expect(result.amount).toBe(100);
      expect(result.currency).toBe('ZAR');
    });

    it('allows multiplication by zero', () => {
      expect(Price.create(25).multiply(0).amount).toBe(0);
    });

    it('rejects negative quantities', () => {
      expect(() => Price.create(25).multiply(-1)).toThrow(
        'Quantity cannot be negative',
      );
    });

    it.each([NaN, Infinity, -Infinity])(
      'rejects non-finite quantities: %s',
      (quantity) => {
        expect(() => Price.create(25).multiply(quantity)).toThrow(
          'Quantity must be a finite number',
        );
      },
    );
  });

  describe('toString', () => {
    it('formats the currency and amount to two decimal places', () => {
      expect(Price.create(100).toString()).toBe('ZAR 100.00');
    });
  });

  describe('equals', () => {
    it('returns true for equal prices', () => {
      expect(Price.create(100).equals(Price.create(100))).toBe(true);
    });

    it('returns false for different amounts', () => {
      expect(Price.create(100).equals(Price.create(200))).toBe(false);
    });

    it('returns false for different currencies', () => {
      expect(Price.create(100, 'ZAR').equals(Price.create(100, 'USD')))
        .toBe(false);
    });
  });
});
