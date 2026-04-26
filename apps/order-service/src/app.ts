import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import orderRoutes from './presentation/routes/order.routes';

const app = express();

// Security & Parsing Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    service: 'order-service',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/orders', orderRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Order Service is running',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      createOrder: 'POST /api/orders',
      getOrderById: 'GET /api/orders/:id',
      getUserOrders: 'GET /api/orders/user/me',
    },
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

export default app;