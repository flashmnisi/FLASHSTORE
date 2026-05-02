// import { Request, Response } from 'express';
// import { stripeWebhookHandler } from '../../infrastructure/payments/webhook.handler';
// import logger from '@org/shared-logger';

// export const stripeWebhookController = async (req: Request, res: Response) => {
//   try {
//     const signature = req.headers['stripe-signature'] as string;
//     const rawBody = (req as any).rawBody;

//     const correlationId = (req as any).correlationId;

//     await stripeWebhookHandler.handle(rawBody, signature, correlationId);

//     res.status(200).json({ received: true });
//   } catch (error: any) {
//     logger.error('Webhook processing failed', {
//       error: error.message,
//     });

//     res.status(400).json({
//       success: false,
//       message: 'Webhook error',
//     });
//   }
// };