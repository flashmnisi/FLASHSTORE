// apps/payment-service/src/application/interfaces/payment.repository.ts

import { PaymentEntity } from '../../domain/entities/payment.entity';

export interface IPaymentRepository {
  create(payment: PaymentEntity): Promise<PaymentEntity>;
  update(payment: PaymentEntity): Promise<PaymentEntity>;

  findById(id: string): Promise<PaymentEntity | null>;
  findByOrderId(orderId: string): Promise<PaymentEntity | null>;
  findByStripePaymentIntentId(stripePaymentIntentId: string): Promise<PaymentEntity | null>;
  findByUserId(userId: string): Promise<PaymentEntity[]>;
  findByStatus(status: string): Promise<PaymentEntity[]>;

  // Missing methods that caused the error
  existsByOrderId(orderId: string): Promise<boolean>;
  updateStatus(id: string, status: string): Promise<PaymentEntity | null>;

  // Optional but useful
  delete(id: string): Promise<boolean>;
}