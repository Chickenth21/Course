import { authService } from '../services/auth.service.js';
import { registerSchema, loginSchema } from '../validators/auth.validator.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const register = async (req, res) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const result = await authService.register(validatedData);
    return successResponse(res, result, 'Đăng ký tài khoản thành công', 201);
  } catch (error) {
    if (error.name === 'ZodError') {
      return errorResponse(res, error.errors[0]?.message || 'Dữ liệu không hợp lệ', 400, error.errors);
    }
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};

export const login = async (req, res) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const result = await authService.login(validatedData);
    return successResponse(res, result, 'Đăng nhập thành công', 200);
  } catch (error) {
    if (error.name === 'ZodError') {
      return errorResponse(res, error.errors[0]?.message || 'Dữ liệu không hợp lệ', 400, error.errors);
    }
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { email, fullName, avatarUrl, targetLevel } = req.body;
    if (!email) {
      return errorResponse(res, 'Email là bắt buộc', 400);
    }
    const result = await authService.continueWithGoogle({ email, fullName, avatarUrl, targetLevel });
    return successResponse(res, result, 'Đăng nhập với Google thành công', 200);
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await authService.getMe(req.user.id);
    return successResponse(res, user, 'Lấy thông tin tài khoản thành công', 200);
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};
