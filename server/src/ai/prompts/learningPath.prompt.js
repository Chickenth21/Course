/**
 * Builds structured prompt for Gemini to generate a personalized English learning curriculum
 */
export function buildLearningPathPrompt({ currentLevel, targetLevel, skillScores = {}, weakAreas = [], strongAreas = [] }) {
  const weakAreasText = weakAreas.length > 0 ? weakAreas.join(', ') : 'Cần củng cố toàn diện các thì cơ bản và từ vựng thông dụng';
  const strongAreasText = strongAreas.length > 0 ? strongAreas.join(', ') : 'Nắm được các câu giao tiếp cơ bản';
  const skillBreakdown = Object.entries(skillScores)
    .map(([skill, score]) => `- ${skill}: ${score}%`)
    .join('\n');

  return `Bạn là một chuyên gia khảo thí và thiết kế giáo trình tiếng Anh chuẩn quốc tế CEFR.
Hãy thiết kế một lộ trình học tập cá nhân hóa (Personalized Learning Path) từng bước cho học viên sau:

THÔNG TIN HỌC VIÊN:
- Trình độ hiện tại: ${currentLevel}
- Trình độ mục tiêu muốn đạt tới: ${targetLevel}
- Điểm đánh giá kỹ năng:
${skillBreakdown || '- Đang cập nhật'}
- Điểm yếu phát hiện qua bài test: ${weakAreasText}
- Điểm mạnh đã nắm vững: ${strongAreasText}

YÊU CẦU THIẾT KẾ:
1. Tạo danh sách từ 5 đến 8 chủ đề / bài học quan trọng nhất sắp xếp theo thứ tự học hợp lý từ dễ đến khó (order_index: 1, 2, 3...).
2. Mỗi bước phải chỉ rõ kỹ năng (Grammar, Vocabulary, Reading, Listening), độ khó CEFR, và nêu lý do ngắn gọn vì sao AI gợi ý bước này (Ví dụ: "Bạn đã làm sai câu về thì quá khứ ở bài test đầu vào nên cần củng cố lại chủ đề này trước").
3. Viết bằng tiếng Việt dễ hiểu, sư phạm và truyền cảm hứng.

BẮT BUỘC TRẢ VỀ ĐỊNH DẠNG JSON HỢP LỆ VỚI CẤU TRÚC:
{
  "summary": "Tóm tắt định hướng lộ trình học và lời khuyên tổng quan...",
  "current_level": "${currentLevel}",
  "target_level": "${targetLevel}",
  "steps": [
    {
      "order_index": 1,
      "topic": "Tên chủ đề bài học (VD: Quá khứ đơn & Động từ bất quy tắc)",
      "skill": "Grammar",
      "difficulty": "${currentLevel}",
      "reason": "Lý do AI đề xuất...",
      "estimated_duration_minutes": 20,
      "objectives": ["Mục tiêu 1", "Mục tiêu 2"]
    }
  ]
}

Chỉ trả về chuỗi JSON thuần túy, không thêm bất kỳ văn bản giải thích nào ngoài JSON.`;
}
