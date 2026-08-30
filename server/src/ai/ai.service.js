import { ai } from '../config/gemini.js';
import { buildLearningPathPrompt } from './prompts/learningPath.prompt.js';
import { learningPathResponseSchema } from './schemas/learningPath.schema.js';

export const aiService = {
  /**
   * Generate personalized learning path using Gemini AI with fallback
   */
  async generateLearningPath({ currentLevel = 'A1', targetLevel = 'B2', skillScores = {}, weakAreas = [], strongAreas = [] }) {
    // 1. Try Gemini AI if client is available
    if (ai) {
      const modelsToTry = ['gemini-3.6-flash', 'gemini-flash-latest', 'gemini-2.5-pro'];
      for (const modelName of modelsToTry) {
        try {
          const prompt = buildLearningPathPrompt({ currentLevel, targetLevel, skillScores, weakAreas, strongAreas });
          console.log(`🤖 Querying Google Gemini AI (${modelName}) for Learning Path...`);

          const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
              responseMimeType: 'application/json'
            }
          });

          const rawText = response.text || '';
          const jsonText = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
          const parsedJson = JSON.parse(jsonText);

          // Validate strictly with Zod schema
          const validatedData = learningPathResponseSchema.parse(parsedJson);
          console.log(`✅ Gemini (${modelName}) generated ${validatedData.steps.length} learning path steps successfully.`);
          return validatedData;
        } catch (error) {
          console.warn(`⚠️ Gemini AI generation with ${modelName} encountered an error:`, error.message);
        }
      }
    } else {
      console.warn('ℹ️ Gemini API client not configured, using deterministic curriculum generator.');
    }

    // 2. Intelligent Deterministic Fallback Generator
    return this.generateFallbackLearningPath({ currentLevel, targetLevel, skillScores, weakAreas });
  },

  generateFallbackLearningPath({ currentLevel = 'A1', targetLevel = 'B2', weakAreas = [] }) {
    const isA1orA2 = currentLevel === 'A1' || currentLevel === 'A2';

    const steps = isA1orA2
      ? [
          {
            order_index: 1,
            topic: 'Thì Hiện Tại Đơn & Động Từ To Be',
            skill: 'Grammar',
            difficulty: currentLevel,
            reason: 'Nền tảng quan trọng nhất để diễn đạt thói quen và sự thật hiển nhiên.',
            estimated_duration_minutes: 20,
            objectives: ['Chia động từ ngôi thứ 3 số ít', 'Đặt câu hỏi và câu phủ định']
          },
          {
            order_index: 2,
            topic: 'Từ Vựng Đời Sống Hàng Ngày & Gia Đình',
            skill: 'Vocabulary',
            difficulty: currentLevel,
            reason: 'Mở rộng vốn từ vựng cơ bản để tự tin giới thiệu bản thân.',
            estimated_duration_minutes: 20,
            objectives: ['Học 30 từ vựng thông dụng', 'Sử dụng từ vựng trong ngữ cảnh']
          },
          {
            order_index: 3,
            topic: 'Thì Quá Khứ Đơn & Động Từ Bất Quy Tắc',
            skill: 'Grammar',
            difficulty: 'A2',
            reason: 'Khắc phục lỗi sai thường gặp khi kể lại các sự việc đã qua.',
            estimated_duration_minutes: 25,
            objectives: ['Nắm vững 50 động từ bất quy tắc', 'Sử dụng did/didn’t chính xác']
          },
          {
            order_index: 4,
            topic: 'Đọc Hiểu: Đoạn Văn Ngắn & Hội Thoại Thực Tế',
            skill: 'Reading',
            difficulty: 'A2',
            reason: 'Rèn luyện kỹ năng tìm ý chính (skimming) và thông tin chi tiết (scanning).',
            estimated_duration_minutes: 25,
            objectives: ['Đọc hiểu văn bản 150-200 từ', 'Trả lời câu hỏi trắc nghiệm đúng']
          },
          {
            order_index: 5,
            topic: 'Câu Điều Kiện Loại 1 & Các Thì Tương Lai',
            skill: 'Grammar',
            difficulty: 'B1',
            reason: 'Bước đệm vững chắc để nâng trình độ lên B1.',
            estimated_duration_minutes: 30,
            objectives: ['Phân biệt Will và Be going to', 'Cấu trúc If + Present Simple, Will + V']
          }
        ]
      : [
          {
            order_index: 1,
            topic: 'Các Thì Hoàn Thành (Present Perfect vs Past Perfect)',
            skill: 'Grammar',
            difficulty: currentLevel,
            reason: 'Chủ điểm ngữ pháp cốt lõi để nâng cao tính chính xác trong diễn đạt.',
            estimated_duration_minutes: 25,
            objectives: ['Sử dụng Since/For', 'Phân biệt Quá khứ đơn và Hiện tại hoàn thành']
          },
          {
            order_index: 2,
            topic: 'Cụm Động Từ & Thành Ngữ Giao Tiếp (Phrasal Verbs & Idioms)',
            skill: 'Vocabulary',
            difficulty: currentLevel,
            reason: 'Tăng độ tự nhiên và linh hoạt khi sử dụng tiếng Anh.',
            estimated_duration_minutes: 25,
            objectives: ['Ghi nhớ 20 phrasal verbs phổ biến', 'Hiểu nghĩa theo ngữ cảnh']
          },
          {
            order_index: 3,
            topic: 'Mệnh Đề Quan Hệ & Câu Bị Động Nâng Cao',
            skill: 'Grammar',
            difficulty: targetLevel,
            reason: 'Giúp câu văn phong phú và học thuật hơn.',
            estimated_duration_minutes: 30,
            objectives: ['Sử dụng Who, Which, That, Whose', 'Rút gọn mệnh đề quan hệ']
          },
          {
            order_index: 4,
            topic: 'Đọc Hiểu Bài Báo & Văn Bản Học Thuật',
            skill: 'Reading',
            difficulty: targetLevel,
            reason: 'Nâng cao khả năng suy luận và đoán nghĩa từ mới.',
            estimated_duration_minutes: 30,
            objectives: ['Đọc văn bản 400-500 từ', 'Phân tích quan điểm tác giả']
          }
        ];

    return {
      summary: `Lộ trình học tập được thiết kế riêng nhằm giúp bạn nâng cao từ trình độ ${currentLevel} lên mục tiêu ${targetLevel}, tập trung khắc phục điểm yếu và củng cố ngữ pháp nền tảng.`,
      current_level: currentLevel,
      target_level: targetLevel,
      steps
    };
  }
};
