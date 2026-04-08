import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cartRoutes from './routes/cart.routes';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/cart', cartRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'cart-service' });
});

export default app;