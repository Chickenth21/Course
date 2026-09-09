# Backend Layered Architecture Patterns - EngVantage Platform

Tài liệu này cung cấp các code template chuẩn cho từng tầng (layer) ở phía backend `server/src/`. Mọi tính năng mới phát triển đều cần tuân thủ cấu trúc này.

---

## 1. Repository Pattern (`src/repositories/<feature>.repository.js`)

Repository chịu trách nhiệm duy nhất là truy vấn và thao tác trực tiếp với cơ sở dữ liệu (Supabase PostgreSQL).

```javascript
import { supabase } from '../config/supabase.js';

export const featureRepository = {
  /**
   * Lấy danh sách bản ghi theo điều kiện
   */
  async getAllByUserId(userId) {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('features')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Lấy chi tiết bản ghi kèm quan hệ (relations)
   */
  async getById(id) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('features')
      .select(`
        *,
        sub_items:sub_items (
          id,
          title,
          order_index
        )
      `)
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  },

  /**
   * Tạo mới bản ghi
   */
  async create(recordData) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('features')
      .insert([recordData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Cập nhật bản ghi
   */
  async update(id, updateData) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('features')
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
```

---

## 2. Service Pattern (`src/services/<feature>.service.js`)

Service chứa toàn bộ nghiệp vụ (business logic), điều phối giữa các Repository và AI Service.

```javascript
import { featureRepository } from '../repositories/feature.repository.js';
import { userRepository } from '../repositories/user.repository.js';

export const featureService = {
  async getList(userId) {
    return await featureRepository.getAllByUserId(userId);
  },

  async getDetail(id, userId) {
    const item = await featureRepository.getById(id);
    if (!item) {
      const err = new Error('Không tìm thấy dữ liệu yêu cầu');
      err.statusCode = 404;
      throw err;
    }
    // Kiểm tra quyền sở hữu nếu cần
    if (item.user_id && item.user_id !== userId) {
      const err = new Error('Bạn không có quyền truy cập tài nguyên này');
      err.statusCode = 403;
      throw err;
    }
    return item;
  },

  async createNew(userId, payload) {
    const user = await userRepository.findById(userId);
    if (!user) {
      const err = new Error('Tài khoản người dùng không tồn tại');
      err.statusCode = 404;
      throw err;
    }

    const newRecord = await featureRepository.create({
      user_id: userId,
      ...payload
    });

    return newRecord;
  }
};
```

---

## 3. Controller Pattern (`src/controllers/<feature>.controller.js`)

Controller nhận request từ Express router, giải nén input, gọi Service và định dạng response qua `successResponse` / `errorResponse`.

```javascript
import { featureService } from '../services/feature.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getFeatures = async (req, res) => {
  try {
    const userId = req.user?.id;
    const data = await featureService.getList(userId);
    return successResponse(res, data, 'Lấy danh sách thành công');
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};

export const getFeatureById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const data = await featureService.getDetail(id, userId);
    return successResponse(res, data, 'Lấy chi tiết thành công');
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};

export const createFeature = async (req, res) => {
  try {
    const userId = req.user?.id;
    const payload = req.body;
    const data = await featureService.createNew(userId, payload);
    return successResponse(res, data, 'Tạo mới thành công', 201);
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};
```

---

## 4. Route Pattern (`src/routes/<feature>.route.js`)

Định nghĩa endpoint và phân quyền qua middleware.

```javascript
import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import {
  getFeatures,
  getFeatureById,
  createFeature
} from '../controllers/feature.controller.js';

const router = Router();

// Yêu cầu xác thực JWT cho toàn bộ router
router.use(requireAuth);

router.get('/', getFeatures);
router.get('/:id', getFeatureById);
router.post('/', createFeature);

export default router;
```

---

## 5. Google Gemini AI Pattern

Tất cả tính năng liên quan đến AI đều phải tuân thủ mô hình 3 thành phần:

1. **Prompt Builder** (`src/ai/prompts/<feature>.prompt.js`):
```javascript
export const buildFeaturePrompt = ({ inputParam }) => {
  return `
You are an expert English pedagogue. Analyze the following user input:
Input: "${inputParam}"

Respond STRICTLY in JSON matching this format:
{
  "score": 85,
  "feedback": "Phản hồi chi tiết bằng tiếng Việt",
  "suggestions": ["Gợi ý 1", "Gợi ý 2"]
}
`.trim();
};
```

2. **Zod Validation Schema** (`src/ai/schemas/<feature>.schema.js`):
```javascript
import { z } from 'zod';

export const featureAiSchema = z.object({
  score: z.number().min(0).max(100),
  feedback: z.string(),
  suggestions: z.array(z.string())
});
```

3. **AI Service Method with Deterministic Fallback** (`src/ai/ai.service.js`):
```javascript
// Gọi qua Gemini API client
if (ai) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    const parsed = JSON.parse(response.text.replace(/```json\n?|```\n?/g, '').trim());
    return featureAiSchema.parse(parsed);
  } catch (err) {
    console.warn('Gemini failed, switching to fallback:', err.message);
  }
}
// Fallback mặc định khi không có API key hoặc gặp lỗi mạng
return this.generateFallbackFeature(inputParam);
```
