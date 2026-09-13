import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { getChallengesByLesson, submitCode, getSubmissions } from '../controllers/codeChallenge.controller.js';

const router = Router();
router.use(requireAuth);

// GET  /api/code-challenges/lesson/:lessonId — list challenges (with user status)
router.get('/lesson/:lessonId', getChallengesByLesson);

// POST /api/code-challenges/:id/submit — submit & AI-grade code
router.post('/:id/submit', submitCode);

// GET  /api/code-challenges/:id/submissions — submission history
router.get('/:id/submissions', getSubmissions);

export default router;
