import { Money } from '../value-objects/money.vo';

export class PaymentEntity {
  constructor(
    public readonly id: string,
    public orderId: string,
    public userId: string,
    public amount: Money,
    public status: 'pending' | 'succeeded' | 'failed' = 'pending',
    public paymentMethod: string,
    public stripePaymentIntentId?: string,
    public metadata?: Record<string, any>,
    public createdAt: Date = new Date()
  ) {}

  markSucceeded() {
    this.status = 'succeeded';
  }

  markFailed() {
    this.status = 'failed';
  }

  isSuccessful(): boolean {
    return this.status === 'succeeded';
  }
}