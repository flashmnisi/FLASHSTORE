//gateway/routes/index.ts

import { Router } from 'express';
import { protect } from '../middlewares/auth.middleware';

// Import each module
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import cartRoutes from './cart.routes';
import catalogRoutes from './catalog.routes';
import orderRoutes from './order.routes';
import paymentRoutes from './payment.routes';
import inventoryRoutes from './inventory.routes';

const router = Router();

// ====================== PUBLIC ROUTES ======================
router.use('/api/auth', authRoutes);

// ====================== PROTECTED ROUTES ======================
const protectedRouter = Router();
protectedRouter.use(protect);          

protectedRouter.use('/api/users', userRoutes);
protectedRouter.use('/api/cart', cartRoutes);
protectedRouter.use('/api/orders', orderRoutes);
protectedRouter.use('/api/catalog', catalogRoutes);
protectedRouter.use('/api/payments', paymentRoutes);
protectedRouter.use('/api/inventory', inventoryRoutes);

router.use(protectedRouter);

export default router;

// import { Router } from 'express';
// import userRoutes from './user.routes';
// import cartRoutes from './cart.routes';
// import catalogRoutes from './catalog.routes';
// import orderRoutes from './order.routes';
// import paymentRoutes from './payment.routes';

// const router = Router();

// // Mount each service's sub-routes
// router.use('/users', userRoutes);
// router.use('/catalog', catalogRoutes);
// router.use('/cart', cartRoutes);
// router.use('/orders', orderRoutes);
// router.use('/payments', paymentRoutes);

// export default router;

// // apps/gateway/src/routes/index.ts
// import { Router, Request, Response } from 'express';
// import { publish } from '@org/shared-kafka';
// import logger from '@org/shared-logger';

// const router = Router();

// // Welcome
// router.get('/', (req: Request, res: Response) => {
//   res.json({
//     message: '🚀 Flashstore API Gateway is running',
//     version: '1.0.0',
//     status: 'running',
//     test: 'Use /api/users/register or /api/users/login'
//   });
// });

// // Health
// router.get('/health', (req: Request, res: Response) => {
//   res.json({ status: 'healthy', service: 'gateway' });
// });

// // ====================== DIRECT REGISTER (RELIABLE) ======================
// router.post('/users/register', async (req: Request, res: Response) => {
//   console.log("=== GATEWAY → USER SERVICE (REGISTER) ===");
//   console.log("Body:", req.body);

//   try {
//     const response = await fetch('http://user-service:3001/api/users/register', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(req.body),
//     });

//     const data = await response.json();
//     console.log("User service responded:", data);

//     return res.status(response.status).json(data);
//   } catch (err: any) {
//     console.error("Fetch failed:", err.message);
//     return res.status(502).json({
//       success: false,
//       message: "Failed to reach user-service",
//       error: err.message
//     });
//   }
// });

// // ====================== DIRECT LOGIN ======================
// router.post('/users/login', async (req: Request, res: Response) => {
//   console.log("=== GATEWAY → USER SERVICE (LOGIN) ===");
//   console.log("Body:", req.body);

//   try {
//     const response = await fetch('http://user-service:3001/api/users/login', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(req.body),
//     });

//     const data = await response.json();
//     return res.status(response.status).json(data);
//   } catch (err: any) {
//     console.error("Login fetch failed:", err.message);
//     return res.status(502).json({ success: false, message: err.message });
//   }
// });

// // ====================== KAFKA TEST ======================
// router.post('/events/publish', async (req: Request, res: Response) => {
//   try {
//     await publish({
//       topic: 'flashstore.events',
//       message: { event: req.body.event || 'test_event', data: req.body, source: 'gateway' },
//       key: 'gateway',
//     });
//     res.json({ success: true, message: 'Event published' });
//   } catch (e: any) {
//     logger.error(e.message);
//     res.status(500).json({ success: false, message: e.message });
//   }
// });

// export default router;


// import { Router } from 'express';
// import { publish } from '@org/shared-kafka';
// import logger from '@org/shared-logger';
// import { createServiceProxy } from '../services/proxy';

// const router = Router();

// // ====================== BASIC ROUTES ======================
// router.get('/', (req, res) => {
//   res.json({ 
//     message: '🚀 Flashstore Gateway is running',
//     version: '1.0.0'
//   });
// });

// router.get('/health', (req, res) => {
//   res.json({ 
//     success: true,
//     status: 'healthy', 
//     service: 'gateway' 
//   });
// });

