/**
 * Social Media Posting API Routes
 * Handles automated posting to all configured platforms
 */

import express from 'express';
import { db } from '../db/connection.mjs';
import { postDrafts, calendarEntries } from '../../shared/schema.mjs';
import { eq, desc, and, lte, isNull } from 'drizzle-orm';
import { requireAuth, requireAdmin } from '../middleware/auth.mjs';
import { success, badRequest } from '../utils/response.mjs';
import { logger } from '../utils/logger.mjs';
import { PLATFORMS, getConfiguredPlatforms, checkPlatformCredentials, getAllRequiredEnvKeys } from '../services/social-platforms.mjs';
import { postToPlatform, postToMultiplePlatforms } from '../services/social-posting.mjs';

const router = express.Router();

/**
 * Get all platform configurations and their status
 */
router.get('/platforms', requireAdmin, async (req, res) => {
  try {
    const platforms = getConfiguredPlatforms();
    return success(res, {
      platforms,
      requiredEnvKeys: getAllRequiredEnvKeys(),
    });
  } catch (error) {
    logger.error('Failed to get platforms:', error);
    return badRequest(res, 'Failed to get platform configurations');
  }
});

/**
 * Check platform connection status
 */
router.get('/platforms/:platformId/status', requireAdmin, async (req, res) => {
  try {
    const { platformId } = req.params;
    const status = checkPlatformCredentials(platformId);
    
    if (!PLATFORMS[platformId]) {
      return badRequest(res, `Unknown platform: ${platformId}`, 404);
    }

    return success(res, {
      platform: platformId,
      name: PLATFORMS[platformId].name,
      ...status,
    });
  } catch (error) {
    logger.error('Failed to check platform status:', error);
    return badRequest(res, 'Failed to check platform status');
  }
});

/**
 * Post content immediately to specified platforms
 */
router.post('/post', requireAdmin, async (req, res) => {
  try {
    const { platforms: platformIds, content, draftId } = req.body;

    if (!platformIds || !Array.isArray(platformIds) || platformIds.length === 0) {
      return badRequest(res, 'At least one platform must be specified');
    }

    if (!content || (!content.caption && !content.text)) {
      return badRequest(res, 'Content caption or text is required');
    }

    const results = await postToMultiplePlatforms(platformIds, content);

    if (draftId) {
      const successCount = results.filter(r => r.success).length;
      await db
        .update(postDrafts)
        .set({
          status: successCount === platformIds.length ? 'published' : 'partial',
          publishedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(postDrafts.id, draftId));
    }

    return success(res, {
      results,
      summary: {
        total: platformIds.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
      },
    });
  } catch (error) {
    logger.error('Failed to post content:', error);
    return badRequest(res, error.message || 'Failed to post content');
  }
});

/**
 * Schedule a post for later
 */
router.post('/schedule', requireAdmin, async (req, res) => {
  try {
    const { platforms, content, scheduledAt, title } = req.body;

    if (!platforms || platforms.length === 0) {
      return badRequest(res, 'At least one platform must be specified');
    }

    if (!scheduledAt) {
      return badRequest(res, 'Scheduled time is required');
    }

    const [entry] = await db
      .insert(calendarEntries)
      .values({
        title: title || content.caption?.substring(0, 50) || 'Scheduled Post',
        platforms: JSON.stringify(platforms),
        status: 'scheduled',
        scheduledAt: new Date(scheduledAt),
        content: JSON.stringify(content),
        createdBy: req.user?.id || 'system',
      })
      .returning();

    return success(res, entry, 201);
  } catch (error) {
    logger.error('Failed to schedule post:', error);
    return badRequest(res, 'Failed to schedule post');
  }
});

/**
 * Get scheduled posts
 */
router.get('/scheduled', requireAdmin, async (req, res) => {
  try {
    const scheduled = await db
      .select()
      .from(calendarEntries)
      .where(eq(calendarEntries.status, 'scheduled'))
      .orderBy(calendarEntries.scheduledAt)
      .limit(50);

    return success(res, scheduled);
  } catch (error) {
    logger.error('Failed to get scheduled posts:', error);
    return badRequest(res, 'Failed to get scheduled posts');
  }
});

/**
 * Cancel a scheduled post
 */
router.delete('/scheduled/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    await db
      .update(calendarEntries)
      .set({ status: 'cancelled', updatedAt: new Date() })
      .where(eq(calendarEntries.id, id));

    return success(res, { message: 'Scheduled post cancelled' });
  } catch (error) {
    logger.error('Failed to cancel scheduled post:', error);
    return badRequest(res, 'Failed to cancel scheduled post');
  }
});

/**
 * Process due scheduled posts (called by cron/scheduler)
 */
router.post('/process-scheduled', requireAdmin, async (req, res) => {
  try {
    const now = new Date();
    
    const duePosts = await db
      .select()
      .from(calendarEntries)
      .where(
        and(
          eq(calendarEntries.status, 'scheduled'),
          lte(calendarEntries.scheduledAt, now)
        )
      )
      .limit(10);

    const results = [];

    for (const post of duePosts) {
      try {
        const platforms = JSON.parse(post.platforms || '[]');
        const content = JSON.parse(post.content || '{}');
        
        const postResults = await postToMultiplePlatforms(platforms, content);
        
        const successCount = postResults.filter(r => r.success).length;
        const newStatus = successCount === platforms.length ? 'published' : 
                         successCount > 0 ? 'partial' : 'failed';

        await db
          .update(calendarEntries)
          .set({ 
            status: newStatus, 
            updatedAt: new Date(),
          })
          .where(eq(calendarEntries.id, post.id));

        results.push({ id: post.id, status: newStatus, details: postResults });
      } catch (error) {
        await db
          .update(calendarEntries)
          .set({ status: 'failed', updatedAt: new Date() })
          .where(eq(calendarEntries.id, post.id));

        results.push({ id: post.id, status: 'failed', error: error.message });
      }
    }

    return success(res, {
      processed: duePosts.length,
      results,
    });
  } catch (error) {
    logger.error('Failed to process scheduled posts:', error);
    return badRequest(res, 'Failed to process scheduled posts');
  }
});

/**
 * Publish a draft to platforms
 */
router.post('/drafts/:id/publish', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { platforms: platformIds } = req.body;

    const [draft] = await db
      .select()
      .from(postDrafts)
      .where(eq(postDrafts.id, id))
      .limit(1);

    if (!draft) {
      return badRequest(res, 'Draft not found', 404);
    }

    const targetPlatforms = platformIds || JSON.parse(draft.platforms || '[]');

    if (!targetPlatforms.length) {
      return badRequest(res, 'No platforms specified for publishing');
    }

    const content = {
      caption: draft.caption,
      mediaUrl: draft.mediaUrl,
      type: draft.contentType || 'text',
    };

    const results = await postToMultiplePlatforms(targetPlatforms, content);

    const successCount = results.filter(r => r.success).length;
    const newStatus = successCount === targetPlatforms.length ? 'published' : 
                     successCount > 0 ? 'partial' : 'failed';

    await db
      .update(postDrafts)
      .set({
        status: newStatus,
        publishedAt: successCount > 0 ? new Date() : null,
        updatedAt: new Date(),
      })
      .where(eq(postDrafts.id, id));

    return success(res, {
      draft: { id, status: newStatus },
      results,
    });
  } catch (error) {
    logger.error('Failed to publish draft:', error);
    return badRequest(res, error.message || 'Failed to publish draft');
  }
});

export default router;
