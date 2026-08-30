import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { errorResponse } from '../utils/response.js';

export const requireAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'Vui lòng đăng nhập để tiếp tục (Thiếu Token)', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwtSecret);

    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại', 401);
    }
    return errorResponse(res, 'Token xác thực không hợp lệ', 401);
  }
};
