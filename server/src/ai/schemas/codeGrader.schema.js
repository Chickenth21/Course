import { z } from 'zod';

// ================================================================
// Schema for AI Code Grading
// ================================================================
export const codeGraderSchema = z.object({
  score: z.number().int().min(0).max(100)
    .describe('Điểm tổng 0-100'),
  isPassed: z.boolean()
    .describe('true nếu score >= 65'),
  feedback: z.string()
    .describe('Nhận xét tổng quan bằng tiếng Việt, 2-4 câu'),
  codeReview: z.string()
    .describe('Phân tích chi tiết code: điểm đúng, điểm sai, bằng tiếng Việt'),
  strengths: z.array(z.string()).min(1).max(5)
    .describe('Điểm mạnh của code học sinh'),
  improvements: z.array(z.string()).min(1).max(5)
    .describe('Điểm cần cải thiện')
});

// ================================================================
// Schema for AI Coding Roadmap Generation
// ================================================================
export const codingRoadmapStepSchema = z.object({
  order_index: z.number().int().min(1),
  topic: z.string().min(1),
  description: z.string(),
  lesson_id: z.string().nullable().optional(),
  concepts: z.array(z.string()).default([]),
  priority: z.enum(['high', 'normal']).default('normal'),
  reason: z.string()
});

export const codingRoadmapResponseSchema = z.object({
  summary: z.string().describe('Tóm tắt lộ trình bằng tiếng Việt'),
  estimatedWeeks: z.number().int().min(1).max(24),
  steps: z.array(codingRoadmapStepSchema).min(3).max(12)
});

// ================================================================
// Deterministic Fallback Results
// ================================================================
export const fallbackCodeGradeResult = {
  score: 60,
  isPassed: false,
  feedback: 'Code của bạn đã được ghi nhận. Hãy kết nối Gemini AI để nhận nhận xét chi tiết và chính xác hơn. Tạm thời điểm số là ước tính.',
  codeReview: 'Chưa thể phân tích chi tiết do AI không khả dụng. Vui lòng thử lại sau.',
  strengths: ['Đã hoàn thành bài tập', 'Đã nộp đúng hạn'],
  improvements: ['Kết nối AI để nhận nhận xét chi tiết', 'Tự review code theo checklist ES6+']
};

export const fallbackCodingRoadmap = {
  summary: 'Lộ trình học tập tuyến tính được tạo tự động. Kết nối Gemini AI để có lộ trình cá nhân hóa phù hợp hơn với mục tiêu của bạn.',
  estimatedWeeks: 6,
  steps: [
    { order_index: 1, topic: 'Cơ bản', description: 'Nắm vững kiến thức nền tảng', lesson_id: null, concepts: ['fundamentals'], priority: 'high', reason: 'Nền tảng quan trọng nhất' },
    { order_index: 2, topic: 'Thực hành', description: 'Luyện tập với các bài tập thực tế', lesson_id: null, concepts: ['practice'], priority: 'normal', reason: 'Củng cố kiến thức qua thực hành' },
    { order_index: 3, topic: 'Dự án', description: 'Áp dụng vào dự án thực tế', lesson_id: null, concepts: ['project'], priority: 'normal', reason: 'Tổng hợp tất cả kiến thức đã học' }
  ]
};
