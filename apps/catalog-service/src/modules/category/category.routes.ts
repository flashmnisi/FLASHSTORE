import { Router } from 'express';
import multer from 'multer';
import { createCategory, getCategories } from './category.controller';

const upload = multer({ dest: 'uploads/' });   

const router = Router();

router.post('/', upload.array('images', 5), createCategory);   // Allow up to 5 images
router.get('/', getCategories);

export default router;