import { Router } from 'express';
import { supabase } from '../config/supabase.js';
import { courseRepository } from '../repositories/course.repository.js';
import { assessmentRepository } from '../repositories/assessment.repository.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

// Only authenticated users can check DB status (prevents information leakage)
router.get('/status', requireAuth, async (_req, res) => {
  if (!supabase) {
    return errorResponse(res, 'Supabase client is not connected', 503);
  }

  try {
    const [courses, placementTest] = await Promise.allSettled([
      courseRepository.getAllCourses(),
      assessmentRepository.getActivePlacementTest()
    ]);

    const coursesData = courses.status === 'fulfilled' ? courses.value : [];
    const testData = placementTest.status === 'fulfilled' ? placementTest.value : null;

    return successResponse(res, {
      database: 'Connected to Supabase PostgreSQL',
      tables: {
        courses: coursesData.length,
        placementTest: testData ? testData.title : 'Not initialized yet'
      },
      ready: true
    }, 'Database status retrieved successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
});

export default router;
