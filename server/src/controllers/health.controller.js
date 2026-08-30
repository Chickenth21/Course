import { config } from '../config/index.js';
import { supabase } from '../config/supabase.js';
import { ai } from '../config/gemini.js';
import { courseRepository } from '../repositories/course.repository.js';
import { assessmentRepository } from '../repositories/assessment.repository.js';

export const getHealth = async (_req, res) => {
  let stats = { coursesCount: 0, hasPlacementTest: false };

  if (supabase) {
    try {
      const [courses, test] = await Promise.allSettled([
        courseRepository.getAllCourses(),
        assessmentRepository.getActivePlacementTest()
      ]);
      if (courses.status === 'fulfilled' && courses.value) {
        stats.coursesCount = courses.value.length;
      }
      if (test.status === 'fulfilled' && test.value) {
        stats.hasPlacementTest = true;
      }
    } catch {
      // ignore
    }
  }

  res.status(200).json({
    status: 'ok',
    message: 'English Learning Platform API is healthy',
    timestamp: new Date().toISOString(),
    uptime: Number(process.uptime().toFixed(2)),
    environment: config.nodeEnv,
    services: {
      supabase: Boolean(supabase),
      gemini: Boolean(ai)
    },
    database: {
      coursesCount: stats.coursesCount,
      hasPlacementTest: stats.hasPlacementTest
    }
  });
};
