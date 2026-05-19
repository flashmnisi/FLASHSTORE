import { Router } from 'express';
import { createServiceProxy } from '../infrastructure/proxy/proxy.factory';

const router = Router();

router.use('/', createServiceProxy('catalog'));

export default router;