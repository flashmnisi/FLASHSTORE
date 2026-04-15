import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/user.controller';

const router = Router();

router.post('/register', (req, res, next) => {
  console.log('✅ REGISTER ROUTE HIT');
  next();
}, registerUser);

router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;