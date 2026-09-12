import { z } from 'zod';

// ================================================================
// Schema for Reading / Translation Evaluation
// ================================================================
export const translationEvaluationSchema = z.object({
  overallScore: z.number().min(0).max(100),
  accuracyScore: z.number().min(0).max(100).describe('Độ chính xác về nghĩa'),
  fluencyScore: z.number().min(0).max(100).describe('Tính trôi chảy, tự nhiên'),
  grammarScore: z.number().min(0).max(100).describe('Độ chính xác ngữ pháp tiếng Việt'),
  feedback: z.string().describe('Nhận xét tổng quát bằng tiếng Việt'),
  errors: z.array(
    z.object({
      originalSegment: z.string().describe('Câu/cụm từ gốc tiếng Anh'),
      userTranslation: z.string().describe('Bản dịch của học viên'),
      suggestedCorrection: z.string().describe('Bản dịch đề xuất đúng hơn'),
      explanation: z.string().describe('Giải thích lý do sai/chưa tự nhiên bằng tiếng Việt')
    })
  ).default([]),
  bestTranslation: z.string().describe('Bản dịch mẫu chuẩn mực toàn bộ đoạn văn'),
  actionableAdvice: z.array(z.string()).min(1).max(5)
    .describe('Danh sách lời khuyên cụ thể để cải thiện kỹ năng dịch thuật')
});

// ================================================================
// Schema for Writing / Essay Evaluation
// ================================================================
export const writingEvaluationSchema = z.object({
  overallScore: z.number().min(0).max(100),
  cefrBand: z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'])
    .describe('Đánh giá trình độ CEFR tương đương của bài viết'),
  criteriaScores: z.object({
    taskAchievement: z.number().min(0).max(100)
      .describe('Mức độ hoàn thành yêu cầu đề bài'),
    coherenceAndCohesion: z.number().min(0).max(100)
      .describe('Tính mạch lạc và liên kết'),
    lexicalResource: z.number().min(0).max(100)
      .describe('Vốn từ vựng và sự đa dạng'),
    grammaticalAccuracy: z.number().min(0).max(100)
      .describe('Độ chính xác ngữ pháp')
  }),
  wordCount: z.number().int().min(0),
  feedback: z.string().describe('Nhận xét tổng quát bằng tiếng Việt'),
  strengths: z.array(z.string()).min(1).describe('Điểm mạnh của bài viết'),
  weaknesses: z.array(z.string()).describe('Điểm cần cải thiện'),
  sentenceErrors: z.array(
    z.object({
      originalSentence: z.string().describe('Câu gốc của học viên'),
      errorType: z.enum(['Grammar', 'Vocabulary', 'Spelling', 'Punctuation', 'Style'])
        .describe('Loại lỗi'),
      correctedSentence: z.string().describe('Câu đã sửa'),
      explanation: z.string().describe('Giải thích lỗi sai bằng tiếng Việt')
    })
  ).default([]),
  polishedEssay: z.string().describe('Bản viết lại hoàn chỉnh theo phong cách người bản xứ'),
  actionableAdvice: z.array(z.string()).min(1).max(5)
    .describe('Lời khuyên cụ thể và có thể thực hiện ngay để cải thiện kỹ năng viết')
});

// ================================================================
// Deterministic Fallback Schemas
// ================================================================
export const fallbackTranslationResult = {
  overallScore: 65,
  accuracyScore: 65,
  fluencyScore: 60,
  grammarScore: 70,
  feedback: 'Bài dịch của bạn đã nắm được ý chính của đoạn văn. Tuy nhiên, một số cụm từ có thể được diễn đạt tự nhiên hơn theo cách người bản ngữ sử dụng. Hãy tiếp tục luyện tập để nâng cao độ trôi chảy và phong phú từ ngữ.',
  errors: [],
  bestTranslation: '(Vui lòng kết nối Gemini AI để nhận bản dịch mẫu chính xác nhất)',
  actionableAdvice: [
    'Đọc thêm văn bản tiếng Anh hàng ngày để quen với cấu trúc câu tự nhiên',
    'Học từ vựng theo ngữ cảnh thay vì ghi nhớ đơn thuần',
    'So sánh bản dịch của bạn với nhiều nguồn tham khảo khác nhau'
  ]
};

export const fallbackWritingResult = {
  overallScore: 60,
  cefrBand: 'B1',
  criteriaScores: {
    taskAchievement: 65,
    coherenceAndCohesion: 60,
    lexicalResource: 58,
    grammaticalAccuracy: 62
  },
  wordCount: 0,
  feedback: 'Bài viết của bạn đã đáp ứng được yêu cầu cơ bản của đề bài. Hãy chú ý hơn đến sự liên kết giữa các câu và đoạn văn, đồng thời mở rộng vốn từ vựng để bài viết phong phú và ấn tượng hơn.',
  strengths: ['Đã trả lời đúng chủ đề được yêu cầu', 'Cấu trúc câu cơ bản tương đối đúng'],
  weaknesses: ['Cần đa dạng hóa từ vựng', 'Cần cải thiện sự liên kết giữa các ý'],
  sentenceErrors: [],
  polishedEssay: '(Vui lòng kết nối Gemini AI để nhận bản viết lại chuẩn bản ngữ)',
  actionableAdvice: [
    'Viết nhật ký bằng tiếng Anh mỗi ngày ít nhất 50 từ',
    'Học 5-10 từ vựng mới theo chủ đề mỗi ngày',
    'Đọc lại bài viết và kiểm tra ngữ pháp trước khi nộp',
    'Sử dụng từ nối (therefore, however, moreover) để tăng tính mạch lạc'
  ]
};
