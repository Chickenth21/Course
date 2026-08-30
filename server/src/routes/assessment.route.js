import { Router } from 'express';
import { getPlacementTest, submitPlacementTest } from '../controllers/assessment.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/placement', getPlacementTest);
router.post('/:id/submit', requireAuth, submitPlacementTest);

export default router;
