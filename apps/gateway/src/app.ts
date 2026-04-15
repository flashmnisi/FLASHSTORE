import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes/index';
import { errorMiddleware } from './middlewares/error.middleware';
import { globalLimiter } from './middlewares/rateLimiter';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(globalLimiter);

// Log every incoming request
app.use((req, res, next) => {
  console.log(`GATEWAY PATH: ${req.method} ${req.originalUrl}`);
  next();
});

app.use('/api', routes);     

app.use(errorMiddleware);

export default app;