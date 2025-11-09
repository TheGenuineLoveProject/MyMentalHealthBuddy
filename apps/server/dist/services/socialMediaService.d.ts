/**
 * Social Media Service
 * Handles multi-platform social media posting (Twitter, Facebook, LinkedIn, Instagram, TikTok)
 * Part of the 360° self-evolving platform
 */
import type { InsertSocialAccount, SelectSocialAccount, SelectSocialProfile, SelectSocialPostHistory } from '../../../shared/schema.js';
export interface PostToSocialMediaParams {
    userId: string;
    accountId: string;
    platform: string;
    content: string;
    mediaUrls?: string[];
    scheduledFor?: Date;
}
export interface SocialMediaAnalytics {
    totalPosts: number;
    totalLikes: number;
    totalComments: number;
    totalShares: number;
    totalViews: number;
    avgEngagementRate: number;
    postsByPlatform: Record<string, number>;
    topPerformingPosts: SelectSocialPostHistory[];
}
export declare class SocialMediaService {
    /**
     * Connect a new social media account
     */
    connectAccount(params: InsertSocialAccount): Promise<SelectSocialAccount>;
    /**
     * Sync profile data from the social media platform
     */
    syncProfileData(accountId: string): Promise<SelectSocialProfile | null>;
    /**
     * Post content to a social media platform
     */
    postToSocialMedia(params: PostToSocialMediaParams): Promise<SelectSocialPostHistory>;
    /**
     * Get analytics for a user's social media activity
     */
    getAnalytics(userId: string, dateRange?: {
        start: Date;
        end: Date;
    }): Promise<SocialMediaAnalytics>;
    /**
     * Update engagement metrics for a post (would normally be called by a background job)
     */
    updatePostMetrics(postId: string, metrics: {
        likes?: number;
        comments?: number;
        shares?: number;
        views?: number;
        clicks?: number;
    }): Promise<SelectSocialPostHistory | null>;
    /**
     * Disconnect a social media account
     */
    disconnectAccount(accountId: string): Promise<boolean>;
    /**
     * Get all connected accounts for a user
     */
    getUserAccounts(userId: string): Promise<SelectSocialAccount[]>;
    /**
     * Get all posts for a specific account
     */
    getAccountPosts(accountId: string): Promise<SelectSocialPostHistory[]>;
}
export declare const socialMediaService: SocialMediaService;
//# sourceMappingURL=socialMediaService.d.ts.map