import { z } from 'zod';

/**
 * Centralised Zod schemas for practice module input validation.
 * Used in controllers to validate req.body before calling service.
 */

export const VALID_TYPES = ['reading_translation', 'writing_essay'];
export const VALID_LEVELS = ['A1', 'A2', 'B1', 'B2'];

export const generateTopicSchema = z.object({
  type: z.enum(['reading_translation', 'writing_essay'], {
    errorMap: () => ({ message: 'type phải là reading_translation hoặc writing_essay' })
  }),
  level: z.enum(['A1', 'A2', 'B1', 'B2'], {
    errorMap: () => ({ message: 'level phải là A1, A2, B1, hoặc B2' })
  }),
  usedTitles: z.array(z.string()).max(10).optional().default([])
});

export const submitTranslationSchema = z.object({
  topicId: z.string().min(1, 'topicId là bắt buộc'),
  userTranslation: z.string().trim().min(3, 'Bản dịch quá ngắn'),
  _inlineTopic: z.object({
    title: z.string().optional(),
    sourceText: z.string().optional(),
    referenceTranslation: z.string().nullable().optional(),
    level: z.string().optional(),
    type: z.string().optional()
  }).optional()
});

export const submitWritingSchema = z.object({
  topicId: z.string().min(1, 'topicId là bắt buộc'),
  userEssay: z.string().trim().min(10, 'Bài viết quá ngắn (cần ít nhất 10 từ)'),
  _inlineTopic: z.object({
    title: z.string().optional(),
    instructions: z.string().optional(),
    level: z.string().optional(),
    type: z.string().optional()
  }).optional()
});

/**
 * Validate request body against a Zod schema.
 * Returns { success, data, errors }.
 */
export function validate(schema, body) {
  const result = schema.safeParse(body);
  if (!result.success) {
    const errors = result.error.issues.map(i => i.message);
    return { success: false, errors };
  }
  return { success: true, data: result.data };
}
