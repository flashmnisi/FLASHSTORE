import { Router } from 'express';
import { createServiceProxy } from '../services/proxy';
import { protect } from '../middlewares/auth';

const router = Router();

router.use('/', protect,createServiceProxy('payment'));

export default router;