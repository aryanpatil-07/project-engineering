import { analyzeWithAI } from '../services/aiService.js';

export async function analyzeController(req, res) {
  const text = typeof req.body?.text === 'string' ? req.body.text : '';

  if (!text || text.trim().length === 0) {
    return res.status(400).json({
      error: 'input_required',
      message: 'Job description text is required.',
    });
  }

  if (text.length > 3000) {
    return res.status(400).json({
      error: 'input_too_long',
      limit: 3000,
      received: text.length,
    });
  }

  const result = await analyzeWithAI(text, req.user?.id || 'anonymous');

  if (result?.fallback === true) {
    return res.status(503).json(result);
  }

  return res.status(200).json({
    success: true,
    analysis: result,
  });
}
