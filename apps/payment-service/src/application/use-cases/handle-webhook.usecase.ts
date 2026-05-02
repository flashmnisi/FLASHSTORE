// // apps/payment-service/src/application/use-cases/handle-webhook.usecase.ts
// ;
// import { PaymentRepository } from '../../domain/repositories/payment.repository';
// import { StripeWebhookDto, stripeWebhookSchema } from '../dtos/webhook.dto';

// export class HandleWebhookUseCase {
//   constructor(
//     private readonly paymentRepository: PaymentRepository
//   ) {}

//   async execute(input: StripeWebhookDto) {
//     // 1. Validate webhook payload
//     const event = stripeWebhookSchema.parse(input);

//     const paymentIntent = event.data.object;

//     const { orderId } = paymentIntent.metadata;

//     if (!orderId) {
//       throw new Error('Missing orderId in metadata');
//     }

//     // 2. Find payment
//     const payment = await this.paymentRepository.findByOrderId(orderId);

//     if (!payment) {
//       throw new Error(`Payment not found for order ${orderId}`);
//     }

//     // 3. Handle event type
//     switch (event.type) {
//       case 'payment_intent.succeeded':
//         payment.markAsSucceeded();
//         break;

//       case 'payment_intent.payment_failed':
//         payment.markAsFailed();
//         break;

//       case 'payment_intent.processing':
//         payment.markAsProcessing(paymentIntent.id);
//         break;

//       case 'payment_intent.canceled':
//         payment.markAsCanceled();
//         break;

//       default:
//         throw new Error(`Unhandled event type: ${event.type}`);
//     }

//     // 4. Persist changes
//     await this.paymentRepository.save(payment);

//     return { status: 'ok' };
//   }
// }