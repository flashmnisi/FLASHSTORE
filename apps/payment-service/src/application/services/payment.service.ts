import { PaymentEntity } from '../../domain/entities/payment.entity';
import { ProcessPaymentDto, processPaymentSchema } from '../dtos/process-payment.dto';
import { IPaymentRepository } from '../interfaces/payment.repository';
import { IPaymentProvider } from '../interfaces/payment.provider';
import { PaymentProducer } from '../../infrastructure/kafka/producer';
import { idempotencyService } from '@org/shared-kafka';
import { Money } from '../../domain/value-objects/money.vo';
import logger from '../../utils/logger';

export class PaymentService {
  constructor(
    private readonly repository: IPaymentRepository,
    private readonly provider: IPaymentProvider,
    private readonly producer: PaymentProducer
  ) {}

  /**
   * 🔥 PROCESS PAYMENT (Saga Step)
   */
  async processPayment(input: ProcessPaymentDto, context?: { correlationId?: string }) {
    const log = logger.withContext({
      correlationId: context?.correlationId,
    });

    // =============================
    // 1. Validate DTO
    // =============================
    const dto = processPaymentSchema.parse(input);

    // =============================
    // 2. Use Money VO (CRITICAL FIX)
    // =============================
    const money = new Money(dto.amount, dto.currency);

    log.info('Processing payment', {
      orderId: dto.orderId,
      amount: money.getAmount(),
      currency: money.getCurrency(),
    });

    // =============================
    // 3. Idempotency (ORDER LEVEL)
    // =============================
    const existing = await this.repository.findByOrderId(dto.orderId);

    if (existing) {
      log.warn('Duplicate payment prevented', {
        orderId: dto.orderId,
        paymentId: existing.id,
      });

      return existing;
    }

    // =============================
    // 4. Create Payment (processing state)
    // =============================
    const payment = new PaymentEntity(
      '',
      dto.orderId,
      dto.userId,
      money.getAmount(),
      money.getCurrency(),
      'processing', // 👈 better than pending
      dto.paymentMethod,
      undefined,
      dto.metadata
    );

    const savedPayment = await this.repository.create(payment);

    try {
      // =============================
      // 5. Call Stripe (with retry)
      // =============================
      const providerResult = await this.retryStripeCall(() =>
        this.provider.createPaymentIntent({
          amount: money.getAmount(),
          currency: money.getCurrency(),
          orderId: dto.orderId,
          userId: dto.userId,
          metadata: dto.metadata,
        })
      );

      // =============================
      // 6. Update Payment
      // =============================
      savedPayment.stripePaymentIntentId = providerResult.paymentIntentId;
      savedPayment.status = 'pending';

      await this.repository.update(savedPayment);

      // =============================
      // 7. Outbox instead of direct Kafka (CRITICAL)
      // =============================
      await this.producer.paymentInitiatedOutbox(savedPayment);

      log.info('Payment initiated', {
        paymentId: savedPayment.id,
      });

      return {
        paymentId: savedPayment.id,
        clientSecret: providerResult.clientSecret,
        status: savedPayment.status,
      };

    } catch (error: any) {
      // =============================
      // 8. Mark as failed (compensation)
      // =============================
      savedPayment.status = 'failed';
      await this.repository.update(savedPayment);

      log.error('Payment failed', {
        error: error.message,
        paymentId: savedPayment.id,
      });

      throw error;
    }
  }

  /**
   * 🔥 STRIPE WEBHOOK HANDLER (Saga Completion)
   */
  async handleWebhook(payload: string, signature: string, context?: { correlationId?: string }) {
    const log = logger.withContext({
      correlationId: context?.correlationId,
    });

    // =============================
    // 1. Verify signature
    // =============================
    const event = await this.provider.verifyWebhookSignature(payload, signature);

    const paymentIntentId = event.data?.id;

    if (!paymentIntentId) {
      log.warn('Missing paymentIntentId');
      return;
    }

    // =============================
    // 2. Idempotency (EVENT LEVEL)
    // =============================
    const isDuplicate = await idempotencyService.isDuplicate(
      `${event.eventType}:${paymentIntentId}`,
      'payment-service'
    );

    if (isDuplicate) return;

    // =============================
    // 3. Find payment
    // =============================
    const payment = await this.repository.findByStripePaymentIntentId(paymentIntentId);

    if (!payment) {
      log.error('Payment not found', { paymentIntentId });
      return;
    }

    // =============================
    // 4. Handle events
    // =============================
    switch (event.eventType) {
      case 'payment_intent.succeeded': {
        payment.status = 'succeeded';
        await this.repository.update(payment);

        await this.producer.paymentCompletedOutbox(payment);

        log.info('Payment succeeded', { paymentId: payment.id });
        break;
      }

      case 'payment_intent.payment_failed': {
        payment.status = 'failed';
        await this.repository.update(payment);

        await this.producer.paymentFailedOutbox(payment);

        log.warn('Payment failed', { paymentId: payment.id });
        break;
      }

      default:
        log.info('Unhandled event', { type: event.eventType });
    }
  }

  /**
   * 🔁 Stripe Retry Strategy (Production-grade)
   */
  private async retryStripeCall<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
    let lastError;

    for (let i = 0; i < retries; i++) {
      try {
        return await fn();
      } catch (err: any) {
        lastError = err;

        if (i < retries - 1) {
          await new Promise(r => setTimeout(r, 500 * (i + 1)));
        }
      }
    }

    throw lastError;
  }
}