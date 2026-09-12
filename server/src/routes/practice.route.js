import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { requireAuth } from '../middlewares/auth.middleware.js';
import {
  getPracticeTopics,
  getTopicDetails,
  submitReadingTranslation,
  submitWritingEssay,
  getUserPracticeHistory,
  getSubmissionReview,
  generateTopic
} from '../controllers/practice.controller.js';

const router = Router();

// Rate limiters — prevent Gemini API spam
const generateTopicLimiter = rateLimit({
  windowMs: 60 * 1000,       // 1 minute window
  max: 10,                   // max 10 generate requests per minute
  message: { status: 'error', message: 'Bạn tạo đề bài quá nhanh. Vui lòng chờ 1 phút rồi thử lại.' },
  standardHeaders: true,
  legacyHeaders: false
});

const submitLimiter = rateLimit({
  windowMs: 60 * 1000,       // 1 minute window
  max: 20,                   // max 20 submissions per minute
  message: { status: 'error', message: 'Bạn nộp bài quá nhanh. Vui lòng đợi một chút.' },
  standardHeaders: true,
  legacyHeaders: false
});

// Public: Browse topic catalogue (no auth needed to view topics)
router.get('/topics', getPracticeTopics);
router.get('/topics/:id', getTopicDetails);

// AI: Generate fresh topic on demand (auth + rate limited)
router.post('/generate-topic', requireAuth, generateTopicLimiter, generateTopic);

// Protected + rate limited: Submission and history endpoints
router.post('/submit-translation', requireAuth, submitLimiter, submitReadingTranslation);
router.post('/submit-writing', requireAuth, submitLimiter, submitWritingEssay);
router.get('/history', requireAuth, getUserPracticeHistory);
router.get('/history/:id', requireAuth, getSubmissionReview);

export default router;
