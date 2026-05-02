// apps/payment-service/src/application/use-cases/process-payment.usecase.ts

import {
  ProcessPaymentDto,
  processPaymentSchema,
} from '../dtos/process-payment.dto';
import { IPaymentRepository } from '../interfaces/payment.repository';
import { IPaymentProvider } from '../interfaces/payment.provider';
import { PaymentProducer } from '../../infrastructure/kafka/payment.producer';
import { Money } from '../../domain/value-objects/money.vo';
import { PaymentEntity } from '../../domain/entities/payment.entity';
import logger from '@org/shared-logger';

export class ProcessPaymentUseCase {
  constructor(
    private readonly repository: IPaymentRepository,
    private readonly provider: IPaymentProvider,
    private readonly producer: PaymentProducer
  ) {}

  async execute(
    input: ProcessPaymentDto,
    context?: { correlationId?: string }
  ) {
    try {
      const dto = processPaymentSchema.parse(input);
      const money = Money.create(dto.amount, dto.currency);

      logger.info('Processing payment', {
        orderId: dto.orderId,
        amount: money.getAmount(),
        currency: money.getCurrency(),
        correlationId: context?.correlationId,
      });

      // Idempotency
      const existing = await this.repository.findByOrderId(dto.orderId);
      if (existing) {
        logger.warn('Duplicate payment prevented', { orderId: dto.orderId });
        return {
          paymentId: existing.id,
          status: existing.status,
          stripePaymentIntentId: existing.stripePaymentIntentId,
        };
      }

      // Create payment entity
      const payment = new PaymentEntity(
        '',
        dto.orderId,
        dto.userId,
        money.getAmount(),
        money.getCurrency(),
        'processing',
        dto.paymentMethod,
        undefined,
        dto.metadata
      );

      const savedPayment = await this.repository.create(payment);

      // Call provider
      const providerResult = await this.provider.createPaymentIntent({
        amount: money.getAmount(),
        currency: money.getCurrency(),
        orderId: dto.orderId,
        userId: dto.userId,
        metadata: dto.metadata,
      });

      // Update
      savedPayment.stripePaymentIntentId = providerResult.paymentIntentId;
      savedPayment.status = 'pending';

      await this.repository.update(savedPayment);

      // Outbox event
      await this.producer.paymentInitiatedOutbox(savedPayment);

      logger.info('Payment initiated successfully', {
        paymentId: savedPayment.id,
        orderId: dto.orderId,
      });

      return {
        paymentId: savedPayment.id,
        clientSecret: providerResult.clientSecret,
        status: savedPayment.status,
      };
    } catch (error: any) {
      logger.error('ProcessPaymentUseCase failed', {
        orderId: input.orderId,
        error: error.message,
      });
      throw error;
    }
  }
}