import { Router } from 'express';
import { getRecentEvents } from '../controllers/analytics.controller';

const router = Router();

router.get('/events', getRecentEvents);

export default router;