/**
 * Practice Schema Migration & Seed Script
 * Run: node src/db/seedPractice.js
 *
 * Creates practice_topics and practice_submissions tables,
 * then seeds sample practice topics.
 */

import dotenv from 'dotenv';
dotenv.config();

import { createClient } from '@supabase/supabase-js';
import ws from 'ws';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
  realtime: { transport: ws }
});

const practiceTopicsData = [
  // ── Reading / Translation Topics ──────────────────────────────────────
  {
    type: 'reading_translation',
    level: 'A2',
    title: 'A Morning at the Café',
    source_text: 'Every morning, Sarah wakes up early and walks to a small café near her house. She always orders a cup of black coffee and a croissant. While she drinks her coffee, she reads the newspaper and watches people passing by. She thinks this is the best way to start a peaceful day.',
    instructions: 'Dịch đoạn văn sau sang tiếng Việt một cách tự nhiên và chính xác nhất có thể. Chú ý đến giọng văn và cách diễn đạt phù hợp.',
    reference_translation: 'Mỗi sáng, Sarah thức dậy sớm và đi bộ đến một quán cà phê nhỏ gần nhà cô. Cô luôn gọi một ly cà phê đen và một chiếc bánh sừng bò. Trong khi uống cà phê, cô đọc báo và nhìn ngắm người đi đường. Cô nghĩ đây là cách tốt nhất để bắt đầu một ngày bình yên.',
    vocabulary_hints: [
      { word: 'croissant', meaning: 'bánh sừng bò', example: 'She ate a warm croissant.' },
      { word: 'passing by', meaning: 'đi qua', example: 'People were passing by the window.' },
      { word: 'peaceful', meaning: 'bình yên', example: 'It was a peaceful morning.' }
    ],
    target_word_count: 80,
    order_index: 1,
    is_active: true
  },
  {
    type: 'reading_translation',
    level: 'B1',
    title: 'The Impact of Social Media on Youth',
    source_text: 'Social media has dramatically changed the way young people communicate and interact with the world. While platforms like Instagram and TikTok allow teenagers to express their creativity and connect with peers globally, they also raise serious concerns about mental health and screen addiction. Psychologists argue that excessive social media use can lead to anxiety, low self-esteem, and disrupted sleep patterns. Therefore, it is crucial for parents and educators to guide young people in developing healthy digital habits.',
    instructions: 'Dịch đoạn văn học thuật này sang tiếng Việt. Chú ý duy trì phong cách trang trọng và chính xác thuật ngữ chuyên ngành.',
    reference_translation: 'Mạng xã hội đã thay đổi đáng kể cách giới trẻ giao tiếp và tương tác với thế giới. Trong khi các nền tảng như Instagram và TikTok cho phép thanh thiếu niên thể hiện sự sáng tạo và kết nối với bạn bè trên toàn cầu, chúng cũng đặt ra những lo ngại nghiêm trọng về sức khỏe tâm thần và nghiện thiết bị điện tử. Các nhà tâm lý học lập luận rằng việc sử dụng mạng xã hội quá mức có thể dẫn đến lo âu, lòng tự trọng thấp và rối loạn giấc ngủ. Do đó, điều quan trọng là cha mẹ và nhà giáo dục cần hướng dẫn giới trẻ xây dựng thói quen số lành mạnh.',
    vocabulary_hints: [
      { word: 'dramatically', meaning: 'đáng kể, đột ngột', example: 'Technology has dramatically changed our lives.' },
      { word: 'excessive', meaning: 'quá mức', example: 'Excessive use of phones is harmful.' },
      { word: 'self-esteem', meaning: 'lòng tự trọng', example: 'Low self-esteem can affect performance.' },
      { word: 'crucial', meaning: 'then chốt, quan trọng', example: 'It is crucial to act now.' }
    ],
    target_word_count: 120,
    order_index: 2,
    is_active: true
  },
  {
    type: 'reading_translation',
    level: 'A1',
    title: 'My Family',
    source_text: 'I have a small family. There are four people in my family: my father, my mother, my sister, and me. My father is a doctor. My mother is a teacher. My sister is twelve years old. She goes to school every day. We love each other very much.',
    instructions: 'Dịch đoạn văn ngắn này sang tiếng Việt. Đây là bài cơ bản, hãy dịch thật chính xác và tự nhiên.',
    reference_translation: 'Tôi có một gia đình nhỏ. Có bốn người trong gia đình tôi: bố, mẹ, chị gái và tôi. Bố tôi là bác sĩ. Mẹ tôi là giáo viên. Chị gái tôi mười hai tuổi. Cô ấy đi học mỗi ngày. Chúng tôi yêu thương nhau rất nhiều.',
    vocabulary_hints: [
      { word: 'family', meaning: 'gia đình', example: 'My family is small.' },
      { word: 'doctor', meaning: 'bác sĩ', example: 'He is a doctor.' },
      { word: 'teacher', meaning: 'giáo viên', example: 'She is a teacher.' }
    ],
    target_word_count: 50,
    order_index: 3,
    is_active: true
  },
  // ── Writing / Essay Topics ─────────────────────────────────────────────
  {
    type: 'writing_essay',
    level: 'A2',
    title: 'My Favorite Weekend Activity',
    source_text: null,
    instructions: 'Viết một đoạn văn ngắn (60-100 từ) bằng tiếng Anh về hoạt động yêu thích của bạn vào cuối tuần. Nêu rõ: Hoạt động đó là gì? Bạn làm với ai? Nó khiến bạn cảm thấy như thế nào?',
    reference_translation: null,
    vocabulary_hints: [
      { word: 'spend time', meaning: 'dành thời gian', example: 'I spend time with my family.' },
      { word: 'relax', meaning: 'thư giãn', example: 'I like to relax on Sundays.' },
      { word: 'enjoy', meaning: 'thích thú', example: 'I enjoy playing football.' },
      { word: 'outdoor', meaning: 'ngoài trời', example: 'We have outdoor activities on weekends.' }
    ],
    target_word_count: 80,
    order_index: 4,
    is_active: true
  },
  {
    type: 'writing_essay',
    level: 'B1',
    title: 'Advantages and Disadvantages of Working from Home',
    source_text: null,
    instructions: 'Viết một đoạn văn hoặc bài luận ngắn (120-180 từ) bằng tiếng Anh thảo luận về ưu và nhược điểm của việc làm việc từ xa (work from home). Đưa ra quan điểm cá nhân và hỗ trợ bằng ví dụ cụ thể.',
    reference_translation: null,
    vocabulary_hints: [
      { word: 'flexible', meaning: 'linh hoạt', example: 'Working from home offers flexible hours.' },
      { word: 'productivity', meaning: 'năng suất', example: 'My productivity increased last month.' },
      { word: 'distraction', meaning: 'sự phân tâm', example: 'Home has many distractions.' },
      { word: 'commute', meaning: 'đi lại (đi làm)', example: 'I save time without a daily commute.' },
      { word: 'collaboration', meaning: 'sự hợp tác', example: 'Team collaboration can be challenging remotely.' }
    ],
    target_word_count: 150,
    order_index: 5,
    is_active: true
  },
  {
    type: 'writing_essay',
    level: 'B2',
    title: 'Technology and Human Connection',
    source_text: null,
    instructions: 'Viết một bài luận (200-280 từ) bằng tiếng Anh phân tích: "Liệu công nghệ hiện đại có làm cho con người gần nhau hơn hay xa nhau hơn?" Sử dụng lý lẽ, bằng chứng và ví dụ cụ thể để bảo vệ quan điểm của bạn.',
    reference_translation: null,
    vocabulary_hints: [
      { word: 'paradoxically', meaning: 'nghịch lý thay', example: 'Paradoxically, more connection leads to loneliness.' },
      { word: 'foster', meaning: 'thúc đẩy, nuôi dưỡng', example: 'Technology can foster real relationships.' },
      { word: 'superficial', meaning: 'hời hợt, bề mặt', example: 'Online friendships can be superficial.' },
      { word: 'authentic', meaning: 'chân thực', example: 'Authentic connection requires real effort.' },
      { word: 'undermine', meaning: 'làm suy yếu', example: 'Screen time can undermine family bonds.' }
    ],
    target_word_count: 240,
    order_index: 6,
    is_active: true
  },
  {
    type: 'writing_essay',
    level: 'A2',
    title: 'Describe Your Hometown',
    source_text: null,
    instructions: 'Viết một đoạn văn (60-80 từ) bằng tiếng Anh mô tả thành phố/quê hương của bạn. Đề cập đến: tên, vị trí, điều bạn yêu thích nhất về nơi đó.',
    reference_translation: null,
    vocabulary_hints: [
      { word: 'located', meaning: 'tọa lạc, nằm ở', example: 'My city is located in the south.' },
      { word: 'famous for', meaning: 'nổi tiếng về', example: 'It is famous for its food.' },
      { word: 'population', meaning: 'dân số', example: 'The population is about 2 million.' }
    ],
    target_word_count: 70,
    order_index: 7,
    is_active: true
  }
];

