/**
 * Build Gemini prompt for generating a personalized coding roadmap.
 */
export function buildCodingRoadmapPrompt({ goal, skillLevel, courseTitle, courseModules }) {
  const modulesText = courseModules.map((mod, i) =>
    `Module ${i + 1}: ${mod.title}\n  Mô tả: ${mod.description}\n  Lessons: ${(mod.lessons || []).map(l => `"${l.title}" (id: ${l.id})`).join(', ')}`
  ).join('\n\n');

  const skillDescriptions = {
    beginner: 'Mới bắt đầu, chưa biết gì về chủ đề này',
    intermediate: 'Đã biết cơ bản, muốn nâng cao',
    advanced: 'Đã có kinh nghiệm, muốn làm chủ toàn diện'
  };

  return `Bạn là một mentor lập trình chuyên nghiệp. Hãy tạo lộ trình học tập cá nhân hóa cho học sinh.

## Thông Tin Học Sinh:
- **Mục tiêu:** ${goal}
- **Trình độ hiện tại:** ${skillLevel} — ${skillDescriptions[skillLevel] || skillLevel}

## Khóa Học: ${courseTitle}
Nội dung có sẵn:

${modulesText}

## Yêu Cầu:
1. Tạo lộ trình học tập phù hợp với trình độ và mục tiêu của học sinh
2. Sắp xếp thứ tự học hợp lý (từ cơ bản đến nâng cao)
3. Với mỗi step, chỉ định lesson_id từ danh sách trên (nếu có lesson phù hợp)
4. Với step chưa có lesson tương ứng, để lesson_id là null
5. Đánh dấu priority: "high" cho step quan trọng nhất với mục tiêu của học sinh

## Trả Về JSON (không thêm markdown):
{
  "summary": "<tóm tắt lộ trình bằng tiếng Việt, 2-3 câu, nêu bật điểm mạnh và hướng đi>",
  "estimatedWeeks": <số tuần ước tính, 2-8>,
  "steps": [
    {
      "order_index": 1,
      "topic": "<tên chủ đề>",
      "description": "<mô tả ngắn 1-2 câu bằng tiếng Việt>",
      "lesson_id": "<uuid của lesson hoặc null>",
      "concepts": ["concept1", "concept2"],
      "priority": "high | normal",
      "reason": "<tại sao step này quan trọng với mục tiêu của học sinh, 1 câu>"
    }
  ]
}

Tạo từ 5 đến 10 steps, phù hợp với trình độ ${skillLevel}.`;
}
