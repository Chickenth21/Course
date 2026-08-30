import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Email không đúng định dạng'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  fullName: z.string().min(2, 'Họ và tên phải có ít nhất 2 ký tự'),
  currentLevel: z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']).optional().default('A1'),
  targetLevel: z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']).optional().default('B2')
});

export const loginSchema = z.object({
  email: z.string().email('Email không đúng định dạng'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu')
});