async function seedPracticeTopics() {
  console.log('🌱 Seeding practice topics...');

  // Test if table exists first
  const { data: existingTopics, error: checkError } = await supabase
    .from('practice_topics')
    .select('id')
    .limit(1);

  if (checkError) {
    console.error('❌ Table "practice_topics" does not exist yet.');
    console.error('   Error:', checkError.message);
    console.log('\n📋 MANUAL STEP REQUIRED:');
    console.log('   1. Go to Supabase Dashboard → SQL Editor');
    console.log('   2. Paste and run the contents of: server/src/db/practice_schema.sql');
    console.log('   3. Then run this script again: node src/db/seedPractice.js');
    process.exit(1);
  }

  if (existingTopics && existingTopics.length > 0) {
    console.log(`ℹ️  practice_topics table already has data (${existingTopics.length}+ rows). Skipping seed.`);
    console.log('   Use --force flag to re-seed: node src/db/seedPractice.js --force');

    if (!process.argv.includes('--force')) {
      process.exit(0);
    }
    console.log('🔄 --force detected. Clearing existing topics...');
    await supabase.from('practice_topics').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  }

  let insertedCount = 0;
  for (const topic of practiceTopicsData) {
    const { error } = await supabase
      .from('practice_topics')
      .insert([topic]);

    if (error) {
      console.error(`❌ Failed to insert "${topic.title}":`, error.message);
    } else {
      console.log(`✅ Seeded: [${topic.type}/${topic.level}] "${topic.title}"`);
      insertedCount++;
    }
  }

  console.log(`\n✨ Done! Seeded ${insertedCount}/${practiceTopicsData.length} practice topics.`);
}

seedPracticeTopics()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
