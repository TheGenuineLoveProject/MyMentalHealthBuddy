/**
 * Social Media Service
 * Handles multi-platform social media posting (Twitter, Facebook, LinkedIn, Instagram, TikTok)
 * Part of the 360° self-evolving platform
 */

import type { 
  InsertSocialAccount,
  SelectSocialAccount,
  InsertSocialProfile,
  SelectSocialProfile,
  InsertSocialPostHistory,
  SelectSocialPostHistory 
} from '../../../shared/schema.js';
import { storage } from '../../storage.js';

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

export class SocialMediaService {
  /**
   * Connect a new social media account
   */
  async connectAccount(params: InsertSocialAccount): Promise<SelectSocialAccount> {
    try {
      // In a real implementation, this would handle OAuth flow
      // For now, we'll create the account with the provided tokens
      const account = await storage.createSocialAccount(params);
      
      // Sync profile data from the platform
      await this.syncProfileData(account.id);
      
      return account;
    } catch (error) {
      console.error('Failed to connect social account:', error);
      throw new Error('Failed to connect social media account');
    }
  }

  /**
   * Sync profile data from the social media platform
   */
  async syncProfileData(accountId: string): Promise<SelectSocialProfile | null> {
    try {
      const account = await storage.getSocialAccountById(accountId);
      if (!account) {
        throw new Error('Account not found');
      }

      // In a real implementation, this would call the platform's API
      // to fetch the latest profile data
      const profileData: InsertSocialProfile = {
        accountId: account.id,
        displayName: account.platformUsername || 'User',
        bio: '',
        profileImageUrl: null,
        followersCount: 0,
        followingCount: 0,
        postsCount: 0,
        engagementRate: '0',
        profileUrl: null,
        isVerified: false,
        metadata: {},
      };

      const existingProfiles = await storage.getSocialProfilesByAccountId(accountId);
      
      if (existingProfiles.length > 0) {
        // Update existing profile
        return await storage.updateSocialProfile(existingProfiles[0].id, profileData);
      } else {
        // Create new profile
        return await storage.createSocialProfile(profileData);
      }
    } catch (error) {
      console.error('Failed to sync profile data:', error);
      return null;
    }
  }

  /**
   * Post content to a social media platform
   */
  async postToSocialMedia(params: PostToSocialMediaParams): Promise<SelectSocialPostHistory> {
    try {
      const account = await storage.getSocialAccountById(params.accountId);
      if (!account) {
        throw new Error('Account not found');
      }

      if (!account.isActive) {
        throw new Error('Account is not active');
      }

      // In a real implementation, this would call the platform's API to post
      // For now, we'll create a post history record
      const postData: InsertSocialPostHistory = {
        userId: params.userId,
        accountId: params.accountId,
        contentPostId: null,
        platform: params.platform,
        platformPostId: `mock_${Date.now()}`,
        content: params.content,
        mediaUrls: params.mediaUrls || [],
        postType: 'post',
        status: params.scheduledFor ? 'scheduled' : 'published',
        publishedAt: params.scheduledFor ? null : new Date(),
        scheduledFor: params.scheduledFor || null,
        likes: 0,
        comments: 0,
        shares: 0,
        views: 0,
        clicks: 0,
        engagementRate: '0',
        metadata: {},
        errorMessage: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const post = await storage.createSocialPost(postData);

      // Update account's last synced timestamp
      await storage.updateSocialAccount(params.accountId, {
        lastSyncedAt: new Date(),
      });

      return post;
    } catch (error) {
      console.error('Failed to post to social media:', error);
      throw new Error('Failed to post to social media');
    }
  }

  /**
   * Get analytics for a user's social media activity
   */
  async getAnalytics(userId: string, dateRange?: { start: Date; end: Date }): Promise<SocialMediaAnalytics> {
    try {
      const posts = await storage.getSocialPostsByUserId(userId);
      
      // Filter by date range if provided
      const filteredPosts = dateRange 
        ? posts.filter(p => {
            const publishedAt = p.publishedAt || p.createdAt;
            return publishedAt && 
                   publishedAt >= dateRange.start && 
                   publishedAt <= dateRange.end;
          })
        : posts;

      // Calculate metrics
      const totalPosts = filteredPosts.length;
      const totalLikes = filteredPosts.reduce((sum, p) => sum + (p.likes || 0), 0);
      const totalComments = filteredPosts.reduce((sum, p) => sum + (p.comments || 0), 0);
      const totalShares = filteredPosts.reduce((sum, p) => sum + (p.shares || 0), 0);
      const totalViews = filteredPosts.reduce((sum, p) => sum + (p.views || 0), 0);
      
      const avgEngagementRate = filteredPosts.length > 0
        ? filteredPosts.reduce((sum, p) => sum + parseFloat(p.engagementRate || '0'), 0) / filteredPosts.length
        : 0;

      // Posts by platform
      const postsByPlatform: Record<string, number> = {};
      filteredPosts.forEach(p => {
        postsByPlatform[p.platform] = (postsByPlatform[p.platform] || 0) + 1;
      });

      // Top performing posts (by engagement)
      const topPerformingPosts = [...filteredPosts]
        .sort((a, b) => {
          const engagementA = (a.likes || 0) + (a.comments || 0) + (a.shares || 0);
          const engagementB = (b.likes || 0) + (b.comments || 0) + (b.shares || 0);
          return engagementB - engagementA;
        })
        .slice(0, 10);

      return {
        totalPosts,
        totalLikes,
        totalComments,
        totalShares,
        totalViews,
        avgEngagementRate,
        postsByPlatform,
        topPerformingPosts,
      };
    } catch (error) {
      console.error('Failed to get analytics:', error);
      throw new Error('Failed to get social media analytics');
    }
  }

  /**
   * Update engagement metrics for a post (would normally be called by a background job)
   */
  async updatePostMetrics(postId: string, metrics: {
    likes?: number;
    comments?: number;
    shares?: number;
    views?: number;
    clicks?: number;
  }): Promise<SelectSocialPostHistory | null> {
    try {
      const post = await storage.getSocialPostById(postId);
      if (!post) {
        return null;
      }

      // Calculate engagement rate
      const totalEngagement = (metrics.likes || post.likes || 0) + 
                             (metrics.comments || post.comments || 0) + 
                             (metrics.shares || post.shares || 0);
      const views = metrics.views || post.views || 1;
      const engagementRate = ((totalEngagement / views) * 100).toFixed(2);

      return await storage.updateSocialPost(postId, {
        ...metrics,
        engagementRate,
      });
    } catch (error) {
      console.error('Failed to update post metrics:', error);
      return null;
    }
  }

  /**
   * Disconnect a social media account
   */
  async disconnectAccount(accountId: string): Promise<boolean> {
    try {
      // In a real implementation, this would revoke OAuth tokens
      return await storage.deleteSocialAccount(accountId);
    } catch (error) {
      console.error('Failed to disconnect account:', error);
      return false;
    }
  }

  /**
   * Get all connected accounts for a user
   */
  async getUserAccounts(userId: string): Promise<SelectSocialAccount[]> {
    return await storage.getSocialAccountsByUserId(userId);
  }

  /**
   * Get all posts for a specific account
   */
  async getAccountPosts(accountId: string): Promise<SelectSocialPostHistory[]> {
    return await storage.getSocialPostsByAccountId(accountId);
  }
}

export const socialMediaService = new SocialMediaService();
