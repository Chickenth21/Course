import { z } from 'zod';

export const learningPathStepSchema = z.object({
  order_index: z.number().int().positive(),
  topic: z.string().min(2),
  skill: z.enum(['Grammar', 'Vocabulary', 'Reading', 'Listening', 'Speaking', 'Writing']),
  difficulty: z.string().default('A2'),
  reason: z.string().min(5),
  estimated_duration_minutes: z.number().int().positive().default(20),
  objectives: z.array(z.string()).default([])
});

export const learningPathResponseSchema = z.object({
  summary: z.string().min(10),
  target_level: z.string(),
  current_level: z.string(),
  steps: z.array(learningPathStepSchema).min(3)
});
