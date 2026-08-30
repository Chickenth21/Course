import { GoogleGenAI } from '@google/genai';
import { config } from './index.js';

let geminiClient = null;

if (config.gemini.apiKey) {
  try {
    geminiClient = new GoogleGenAI({ apiKey: config.gemini.apiKey });
    console.log('✅ Google Gemini client initialized successfully.');
  } catch (error) {
    console.error('❌ Failed to initialize Gemini client:', error.message);
  }
} else {
  console.warn('⚠️ GEMINI_API_KEY missing in .env');
}

export const ai = geminiClient;
