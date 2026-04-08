import { Router } from 'express';
import { createProduct, getAllProducts } from './product.controller';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });   // Adjust path as needed

const router = Router();

router.post('/', upload.array('images', 5), createProduct);   // Allow up to 5 images
router.get('/', getAllProducts);

export default router;