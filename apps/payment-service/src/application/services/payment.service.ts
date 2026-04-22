import { PaymentEntity } from '../../domain/entities/payment.entity';
import { ProcessPaymentDto, processPaymentSchema } from '../dtos/process-payment.dto';
import { IPaymentRepository } from '../interfaces/payment.repository';
import { IPaymentProvider } from '../interfaces/payment.provider';
import { PaymentProducer } from '../../infrastructure/kafka/producer';
import { idempotencyService } from '@org/shared-kafka';
import logger from '../../utils/logger';

export class PaymentService {
  constructor(
    private readonly repository: IPaymentRepository,
    private readonly provider: IPaymentProvider,
    private readonly producer: PaymentProducer
  ) {}

  /**
   * 🔥 MAIN ENTRY: Process Payment (Saga Step)
   */
  async processPayment(input: ProcessPaymentDto, context?: { correlationId?: string }) {
    const log = logger.withContext({
      correlationId: context?.correlationId,
      service: 'payment-service',
    });

    try {
      // =============================
      // 1. Validate DTO
      // =============================
      const dto = processPaymentSchema.parse(input);

      log.info('Processing payment request', {
        orderId: dto.orderId,
        userId: dto.userId,
        amount: dto.amount,
      });

      // =============================
      // 2. Idempotency (CRITICAL)
      // =============================
      const existingPayment = await this.repository.findByOrderId(dto.orderId);

      if (existingPayment) {
        log.warn('Duplicate payment prevented', {
          orderId: dto.orderId,
          paymentId: existingPayment.id,
        });

        return existingPayment;
      }

      // =============================
      // 3. Create Payment Record
      // =============================
      const payment = new PaymentEntity(
        '',
        dto.orderId,
        dto.userId,
        dto.amount,
        dto.currency,
        'pending',
        dto.paymentMethod,
        undefined,
        dto.metadata
      );

      const savedPayment = await this.repository.create(payment);

      // =============================
      // 4. Call Payment Provider (Stripe)
      // =============================
      const providerResult = await this.provider.createPaymentIntent({
        amount: dto.amount,
        currency: dto.currency,
        orderId: dto.orderId,
        userId: dto.userId,
        metadata: dto.metadata,
      });

      // =============================
      // 5. Update Payment with Provider Data
      // =============================
      savedPayment.stripePaymentIntentId = providerResult.paymentIntentId;

      await this.repository.update(savedPayment);

      // =============================
      // 6. Publish Kafka Event (Saga Start)
      // =============================
      await this.producer.paymentInitiated({
        paymentId: savedPayment.id,
        orderId: savedPayment.orderId,
        userId: savedPayment.userId,
        amount: savedPayment.amount,
        currency: savedPayment.currency,
      });

      log.info('Payment initiated successfully', {
        paymentId: savedPayment.id,
        orderId: savedPayment.orderId,
      });

      return {
        paymentId: savedPayment.id,
        clientSecret: providerResult.clientSecret,
        status: savedPayment.status,
      };

    } catch (error: any) {
      log.error('Payment processing failed', {
        error: error.message,
        stack: error.stack,
      });

      throw error;
    }
  }

  /**
   * 🔥 HANDLE STRIPE WEBHOOK (Saga Completion)
   */
  async handleWebhook(payload: string, signature: string, context?: { correlationId?: string }) {
    const log = logger.withContext({
      correlationId: context?.correlationId,
    });

    try {
      // =============================
      // 1. Verify Webhook Signature
      // =============================
      const event = await this.provider.verifyWebhookSignature(payload, signature);

      log.info('Webhook received', {
        type: event.eventType,
      });

      const data = event.data;

      const paymentIntentId = data?.id;

      if (!paymentIntentId) {
        log.warn('Webhook missing paymentIntentId');
        return;
      }

      // =============================
      // 2. Idempotency (EVENT LEVEL)
      // =============================
      const isDuplicate = await idempotencyService.isDuplicate(
        event.eventType + ':' + paymentIntentId,
        'payment-service'
      );

      if (isDuplicate) {
        log.warn('Duplicate webhook ignored', {
          paymentIntentId,
        });
        return;
      }

      // =============================
      // 3. Find Payment
      // =============================
      const payment = await this.repository.findByStripePaymentIntentId(paymentIntentId);

      if (!payment) {
        log.error('Payment not found for webhook', { paymentIntentId });
        return;
      }

      // =============================
      // 4. Handle Events
      // =============================
      switch (event.eventType) {
        case 'payment_intent.succeeded': {
          payment.status = 'succeeded';
          await this.repository.update(payment);

          await this.producer.paymentCompleted({
            paymentId: payment.id,
            orderId: payment.orderId,
            userId: payment.userId,
            amount: payment.amount,
            currency: payment.currency,
          });

          log.info('Payment succeeded', { paymentId: payment.id });
          break;
        }

        case 'payment_intent.payment_failed': {
          payment.status = 'failed';
          await this.repository.update(payment);

          await this.producer.paymentFailed({
            paymentId: payment.id,
            orderId: payment.orderId,
            userId: payment.userId,
          });

          log.warn('Payment failed', { paymentId: payment.id });
          break;
        }

        default:
          log.info('Unhandled webhook event', { type: event.eventType });
      }

    } catch (error: any) {
      log.error('Webhook handling failed', {
        error: error.message,
      });
      throw error;
    }
  }
}