import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import analyticsRoutes from './routes/analytics.routes';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/analytics', analyticsRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'analytics-service' });
});

export default app;