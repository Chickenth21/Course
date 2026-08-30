import { Router } from 'express';
import { getLessonById, completeLesson } from '../controllers/lesson.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/:id', getLessonById);
router.post('/:id/complete', requireAuth, completeLesson);

export default router;
