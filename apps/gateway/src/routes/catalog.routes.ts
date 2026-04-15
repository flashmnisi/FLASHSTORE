import { Router } from 'express';
import { createServiceProxy } from '../services/proxy';

const router = Router();

router.use('/', createServiceProxy('catalog'));

export default router;