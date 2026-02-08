/**
 * Perplexity AI Routes
 * Integration: blueprint:perplexity_v0
 * Provides factual AI responses with citations for wellness research
 */

import { Router } from 'express';
import { logger } from "../utils/logger.mjs";

const router = Router();

const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';

function getApiKey() {
  const apiKey = process.env.PERPLEXITY_API_KEY;
  if (!apiKey) {
    throw new Error('PERPLEXITY_API_KEY environment variable is required');
  }
  return apiKey;
}

async function queryPerplexity(messages, options = {}) {
  const apiKey = getApiKey();

  const {
    model = 'llama-3.1-sonar-small-128k-online',
    maxTokens,
    temperature = 0.2,
    topP = 0.9,
    searchDomainFilter,
    returnImages = false,
    returnRelatedQuestions = false,
    searchRecencyFilter = 'month',
  } = options;

  const response = await fetch(PERPLEXITY_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: maxTokens,
      temperature,
      top_p: topP,
      search_domain_filter: searchDomainFilter,
      return_images: returnImages,
      return_related_questions: returnRelatedQuestions,
      search_recency_filter: searchRecencyFilter,
      stream: false,
      presence_penalty: 0,
      frequency_penalty: 1,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Perplexity API error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

router.post('/ask', async (req, res) => {
  try {
    const { question, systemPrompt } = req.body;

    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Question is required' });
    }

    const messages = [];
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    messages.push({ role: 'user', content: question });

    const response = await queryPerplexity(messages);

    res.json({
      answer: response.choices[0]?.message?.content || '',
      citations: response.citations || [],
    });
  } catch (error) {
    logger.error("Perplexity ask error", { error: error?.message || error });
    res.status(500).json({ error: error.message || 'Failed to get response from Perplexity' });
  }
});

router.post('/research', async (req, res) => {
  try {
    const { topic, context } = req.body;

    if (!topic || typeof topic !== 'string') {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const systemPrompt = `You are a research assistant for The Genuine Love Project, a trauma-informed mental wellness platform. 
Provide evidence-based, educational information about mental wellness, healing, and personal growth topics.
Always include relevant citations. Use compassionate, non-clinical language that is accessible to everyone.
Important: This is educational content only - not medical advice. Always encourage consulting professionals for clinical concerns.`;

    const question = context 
      ? `Research the following topic in the context of mental wellness and healing: ${topic}\n\nAdditional context: ${context}`
      : `Research the following topic in the context of mental wellness and healing: ${topic}`;

    const response = await queryPerplexity(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: question },
      ],
      {
        model: 'llama-3.1-sonar-small-128k-online',
        returnRelatedQuestions: true,
        searchRecencyFilter: 'month',
      }
    );

    res.json({
      summary: response.choices[0]?.message?.content || '',
      citations: response.citations || [],
    });
  } catch (error) {
    logger.error("Perplexity research error", { error: error?.message || error });
    res.status(500).json({ error: error.message || 'Failed to research topic' });
  }
});

router.get('/health', async (_req, res) => {
  try {
    const apiKey = process.env.PERPLEXITY_API_KEY;
    if (!apiKey) {
      return res.status(503).json({ status: 'unavailable', error: 'API key not configured' });
    }
    res.json({ status: 'available' });
  } catch (error) {
    res.status(503).json({ status: 'error', error: error.message });
  }
});

export default router;
