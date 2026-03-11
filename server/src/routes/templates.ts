import { Router, Request, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middlewares/auth';
import { processTemplate, validateTemplate, getAvailableFilters } from '../services/advanced';

const router = Router();

router.use(authMiddleware);

/**
 * POST /api/templates/render
 * Advanced Feature: Template Engine with Variable Interpolation
 * 
 * Renders a template with custom DSL supporting:
 * - {{variable}} interpolation with dot notation
 * - {{#if condition}}...{{else}}...{{/if}} conditionals
 * - {{#each items as item}}...{{/each}} loops
 * - {{variable | filter}} pipe filters
 */
router.post('/render', async (req: AuthRequest, res: Response) => {
  try {
    const { template, variables } = req.body;

    if (!template) {
      res.status(400).json({ success: false, error: 'Template string is required' });
      return;
    }

    const result = processTemplate(template, variables || {});

    if (result.errors.length > 0) {
      res.status(400).json({
        success: false,
        error: 'Template syntax errors',
        details: result.errors,
      });
      return;
    }

    res.json({
      success: true,
      data: {
        output: result.output,
        usedVariables: result.usedVariables,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Template rendering failed' });
  }
});

/**
 * POST /api/templates/validate
 * Validate template syntax without rendering
 */
router.post('/validate', async (req: AuthRequest, res: Response) => {
  try {
    const { template } = req.body;

    if (!template) {
      res.status(400).json({ success: false, error: 'Template string is required' });
      return;
    }

    const result = validateTemplate(template);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Template validation failed' });
  }
});

/**
 * GET /api/templates/filters
 * Get available template filters
 */
router.get('/filters', async (_req: AuthRequest, res: Response) => {
  res.json({
    success: true,
    data: getAvailableFilters(),
  });
});

export default router;
