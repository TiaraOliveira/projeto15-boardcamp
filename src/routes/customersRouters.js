import { getCostumers, postCostumers } from '../controllers/customersController.js';
import { Router } from 'express';

const router = Router();

router.get('/customers', getCostumers);
router.post('/customers', postCostumers);


export default router;