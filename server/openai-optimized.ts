// Optimized OpenAI Integration with Advanced Features
// Evolution Engine v1.0.3 - Enhanced with streaming, token tracking, and intelligent caching

import { retryWithBreaker, openAIBreaker, retryConfigs } from './services/retry';
import { aiResponseCache, getCacheKey } from './services/cache';
import { RateLimiter } from './services/rateLimiter';

// Initialize OpenAI API with optimized configuration
let openai: any = null;
let tokenUsage = { total: 0, prompt: 0, completion: 0, cached: 0 };
const conversationContexts = new Map<string, Array<{role: string, content: string}>>();
const rateLimiter = new RateLimiter({ maxRequests: 100, windowMs: 60000 });

try {
  const OpenAI = await import('./lib/openai-mock').then(m => m.OpenAI).catch(() => null);
  if (OpenAI && process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      maxRetries: 3,
      timeout: 30000,
    });
    console.log('✅ OpenAI initialized with optimized settings');
  }
} catch (e) {
  console.warn('⚠️ OpenAI module not available, using enhanced fallback system');
}

// Token usage tracking for cost optimization
export function getTokenUsage() {
  return {
    ...tokenUsage,
    estimatedCost: (tokenUsage.total / 1000) * 0.002,
    cacheHitRate: tokenUsage.cached / Math.max(1, tokenUsage.total)
  };
}

// Helper function to detect common mental health topics
function detectCommonTopic(message: string): boolean {
  const commonTopics = ['anxiety', 'stress', 'depression', 'sad', 'worried', 'overwhelmed', 'tired', 'sleep', 'relationship'];
  const lowerMessage = message.toLowerCase();
  return commonTopics.some(topic => lowerMessage.includes(topic));
}

// Optimized response generator with streaming support
export async function generateHealingResponse(
  userMessage: string, 
  conversationHistory?: Array<{role: string, content: string}>,
  sessionId?: string,
  options?: { streaming?: boolean, maxTokens?: number, temperature?: number }
): Promise<string> {
  // Rate limiting check
  if (!rateLimiter.checkLimit(sessionId || 'anonymous')) {
    console.warn('⚠️ Rate limit exceeded, using fallback');
    return generateEnhancedFallback(userMessage, 'rate-limit');
  }

  if (!openai || !process.env.OPENAI_API_KEY) {
    console.warn('🚨 OpenAI API not available. Using enhanced fallback.');
    return generateEnhancedFallback(userMessage);
  }

  // Enhanced cache check with context awareness
  const contextHash = JSON.stringify(conversationHistory || []).substring(0, 100);
  const cacheKey = getCacheKey('ai-response-v2', `${userMessage.toLowerCase().trim()}-${contextHash}`);
  const cachedResponse = aiResponseCache.get<string>(cacheKey);
  if (cachedResponse) {
    console.log('✅ Cache hit - returning optimized response');
    tokenUsage.cached += 50; // Estimate saved tokens
    return cachedResponse;
  }

  // Build conversation context
  const messages = [];
  
  // Add system prompt optimized for mental health support
  messages.push({
    role: 'system',
    content: `You are Dr. MindCare, an expert AI therapist with advanced training in CBT, DBT, and mindfulness techniques.
    Key directives:
    - Provide empathetic, evidence-based support
    - Keep responses concise (100-150 words) unless complex issues require more
    - Focus on: validation, practical coping strategies, and hope
    - Use therapeutic techniques appropriately
    - Maintain professional boundaries while being genuinely caring
    - If crisis detected, prioritize safety and provide resources`
  });

  // Add conversation history for context (limit to last 5 messages)
  if (conversationHistory && conversationHistory.length > 0) {
    const recentHistory = conversationHistory.slice(-5);
    messages.push(...recentHistory);
  }

  // Add current user message
  messages.push({ role: 'user', content: userMessage });

  try {
    const completionOptions = {
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages,
      temperature: options?.temperature || 0.7,
      max_tokens: options?.maxTokens || 200,
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
      stream: options?.streaming || false,
    };

    const response = await retryWithBreaker(
      async () => openai.chat.completions.create(completionOptions),
      openAIBreaker,
      retryConfigs.critical
    );

    // Track token usage
    if (response.usage) {
      tokenUsage.total += response.usage.total_tokens || 0;
      tokenUsage.prompt += response.usage.prompt_tokens || 0;
      tokenUsage.completion += response.usage.completion_tokens || 0;
    }

    const aiResponse = response.choices[0]?.message?.content?.trim() || "I'm here for you. Your feelings are valid.";
    
    // Update conversation context for session
    if (sessionId) {
      const context = conversationContexts.get(sessionId) || [];
      context.push({ role: 'user', content: userMessage });
      context.push({ role: 'assistant', content: aiResponse });
      
      // Keep only last 10 messages in context
      if (context.length > 10) {
        context.splice(0, context.length - 10);
      }
      
      conversationContexts.set(sessionId, context);
    }
    
    // Enhanced caching with longer TTL for common responses
    const isCommonTopic = detectCommonTopic(userMessage);
    const cacheTTL = isCommonTopic ? 7200 : 3600; // 2 hours for common, 1 hour for unique
    aiResponseCache.set(cacheKey, aiResponse, cacheTTL);
    
    console.log(`✅ AI response generated (${response.usage?.total_tokens || 0} tokens)`);
    return aiResponse;
  } catch (error: any) {
    // Enhanced error tracking and recovery
    console.error('❌ OpenAI API error:', {
      message: error.message,
      type: error.type,
      code: error.code,
      status: error.status,
      timestamp: new Date().toISOString(),
      tokenUsage: tokenUsage.total
    });
    
    // Intelligent fallback based on error type
    if (error.status === 429) {
      console.warn('⚠️ OpenAI rate limit - using advanced fallback');
      return generateEnhancedFallback(userMessage, 'rate-limit');
    } else if (error.status === 503) {
      console.warn('⚠️ OpenAI service unavailable - using fallback');
      return generateEnhancedFallback(userMessage, 'service-error');
    }
    
    return generateEnhancedFallback(userMessage, 'general-error');
  }
}

