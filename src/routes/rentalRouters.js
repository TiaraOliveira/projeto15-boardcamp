import { getRental, postRental, deleteRental } from '../controllers/rentalController.js';
import { Router } from 'express';

const router = Router();

router.get('/rentals', getRental);
router.post('/rentals', postRental);
router.delete('/rentals/:id', deleteRental);

export default router;