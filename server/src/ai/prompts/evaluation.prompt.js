/**
 * Prompt builders for Gemini AI evaluation of:
 * 1. Reading / Translation submissions
 * 2. Writing / Essay submissions
 */

/**
 * Build prompt for evaluating a Reading/Translation exercise.
 *
 * @param {object} params
 * @param {string} params.sourceText - Original English passage
 * @param {string} params.userTranslation - Student's Vietnamese translation
 * @param {string} params.level - CEFR level (A1, A2, B1, B2)
 * @param {string} [params.referenceTranslation] - Optional model translation for context
 */
export function buildTranslationPrompt({ sourceText, userTranslation, level, referenceTranslation }) {
  const refSection = referenceTranslation
    ? `\n\n**Bản dịch tham khảo (Reference Translation):**\n"${referenceTranslation}"\n`
    : '';

  return `
Bạn là một **Giám khảo Dịch thuật Anh-Việt** chuyên nghiệp, giàu kinh nghiệm trong giảng dạy CEFR cấp độ ${level}.

**Nhiệm vụ của bạn:**
Đánh giá bản dịch tiếng Việt của học viên từ đoạn văn tiếng Anh sau, và trả về kết quả đánh giá chi tiết dưới dạng JSON hợp lệ.

---

**Đoạn văn gốc (tiếng Anh - CEFR ${level}):**
"${sourceText}"
${refSection}
**Bản dịch của học viên (tiếng Việt):**
"${userTranslation}"

---

**Tiêu chí đánh giá:**
1. **Độ chính xác (Accuracy - 0-100):** Bản dịch có truyền đạt đúng nghĩa, ý tứ, sắc thái của văn bản gốc không? Có bị mất ý hoặc sai nghĩa không?
2. **Tính trôi chảy và tự nhiên (Fluency - 0-100):** Bản dịch có đọc tự nhiên như văn tiếng Việt chuẩn mực không? Có bị "dịch máy" hay gượng gạo không?
3. **Chính xác ngữ pháp tiếng Việt (Grammar - 0-100):** Cấu trúc câu, dấu câu, và ngữ pháp tiếng Việt có đúng không?

**Hướng dẫn phân tích lỗi:**
- Chỉ liệt kê lỗi sai hoặc chỗ cần cải thiện đáng kể (tối đa 4 lỗi).
- Với mỗi lỗi: trích dẫn đúng câu/cụm từ gốc, bản dịch học viên, đề xuất sửa đúng và giải thích rõ lý do.
- Tất cả giải thích phải bằng tiếng Việt, thân thiện và mang tính xây dựng.

**Yêu cầu bắt buộc:**
- Cung cấp bản dịch mẫu hoàn chỉnh (bestTranslation) - đây là bản dịch chuẩn nhất có thể theo phong cách người bản ngữ Việt.
- Đưa ra đúng 3 lời khuyên học tập cụ thể, có thể thực hiện ngay (actionableAdvice) bằng tiếng Việt.
- Điểm tổng (overallScore) = trung bình có trọng số của 3 tiêu chí: Accuracy*50% + Fluency*30% + Grammar*20%.

**Trả về đúng định dạng JSON sau (không có markdown, không có chú thích ngoài):**
{
  "overallScore": <number 0-100>,
  "accuracyScore": <number 0-100>,
  "fluencyScore": <number 0-100>,
  "grammarScore": <number 0-100>,
  "feedback": "<nhận xét tổng quát bằng tiếng Việt, 2-4 câu>",
  "errors": [
    {
      "originalSegment": "<câu/cụm từ tiếng Anh gốc>",
      "userTranslation": "<bản dịch học viên>",
      "suggestedCorrection": "<bản dịch đề xuất>",
      "explanation": "<giải thích bằng tiếng Việt>"
    }
  ],
  "bestTranslation": "<bản dịch mẫu toàn bộ đoạn văn>",
  "actionableAdvice": ["<lời khuyên 1>", "<lời khuyên 2>", "<lời khuyên 3>"]
}
`.trim();
}

/**
 * Build prompt for evaluating a Writing/Essay exercise.
 *
 * @param {object} params
 * @param {string} params.topicTitle - Essay topic title
 * @param {string} params.instructions - Task instructions
 * @param {string} params.userEssay - Student's written essay
 * @param {string} params.targetLevel - Target CEFR level (A2, B1, B2)
 * @param {number} [params.minWords] - Minimum word count requirement
 * @param {number} [params.maxWords] - Maximum word count
 */
