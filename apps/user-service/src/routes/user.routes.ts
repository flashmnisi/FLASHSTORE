import { Router } from 'express';

import {
  registerUser,
} from '../controllers/user.controller';

const router = Router();

// ====================== PUBLIC ROUTES ======================
router.post('/register', registerUser);


export default router;