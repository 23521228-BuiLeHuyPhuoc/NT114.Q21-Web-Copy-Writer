import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-copywriter',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-key-change-in-production',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-key',
  jwtExpiresIn: 900,         // 15 minutes in seconds
  jwtRefreshExpiresIn: 604800, // 7 days in seconds
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  aiRateLimitMaxRequests: parseInt(process.env.AI_RATE_LIMIT_MAX_REQUESTS || '10', 10),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
};
