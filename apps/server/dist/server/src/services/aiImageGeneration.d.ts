/**
 * 360° Self-Evolving AI Platform: AI Image Generation Service
 *
 * Comprehensive image generation service using OpenAI gpt-image-1 model
 * with prompt templates, quality tracking, and media asset management.
 */
import { Buffer } from 'node:buffer';
import type { InsertMediaAsset, InsertAiRun, InsertAiUsageTracking } from '../../../shared/schema.js';
export interface ImageGenerationRequest {
    prompt: string;
    size?: '256x256' | '512x512' | '1024x1024';
    userId: string;
    promptId?: string;
    tags?: string[];
    altText?: string;
}
export interface ImageGenerationResult {
    imageBuffer: Buffer;
    base64: string;
    metadata: {
        size: string;
        promptUsed: string;
        model: string;
        timestamp: string;
    };
    aiRunId?: string;
}
export declare class AIImageGenerationService {
    /**
     * Generate an image from a text prompt
     */
    generateImage(request: ImageGenerationRequest): Promise<ImageGenerationResult>;
    /**
     * Generate an image using a prompt template
     */
    generateFromTemplate(templatePrompt: string, variables: Record<string, string>, request: Omit<ImageGenerationRequest, 'prompt'>): Promise<ImageGenerationResult>;
    /**
     * Generate multiple images with different variations
     */
    generateVariations(baseRequest: ImageGenerationRequest, variations: string[], concurrency?: number): Promise<ImageGenerationResult[]>;
    /**
     * Save generated image to media assets storage
     * Note: This is a placeholder - actual storage would use object storage/CDN
     */
    createMediaAssetRecord(result: ImageGenerationResult, request: ImageGenerationRequest): Omit<InsertMediaAsset, 'id'>;
    /**
     * Create AI run tracking record
     */
    createAiRunRecord(request: ImageGenerationRequest, result: ImageGenerationResult, status: 'completed' | 'failed', errorMessage?: string): Omit<InsertAiRun, 'id'>;
    /**
     * Calculate credit cost for image generation
     */
    private calculateCredits;
    /**
     * Track AI usage for analytics
     */
    createUsageTrackingRecord(request: ImageGenerationRequest, success: boolean): Omit<InsertAiUsageTracking, 'id'>;
}
export declare const aiImageService: AIImageGenerationService;
/**
 * Predefined prompt templates for common use cases
 */
export declare const PROMPT_TEMPLATES: {
    SOCIAL_MEDIA: {
        QUOTE: string;
        ANNOUNCEMENT: string;
        PRODUCT: string;
    };
    CONTENT: {
        BLOG_HEADER: string;
        THUMBNAIL: string;
    };
    BRANDING: {
        LOGO_CONCEPT: string;
        BANNER: string;
    };
};
