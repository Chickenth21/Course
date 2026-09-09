# Frontend Architecture & UI Patterns - EngVantage Platform

Tài liệu này cung cấp các code template và quy chuẩn giao diện chuẩn cho phía frontend `client/src/`.

---

## 1. API Client Service (`src/services/<feature>Service.js`)

Mọi giao tiếp API với backend đều phải gói qua hàm `apiRequest` từ `src/services/api.js`. Không viết `fetch` trực tiếp trong Component.

```javascript
import { apiRequest } from './api.js';

export const featureService = {
  /**
   * Lấy danh sách
   */
  async getAll() {
    return await apiRequest('/api/features');
  },

  /**
   * Lấy chi tiết theo ID
   */
  async getById(id) {
    return await apiRequest(`/api/features/${id}`);
  },

  /**
   * Gửi dữ liệu tạo mới
   */
  async create(data) {
    return await apiRequest('/api/features', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  /**
   * Cập nhật dữ liệu
   */
  async update(id, data) {
    return await apiRequest(`/api/features/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }
};
```

---

## 2. Page Component Pattern (`src/pages/<FeaturePage>.jsx`)

Mẫu trang chuẩn tích hợp Header, State loading, error handling, và responsive layout.

```jsx
import React, { useState, useEffect } from 'react';
import Header from '../components/Header.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { featureService } from '../services/featureService.js';
import { Sparkles, AlertCircle, Loader2 } from 'lucide-react';

export default function FeaturePage() {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await featureService.getAll();
        setData(res.data || []);
      } catch (err) {
        setError(err.message || 'Không thể tải dữ liệu');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            EngVantage AI Feature
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Tiêu Đề Tính Năng Mới
          </h1>
          <p className="mt-2 text-base text-slate-400">
            Mô tả ngắn gọn mục tiêu của tính năng và hướng dẫn người học.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Loading Spinner */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-3" />
            <p className="text-sm">Đang tải dữ liệu...</p>
          </div>
        ) : (
          /* Main Content Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/5 backdrop-blur-sm"
              >
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400">{item.description}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
```

---

## 3. Router Registration (`src/App.jsx`)

Mọi trang mới phải được định tuyến trong `client/src/App.jsx`. Nếu trang dành cho người dùng đã đăng nhập, luôn bọc trong `<ProtectedRoute>`:

```jsx
import FeaturePage from './pages/FeaturePage.jsx';

// Bên trong <Routes>:
<Route
  path="/feature-path"
  element={
    <ProtectedRoute>
      <FeaturePage />
    </ProtectedRoute>
  }
/>
```

---

## 4. Quy Chuẩn Thiết Kế Giao Diện (Design System & Aesthetics)

1. **Background**: Luôn sử dụng nền tối sâu (`bg-slate-950` hoặc `bg-[#0B0F19]`), văn bản chính `text-slate-100`, văn bản phụ `text-slate-400`.
2. **Card Container**: `bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-sm hover:border-indigo-500/40 transition-all`.
3. **Primary Action**: Nút bấm màu indigo sáng (`bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all shadow-md shadow-indigo-600/20 active:scale-[0.98]`).
4. **Icons**: Sử dụng icon từ thư viện `lucide-react` với kích thước chuẩn (`w-4 h-4` cho inline, `w-5 h-5` cho button/card).
