import { getCostumers, postCostumers, getCostumersbyId } from '../controllers/customersController.js';
import { Router } from 'express';

const router = Router();

router.get('/customers', getCostumers);
router.get('/customers/:id', getCostumersbyId);
router.post('/customers', postCostumers);


export default router;