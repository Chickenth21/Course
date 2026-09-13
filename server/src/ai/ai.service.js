import { ai } from '../config/gemini.js';
import { buildLearningPathPrompt } from './prompts/learningPath.prompt.js';
import { learningPathResponseSchema } from './schemas/learningPath.schema.js';
import { buildTranslationPrompt, buildWritingPrompt, buildTopicGenerationPrompt } from './prompts/evaluation.prompt.js';
import {
  translationEvaluationSchema,
  writingEvaluationSchema,
  fallbackTranslationResult,
  fallbackWritingResult
} from './schemas/evaluation.schema.js';
import { buildCodeGraderPrompt } from './prompts/codeGrader.prompt.js';
import { buildCodingRoadmapPrompt } from './prompts/codingRoadmap.prompt.js';
import {
  codeGraderSchema,
  codingRoadmapResponseSchema,
  fallbackCodeGradeResult,
  fallbackCodingRoadmap
} from './schemas/codeGrader.schema.js';

export const aiService = {
  /**
   * Generate personalized learning path using Gemini AI with fallback
   */
  async generateLearningPath({ currentLevel = 'A1', targetLevel = 'B2', skillScores = {}, weakAreas = [], strongAreas = [] }) {
    // 1. Try Gemini AI if client is available
    if (ai) {
      const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
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
  },

  /**
   * Evaluate a reading/translation submission using Gemini AI.
   * Falls back to deterministic result if Gemini is unavailable.
   */
  async evaluateReadingTranslation({ sourceText, userTranslation, level = 'B1', referenceTranslation }) {
    if (ai) {
      const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
      for (const modelName of modelsToTry) {
        try {
          const prompt = buildTranslationPrompt({ sourceText, userTranslation, level, referenceTranslation });
          console.log(`🤖 Gemini (${modelName}): Evaluating translation...`);

          const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: { responseMimeType: 'application/json' }
          });

          const rawText = response.text || '';
          const jsonText = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
          const parsedJson = JSON.parse(jsonText);
          const validated = translationEvaluationSchema.parse(parsedJson);
          console.log(`✅ Gemini (${modelName}): Translation evaluated — score ${validated.overallScore}`);
          return { ...validated, isAiGraded: true };
        } catch (error) {
          console.warn(`⚠️ Gemini translation eval (${modelName}) failed:`, error.message);
        }
      }
    } else {
      console.warn('ℹ️ Gemini not configured — using fallback for translation evaluation.');
    }

    // Deterministic fallback
    return { ...fallbackTranslationResult, isAiGraded: false };
  },

  /**
   * Evaluate a writing/essay submission using Gemini AI.
   * Falls back to deterministic result if Gemini is unavailable.
   */
  async evaluateWritingEssay({ topicTitle, instructions, userEssay, targetLevel = 'B1', minWords = 50, maxWords = 300 }) {
    if (ai) {
      const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
      for (const modelName of modelsToTry) {
        try {
          const prompt = buildWritingPrompt({ topicTitle, instructions, userEssay, targetLevel, minWords, maxWords });
          console.log(`🤖 Gemini (${modelName}): Evaluating writing essay...`);

          const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: { responseMimeType: 'application/json' }
          });

          const rawText = response.text || '';
          const jsonText = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
          const parsedJson = JSON.parse(jsonText);
          const validated = writingEvaluationSchema.parse(parsedJson);
          console.log(`✅ Gemini (${modelName}): Essay evaluated — score ${validated.overallScore}, CEFR ${validated.cefrBand}`);
          return { ...validated, isAiGraded: true };
        } catch (error) {
          console.warn(`⚠️ Gemini writing eval (${modelName}) failed:`, error.message);
        }
      }
    } else {
      console.warn('ℹ️ Gemini not configured — using fallback for writing evaluation.');
    }

    // Deterministic fallback with word count populated
    const wordCount = userEssay.trim().split(/\s+/).filter(Boolean).length;
    return { ...fallbackWritingResult, wordCount, isAiGraded: false };
  },

  /**
   * Generate a brand-new practice topic using Gemini AI.
   * Returns a structured topic object ready for display.
   */
  async generatePracticeTopic({ type, level, usedTitles = [] }) {
    if (ai) {
      const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
      for (const modelName of modelsToTry) {
        try {
          const prompt = buildTopicGenerationPrompt({ type, level, usedTitles });
          console.log(`🤖 Gemini (${modelName}): Generating ${type} topic for level ${level}...`);

          const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: { responseMimeType: 'application/json' }
          });

          const rawText = response.text || '';
          const jsonText = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
          const parsed = JSON.parse(jsonText);

          // Validate minimum required fields
          if (!parsed.title || !parsed.instructions) {
            throw new Error('Missing required fields in generated topic');
          }
          if (type === 'reading_translation' && !parsed.sourceText) {
            throw new Error('Missing sourceText for reading topic');
          }

          console.log(`✅ Gemini (${modelName}): Generated topic "${parsed.title}"`);
          return {
            ...parsed,
            type,
            level,
            isAiGenerated: true,
            vocabularyHints: Array.isArray(parsed.vocabularyHints) ? parsed.vocabularyHints : [],
            targetWordCount: parsed.targetWordCount || (type === 'reading_translation' ? 100 : 150)
          };
        } catch (error) {
          console.warn(`⚠️ Gemini topic generation (${modelName}) failed:`, error.message);
        }
      }
    } else {
      console.warn('ℹ️ Gemini not configured — using fallback topic.');
    }

    // Deterministic fallback topics
    return this.getFallbackTopic(type, level);
  },

  getFallbackTopic(type, level) {
    if (type === 'reading_translation') {
      return {
        title: 'Life in a Modern City',
        sourceText: 'Modern cities are exciting places to live and work. They offer many opportunities for education, career development, and entertainment. However, city life also has its challenges. Traffic jams, pollution, and high costs of living are common problems that urban residents face every day. Despite these difficulties, millions of people continue to move to cities in search of a better future.',
        instructions: 'Dịch đoạn văn sau sang tiếng Việt một cách tự nhiên và chính xác nhất.',
        referenceTranslation: 'Các thành phố hiện đại là những nơi thú vị để sinh sống và làm việc. Chúng mang lại nhiều cơ hội cho giáo dục, phát triển nghề nghiệp và giải trí. Tuy nhiên, cuộc sống đô thị cũng có những thách thức riêng. Tắc đường, ô nhiễm và chi phí sinh hoạt cao là những vấn đề phổ biến mà cư dân thành thị phải đối mặt hàng ngày. Bất chấp những khó khăn đó, hàng triệu người vẫn tiếp tục đổ về các thành phố để tìm kiếm một tương lai tươi sáng hơn.',
        vocabularyHints: [
          { word: 'opportunities', meaning: 'cơ hội', example: 'There are many opportunities in the city.' },
          { word: 'urban residents', meaning: 'cư dân thành thị', example: 'Urban residents face many challenges.' },
          { word: 'despite', meaning: 'bất chấp, dù', example: 'Despite the problems, people still come.' }
        ],
        targetWordCount: 100,
        type,
        level,
        isAiGenerated: false
      };
    }
    return {
      title: 'My Ideal Weekend',
      instructions: `Viết một đoạn văn ${level === 'A2' ? '(60-100 từ)' : level === 'B1' ? '(120-180 từ)' : '(200-250 từ)'} bằng tiếng Anh mô tả buổi cuối tuần lý tưởng của bạn. Nêu rõ bạn muốn làm gì, ở đâu, với ai và tại sao điều đó quan trọng với bạn.`,
      vocabularyHints: [
        { word: 'leisure', meaning: 'thời gian rảnh rỗi', example: 'I enjoy leisure activities on weekends.' },
        { word: 'refresh', meaning: 'làm mới, hồi phục', example: 'A good rest helps me refresh.' },
        { word: 'worthwhile', meaning: 'xứng đáng, có giá trị', example: 'Spending time with family is worthwhile.' }
      ],
      targetWordCount: level === 'A2' ? 80 : level === 'B1' ? 150 : 220,
      type,
      level,
      isAiGenerated: false
    };
  },

  /**
   * Grade a code submission using Gemini AI.
   * Returns score 0-100, isPassed, feedback, strengths, improvements.
   * Falls back to a deterministic result if Gemini is unavailable.
   */
  async gradeCode({ title, description, userCode, starterCode, testCases, concepts, language, solutionCode }) {
    if (ai) {
      const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
      for (const modelName of modelsToTry) {
        try {
          const prompt = buildCodeGraderPrompt({ title, description, userCode, starterCode, testCases, concepts, language, solutionCode });
          console.log(`🤖 Gemini (${modelName}): Grading code submission...`);

          const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: { responseMimeType: 'application/json' }
          });

          const rawText = response.text || '';
          const jsonText = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
          const parsedJson = JSON.parse(jsonText);
          const validated = codeGraderSchema.parse(parsedJson);
          console.log(`✅ Gemini (${modelName}): Code graded — score ${validated.score}, passed: ${validated.isPassed}`);
          return { ...validated, isAiGraded: true };
        } catch (error) {
          console.warn(`⚠️ Gemini code grading (${modelName}) failed:`, error.message);
        }
      }
    } else {
      console.warn('ℹ️ Gemini not configured — using fallback for code grading.');
    }

    return { ...fallbackCodeGradeResult, isAiGraded: false };
  },

  /**
   * Generate a personalized coding roadmap using Gemini AI.
   * Falls back to a linear roadmap ordering all course modules.
   */
  async generateCodingRoadmap({ goal, skillLevel, courseTitle, courseModules }) {
    if (ai) {
      const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
      for (const modelName of modelsToTry) {
        try {
          const prompt = buildCodingRoadmapPrompt({ goal, skillLevel, courseTitle, courseModules });
          console.log(`🤖 Gemini (${modelName}): Generating coding roadmap...`);

          const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: { responseMimeType: 'application/json' }
          });

          const rawText = response.text || '';
          const jsonText = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
          const parsedJson = JSON.parse(jsonText);
          const validated = codingRoadmapResponseSchema.parse(parsedJson);
          console.log(`✅ Gemini (${modelName}): Roadmap generated with ${validated.steps.length} steps.`);
          return validated;
        } catch (error) {
          console.warn(`⚠️ Gemini coding roadmap (${modelName}) failed:`, error.message);
        }
      }
    } else {
      console.warn('ℹ️ Gemini not configured — using fallback for coding roadmap.');
    }

    // Deterministic fallback: create steps from all available lessons
    const allLessons = courseModules.flatMap((mod, mIdx) =>
      (mod.lessons || []).map((lesson, lIdx) => ({
        order_index: mIdx * 10 + lIdx + 1,
        topic: lesson.title,
        description: lesson.description || mod.description || '',
        lesson_id: lesson.id,
        concepts: [],
        priority: lIdx === 0 ? 'high' : 'normal',
        reason: `Bài học từ module: ${mod.title}`
      }))
    );

    return {
      ...fallbackCodingRoadmap,
      steps: allLessons.length > 0 ? allLessons : fallbackCodingRoadmap.steps
    };
  }
};

