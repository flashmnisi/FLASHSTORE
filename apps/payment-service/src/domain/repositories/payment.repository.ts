// apps/payment-service/src/application/interfaces/payment.repository.ts

import { PaymentEntity } from '../../domain/entities/payment.entity';

export interface IPaymentRepository {
  /**
   * Create a new payment record
   */
  create(payment: PaymentEntity): Promise<PaymentEntity>;

  /**
   * Update an existing payment
   */
  update(payment: PaymentEntity): Promise<PaymentEntity>;

  /**
   * Find payment by internal ID
   */
  findById(id: string): Promise<PaymentEntity | null>;

  /**
   * Find payment by Order ID (for idempotency)
   */
  findByOrderId(orderId: string): Promise<PaymentEntity | null>;

  /**
   * Find payment by Stripe Payment Intent ID
   */
  findByStripePaymentIntentId(stripePaymentIntentId: string): Promise<PaymentEntity | null>;

  /**
   * Get all payments for a user
   */
  findByUserId(userId: string): Promise<PaymentEntity[]>;

  /**
   * Get payments by status
   */
  findByStatus(status: string): Promise<PaymentEntity[]>;
}