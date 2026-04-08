import { Router, Request, Response } from 'express';
import { publish } from '@org/shared-kafka';
import { generateAccessToken } from '@org/shared-auth';
import logger from '@org/shared-logger';
import { protect } from '../middleware/auth.middleware';
import { createServiceProxy } from '../services/proxy';

const router = Router();

// ====================== WELCOME ROUTE ======================
router.get('/', (req: Request, res: Response) => {
  res.json({
    message: '🚀 Welcome to Flashstore API Gateway',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      login: 'POST /api/auth/login',
      publishEvent: 'POST /api/events/publish',
      protectedProfile: 'GET /api/profile (requires Bearer token)',
      services: [
        '/api/users',
        '/api/catalog',
        '/api/cart',
        '/api/orders',
        '/api/payments',
        '/api/notifications'
      ]
    }
  });
});

// ====================== HEALTH CHECK ======================
router.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    status: 'healthy',
    service: 'flashstore-gateway',
    timestamp: new Date().toISOString()
  });
});

// ====================== LOGIN ROUTE (for testing) ======================
router.post('/auth/login', (req: Request, res: Response) => {
  const { email, userId = 1 } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Email is required'
    });
  }

  const token = generateAccessToken({
    userId: String(userId),
    email,
    role: 'user'
  });

  logger.info(
    { email, userId: Number(userId) },
    'User logged in successfully'
  );

  return res.json({
    success: true,
    message: 'Login successful',
    accessToken: token,
    user: { 
      userId: Number(userId), 
      email 
    }
  });
});

// ====================== KAFKA EVENT PUBLISH ======================
router.post('/events/publish', async (req: Request, res: Response) => {
  try {
    const { event, data = {}, topic = 'flashstore.events' } = req.body;

    if (!event) {
      return res.status(400).json({
        success: false,
        message: 'event field is required'
      });
    }

    const key = data.userId 
      ? String(data.userId) 
      : (data.orderId ? String(data.orderId) : undefined);

    await publish({
      topic,
      message: {
        event,
        data,
        service: 'gateway',
        timestamp: new Date().toISOString(),
        source: 'api'
      },
      key
    });

    logger.info(
      { event, topic, userId: data.userId },
      `Event published: ${event}`
    );

    return res.json({
      success: true,
      message: 'Event successfully published to Kafka',
      event,
      topic
    });

  } catch (error: any) {
    logger.error(
      { 
        error: error.message,
        event: req.body?.event 
      },
      'Failed to publish event from gateway'
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to publish event',
      details: error.message
    });
  }
});

// ====================== PROTECTED EXAMPLE ROUTE ======================
router.get('/profile', protect, (req: Request, res: Response) => {
  const user = (req as any).user;

  return res.json({
    success: true,
    message: 'Protected profile data',
    user
  });
});

// ====================== MICROSERVICE PROXY ROUTES ======================
// All proxies are mounted under /api
router.use('/users', createServiceProxy('user', '/users'));
router.use('/catalog', createServiceProxy('catalog', '/catalog'));
router.use('/cart', createServiceProxy('cart', '/cart'));
router.use('/orders', createServiceProxy('order', '/orders'));
router.use('/payments', createServiceProxy('payment', '/payments'));
router.use('/notifications', createServiceProxy('notification', '/notifications'));

export default router;