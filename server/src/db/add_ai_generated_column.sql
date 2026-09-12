-- ====================================================================
-- Migration: Add is_ai_generated column to practice_topics
-- Required for inline Gemini-generated topics (not shown in catalogue)
-- Run in Supabase SQL Editor
-- ====================================================================

-- Add column if not exists (idempotent)
ALTER TABLE public.practice_topics
  ADD COLUMN IF NOT EXISTS is_ai_generated BOOLEAN DEFAULT FALSE;

-- Update RLS to hide AI-generated topics from public catalogue
-- (they have is_active = FALSE so existing policy already covers this)

-- Verify
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'practice_topics'
  AND table_schema = 'public'
ORDER BY ordinal_position;
