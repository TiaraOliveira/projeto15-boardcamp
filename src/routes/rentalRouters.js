import { getRental, postRental } from '../controllers/rentalController.js';
import { Router } from 'express';

const router = Router();

router.get('/rental', getRental);
router.post('/rental', postRental);


export default router;