// Enhanced fallback system with context awareness
export function generateEnhancedFallback(userMessage: string, reason?: string): string {
  const keywords = userMessage.toLowerCase();
  
  // Add context-aware prefix based on error reason
  let prefix = '';
  if (reason === 'rate-limit') {
    prefix = "I'm experiencing high demand right now, but I'm still here for you. ";
  } else if (reason === 'service-error') {
    prefix = "While my advanced features are temporarily limited, I want you to know that ";
  }
  
  const response = generateCompassionateFallback(userMessage);
  return prefix + response;
}

// Original compassionate fallback system (enhanced)
export function generateCompassionateFallback(userMessage: string): string {
  const keywords = userMessage.toLowerCase();

  // 🆘 Crisis
  if (
    keywords.includes('hurt myself') ||
    keywords.includes('suicide') ||
    keywords.includes('kill myself') ||
    keywords.includes('end it all')
  ) {
    return "I hear that you're in tremendous pain right now, and I'm deeply concerned about you. Your life has value, and there is help available. Please reach out to a crisis helpline immediately: Call 988 (Suicide & Crisis Lifeline) or text 'HELLO' to 741741. You don't have to face this alone — trained counselors are available 24/7.";
  }

  // 😢 Sadness & Depression
  if (
    keywords.includes('sad') ||
    keywords.includes('down') ||
    keywords.includes('depressed') ||
    keywords.includes('hopeless') ||
    keywords.includes('empty')
  ) {
    return "Your sadness is speaking to something important — it's okay not to be okay right now. Depression can make everything feel colorless and heavy, but please know that this feeling, though powerful, is temporary. Even in this darkness, you took the brave step of reaching out, which shows a part of you is still fighting. Consider one tiny act of self-care today — a shower, a walk, or calling someone who cares about you.";
  }

  // 💪 Stress & Overwhelm
  if (
    keywords.includes('stressed') ||
    keywords.includes('overwhelmed') ||
    keywords.includes('exhausted') ||
    keywords.includes('burned out') ||
    keywords.includes('too much')
  ) {
    return "I can hear how heavy everything feels for you right now - that sense of being overwhelmed is exhausting and valid. When stress feels this intense, your mind and body are telling you they need care. Try the 5-4-3-2-1 grounding technique: notice 5 things you see, 4 you can touch, 3 you hear, 2 you smell, and 1 you taste. You've weathered difficult storms before, and you have more strength than you realize right now.";
  }

  // 😰 Anxiety & Fear
  if (
    keywords.includes('anxious') ||
    keywords.includes('anxiety') ||
    keywords.includes('worry') ||
    keywords.includes('panic') ||
    keywords.includes('scared') ||
    keywords.includes('afraid')
  ) {
    return "Anxiety can make your world feel unsafe and unpredictable. I understand how exhausting that constant alertness can be. Your nervous system is trying to protect you, even when the danger isn't immediate. Try box-breathing with me: breathe in for 4, hold for 4, out for 4, hold for 4. Your anxiety doesn't define you, and this intense feeling will pass. You've survived 100% of your worst days so far.";
  }

  // 😡 Anger & Frustration
  if (
    keywords.includes('angry') ||
    keywords.includes('mad') ||
    keywords.includes('frustrated') ||
    keywords.includes('rage') ||
    keywords.includes('hate')
  ) {
    return "Your anger is valid. It's often a signal that something important to you has been violated. Anger itself isn't bad — even overwhelming — but it's alerting you to something that matters to you. Try channeling this energy: write, move, do intense exercise, or scream into a pillow. You're allowed to feel angry, and you're strong enough to move through this feeling without it consuming you.";
  }

  // 💔 Loneliness & Relationship Pain
  if (
    keywords.includes('lonely') ||
    keywords.includes('alone') ||
    keywords.includes('isolated') ||
    keywords.includes('relationship') ||
    keywords.includes('breakup') ||
    keywords.includes('divorce')
  ) {
    return "The ache of loneliness or relationship pain cuts deep — humans are wired for connection, so this hurt makes complete sense. Whether you're physically alone or feeling emotionally disconnected, your need for understanding and closeness is fundamentally human. By reaching out here, you've already taken a step toward connection. Consider one small way to connect today: text an old friend, join an online community, or simply smile at a stranger.";
  }

  // 🎯 Self-harm or trauma
  if (
    keywords.includes('trauma') ||
    keywords.includes('ptsd') ||
    keywords.includes('flashback') ||
    keywords.includes('nightmare')
  ) {
    return "Trauma leaves deep marks, and what you're experiencing is a natural response to difficult experiences. Your mind is trying to process and protect you. Grounding techniques can help: focus on your five senses, breathe slowly, remind yourself you're safe now. Healing from trauma takes time and often professional support. You've already shown incredible strength by surviving what happened.";
  }

  // 💊 Medication concerns
  if (
    keywords.includes('medication') ||
    keywords.includes('meds') ||
    keywords.includes('pills') ||
    keywords.includes('side effects')
  ) {
    return "Questions about medication are important and valid. While I can't provide medical advice, I encourage you to discuss your concerns openly with your healthcare provider. They can help you weigh benefits and risks, adjust dosages, or explore alternatives. Remember, finding the right treatment often takes time and adjustments. Your wellbeing is the priority.";
  }

  // 🌈 Default enhanced fallback
  return "Thank you for reaching out and sharing what you're going through. Your feelings are valid and important. While every situation is unique, please know that support is available and healing is possible. Consider taking one small step today - whether it's a deep breath, a short walk, or reaching out to someone you trust. You don't have to face this alone.";
}

// Advanced streaming response handler
export async function* streamHealingResponse(
  userMessage: string,
  sessionId?: string
): AsyncGenerator<string, void, unknown> {
  if (!openai || !process.env.OPENAI_API_KEY) {
    yield generateEnhancedFallback(userMessage);
    return;
  }

  try {
    const stream = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are Dr. MindCare, an empathetic AI therapist. Provide supportive, evidence-based responses.'
        },
        { role: 'user', content: userMessage }
      ],
      stream: true,
      temperature: 0.7,
      max_tokens: 200,
    });

    let fullResponse = '';
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      fullResponse += content;
      yield content;
    }

    // Cache the complete response
    if (fullResponse) {
      const cacheKey = getCacheKey('ai-stream', userMessage.toLowerCase().trim());
      aiResponseCache.set(cacheKey, fullResponse, 3600);
    }
  } catch (error) {
    console.error('Streaming error:', error);
    yield generateEnhancedFallback(userMessage);
  }
}

// Conversation context management
export function getConversationContext(sessionId: string) {
  return conversationContexts.get(sessionId) || [];
}

export function clearConversationContext(sessionId: string) {
  conversationContexts.delete(sessionId);
}

// Export rate limiter for monitoring
export { rateLimiter };