import { getRental, postRental, deleteRental, finishRentals } from '../controllers/rentalController.js';
import { Router } from 'express';

const router = Router();

router.get('/rentals', getRental);
router.post('/rentals', postRental);
router.delete('/rentals/:id', deleteRental);
router.post('/rentals/:id/return', finishRentals);
export default router;