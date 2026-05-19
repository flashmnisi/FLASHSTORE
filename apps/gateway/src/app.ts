import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes';

import { errorMiddleware }
from './middlewares/error.middleware';

const app = express();

/**
 * Security
 */
app.use(helmet());
app.use(cors());

app.use(express.urlencoded({
  extended: true,
  limit: '50mb',
}));

/**
 * =========================
 * PUBLIC ROUTES
 * =========================
 */
// Main Routes
app.use('/', routes);
// app.use(
//   '/api/auth',
//   createServiceProxy('user')
// );

// /**
//  * =========================
//  * PROTECTED USER ROUTES
//  * =========================
//  */
// app.use(
//   '/api/users',
//   protect,
//   createServiceProxy('user')
// );

// /**
//  * =========================
//  * CATALOG
//  * =========================
//  */
// app.use(
//   '/api/products',
//   createServiceProxy('catalog')
// );

// app.use(
//   '/api/categories',
//   createServiceProxy('catalog')
// );

// /**
//  * =========================
//  * CART
//  * =========================
//  */
// app.use(
//   '/api/cart',
//   protect,
//   createServiceProxy('cart')
// );

// /**
//  * =========================
//  * ORDERS
//  * =========================
//  */
// app.use(
//   '/api/orders',
//   protect,
//   createServiceProxy('order')
// );

// /**
//  * =========================
//  * PAYMENTS
//  * =========================
//  */
// app.use(
//   '/api/payments',
//   protect,
//   createServiceProxy('payment')
// );

// /**
//  * =========================
//  * SEARCH
//  * =========================
//  */
// app.use(
//   '/api/search',
//   createServiceProxy('search')
// );

// /**
//  * =========================
//  * NOTIFICATIONS
//  * =========================
//  */
// app.use(
//   '/api/notifications',
//   protect,
//   createServiceProxy('notification')
// );

// /**
//  * =========================
//  * ANALYTICS
//  * =========================
//  */
// app.use(
//   '/api/analytics',
//   protect,
//   createServiceProxy('analytics')
// );

/**
 * =========================
 * HEALTH CHECK
 * =========================
 */
app.get('/health', (_req, res) => {
  res.json({
    success: true,
  });
});

/**
 * Body parsers
 */
app.use(express.json({
  limit: '50mb',
}));

/**
 * =========================
 * GLOBAL ERROR HANDLER
 * =========================
 */
app.use(errorMiddleware);

export default app;

// import express from 'express';
// import cors from 'cors';
// import helmet from 'helmet';
// import routes from './routes/index';
// import { errorMiddleware } from './middlewares/error.middleware';
// import { globalLimiter } from './middlewares/rateLimiter';

// const app = express();

// app.use(helmet());
// app.use(cors());
// app.use(express.json({ limit: '50mb' }));
// app.use(express.urlencoded({ extended: true, limit: '50mb' }));
// app.use(globalLimiter);

// // Log every incoming request
// app.use((req, res, next) => {
//   console.log(`GATEWAY PATH: ${req.method} ${req.originalUrl}`);
//   next();
// });

// app.use('/api', routes);     

// app.use(errorMiddleware);

// export default app;