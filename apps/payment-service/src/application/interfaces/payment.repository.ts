import { PaymentEntity } from '../../domain/entities/payment.entity';

export interface IPaymentRepository {
  /**
   * Create a new payment
   */
  create(payment: PaymentEntity): Promise<PaymentEntity>;

  /**
   * Update payment state (status, stripe ID, etc.)
   */
  update(payment: PaymentEntity): Promise<PaymentEntity>;

  /**
   * Find by internal ID
   */
  findById(id: string): Promise<PaymentEntity | null>;

  /**
   * Find payment by order (critical for idempotency)
   */
  findByOrderId(orderId: string): Promise<PaymentEntity | null>;

  /**
   * Find payment by Stripe Payment Intent ID
   */
  findByStripePaymentIntentId(
    stripePaymentIntentId: string
  ): Promise<PaymentEntity | null>;

  /**
   * 🔥 Prevent duplicate payments
   */
  existsByOrderId(orderId: string): Promise<boolean>;

  /**
   * 🔥 Optional: get payments for a user (analytics / history)
   */
  findByUserId(userId: string): Promise<PaymentEntity[]>;

  /**
   * 🔥 Optional: transactional update (important for saga consistency)
   */
  updateStatus(
    paymentId: string,
    status: PaymentEntity['status']
  ): Promise<void>;
}