import { Router, Request, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middlewares/auth';
import {
  streamContentGeneration,
  generateContent,
  detectPlagiarism,
  batchPlagiarismCheck,
  analyzeSEO,
  ContentVersionStore,
  simpleDiff,
  calculateDiffStats,
  aiGenerationRateLimiter,
} from '../services/advanced';
import { Content } from '../models';

const router = Router();
const versionStore = new ContentVersionStore();

// Apply auth middleware to all content routes
router.use(authMiddleware);

/**
 * POST /api/content/generate
 * Advanced Feature: SSE Streaming Content Generation
 * 
 * Streams AI-generated content in real-time using Server-Sent Events.
 * Supports 8 content types with customizable tone, language, and model.
 */
router.post('/generate', (req: AuthRequest, res: Response) => {
  // Check AI rate limit
  const rateLimitResult = aiGenerationRateLimiter.checkLimit(req.user?.id || req.ip || 'unknown');
  if (!rateLimitResult.allowed) {
    res.status(429).json({
      success: false,
      error: 'AI generation rate limit exceeded',
      retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000),
    });
    return;
  }

  const { type, prompt, tone, language, maxTokens, temperature, model } = req.body;

  if (!type || !prompt) {
    res.status(400).json({ success: false, error: 'Type and prompt are required' });
    return;
  }

  // Use SSE streaming
  streamContentGeneration(req, res, {
    type,
    prompt,
    tone: tone || 'professional',
    language: language || 'en',
    maxTokens: maxTokens || 2000,
    temperature: temperature || 0.7,
    model: model || 'gpt-4',
  });
});

/**
 * POST /api/content/generate-sync
 * Non-streaming generation for batch operations
 */
router.post('/generate-sync', async (req: AuthRequest, res: Response) => {
  try {
    const { type, prompt, tone, model } = req.body;

    if (!type || !prompt) {
      res.status(400).json({ success: false, error: 'Type and prompt are required' });
      return;
    }

    const result = await generateContent({ type, prompt, tone, model });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Content generation failed' });
  }
});

/**
 * POST /api/content/analyze-seo
 * Advanced Feature: SEO Content Analysis
 * 
 * Analyzes content using multiple readability formulas (Flesch-Kincaid,
 * Coleman-Liau, ARI), keyword density with TF-IDF, structure analysis,
 * and provides actionable SEO suggestions.
 */
router.post('/analyze-seo', async (req: AuthRequest, res: Response) => {
  try {
    const { content, targetKeywords } = req.body;

    if (!content) {
      res.status(400).json({ success: false, error: 'Content is required' });
      return;
    }

    const analysis = analyzeSEO(content, targetKeywords);

    res.json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'SEO analysis failed' });
  }
});

/**
 * POST /api/content/check-plagiarism
 * Advanced Feature: Plagiarism Detection
 * 
 * Uses 4 algorithms: Cosine Similarity (TF-IDF), Jaccard Similarity (n-grams),
 * LCS Ratio (dynamic programming), and Winnowing fingerprinting.
 */
router.post('/check-plagiarism', async (req: AuthRequest, res: Response) => {
  try {
    const { sourceText, comparisonText, comparisonTexts } = req.body;

    if (!sourceText) {
      res.status(400).json({ success: false, error: 'Source text is required' });
      return;
    }

    if (comparisonTexts && Array.isArray(comparisonTexts)) {
      // Batch plagiarism check against multiple documents
      const results = batchPlagiarismCheck(sourceText, comparisonTexts);
      res.json({ success: true, data: results });
      return;
    }

    if (!comparisonText) {
      res.status(400).json({ success: false, error: 'Comparison text is required' });
      return;
    }

    const result = detectPlagiarism(sourceText, comparisonText);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Plagiarism check failed' });
  }
});

/**
 * POST /api/content/:id/version
 * Advanced Feature: Content Versioning
 * 
 * Creates a new version of the content, tracking changes with diff.
 */
router.post('/:id/version', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { content, message } = req.body;

    if (!content) {
      res.status(400).json({ success: false, error: 'Content is required' });
      return;
    }

    const version = versionStore.createVersion(
      id,
      content,
      req.user?.id || 'unknown',
      message || 'Updated content'
    );

    res.json({
      success: true,
      data: {
        version: version.version,
        metadata: version.metadata,
        hasDelta: !!version.delta,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Version creation failed' });
  }
});

/**
 * GET /api/content/:id/versions
 * Get all versions of a content item
 */
router.get('/:id/versions', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const versions = versionStore.getVersions(id);

    res.json({
      success: true,
      data: versions.map(v => ({
        id: v.id,
        version: v.version,
        metadata: v.metadata,
      })),
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get versions' });
  }
});

/**
 * GET /api/content/:id/versions/compare
 * Advanced Feature: Version Diff Comparison
 * 
 * Compare two versions using the Myers diff algorithm (same as Git).
 */
router.get('/:id/versions/compare', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const v1 = parseInt(req.query.v1 as string, 10);
    const v2 = parseInt(req.query.v2 as string, 10);

    if (isNaN(v1) || isNaN(v2)) {
      res.status(400).json({ success: false, error: 'Version numbers v1 and v2 are required' });
      return;
    }

    const comparison = versionStore.compareVersions(id, v1, v2);
    if (!comparison) {
      res.status(404).json({ success: false, error: 'Version not found' });
      return;
    }

    res.json({
      success: true,
      data: comparison,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Version comparison failed' });
  }
});

/**
 * POST /api/content/:id/versions/:versionNumber/restore
 * Restore content to a previous version
 */
router.post('/:id/versions/:versionNumber/restore', async (req: AuthRequest, res: Response) => {
  try {
    const { id, versionNumber } = req.params;
    const version = versionStore.restoreVersion(
      id,
      parseInt(versionNumber, 10),
      req.user?.id || 'unknown'
    );

    if (!version) {
      res.status(404).json({ success: false, error: 'Version not found' });
      return;
    }

    res.json({
      success: true,
      data: {
        version: version.version,
        metadata: version.metadata,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Version restore failed' });
  }
});

/**
 * GET /api/content/search
 * Advanced search with regex support
 */
router.get('/search', async (req: AuthRequest, res: Response) => {
  try {
    const { q, type, tags, favorite, page = '1', limit = '10' } = req.query;

    const query: Record<string, unknown> = {
      userId: req.user?.id,
    };

    // Regex search in title and content
    if (q) {
      try {
        const regex = new RegExp(q as string, 'i');
        query.$or = [
          { title: regex },
          { generatedContent: regex },
          { tags: regex },
        ];
      } catch {
        // If invalid regex, use plain text search
        query.$text = { $search: q as string };
      }
    }

    if (type) query.type = type;
    if (favorite === 'true') query.isFavorite = true;
    if (tags) query.tags = { $in: (tags as string).split(',') };

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    const [contents, total] = await Promise.all([
      Content.find(query)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Content.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: {
        contents,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Search failed' });
  }
});

export default router;