// // ====================== KAFKA TEST ROUTE ======================
// router.post('/events/publish', async (req, res) => {
//   try {
//     const { event, data = {} } = req.body;
//     await publish({
//       topic: 'flashstore.events',
//       message: { event, data, source: 'gateway' },
//       key: 'gateway',
//     });
//     res.json({ success: true, message: 'Event published' });
//   } catch (e: any) {
//     logger.error(e.message);
//     res.status(500).json({ success: false, message: e.message });
//   }
// });

// // ====================== PROXY ROUTES ======================
// router.use('/users', createServiceProxy('user', '/users'));
// router.use('/catalog', createServiceProxy('catalog', '/catalog'));
// router.use('/cart', createServiceProxy('cart', '/cart'));
// router.use('/orders', createServiceProxy('order', '/orders'));

// export default router;

// import { Router, Request, Response } from 'express';
// import { publish } from '@org/shared-kafka';
// import { generateAccessToken } from '@org/shared-auth';
// import logger from '@org/shared-logger';
// import { createServiceProxy } from '../services/proxy';
// import { protect } from '../middlewares/auth';

// const router = Router();

// // ====================== WELCOME ROUTE ======================
// router.get('/', (req: Request, res: Response) => {
//   res.json({
//     message: '🚀 Welcome to Flashstore API Gateway',
//     version: '1.0.0',
//     status: 'running',
//     endpoints: {
//       health: '/api/health',
//       login: 'POST /api/auth/login',
//       publishEvent: 'POST /api/events/publish',
//       protectedProfile: 'GET /api/profile (requires Bearer token)',
//       services: [
//         '/api/users',
//         '/api/catalog',
//         '/api/cart',
//         '/api/orders',
//         '/api/payments',
//         '/api/notifications'
//       ]
//     }
//   });
// });

// // ====================== HEALTH CHECK ======================
// router.get('/health', (req: Request, res: Response) => {
//   res.json({
//     success: true,
//     status: 'healthy',
//     service: 'flashstore-gateway',
//     timestamp: new Date().toISOString()
//   });
// });

// // ====================== LOGIN ROUTE (for testing) ======================
// router.post('/auth/login', (req: Request, res: Response) => {
//   const { email, userId = 1 } = req.body;

//   if (!email) {
//     return res.status(400).json({
//       success: false,
//       message: 'Email is required'
//     });
//   }

//   const token = generateAccessToken({
//     userId: String(userId),
//     email,
//     role: 'user'
//   });

//   logger.info(
//     { email, userId: Number(userId) },
//     'User logged in successfully'
//   );

//   return res.json({
//     success: true,
//     message: 'Login successful',
//     accessToken: token,
//     user: { 
//       userId: Number(userId), 
//       email 
//     }
//   });
// });

// // ====================== KAFKA EVENT PUBLISH ======================
// router.post('/events/publish', async (req: Request, res: Response) => {
//   try {
//     const { event, data = {}, topic = 'flashstore.events' } = req.body;

//     if (!event) {
//       return res.status(400).json({
//         success: false,
//         message: 'event field is required'
//       });
//     }

//     const key = data.userId 
//       ? String(data.userId) 
//       : (data.orderId ? String(data.orderId) : undefined);

//     await publish({
//       topic,
//       message: {
//         event,
//         data,
//         service: 'gateway',
//         timestamp: new Date().toISOString(),
//         source: 'api'
//       },
//       key
//     });

//     logger.info(
//       { event, topic, userId: data.userId },
//       `Event published: ${event}`
//     );

//     return res.json({
//       success: true,
//       message: 'Event successfully published to Kafka',
//       event,
//       topic
//     });

//   } catch (error: any) {
//     logger.error(
//       { 
//         error: error.message,
//         event: req.body?.event 
//       },
//       'Failed to publish event from gateway'
//     );

//     return res.status(500).json({
//       success: false,
//       message: 'Failed to publish event',
//       details: error.message
//     });
//   }
// });

// // ====================== PROTECTED EXAMPLE ROUTE ======================
// router.get('/profile', protect, (req: Request, res: Response) => {
//   const user = (req as any).user;

//   return res.json({
//     success: true,
//     message: 'Protected profile data',
//     user
//   });
// });

// // ====================== MICROSERVICE PROXY ROUTES ======================
// // All proxies are mounted under /api
// router.use('/users', createServiceProxy('user', '/users'));
// router.use('/catalog', createServiceProxy('catalog', '/catalog'));
// router.use('/cart', createServiceProxy('cart', '/cart'));
// router.use('/orders', createServiceProxy('order', '/orders'));
// router.use('/payments', createServiceProxy('payment', '/payments'));
// router.use('/notifications', createServiceProxy('notification', '/notifications'));

// export default router;