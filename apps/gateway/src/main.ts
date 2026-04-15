import dotenv from 'dotenv';
import logger from '@org/shared-logger';
import app from './app';
import env from './config/env';

dotenv.config();

const PORT = env.PORT;

app.listen(PORT, () => {
  logger.info(`🚀 Gateway running on http://localhost:${PORT}`);
});

// import express from 'express';
// import cors from 'cors';
// import helmet from 'helmet';
// import dotenv from 'dotenv';

// import logger from '@org/shared-logger';
// import apiRoutes from './routes/index';

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Request logging
// app.use((req, res, next) => {
//   const start = Date.now();
//   res.on('finish', () => {
//     logger.info({
//       method: req.method,
//       url: req.url,
//       status: res.statusCode,
//       responseTime: `${Date.now() - start}ms`,
//     });
//   });
//   next();
// });

// app.use(helmet());
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Redirect root to /api
// app.get('/', (req, res) => {
//   res.redirect('/api');
// });

// // All API routes
// app.use('/api', apiRoutes);

// // 404 handler
// app.use((req, res) => {
//   logger.warn(`Route not found: ${req.method} ${req.url}`);
//   res.status(404).json({ error: 'Route not found' });
// });

// // Global error handler
// app.use((err: any, req: any, res: any, next: any) => {
//   logger.error({ err, url: req.url }, 'Unhandled error in gateway');
//   res.status(500).json({ error: 'Internal server error' });
// });

// app.listen(PORT, () => {
//   logger.info(`🚀 Flashstore Gateway running on http://localhost:${PORT}`);
// });
