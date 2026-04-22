// apps/payment-service/src/infrastructure/persistence/repositories/payment.repository.impl.ts

import { IPaymentRepository } from '../../../application/interfaces/payment.repository';
import { PaymentEntity } from '../../../domain/entities/payment.entity';
import { PaymentModel, PaymentDocument } from '../models/payment.model';
import logger from '@org/shared-logger';

export class PaymentRepository implements IPaymentRepository {

  // 🔁 Document → Entity
  private toEntity(doc: PaymentDocument): PaymentEntity {
    return new PaymentEntity(
      doc._id.toString(),
      doc.orderId,
      doc.userId,
      doc.amount,
      doc.currency,
      doc.status,
      doc.paymentMethod,
      doc.stripePaymentIntentId,
      doc.metadata,
      doc.createdAt
    );
  }

  // 🔁 Entity → DB object
  private toPersistence(entity: PaymentEntity) {
    return {
      orderId: entity.orderId,
      userId: entity.userId,
      amount: entity.amount,
      currency: entity.currency,
      status: entity.status,
      paymentMethod: entity.paymentMethod,
      stripePaymentIntentId: entity.stripePaymentIntentId,
      metadata: entity.metadata,
    };
  }

  /**
   * Save new payment
   */
  async save(payment: PaymentEntity): Promise<PaymentEntity> {
    try {
      const doc = await PaymentModel.create(this.toPersistence(payment));

      logger.info('Payment saved', {
        paymentId: doc._id.toString(),
        orderId: doc.orderId,
      });

      return this.toEntity(doc);
    } catch (error: any) {
      logger.error('Failed to save payment', {
        error: error.message,
        orderId: payment.orderId,
      });
      throw error;
    }
  }

  /**
   * Update payment
   */
  async update(payment: PaymentEntity): Promise<PaymentEntity> {
    try {
      const updated = await PaymentModel.findByIdAndUpdate(
        payment.id,
        this.toPersistence(payment),
        { new: true }
      );

      if (!updated) {
        throw new Error('Payment not found');
      }

      logger.info('Payment updated', {
        paymentId: payment.id,
        status: payment.status,
      });

      return this.toEntity(updated);
    } catch (error: any) {
      logger.error('Failed to update payment', {
        error: error.message,
        paymentId: payment.id,
      });
      throw error;
    }
  }

  /**
   * Find by Stripe ID
   */
  async findByStripePaymentIntentId(
    stripeId: string
  ): Promise<PaymentEntity | null> {
    const doc = await PaymentModel.findOne({
      stripePaymentIntentId: stripeId,
    });

    return doc ? this.toEntity(doc) : null;
  }

  /**
   * Find by Order ID
   */
  async findByOrderId(orderId: string): Promise<PaymentEntity | null> {
    const doc = await PaymentModel.findOne({ orderId });
    return doc ? this.toEntity(doc) : null;
  }

  /**
   * Find by ID
   */
  async findById(id: string): Promise<PaymentEntity | null> {
    const doc = await PaymentModel.findById(id);
    return doc ? this.toEntity(doc) : null;
  }
}