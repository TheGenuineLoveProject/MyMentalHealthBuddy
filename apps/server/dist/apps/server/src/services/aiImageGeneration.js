/**
 * 360° Self-Evolving AI Platform: AI Image Generation Service
 *
 * Comprehensive image generation service using OpenAI gpt-image-1 model
 * with prompt templates, quality tracking, and media asset management.
 */
import OpenAI from 'openai';
import crypto from 'crypto';
import { Buffer } from 'node:buffer';
// Using Replit's AI Integrations service (no personal API key required)
const openai = new OpenAI({
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
    apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY
});
export class AIImageGenerationService {
    /**
     * Generate an image from a text prompt
     */
    async generateImage(request) {
        const startTime = Date.now();
        const size = request.size || '1024x1024';
        try {
            // Call OpenAI image generation API
            // the newest OpenAI model is "gpt-5" which was released August 7, 2025
            // but for images we use "gpt-image-1" which is the dedicated image generation model
            const response = await openai.images.generate({
                model: 'gpt-image-1',
                prompt: request.prompt,
                size,
                // Note: response_format is not supported, always returns base64
            });
            const base64 = response.data[0]?.b64_json ?? '';
            if (!base64) {
                throw new Error('No image data returned from API');
            }
            const imageBuffer = Buffer.from(base64, 'base64');
            const executionTime = Date.now() - startTime;
            return {
                imageBuffer,
                base64,
                metadata: {
                    size,
                    promptUsed: request.prompt,
                    model: 'gpt-image-1',
                    timestamp: new Date().toISOString(),
                },
            };
        }
        catch (error) {
            console.error('[AI Image Generation] Error:', error.message);
            throw new Error(`Image generation failed: ${error.message}`);
        }
    }
    /**
     * Generate an image using a prompt template
     */
    async generateFromTemplate(templatePrompt, variables, request) {
        // Replace variables in template
        let finalPrompt = templatePrompt;
        for (const [key, value] of Object.entries(variables)) {
            const placeholder = `{{${key}}}`;
            finalPrompt = finalPrompt.replace(new RegExp(placeholder, 'g'), value);
        }
        return this.generateImage({
            ...request,
            prompt: finalPrompt,
        });
    }
    /**
     * Generate multiple images with different variations
     */
    async generateVariations(baseRequest, variations, concurrency = 2) {
        const results = [];
        // Process in batches to avoid rate limits
        for (let i = 0; i < variations.length; i += concurrency) {
            const batch = variations.slice(i, i + concurrency);
            const batchPromises = batch.map(variation => this.generateImage({
                ...baseRequest,
                prompt: `${baseRequest.prompt}, ${variation}`,
            }));
            const batchResults = await Promise.all(batchPromises);
            results.push(...batchResults);
        }
        return results;
    }
    /**
     * Save generated image to media assets storage
     * Note: This is a placeholder - actual storage would use object storage/CDN
     */
    createMediaAssetRecord(result, request) {
        const filename = `ai-generated-${Date.now()}-${crypto.randomBytes(4).toString('hex')}.png`;
        const [width, height] = (request.size || '1024x1024').split('x').map(Number);
        return {
            userId: request.userId,
            filename,
            originalName: `AI Generated: ${request.prompt.substring(0, 50)}...`,
            fileType: 'image',
            mimeType: 'image/png',
            fileSize: result.imageBuffer.length,
            width,
            height,
            storageUrl: `data:image/png;base64,${result.base64}`, // Temporary base64 storage
            generatedBy: 'openai',
            aiPromptId: request.promptId,
            tags: request.tags,
            altText: request.altText || request.prompt,
            isPublic: false,
            metadata: result.metadata,
        };
    }
    /**
     * Create AI run tracking record
     */
    createAiRunRecord(request, result, status, errorMessage) {
        const executionTime = parseInt(result.metadata.timestamp) || 0;
        return {
            userId: request.userId,
            promptId: request.promptId,
            runType: 'image_generation',
            model: 'gpt-image-1',
            inputPrompt: request.prompt,
            inputVariables: { size: request.size },
            outputData: status === 'completed' ? {
                imageSize: result.imageBuffer.length,
                base64Length: result.base64.length
            } : undefined,
            status,
            tokensUsed: null, // Image generation doesn't use tokens
            creditsUsed: this.calculateCredits(request.size || '1024x1024'),
            executionTime,
            errorMessage,
            metadata: result.metadata,
            completedAt: new Date(),
        };
    }
    /**
     * Calculate credit cost for image generation
     */
    calculateCredits(size) {
        const costs = {
            '256x256': 0.016,
            '512x512': 0.018,
            '1024x1024': 0.020,
        };
        return (costs[size] || 0.020).toFixed(4);
    }
    /**
     * Track AI usage for analytics
     */
    createUsageTrackingRecord(request, success) {
        const creditsUsed = this.calculateCredits(request.size || '1024x1024');
        return {
            userId: request.userId,
            date: new Date(),
            feature: 'image_generation',
            model: 'gpt-image-1',
            requestCount: 1,
            tokensUsed: 0,
            creditsUsed,
            successCount: success ? 1 : 0,
            failureCount: success ? 0 : 1,
            avgResponseTime: null,
            metadata: {
                size: request.size,
                hasTemplate: !!request.promptId,
            },
        };
    }
}
// Export singleton instance
export const aiImageService = new AIImageGenerationService();
/**
 * Predefined prompt templates for common use cases
 */
export const PROMPT_TEMPLATES = {
    SOCIAL_MEDIA: {
        QUOTE: 'Create an inspiring social media image with the quote: "{{quote}}" in elegant typography, {{style}} style, visually appealing background',
        ANNOUNCEMENT: 'Design a professional {{platform}} announcement image for: {{message}}, modern and eye-catching, {{color}} color scheme',
        PRODUCT: 'Create a stunning product showcase image for {{productName}}, highlighting {{features}}, professional photography style',
    },
    CONTENT: {
        BLOG_HEADER: 'Create a compelling blog header image for an article titled "{{title}}", representing {{theme}}, modern and professional',
        THUMBNAIL: 'Design an attractive YouTube/video thumbnail for "{{videoTitle}}", {{emotion}} feeling, bold and engaging',
    },
    BRANDING: {
        LOGO_CONCEPT: 'Generate a creative logo concept for {{brandName}}, {{industry}} industry, {{style}} style, simple and memorable',
        BANNER: 'Create a professional website banner for {{purpose}}, featuring {{elements}}, high-quality and modern design',
    },
};
