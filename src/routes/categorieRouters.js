import { getCategorie, postCategories } from '../controllers/categorieController.js';
import { Router } from 'express';

const router = Router();

router.get('/categories', getCategorie);
router.post('/categories', postCategories)

export default router;
