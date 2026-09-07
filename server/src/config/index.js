import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET || 'english_learning_jwt_secret_dev_key',
  
  // Supabase Configuration
  supabase: {
    url: process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '',
    publishableKey: process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || ''
  },

  // Gemini AI Configuration
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || ''
  },

  // Discord Logging Configuration
  discord: {
    webhookUrl: process.env.DISCORD_WEBHOOK_URL || ''
  }
};
