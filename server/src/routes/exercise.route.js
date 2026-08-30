import { Router } from 'express';
import { submitExercise } from '../controllers/exercise.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/:id/submit', requireAuth, submitExercise);

export default router;
