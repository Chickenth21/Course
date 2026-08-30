import { Router } from 'express';
import {
  getActiveLearningPath,
  generateLearningPath,
  updateItemStatus
} from '../controllers/learningPath.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

// All learning path routes are protected
router.use(requireAuth);

router.get('/', getActiveLearningPath);
router.post('/generate', generateLearningPath);
router.patch('/items/:id/status', updateItemStatus);

export default router;
