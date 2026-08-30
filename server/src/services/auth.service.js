import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { userRepository } from '../repositories/user.repository.js';

export const authService = {
  async register({ email, password, fullName, currentLevel, targetLevel }) {
    // 1. Check if user already exists
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      const error = new Error('Email này đã được đăng ký tài khoản');
      error.statusCode = 400;
      throw error;
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 3. Create user in database
    const newUser = await userRepository.create({
      email,
      passwordHash,
      fullName,
      currentLevel: currentLevel || 'A1',
      targetLevel: targetLevel || 'B2'
    });

    // 4. Generate JWT Token
    const token = this.generateToken(newUser);

    // Remove password hash from returned user object
    const { password_hash, ...userWithoutPassword } = newUser;

    return {
      user: userWithoutPassword,
      token
    };
  },

  async login({ email, password }) {
    // 1. Find user by email
    const user = await userRepository.findByEmail(email);
    if (!user) {
      const error = new Error('Email hoặc mật khẩu không chính xác');
      error.statusCode = 401;
      throw error;
    }

    // 2. Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      const error = new Error('Email hoặc mật khẩu không chính xác');
      error.statusCode = 401;
      throw error;
    }

    // 3. Generate JWT Token
    const token = this.generateToken(user);

    const { password_hash, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token
    };
  },

  async getMe(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      const error = new Error('Không tìm thấy thông tin người dùng');
      error.statusCode = 404;
      throw error;
    }
    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  generateToken(user) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      config.jwtSecret,
      { expiresIn: '7d' }
    );
  }
};
