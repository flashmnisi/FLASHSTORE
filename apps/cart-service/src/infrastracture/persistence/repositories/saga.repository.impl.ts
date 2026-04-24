import { ISagaRepository } from '../../application/interfaces/saga.repository';
import { CheckoutSagaEntity } from '../../domain/entities/checkout-saga.entity';
import { CheckoutSagaModel } from '../persistence/models/checkout-saga.model';

export class SagaRepositoryImpl implements ISagaRepository {

  async create(saga: CheckoutSagaEntity) {
    const doc = await CheckoutSagaModel.create(saga);
    return this.toEntity(doc);
  }

  async update(saga: CheckoutSagaEntity) {
    const doc = await CheckoutSagaModel.findByIdAndUpdate(
      saga.id,
      saga,
      { new: true }
    );

    return this.toEntity(doc!);
  }

  async findById(id: string) {
    const doc = await CheckoutSagaModel.findById(id);
    return doc ? this.toEntity(doc) : null;
  }

  private toEntity(doc: any): CheckoutSagaEntity {
    return new CheckoutSagaEntity(
      doc._id.toString(),
      doc.userId,
      doc.orderId,
      doc.paymentId,
      doc.status,
      doc.payload,
      doc.error,
      doc.createdAt,
      doc.updatedAt
    );
  }
}