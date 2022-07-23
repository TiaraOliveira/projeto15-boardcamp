import { getCategorie, postCategories } from '../controllers/categorieController.js';
import { Router } from 'express';

const router = Router();

router.get('/categorie', getCategorie);
router.post('/categorie', postCategories)

export default router;
