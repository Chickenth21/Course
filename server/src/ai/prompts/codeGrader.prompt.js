/**
 * Build Gemini prompt for AI code grading.
 * Returns a detailed evaluation with score, feedback, strengths & improvements.
 */
export function buildCodeGraderPrompt({ title, description, userCode, starterCode, testCases, concepts, language, solutionCode }) {
  const languageLabel = language === 'nodejs' ? 'Node.js' : 'JavaScript ES6+';
  const conceptsList = Array.isArray(concepts) ? concepts.join(', ') : concepts;
  const testCasesText = Array.isArray(testCases) && testCases.length > 0
    ? testCases.map(tc => `- Input: ${tc.input} → Expected: ${tc.expected_output || tc.expected} (${tc.description})`).join('\n')
    : 'Không có test case cụ thể — chấm theo logic và best practices';

  const solutionHint = solutionCode
    ? `\n\n## Đáp Án Tham Khảo (không tiết lộ cho user):\n\`\`\`javascript\n${solutionCode}\n\`\`\``
    : '';

  return `Bạn là một giáo viên lập trình ${languageLabel} chuyên nghiệp, đang chấm bài tập code cho học sinh.

## Bài Tập:
**Tên:** ${title}
**Mô tả:** ${description}
**Concepts cần thể hiện:** ${conceptsList}

## Code Khởi Đầu (Starter Code):
\`\`\`javascript
${starterCode}
\`\`\`

## Code Học Sinh Nộp:
\`\`\`javascript
${userCode}
\`\`\`

## Test Cases:
${testCasesText}
${solutionHint}

## Yêu Cầu Chấm Điểm:
Hãy đánh giá code của học sinh theo các tiêu chí sau và trả về JSON:

1. **Correctness (40%)**: Code có giải quyết đúng yêu cầu không? Test cases có pass không?
2. **ES6+ Usage (30%)**: Có dùng đúng syntax ES6+ mà bài yêu cầu (${conceptsList}) không?
3. **Code Quality (20%)**: Readable, clean, proper naming, không có anti-patterns?
4. **Edge Cases (10%)**: Có xử lý edge cases tốt không?

## Quy Tắc Chấm:
- Score 90-100: Code xuất sắc, dùng đúng concepts, clean
- Score 70-89: Đúng logic nhưng có thể cải thiện style hoặc dùng syntax hiện đại hơn
- Score 50-69: Đúng một phần hoặc có vấn đề nhỏ
- Score < 50: Sai logic hoặc không dùng đúng concepts yêu cầu
- isPassed = true khi score >= 65

## Trả Về JSON (không thêm markdown):
{
  "score": <số nguyên 0-100>,
  "isPassed": <true/false>,
  "feedback": "<nhận xét tổng quan bằng tiếng Việt, 2-4 câu, cụ thể và mang tính xây dựng>",
  "codeReview": "<giải thích chi tiết về code của học sinh, chỉ ra điểm đúng/sai cụ thể, bằng tiếng Việt, 3-6 câu>",
  "strengths": ["<điểm tốt 1>", "<điểm tốt 2>"],
  "improvements": ["<cần cải thiện 1>", "<cần cải thiện 2>"]
}`;
}
