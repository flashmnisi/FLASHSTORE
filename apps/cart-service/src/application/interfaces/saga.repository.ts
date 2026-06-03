// apps/cart-service/src/application/interface/saga.repository.ts

import { CheckoutSagaEntity } from '../../domain/entities/checkout-saga.entity';

export interface ISagaRepository {
  create(saga: CheckoutSagaEntity): Promise<CheckoutSagaEntity>;
  update(saga: CheckoutSagaEntity): Promise<CheckoutSagaEntity>;
  findById(id: string): Promise<CheckoutSagaEntity | null>;
}