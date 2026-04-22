import express from 'express';
import paymentRoutes from './presentation/routes/payment.routes';
import logger from './utils/logger';

const app = express();

// ⚠️ IMPORTANT: Stripe webhook requires raw body
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());

app.use('/api/payments', paymentRoutes);

// Health check
app.get('/health', (_, res) => {
  res.send('Payment Service is healthy');
});

// Global error handler
app.use((err: any, req: any, res: any, next: any) => {
  logger.error('Unhandled error', { error: err.message });

  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
});

export default app;