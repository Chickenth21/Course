-- ====================================================================
-- Practice Module Schema: Reading/Translation & Writing/Essay Practice
-- Extends base schema WITHOUT modifying any existing tables.
-- Run this after schema.sql
-- ====================================================================

-- 1. Practice Topics Bank (Reading/Translation & Writing/Essay prompts)
CREATE TABLE IF NOT EXISTS public.practice_topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(50) NOT NULL CHECK (type IN ('reading_translation', 'writing_essay')),
  level VARCHAR(10) NOT NULL CHECK (level IN ('A1', 'A2', 'B1', 'B2')),
  title VARCHAR(255) NOT NULL,
  source_text TEXT NOT NULL,              -- Paragraph for reading/translation OR essay situation description
  instructions TEXT NOT NULL,            -- Task instructions shown to student
  reference_translation TEXT,            -- Model translation (for reading_translation only)
  target_word_count INT DEFAULT 100,     -- Suggested word count (for writing_essay)
  vocabulary_hints JSONB DEFAULT '[]'::jsonb, -- Array of { word, meaning, example } objects
  is_active BOOLEAN DEFAULT TRUE,
  order_index INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Practice Submissions (Student answers + full Gemini AI feedback)
CREATE TABLE IF NOT EXISTS public.practice_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES public.practice_topics(id) ON DELETE SET NULL,
  exercise_id UUID REFERENCES public.exercises(id) ON DELETE SET NULL, -- null if from PracticeHub
  submission_type VARCHAR(50) NOT NULL CHECK (submission_type IN ('reading_translation', 'writing_essay')),
  user_content TEXT NOT NULL,            -- The student's submitted translation or essay
  overall_score INT DEFAULT 0 CHECK (overall_score >= 0 AND overall_score <= 100),
  detailed_scores JSONB DEFAULT '{}'::jsonb,   -- { accuracy, fluency, grammar, vocabulary, coherence }
  cefr_band VARCHAR(10),                -- Estimated CEFR level of the submission
  feedback_summary TEXT,               -- Overall narrative feedback from Gemini
  strengths JSONB DEFAULT '[]'::jsonb, -- Array of strength strings
  detailed_errors JSONB DEFAULT '[]'::jsonb,   -- Array of { originalSegment, userTranslation, correction, explanation }
  improved_version TEXT,               -- Gemini's polished native version
  actionable_advice JSONB DEFAULT '[]'::jsonb, -- Array of specific advice strings
  word_count INT DEFAULT 0,
  is_ai_graded BOOLEAN DEFAULT TRUE,   -- false if fallback heuristic was used
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_practice_topics_type_level ON public.practice_topics(type, level);
CREATE INDEX IF NOT EXISTS idx_practice_topics_active ON public.practice_topics(is_active);
CREATE INDEX IF NOT EXISTS idx_practice_submissions_user_id ON public.practice_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_practice_submissions_topic_id ON public.practice_submissions(topic_id);
CREATE INDEX IF NOT EXISTS idx_practice_submissions_type ON public.practice_submissions(submission_type);

-- ====================================================================
-- RLS Policies for Practice Tables
-- ====================================================================
ALTER TABLE public.practice_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_submissions ENABLE ROW LEVEL SECURITY;

-- Practice topics: public read (no login required to browse)
CREATE POLICY "Allow public read practice_topics" ON public.practice_topics FOR SELECT USING (true);

-- Practice topics: full app management
CREATE POLICY "Allow app manage practice_topics" ON public.practice_topics FOR ALL USING (true) WITH CHECK (true);

-- Practice submissions: full app management
CREATE POLICY "Allow app manage practice_submissions" ON public.practice_submissions FOR ALL USING (true) WITH CHECK (true);

-- ====================================================================
-- Seed Data: Sample Practice Topics
-- ====================================================================

