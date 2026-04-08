import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import logger from '@org/shared-logger';
import userRoutes from './routes/user.routes';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(
    {
      method: req.method,
      url: req.url,
      ip: req.ip,
    },
    'Incoming request'
  );
  next();
});

// Routes
app.use('/api/users', userRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'user-service',
    timestamp: new Date().toISOString(),
  });
});

// Root welcome route
app.get('/', (req, res) => {
  res.json({
    message: '🚀 User Service is running',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      register: 'POST /api/users/register',
      login: 'POST /api/users/login',
      profile: 'GET /api/users/profile (protected)',
    },
  });
});

// 404 handler
app.use((req, res) => {
  logger.warn(
    { method: req.method, url: req.url },
    'Route not found'
  );
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

export default app;