import { Router } from 'express';
import { z } from 'zod';
import { authenticateToken, optionalAuthenticateToken } from '../auth/jwt';
import { storage } from '../storage';
import { asyncHandler, ValidationError } from '../middleware/errorHandler';
import { generateHealingResponse, generateCompassionateFallback } from '../openai';
const router = Router();
// Request validation schema
const healingChatSchema = z.object({
    message: z.string().min(1).max(2000),
    sessionId: z.string().optional(),
    emotion: z.string().optional(),
    context: z.object({
        mood: z.string().optional(),
        stressLevel: z.number().min(0).max(10).optional(),
        topics: z.array(z.string()).optional()
    }).optional()
});
// Get conversation history
router.get('/conversations', authenticateToken, asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ValidationError('User not found');
    }
    const conversations = await storage.getHealingMessagesByUserId(req.user.id);
    res.json({
        success: true,
        conversations: conversations.map(conv => ({
            id: conv.id,
            sessionId: conv.sessionId,
            userMessage: conv.userMessage,
            aiResponse: conv.aiResponse,
            emotion: conv.emotion,
            sentiment: conv.sentiment,
            timestamp: conv.timestamp,
            isHelpful: conv.isHelpful,
            tags: conv.tags
        }))
    });
}));
// Get specific conversation session
router.get('/conversations/:sessionId', authenticateToken, asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ValidationError('User not found');
    }
    const { sessionId } = req.params;
    const conversations = await storage.getHealingMessagesBySessionId(sessionId, req.user.id);
    res.json({
        success: true,
        sessionId,
        messages: conversations.map(conv => ({
            id: conv.id,
            userMessage: conv.userMessage,
            aiResponse: conv.aiResponse,
            emotion: conv.emotion,
            sentiment: conv.sentiment,
            timestamp: conv.timestamp,
            isHelpful: conv.isHelpful
        }))
    });
}));
// Main AI healing chat endpoint
router.post('/chat', optionalAuthenticateToken, asyncHandler(async (req, res) => {
    const validation = healingChatSchema.safeParse(req.body);
    if (!validation.success) {
        throw new ValidationError(validation.error.issues.map((e) => e.message).join(', '));
    }
    const { message, sessionId, emotion, context } = validation.data;
    const userId = req.user?.id || null;
    // Generate session ID if not provided
    const chatSessionId = sessionId || `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    try {
        // Get conversation context if session exists
        let conversationContext = '';
        if (sessionId && userId) {
            const previousMessages = await storage.getHealingMessagesBySessionId(sessionId, userId);
            if (previousMessages.length > 0) {
                // Build context from last 5 messages
                const recentMessages = previousMessages.slice(-5);
                conversationContext = recentMessages
                    .map(m => `User: ${m.userMessage}\nAI: ${m.aiResponse}`)
                    .join('\n\n');
            }
        }
        // Generate AI response with context
        const fullContext = conversationContext ?
            `Previous conversation:\n${conversationContext}\n\nCurrent message: ${message}` :
            message;
        const aiResponse = await generateHealingResponse(fullContext);
        // Analyze emotion and sentiment
        const analyzedEmotion = emotion || detectEmotion(message);
        const sentimentScore = calculateSentiment(message);
        // Store the conversation
        const healingMessage = await storage.createHealingMessage({
            userId,
            sessionId: chatSessionId,
            userMessage: message,
            aiResponse: aiResponse,
            emotion: analyzedEmotion,
            sentiment: sentimentScore,
            tokensUsed: estimateTokens(message + aiResponse),
            tags: extractTags(message)
        });
        res.json({
            success: true,
            sessionId: chatSessionId,
            response: {
                id: healingMessage.id,
                message: aiResponse,
                emotion: analyzedEmotion,
                sentiment: sentimentScore,
                timestamp: healingMessage.timestamp
            }
        });
    }
    catch (error) {
        console.error('AI chat processing error:', error);
        // Provide compassionate fallback response
        const fallbackResponse = generateCompassionateFallback(message);
        // Try to save even with fallback
        try {
            const healingMessage = await storage.createHealingMessage({
                userId,
                sessionId: chatSessionId,
                userMessage: message,
                aiResponse: fallbackResponse,
                emotion: emotion || 'unknown',
                sentiment: 0
            });
            res.json({
                success: true,
                sessionId: chatSessionId,
                response: {
                    id: healingMessage.id,
                    message: fallbackResponse,
                    emotion: emotion || 'supportive',
                    sentiment: 0.5,
                    timestamp: healingMessage.timestamp,
                    isFallback: true
                }
            });
        }
        catch (storageError) {
            // Even if storage fails, provide support
            res.json({
                success: true,
                sessionId: chatSessionId,
                response: {
                    id: `temp_${Date.now()}`,
                    message: fallbackResponse,
                    emotion: 'supportive',
                    sentiment: 0.5,
                    timestamp: new Date().toISOString(),
                    isFallback: true,
                    temporary: true
                }
            });
        }
    }
}));
// Rate conversation as helpful/not helpful
router.post('/conversations/:id/feedback', authenticateToken, asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ValidationError('User not found');
    }
    const { id } = req.params;
    const { isHelpful, feedback } = req.body;
    await storage.updateHealingMessageFeedback(id, req.user.id, isHelpful, feedback);
    res.json({
        success: true,
        message: 'Thank you for your feedback'
    });
}));
// Helper functions
function detectEmotion(text) {
    const emotions = {
        anxious: /anxious|worried|nervous|stressed|panic/i,
        sad: /sad|depressed|down|crying|tears|lonely/i,
        angry: /angry|mad|frustrated|annoyed|irritated/i,
        happy: /happy|joy|excited|great|wonderful/i,
        confused: /confused|lost|unsure|don't know/i,
        hopeful: /hope|better|improve|positive|optimistic/i
    };
    for (const [emotion, pattern] of Object.entries(emotions)) {
        if (pattern.test(text)) {
            return emotion;
        }
    }
    return 'neutral';
}
function calculateSentiment(text) {
    // Simple sentiment analysis (0-1 scale)
    const positiveWords = /good|great|happy|wonderful|excellent|amazing|better|hope|love|thank/gi;
    const negativeWords = /bad|terrible|awful|hate|angry|sad|depressed|anxious|worried|scared/gi;
    const positiveMatches = (text.match(positiveWords) || []).length;
    const negativeMatches = (text.match(negativeWords) || []).length;
    const total = positiveMatches + negativeMatches;
    if (total === 0)
        return 0.5;
    return positiveMatches / total;
}
function estimateTokens(text) {
    // Rough estimation: ~4 characters per token
    return Math.ceil(text.length / 4);
}
function extractTags(text) {
    const tags = [];
    const topicPatterns = {
        relationships: /relationship|partner|family|friend|spouse/i,
        work: /work|job|career|boss|colleague/i,
        health: /health|sick|pain|doctor|medical/i,
        anxiety: /anxiety|panic|worry|stress/i,
        depression: /depression|sad|hopeless/i,
        sleep: /sleep|insomnia|tired|fatigue/i
    };
    for (const [tag, pattern] of Object.entries(topicPatterns)) {
        if (pattern.test(text)) {
            tags.push(tag);
        }
    }
    return tags;
}
export default router;
