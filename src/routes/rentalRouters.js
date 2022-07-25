import { getRental, postRental, deleteRental, finishRentals } from '../controllers/rentalController.js';
import { Router } from 'express';

const router = Router();

router.get('/rentals', getRental);
router.post('/rentals', postRental);
router.delete('/rentals/:id', deleteRental);
router.delete('/rentals/:id/return', deleteRental);
export default router;