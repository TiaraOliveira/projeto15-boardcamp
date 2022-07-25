import { getCostumers, postCostumers, getCostumersbyId, setCostumers } from '../controllers/customersController.js';
import { Router } from 'express';

const router = Router();

router.get('/customers', getCostumers);
router.get('/customers/:id', getCostumersbyId);
router.post('/customers', postCostumers);
router.put('/customers/:id', setCostumers);


export default router;