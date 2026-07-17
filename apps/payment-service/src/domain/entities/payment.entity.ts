// apps/payment-service/src/domain/entities/payment.entity.ts

import { Money } from '../value-objects/money.vo';

export type PaymentStatus = 'pending' | 'processing' | 'succeeded' | 'failed';

export class PaymentEntity {
  markAsCanceled() {
    throw new Error('Method not implemented.');
  }
  constructor(
    public readonly id = '',
    public orderId: string,
    public userId: string,
    public readonly amount: number,
    public readonly currency: string,
    public status: PaymentStatus = 'pending',
    public paymentMethod = 'card',
    public stripePaymentIntentId?: string,
    public metadata?: Record<string, any>,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  // ======================
  // DOMAIN METHODS
  // ======================

  /**
   * Get Money Value Object
   */
  getMoney(): Money {
    return Money.create(this.amount, this.currency);
  }

  markSucceeded(stripePaymentIntentId?: string): void {
    this.status = 'succeeded';
    if (stripePaymentIntentId)
      this.stripePaymentIntentId = stripePaymentIntentId;
    this.updatedAt = new Date();
  }

  markFailed(reason?: string): void {
    this.status = 'failed';
    if (reason && this.metadata) {
      this.metadata.failureReason = reason;
    }
    this.updatedAt = new Date();
  }

  markProcessing(): void {
    this.status = 'processing';
    this.updatedAt = new Date();
  }

  isSuccessful(): boolean {
    return this.status === 'succeeded';
  }

  isFinalized(): boolean {
    return this.status === 'succeeded' || this.status === 'failed';
  }

  addMetadata(key: string, value: any): void {
    if (!this.metadata) this.metadata = {};
    this.metadata[key] = value;
    this.updatedAt = new Date();
  }

  // ======================
  // SERIALIZATION
  // ======================
  toJSON() {
    return {
      id: this.id,
      orderId: this.orderId,
      userId: this.userId,
      amount: this.amount,
      currency: this.currency,
      status: this.status,
      paymentMethod: this.paymentMethod,
      stripePaymentIntentId: this.stripePaymentIntentId,
      metadata: this.metadata,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
