import OpenAI from "openai";
// This is using Replit's AI Integrations service, which provides OpenAI-compatible API access without requiring your own OpenAI API key.
// Charges are billed to your Replit credits.
const openai = new OpenAI({
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
    apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY
});
const MENTAL_HEALTH_SYSTEM_PROMPT = `You are a compassionate mental health support assistant. Your role is to:

1. Listen actively and validate the user's feelings
2. Provide supportive, non-judgmental responses
3. Offer coping strategies and mental health techniques when appropriate
4. Encourage professional help when needed
5. Never diagnose or prescribe medical treatments
6. Maintain a warm, empathetic tone

Remember:
- You are NOT a replacement for professional therapy
- Always prioritize the user's safety and well-being
- If someone expresses thoughts of self-harm or suicide, encourage them to contact crisis resources immediately
- Use trauma-informed language and be sensitive to triggers`;
// Enhanced error types for better error handling
export class OpenAIError extends Error {
    code;
    statusCode;
    constructor(message, code, statusCode) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
        this.name = "OpenAIError";
    }
}
export class RateLimitError extends OpenAIError {
    constructor(message = "Rate limit exceeded. Please try again in a moment.") {
        super(message, "RATE_LIMIT", 429);
        this.name = "RateLimitError";
    }
}
export class APIKeyError extends OpenAIError {
    constructor(message = "API configuration error. Please check your setup.") {
        super(message, "API_KEY_ERROR", 401);
        this.name = "APIKeyError";
    }
}
export class TimeoutError extends OpenAIError {
    constructor(message = "Request timed out. Please try again.") {
        super(message, "TIMEOUT", 408);
        this.name = "TimeoutError";
    }
}
export class QuotaExceededError extends OpenAIError {
    constructor(message = "API quota exceeded. Please try again later.") {
        super(message, "QUOTA_EXCEEDED", 429);
        this.name = "QuotaExceededError";
    }
}
// Fallback responses for different error scenarios
const FALLBACK_RESPONSES = {
    rateLimited: "I'm experiencing high demand right now. I'm still here to support you - could you please try again in just a moment? Your well-being is important.",
    apiError: "I'm having a temporary technical difficulty, but I want you to know that I'm here for you. Please try again, or if you need immediate support, consider reaching out to a crisis helpline.",
    timeout: "My response is taking longer than expected. I'm here for you - please try sending your message again.",
    general: "I encountered a brief technical issue, but I'm here to support you. Please try again, and if you need immediate help, don't hesitate to reach out to crisis resources."
};
// Enhanced error classification function
function classifyOpenAIError(error) {
    if (error instanceof OpenAIError) {
        return error;
    }
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorString = errorMessage.toLowerCase();
    // Rate limiting errors
    if (errorString.includes("rate limit") || errorString.includes("429")) {
        return new RateLimitError();
    }
    // Authentication errors
    if (errorString.includes("api key") || errorString.includes("401") || errorString.includes("authentication")) {
        return new APIKeyError();
    }
    // Timeout errors
    if (errorString.includes("timeout") || errorString.includes("timed out") || errorString.includes("408")) {
        return new TimeoutError();
    }
    // Quota errors
    if (errorString.includes("quota") || errorString.includes("insufficient_quota")) {
        return new QuotaExceededError();
    }
    // Generic OpenAI error
    return new OpenAIError(errorMessage, "UNKNOWN_ERROR", 500);
}
// Get appropriate fallback response based on error type
function getFallbackResponse(error) {
    if (error instanceof RateLimitError || error instanceof QuotaExceededError) {
        return FALLBACK_RESPONSES.rateLimited;
    }
    if (error instanceof TimeoutError) {
        return FALLBACK_RESPONSES.timeout;
    }
    if (error instanceof APIKeyError) {
        return FALLBACK_RESPONSES.apiError;
    }
    return FALLBACK_RESPONSES.general;
}
// Retry configuration
const RETRY_CONFIG = {
    maxRetries: 2,
    retryDelay: 1000, // 1 second
    retryableErrors: [TimeoutError]
};
// Sleep utility for retries
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export async function generateChatResponse(userMessage, chatHistory = [], retryCount = 0) {
    const messages = [
        { role: "system", content: MENTAL_HEALTH_SYSTEM_PROMPT },
        ...chatHistory,
        { role: "user", content: userMessage }
    ];
    try {
        // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
        const completion = await openai.chat.completions.create({
            model: "gpt-5",
            messages,
            temperature: 0.7,
            max_completion_tokens: 500
        });
        return completion.choices[0]?.message?.content || "I'm here to listen. Could you tell me more?";
    }
    catch (error) {
        const classifiedError = classifyOpenAIError(error);
        // Log detailed error for monitoring
        console.error("OpenAI API error:", {
            type: classifiedError.name,
            code: classifiedError.code,
            statusCode: classifiedError.statusCode,
            message: classifiedError.message,
            retryCount
        });
        // Retry logic for transient errors
        const isRetryable = RETRY_CONFIG.retryableErrors.some(ErrorClass => classifiedError instanceof ErrorClass);
        if (isRetryable && retryCount < RETRY_CONFIG.maxRetries) {
            console.log(`Retrying request (attempt ${retryCount + 1}/${RETRY_CONFIG.maxRetries})...`);
            await sleep(RETRY_CONFIG.retryDelay * (retryCount + 1)); // Exponential backoff
            return generateChatResponse(userMessage, chatHistory, retryCount + 1);
        }
        // Return fallback response instead of throwing
        return getFallbackResponse(classifiedError);
    }
}
export async function* streamChatResponse(userMessage, chatHistory = []) {
    const messages = [
        { role: "system", content: MENTAL_HEALTH_SYSTEM_PROMPT },
        ...chatHistory,
        { role: "user", content: userMessage }
    ];
    try {
        // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
        const stream = await openai.chat.completions.create({
            model: "gpt-5",
            messages,
            temperature: 0.7,
            max_completion_tokens: 500,
            stream: true
        });
        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
                yield content;
            }
        }
    }
    catch (error) {
        const classifiedError = classifyOpenAIError(error);
        // Log detailed error for monitoring
        console.error("OpenAI streaming error:", {
            type: classifiedError.name,
            code: classifiedError.code,
            statusCode: classifiedError.statusCode,
            message: classifiedError.message
        });
        // Yield fallback response for streaming
        const fallback = getFallbackResponse(classifiedError);
        yield fallback;
    }
}
// Health check function for OpenAI API
export async function checkOpenAIHealth() {
    try {
        await openai.models.list();
        return { healthy: true };
    }
    catch (error) {
        const classifiedError = classifyOpenAIError(error);
        return {
            healthy: false,
            error: `${classifiedError.name}: ${classifiedError.message}`
        };
    }
}
