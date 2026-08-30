-- ====================================================================
-- English Learning Platform - Database Schema with Row Level Security (RLS)
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Users Table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'student',
  current_level VARCHAR(10) DEFAULT 'A1',
  target_level VARCHAR(10) DEFAULT 'B2',
  avatar_url TEXT,
  streak_count INT DEFAULT 0,
  last_study_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Assessments (Placement Tests)
CREATE TABLE IF NOT EXISTS public.assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  target_level VARCHAR(10) DEFAULT 'ALL',
  duration_minutes INT DEFAULT 20,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Assessment Questions
CREATE TABLE IF NOT EXISTS public.assessment_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id UUID REFERENCES public.assessments(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  skill VARCHAR(50) NOT NULL,
  type VARCHAR(50) DEFAULT 'multiple_choice',
  options JSONB NOT NULL DEFAULT '[]'::jsonb,
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  difficulty VARCHAR(10) NOT NULL DEFAULT 'A1',
  order_index INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Assessment Submissions (Results)
CREATE TABLE IF NOT EXISTS public.assessment_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  assessment_id UUID REFERENCES public.assessments(id) ON DELETE CASCADE,
  total_score INT NOT NULL,
  total_questions INT NOT NULL,
  estimated_level VARCHAR(10) NOT NULL,
  skill_scores JSONB NOT NULL DEFAULT '{}'::jsonb,
  weak_areas JSONB DEFAULT '[]'::jsonb,
  strong_areas JSONB DEFAULT '[]'::jsonb,
  qualitative_feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Assessment Individual Answers
CREATE TABLE IF NOT EXISTS public.assessment_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id UUID REFERENCES public.assessment_submissions(id) ON DELETE CASCADE,
  question_id UUID REFERENCES public.assessment_questions(id) ON DELETE CASCADE,
  user_answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Courses
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  level VARCHAR(10) NOT NULL,
  thumbnail_url TEXT,
  order_index INT DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Course Modules
CREATE TABLE IF NOT EXISTS public.modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  order_index INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Lessons
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  objectives JSONB DEFAULT '[]'::jsonb,
  content JSONB NOT NULL DEFAULT '{"explanation": "", "examples": [], "vocabulary": []}'::jsonb,
  level VARCHAR(10) NOT NULL DEFAULT 'A1',
  duration_minutes INT DEFAULT 15,
  order_index INT DEFAULT 0,
  is_ai_generated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Exercises
CREATE TABLE IF NOT EXISTS public.exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL DEFAULT 'multiple_choice',
  instructions TEXT,
  question TEXT NOT NULL,
  options JSONB DEFAULT '[]'::jsonb,
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  skill VARCHAR(50) DEFAULT 'Grammar',
  difficulty VARCHAR(10) DEFAULT 'A1',
  order_index INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Personalized Learning Paths
CREATE TABLE IF NOT EXISTS public.learning_paths (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  current_level VARCHAR(10) NOT NULL,
  target_level VARCHAR(10) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. Learning Path Items
CREATE TABLE IF NOT EXISTS public.learning_path_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  learning_path_id UUID REFERENCES public.learning_paths(id) ON DELETE CASCADE,
  topic VARCHAR(255) NOT NULL,
  skill VARCHAR(50) NOT NULL,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL,
  order_index INT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. User Lesson Progress
CREATE TABLE IF NOT EXISTS public.user_lesson_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'not_started',
  score INT DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, lesson_id)
);

-- 14. User Exercise Attempts
CREATE TABLE IF NOT EXISTS public.user_exercise_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES public.exercises(id) ON DELETE CASCADE,
  user_answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  attempt_number INT DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 15. User Skill Progress Tracking
CREATE TABLE IF NOT EXISTS public.user_skill_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  skill VARCHAR(50) NOT NULL,
  score INT DEFAULT 0,
  total_questions INT DEFAULT 0,
  correct_questions INT DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, skill)
);

-- Indexes for Fast Querying
CREATE INDEX IF NOT EXISTS idx_assessment_questions_assessment_id ON public.assessment_questions(assessment_id);
CREATE INDEX IF NOT EXISTS idx_modules_course_id ON public.modules(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_module_id ON public.lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_exercises_lesson_id ON public.exercises(lesson_id);
CREATE INDEX IF NOT EXISTS idx_learning_path_items_path_id ON public.learning_path_items(learning_path_id);
CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_user_id ON public.user_lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_exercise_attempts_user_id ON public.user_exercise_attempts(user_id);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_path_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_exercise_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skill_progress ENABLE ROW LEVEL SECURITY;

-- Allow Public/API Access for Course Catalog & Content
CREATE POLICY "Allow public read courses" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Allow public read modules" ON public.modules FOR SELECT USING (true);
CREATE POLICY "Allow public read lessons" ON public.lessons FOR SELECT USING (true);
CREATE POLICY "Allow public read exercises" ON public.exercises FOR SELECT USING (true);
CREATE POLICY "Allow public read assessments" ON public.assessments FOR SELECT USING (true);
CREATE POLICY "Allow public read assessment_questions" ON public.assessment_questions FOR SELECT USING (true);

-- Allow Full Access for Application Backend Operations (anon / authenticated roles)
CREATE POLICY "Allow app manage users" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow app manage courses" ON public.courses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow app manage modules" ON public.modules FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow app manage lessons" ON public.lessons FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow app manage exercises" ON public.exercises FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow app manage assessments" ON public.assessments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow app manage assessment_questions" ON public.assessment_questions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow app manage assessment_submissions" ON public.assessment_submissions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow app manage assessment_answers" ON public.assessment_answers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow app manage learning_paths" ON public.learning_paths FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow app manage learning_path_items" ON public.learning_path_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow app manage user_lesson_progress" ON public.user_lesson_progress FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow app manage user_exercise_attempts" ON public.user_exercise_attempts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow app manage user_skill_progress" ON public.user_skill_progress FOR ALL USING (true) WITH CHECK (true);