export function buildWritingPrompt({ topicTitle, instructions, userEssay, targetLevel, minWords = 50, maxWords = 300 }) {
  const wordCount = userEssay.trim().split(/\s+/).filter(Boolean).length;

  return `
Bạn là một **Giám khảo Khảo thí Tiếng Anh Quốc tế** chuyên chấm bài theo tiêu chuẩn CEFR cho trình độ mục tiêu: **${targetLevel}**.

**Nhiệm vụ:** Đánh giá toàn diện bài viết tiếng Anh của học viên dưới đây, trả về kết quả JSON hợp lệ.

---

**Đề bài (Topic):** ${topicTitle}
**Yêu cầu đề bài:**
"${instructions}"
**Số từ yêu cầu:** Tối thiểu ${minWords} từ, tối đa ${maxWords} từ.

---

**Bài viết của học viên (${wordCount} từ):**
"${userEssay}"

---

**Tiêu chí chấm điểm (CEFR-aligned):**
1. **Task Achievement (0-100):** Bài có đáp ứng đúng yêu cầu đề bài? Có đủ ý và đủ số từ không?
2. **Coherence & Cohesion (0-100):** Bài viết có mạch lạc, logic, sử dụng từ nối tốt không?
3. **Lexical Resource (0-100):** Vốn từ có phong phú, chính xác, phù hợp không? Có tránh lặp từ không?
4. **Grammatical Accuracy (0-100):** Ngữ pháp có chính xác, đa dạng không?

**Hướng dẫn phân tích lỗi:**
- Chỉ nêu lỗi quan trọng, tối đa 5 lỗi (Grammar, Vocabulary, Spelling, Punctuation, hoặc Style).
- Mỗi lỗi: trích dẫn câu gốc, phân loại lỗi, câu đã sửa, giải thích ngắn gọn bằng tiếng Việt.
- Giải thích phải thân thiện, mang tính xây dựng và bằng tiếng Việt.

**Bắt buộc cung cấp:**
- **polishedEssay**: Bản viết lại toàn bộ bài theo phong cách người bản ngữ trình độ ${targetLevel} — giữ nguyên ý tưởng chính của học viên nhưng nâng cao ngôn ngữ.
- **cefrBand**: Đánh giá trình độ CEFR tương đương của bài viết này (A1/A2/B1/B2/C1/C2).
- **strengths**: Ít nhất 2 điểm mạnh cụ thể của bài viết.
- **actionableAdvice**: Đúng 3-4 lời khuyên cụ thể, có thể thực hiện ngay bằng tiếng Việt.

**Trả về đúng JSON (không có markdown, không có chú thích ngoài):**
{
  "overallScore": <number 0-100>,
  "cefrBand": "<A1|A2|B1|B2|C1|C2>",
  "criteriaScores": {
    "taskAchievement": <number 0-100>,
    "coherenceAndCohesion": <number 0-100>,
    "lexicalResource": <number 0-100>,
    "grammaticalAccuracy": <number 0-100>
  },
  "wordCount": ${wordCount},
  "feedback": "<nhận xét tổng quát bằng tiếng Việt, 3-5 câu>",
  "strengths": ["<điểm mạnh 1>", "<điểm mạnh 2>"],
  "weaknesses": ["<điểm yếu 1>", "<điểm yếu 2>"],
  "sentenceErrors": [
    {
      "originalSentence": "<câu gốc học viên>",
      "errorType": "<Grammar|Vocabulary|Spelling|Punctuation|Style>",
      "correctedSentence": "<câu đã sửa>",
      "explanation": "<giải thích bằng tiếng Việt>"
    }
  ],
  "polishedEssay": "<bản viết lại hoàn chỉnh>",
  "actionableAdvice": ["<lời khuyên 1>", "<lời khuyên 2>", "<lời khuyên 3>"]
}
`.trim();
}

/**
 * Build prompt for Gemini to generate a brand-new practice topic on-demand.
 *
 * @param {object} params
 * @param {'reading_translation'|'writing_essay'} params.type
 * @param {string} params.level - CEFR level (A1, A2, B1, B2)
 * @param {string[]} [params.usedTitles] - Titles already used, to avoid duplicates
 */
export function buildTopicGenerationPrompt({ type, level, usedTitles = [] }) {
  const avoidSection = usedTitles.length > 0
    ? `\n**Tránh chủ đề đã dùng gần đây:** ${usedTitles.join(', ')}\n`
    : '';

  if (type === 'reading_translation') {
    return `
Bạn là giáo viên tiếng Anh CEFR chuyên nghiệp. Tạo một **đoạn văn đọc hiểu tiếng Anh** cấp độ **${level}** để học viên luyện dịch Anh-Việt.
${avoidSection}
Yêu cầu:
- Từ vựng và cú pháp phù hợp ${level}
- Chủ đề thú vị, gần gũi cuộc sống hàng ngày
- Có idioms nhẹ hoặc cụm từ hay để luyện dịch
- Độ dài: ${level === 'A1' ? '50-80' : level === 'A2' ? '80-120' : level === 'B1' ? '120-180' : '180-250'} từ
- Viết thành đoạn văn liên mạch
- Chủ đề sáng tạo, KHÔNG phải "My name is..." hay "The weather..."

Trả về JSON (không markdown):
{
  "title": "<tiêu đề ngắn, dưới 8 từ>",
  "sourceText": "<đoạn văn tiếng Anh>",
  "instructions": "<hướng dẫn ngắn bằng tiếng Việt, 1-2 câu>",
  "referenceTranslation": "<bản dịch mẫu tiếng Việt chuẩn>",
  "vocabularyHints": [
    { "word": "<từ/cụm khó>", "meaning": "<nghĩa tiếng Việt>", "example": "<ví dụ ngắn>" }
  ],
  "targetWordCount": <số từ ước tính>
}`.trim();
  }

  return `
Bạn là giáo viên tiếng Anh CEFR chuyên nghiệp. Tạo một **đề bài viết luận tiếng Anh** cấp độ **${level}**.
${avoidSection}
Yêu cầu:
- Chủ đề gần gũi, kích thích tư duy, phù hợp người Việt
- Số từ yêu cầu: ${level === 'A2' ? '60-100' : level === 'B1' ? '120-180' : '200-280'} từ
- Có thể: mô tả, so sánh, kể chuyện, nêu ý kiến — phù hợp ${level}

Trả về JSON (không markdown):
{
  "title": "<tiêu đề đề bài ngắn>",
  "instructions": "<hướng dẫn đầy đủ bằng tiếng Việt — viết về gì, đề cập điểm nào, số từ>",
  "vocabularyHints": [
    { "word": "<từ gợi ý>", "meaning": "<nghĩa tiếng Việt>", "example": "<ví dụ>" }
  ],
  "targetWordCount": <số từ>
}`.trim();
}
