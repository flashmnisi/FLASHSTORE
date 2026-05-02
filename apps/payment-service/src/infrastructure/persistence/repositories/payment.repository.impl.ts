// apps/payment-service/src/infrastructure/persistence/mongoose/repositories/payment.repository.impl.ts

import logger from '@org/shared-logger';
import { PaymentEntity } from '../../../domain/entities/payment.entity';
import { IPaymentRepository } from '../../../application/interfaces/payment.repository';
import { AppError } from '../../../middlewares/error.middleware';
import { PaymentModel } from '../models/payment.model';

export class PaymentRepositoryImpl implements IPaymentRepository {

  async create(payment: PaymentEntity): Promise<PaymentEntity> {
    try {
      const paymentDoc = await PaymentModel.create({
        orderId: payment.orderId,
        userId: payment.userId,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        paymentMethod: payment.paymentMethod,
        stripePaymentIntentId: payment.stripePaymentIntentId,
        metadata: payment.metadata,
      });

      return new PaymentEntity(
        paymentDoc._id.toString(),
        paymentDoc.orderId,
        paymentDoc.userId,
        paymentDoc.amount,
        paymentDoc.currency,
        paymentDoc.status,
        paymentDoc.paymentMethod,
        paymentDoc.stripePaymentIntentId,
        paymentDoc.metadata,
        paymentDoc.createdAt
      );
    } catch (error: any) {
      logger.error('Failed to create payment', { orderId: payment.orderId, error: error.message });
      throw new AppError('Failed to create payment', 500);
    }
  }

  async update(payment: PaymentEntity): Promise<PaymentEntity> {
    try {
      const paymentDoc = await PaymentModel.findByIdAndUpdate(
        payment.id,
        {
          status: payment.status,
          stripePaymentIntentId: payment.stripePaymentIntentId,
          metadata: payment.metadata,
          updatedAt: new Date(),
        },
        { new: true }
      );

      if (!paymentDoc) throw new AppError('Payment not found', 404);

      return new PaymentEntity(
        paymentDoc._id.toString(),
        paymentDoc.orderId,
        paymentDoc.userId,
        paymentDoc.amount,
        paymentDoc.currency,
        paymentDoc.status,
        paymentDoc.paymentMethod,
        paymentDoc.stripePaymentIntentId,
        paymentDoc.metadata,
        paymentDoc.createdAt
      );
    } catch (error: any) {
      logger.error('Failed to update payment', { paymentId: payment.id });
      throw error;
    }
  }

  async findById(id: string): Promise<PaymentEntity | null> {
    const paymentDoc = await PaymentModel.findById(id);
    if (!paymentDoc) return null;

    return this.toEntity(paymentDoc);
  }

  async findByOrderId(orderId: string): Promise<PaymentEntity | null> {
    const paymentDoc = await PaymentModel.findOne({ orderId });
    if (!paymentDoc) return null;

    return this.toEntity(paymentDoc);
  }

  async findByStripePaymentIntentId(stripePaymentIntentId: string): Promise<PaymentEntity | null> {
    const paymentDoc = await PaymentModel.findOne({ stripePaymentIntentId });
    if (!paymentDoc) return null;

    return this.toEntity(paymentDoc);
  }

  async findByUserId(userId: string): Promise<PaymentEntity[]> {
    const paymentDocs = await PaymentModel.find({ userId }).sort({ createdAt: -1 });
    return paymentDocs.map(doc => this.toEntity(doc));
  }

  async findByStatus(status: string): Promise<PaymentEntity[]> {
    const paymentDocs = await PaymentModel.find({ status });
    return paymentDocs.map(doc => this.toEntity(doc));
  }

  async existsByOrderId(orderId: string): Promise<boolean> {
    const count = await PaymentModel.countDocuments({ orderId });
    return count > 0;
  }

  async updateStatus(id: string, status: string): Promise<PaymentEntity | null> {
    const paymentDoc = await PaymentModel.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true }
    );

    return paymentDoc ? this.toEntity(paymentDoc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await PaymentModel.findByIdAndDelete(id);
    return !!result;
  }

  // Helper method to convert Mongoose document to Entity
  private toEntity(doc: any): PaymentEntity {
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
}