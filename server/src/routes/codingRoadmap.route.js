import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { getRoadmap, generateRoadmap, updateStepStatus } from '../controllers/codingRoadmap.controller.js';

const router = Router();
router.use(requireAuth);

// GET   /api/coding-roadmap/:courseId — get user's roadmap
router.get('/:courseId', getRoadmap);

// POST  /api/coding-roadmap/:courseId/generate — generate/re-generate roadmap
router.post('/:courseId/generate', generateRoadmap);

// PATCH /api/coding-roadmap/steps/:stepId — update step status
router.patch('/steps/:stepId', updateStepStatus);

export default router;