-- Reading & Translation Topics
INSERT INTO public.practice_topics (type, level, title, source_text, instructions, reference_translation, vocabulary_hints, order_index)
VALUES
  (
    'reading_translation', 'A2',
    'A Morning at the Café',
    'Every morning, Sarah wakes up early and walks to a small café near her house. She always orders a cup of black coffee and a croissant. While she drinks her coffee, she reads the newspaper and watches people passing by. She thinks this is the best way to start a peaceful day.',
    'Dịch đoạn văn sau sang tiếng Việt một cách tự nhiên và chính xác nhất có thể. Chú ý đến giọng văn và cách diễn đạt phù hợp.',
    'Mỗi sáng, Sarah thức dậy sớm và đi bộ đến một quán cà phê nhỏ gần nhà cô. Cô luôn gọi một ly cà phê đen và một chiếc bánh sừng bò. Trong khi uống cà phê, cô đọc báo và nhìn ngắm người đi đường. Cô nghĩ đây là cách tốt nhất để bắt đầu một ngày bình yên.',
    '[{"word":"croissant","meaning":"bánh sừng bò","example":"She ate a warm croissant."},{"word":"passing by","meaning":"đi qua","example":"People were passing by the window."},{"word":"peaceful","meaning":"bình yên","example":"It was a peaceful morning."}]',
    1
  ),
  (
    'reading_translation', 'B1',
    'The Impact of Social Media on Youth',
    'Social media has dramatically changed the way young people communicate and interact with the world. While platforms like Instagram and TikTok allow teenagers to express their creativity and connect with peers globally, they also raise serious concerns about mental health and screen addiction. Psychologists argue that excessive social media use can lead to anxiety, low self-esteem, and disrupted sleep patterns. Therefore, it is crucial for parents and educators to guide young people in developing healthy digital habits.',
    'Dịch đoạn văn học thuật này sang tiếng Việt. Chú ý duy trì phong cách trang trọng và chính xác thuật ngữ chuyên ngành.',
    'Mạng xã hội đã thay đổi đáng kể cách giới trẻ giao tiếp và tương tác với thế giới. Trong khi các nền tảng như Instagram và TikTok cho phép thanh thiếu niên thể hiện sự sáng tạo và kết nối với bạn bè trên toàn cầu, chúng cũng đặt ra những lo ngại nghiêm trọng về sức khỏe tâm thần và nghiện thiết bị điện tử. Các nhà tâm lý học lập luận rằng việc sử dụng mạng xã hội quá mức có thể dẫn đến lo âu, lòng tự trọng thấp và rối loạn giấc ngủ. Do đó, điều quan trọng là cha mẹ và nhà giáo dục cần hướng dẫn giới trẻ xây dựng thói quen số lành mạnh.',
    '[{"word":"dramatically","meaning":"đáng kể, đột ngột","example":"Technology has dramatically changed our lives."},{"word":"excessive","meaning":"quá mức","example":"Excessive use of phones is harmful."},{"word":"self-esteem","meaning":"lòng tự trọng","example":"Low self-esteem can affect performance."},{"word":"crucial","meaning":"then chốt, quan trọng","example":"It is crucial to act now."}]',
    2
  ),

-- Writing Essay Topics
  (
    'writing_essay', 'A2',
    'My Favorite Weekend Activity',
    NULL,
    'Viết một đoạn văn ngắn (60-100 từ) bằng tiếng Anh về hoạt động yêu thích của bạn vào cuối tuần. Nêu rõ: Hoạt động đó là gì? Bạn làm với ai? Nó khiến bạn cảm thấy như thế nào?',
    NULL,
    '[{"word":"spend time","meaning":"dành thời gian","example":"I spend time with my family."},{"word":"relax","meaning":"thư giãn","example":"I like to relax on Sundays."},{"word":"enjoy","meaning":"thích thú","example":"I enjoy playing football."},{"word":"outdoor","meaning":"ngoài trời","example":"We have outdoor activities on weekends."}]',
    3
  ),
  (
    'writing_essay', 'B1',
    'The Advantages and Disadvantages of Working from Home',
    NULL,
    'Viết một đoạn văn hoặc bài luận ngắn (120-180 từ) bằng tiếng Anh thảo luận về ưu và nhược điểm của việc làm việc từ xa (work from home). Đưa ra quan điểm cá nhân và hỗ trợ bằng ví dụ cụ thể.',
    NULL,
    '[{"word":"flexible","meaning":"linh hoạt","example":"Working from home offers flexible hours."},{"word":"productivity","meaning":"năng suất","example":"My productivity increased last month."},{"word":"distraction","meaning":"sự phân tâm","example":"Home has many distractions."},{"word":"commute","meaning":"đi lại (đi làm)","example":"I save time without a daily commute."},{"word":"collaboration","meaning":"sự hợp tác","example":"Team collaboration can be challenging remotely."}]',
    4
  ),
  (
    'writing_essay', 'B2',
    'Technology and Human Connection',
    NULL,
    'Viết một bài luận (200-280 từ) bằng tiếng Anh phân tích: "Liệu công nghệ hiện đại có làm cho con người gần nhau hơn hay xa nhau hơn?" Sử dụng lý lẽ, bằng chứng và ví dụ cụ thể để bảo vệ quan điểm của bạn.',
    NULL,
    '[{"word":"paradoxically","meaning":"nghịch lý thay","example":"Paradoxically, more connection leads to loneliness."},{"word":"foster","meaning":"thúc đẩy, nuôi dưỡng","example":"Technology can foster real relationships."},{"word":"superficial","meaning":"hời hợt, bề mặt","example":"Online friendships can be superficial."},{"word":"authentic","meaning":"chân thực","example":"Authentic connection requires real effort."},{"word":"undermine","meaning":"làm suy yếu","example":"Screen time can undermine family bonds."}]',
    5
  )
ON CONFLICT DO NOTHING;
