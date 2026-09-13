import { codingRoadmapRepository } from '../repositories/codingRoadmap.repository.js';
import { aiService } from '../ai/ai.service.js';
import { supabase } from '../config/supabase.js';

export const codingRoadmapService = {
  /**
   * Get a user's existing roadmap for a course (with steps)
   */
  async getRoadmap(userId, courseId) {
    return codingRoadmapRepository.getByUserAndCourse(userId, courseId);
  },

  /**
   * Generate (or re-generate) a personalized coding roadmap using Gemini AI
   * Steps:
   * 1. Load course + modules + lessons from DB
   * 2. Call Gemini with user's goal and skill level
   * 3. Upsert roadmap record
   * 4. Delete old steps and insert new ones
   */
  async generateRoadmap(userId, courseId, { goal, skillLevel }) {
    if (!goal || !goal.trim()) {
      const error = new Error('Vui lòng nhập mục tiêu học tập của bạn');
      error.statusCode = 400;
      throw error;
    }

    if (!['beginner', 'intermediate', 'advanced'].includes(skillLevel)) {
      const error = new Error('Trình độ không hợp lệ. Chọn: beginner, intermediate, advanced');
      error.statusCode = 400;
      throw error;
    }

    // Load course with modules and lessons
    const courseData = await this._loadCourseModulesLessons(courseId);
    if (!courseData) {
      const error = new Error('Khóa học không tồn tại');
      error.statusCode = 404;
      throw error;
    }

    // Generate roadmap via Gemini
    const aiResult = await aiService.generateCodingRoadmap({
      goal: goal.trim(),
      skillLevel,
      courseTitle: courseData.title,
      courseModules: courseData.modules
    });

    // Upsert roadmap
    const roadmap = await codingRoadmapRepository.upsert({
      user_id: userId,
      course_id: courseId,
      current_skill_level: skillLevel,
      goal: goal.trim(),
      ai_summary: aiResult.summary,
      estimated_weeks: aiResult.estimatedWeeks,
      status: 'active',
      updated_at: new Date().toISOString()
    });

    // Replace steps
    await codingRoadmapRepository.deleteSteps(roadmap.id);

    const stepsToInsert = aiResult.steps.map(step => ({
      roadmap_id: roadmap.id,
      lesson_id: step.lesson_id || null,
      topic: step.topic,
      description: step.description,
      concepts: step.concepts || [],
      order_index: step.order_index,
      status: 'pending',
      priority: step.priority || 'normal',
      reason: step.reason
    }));

    const steps = await codingRoadmapRepository.createSteps(stepsToInsert);

    return { ...roadmap, steps };
  },

  /**
   * Update the status of a roadmap step
   */
  async updateStepStatus(stepId, status) {
    const validStatuses = ['pending', 'in_progress', 'completed'];
    if (!validStatuses.includes(status)) {
      const error = new Error(`Trạng thái không hợp lệ. Chọn: ${validStatuses.join(', ')}`);
      error.statusCode = 400;
      throw error;
    }
    return codingRoadmapRepository.updateStepStatus(stepId, status);
  },

  /**
   * When user completes a lesson, auto-advance the roadmap step
   */
  async advanceRoadmapStep(userId, courseId, lessonId) {
    const roadmap = await codingRoadmapRepository.getByUserAndCourse(userId, courseId);
    if (!roadmap) return null;

    return codingRoadmapRepository.markStepForLesson(roadmap.id, lessonId, 'completed');
  },

  /**
   * Load course structure from Supabase for roadmap generation
   */
  async _loadCourseModulesLessons(courseId) {
    if (!supabase) return null;

    const { data: course, error } = await supabase
      .from('courses')
      .select(`
        id,
        title,
        description,
        modules (
          id,
          title,
          description,
          order_index,
          lessons (
            id,
            title,
            description,
            duration_minutes,
            level,
            order_index
          )
        )
      `)
      .eq('id', courseId)
      .single();

    if (error || !course) return null;

    // Sort modules and lessons by order_index
    course.modules?.sort((a, b) => a.order_index - b.order_index);
    course.modules?.forEach(mod => {
      mod.lessons?.sort((a, b) => a.order_index - b.order_index);
    });

    return course;
  }
};
