import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createServer } from 'http';
import mongoose from 'mongoose';

import { config } from './config';
import { errorHandler } from './middlewares/errorHandler';
import { apiRateLimiter, notificationService } from './services/advanced';

import authRoutes from './routes/auth';
import contentRoutes from './routes/content';
import templateRoutes from './routes/templates';

const app = express();
const httpServer = createServer(app);

// Middleware
app.use(helmet());
app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Global API rate limiter (sliding window algorithm)
app.use('/api', apiRateLimiter.middleware());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/templates', templateRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    features: [
      'SSE Streaming Content Generation',
      'Plagiarism Detection (Cosine, Jaccard, LCS, Winnowing)',
      'SEO Analysis (Flesch-Kincaid, Coleman-Liau, ARI)',
      'Content Version Control with Diff',
      'Template Engine with DSL',
      'WebSocket Real-time Notifications',
      'Sliding Window Rate Limiting',
    ],
  });
});

// Error handler
app.use(errorHandler);

// Initialize WebSocket notification service
notificationService.initialize(httpServer);

// Connect to MongoDB and start server
async function startServer() {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('[MongoDB] Connected successfully');
  } catch (error) {
    console.warn('[MongoDB] Connection failed, running without database:', (error as Error).message);
  }

  httpServer.listen(config.port, () => {
    console.log(`\n🚀 AI Copywriter Server running on port ${config.port}`);
    console.log(`📡 WebSocket server initialized`);
    console.log(`\n🔧 Advanced Features:`);
    console.log(`  ✅ SSE Streaming Content Generation`);
    console.log(`  ✅ Plagiarism Detection (4 algorithms)`);
    console.log(`  ✅ SEO Content Analysis Engine`);
    console.log(`  ✅ Content Version Control with Diff`);
    console.log(`  ✅ Template Engine with DSL Parser`);
    console.log(`  ✅ WebSocket Real-time Notifications`);
    console.log(`  ✅ Sliding Window Rate Limiting`);
    console.log(`\n📖 API Docs: http://localhost:${config.port}/api/health`);
  });
}

startServer();

export default app;
