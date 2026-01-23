/**
 * Unified Social Media Posting Service
 * Handles posting to all configured platforms
 */

import { PLATFORMS, checkPlatformCredentials } from './social-platforms.mjs';
import { logger } from '../utils/logger.mjs';

/**
 * Post content to a specific platform
 */
export async function postToPlatform(platformId, content) {
  const platform = PLATFORMS[platformId];
  if (!platform) {
    throw new Error(`Unknown platform: ${platformId}`);
  }

  const credentials = checkPlatformCredentials(platformId);
  if (!credentials.configured) {
    throw new Error(`Platform ${platform.name} not configured. Missing: ${credentials.missing.join(', ')}`);
  }

  const handler = platformHandlers[platformId];
  if (!handler) {
    throw new Error(`No handler implemented for platform: ${platformId}`);
  }

  try {
    logger.info(`Posting to ${platform.name}`, { platformId, contentType: content.type });
    const result = await handler(content);
    logger.info(`Posted successfully to ${platform.name}`, { platformId, postId: result.postId });
    return { success: true, platform: platformId, ...result };
  } catch (error) {
    logger.error(`Failed to post to ${platform.name}`, { platformId, error: error.message });
    throw error;
  }
}

/**
 * Post content to multiple platforms
 */
export async function postToMultiplePlatforms(platformIds, content) {
  const results = await Promise.allSettled(
    platformIds.map(id => postToPlatform(id, content))
  );

  return platformIds.map((id, index) => {
    const result = results[index];
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      return {
        success: false,
        platform: id,
        error: result.reason?.message || 'Unknown error',
      };
    }
  });
}

/**
 * Platform-specific posting handlers
 */
const platformHandlers = {
  /**
   * Instagram - via Meta Graph API
   */
  instagram: async (content) => {
    const accessToken = process.env.META_ACCESS_TOKEN;
    const accountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
    
    if (content.type === 'photo' || content.type === 'image') {
      const containerRes = await fetch(
        `https://graph.facebook.com/v21.0/${accountId}/media`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image_url: content.mediaUrl,
            caption: content.caption,
            access_token: accessToken,
          }),
        }
      );
      const containerData = await containerRes.json();
      if (containerData.error) throw new Error(containerData.error.message);

      const publishRes = await fetch(
        `https://graph.facebook.com/v21.0/${accountId}/media_publish`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            creation_id: containerData.id,
            access_token: accessToken,
          }),
        }
      );
      const publishData = await publishRes.json();
      if (publishData.error) throw new Error(publishData.error.message);

      return { postId: publishData.id, url: `https://instagram.com/p/${publishData.id}` };
    }

    if (content.type === 'video' || content.type === 'reel') {
      const containerRes = await fetch(
        `https://graph.facebook.com/v21.0/${accountId}/media`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            video_url: content.mediaUrl,
            caption: content.caption,
            media_type: 'REELS',
            access_token: accessToken,
          }),
        }
      );
      const containerData = await containerRes.json();
      if (containerData.error) throw new Error(containerData.error.message);

      await pollForMediaReady(accountId, containerData.id, accessToken);

      const publishRes = await fetch(
        `https://graph.facebook.com/v21.0/${accountId}/media_publish`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            creation_id: containerData.id,
            access_token: accessToken,
          }),
        }
      );
      const publishData = await publishRes.json();
      if (publishData.error) throw new Error(publishData.error.message);

      return { postId: publishData.id };
    }

    throw new Error(`Unsupported content type: ${content.type}`);
  },

  /**
   * Facebook - via Meta Graph API
   */
  facebook: async (content) => {
    const accessToken = process.env.META_ACCESS_TOKEN;
    const pageId = process.env.FACEBOOK_PAGE_ID;

    if (content.type === 'photo' || content.type === 'image') {
      const res = await fetch(
        `https://graph.facebook.com/v21.0/${pageId}/photos`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: content.mediaUrl,
            message: content.caption,
            access_token: accessToken,
          }),
        }
      );
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      return { postId: data.post_id || data.id };
    }

    if (content.type === 'text' || content.type === 'link') {
      const res = await fetch(
        `https://graph.facebook.com/v21.0/${pageId}/feed`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: content.caption,
            link: content.link,
            access_token: accessToken,
          }),
        }
      );
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      return { postId: data.id };
    }

    throw new Error(`Unsupported content type: ${content.type}`);
  },

  /**
   * TikTok - via Content Posting API
   */
  tiktok: async (content) => {
    const accessToken = process.env.TIKTOK_ACCESS_TOKEN;

    const initRes = await fetch(
      'https://open.tiktokapis.com/v2/post/publish/inbox/video/init/',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source_info: {
            source: 'PULL_FROM_URL',
            video_url: content.mediaUrl,
          },
          post_info: {
            title: content.caption,
            privacy_level: 'PUBLIC_TO_EVERYONE',
            disable_comment: false,
            disable_duet: false,
            disable_stitch: false,
          },
        }),
      }
    );
    const initData = await initRes.json();
    if (initData.error) throw new Error(initData.error.message);

    return { postId: initData.data?.publish_id, status: 'processing' };
  },

  /**
   * YouTube - via Data API v3
   */
  youtube: async (content) => {
    logger.info('YouTube posting requires OAuth flow - marking for manual upload');
    return { 
      postId: null, 
      status: 'manual_required',
      message: 'YouTube video upload requires OAuth consent flow. Content saved for manual upload.',
    };
  },

  /**
   * X (Twitter) - via API v2
   */
  x: async (content) => {
    const bearerToken = process.env.X_BEARER_TOKEN;

    if (content.mediaUrl) {
      logger.info('X media upload requires separate endpoint - posting text only');
    }

    const res = await fetch('https://api.twitter.com/2/tweets', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: content.caption?.substring(0, 280) || content.text,
      }),
    });
    const data = await res.json();
    if (data.errors) throw new Error(data.errors[0]?.message || 'Tweet failed');

    return { postId: data.data?.id, url: `https://x.com/i/status/${data.data?.id}` };
  },

  /**
   * Threads - via Meta Threads API
   */
  threads: async (content) => {
    const accessToken = process.env.THREADS_ACCESS_TOKEN;
    const userId = process.env.THREADS_USER_ID;

    const containerRes = await fetch(
      `https://graph.threads.net/v1.0/${userId}/threads`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          media_type: content.mediaUrl ? 'IMAGE' : 'TEXT',
          text: content.caption,
          image_url: content.mediaUrl,
          access_token: accessToken,
        }),
      }
    );
    const containerData = await containerRes.json();
    if (containerData.error) throw new Error(containerData.error.message);

    const publishRes = await fetch(
      `https://graph.threads.net/v1.0/${userId}/threads_publish`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creation_id: containerData.id,
          access_token: accessToken,
        }),
      }
    );
    const publishData = await publishRes.json();
    if (publishData.error) throw new Error(publishData.error.message);

    return { postId: publishData.id };
  },

  /**
   * Pinterest - via API v5
   */
  pinterest: async (content) => {
    const accessToken = process.env.PINTEREST_ACCESS_TOKEN;
    const boardId = process.env.PINTEREST_BOARD_ID;

    const res = await fetch('https://api.pinterest.com/v5/pins', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        board_id: boardId,
        title: content.title || content.caption?.substring(0, 100),
        description: content.caption,
        link: content.link,
        media_source: {
          source_type: 'image_url',
          url: content.mediaUrl,
        },
      }),
    });
    const data = await res.json();
    if (data.code) throw new Error(data.message || 'Pin creation failed');

    return { postId: data.id, url: `https://pinterest.com/pin/${data.id}` };
  },

  /**
   * LinkedIn - via API v2
   */
  linkedin: async (content) => {
    const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
    const orgId = process.env.LINKEDIN_ORGANIZATION_ID;

    const author = orgId ? `urn:li:organization:${orgId}` : 'urn:li:person:me';

    const res = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
      },
      body: JSON.stringify({
        author,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: { text: content.caption },
            shareMediaCategory: content.mediaUrl ? 'IMAGE' : 'NONE',
          },
        },
        visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
      }),
    });
    const data = await res.json();
    if (data.status >= 400) throw new Error(data.message || 'LinkedIn post failed');

    return { postId: data.id };
  },
};

/**
 * Poll for Instagram media container to be ready
 */
async function pollForMediaReady(accountId, containerId, accessToken, maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    const res = await fetch(
      `https://graph.facebook.com/v21.0/${containerId}?fields=status_code&access_token=${accessToken}`
    );
    const data = await res.json();
    
    if (data.status_code === 'FINISHED') return true;
    if (data.status_code === 'ERROR') throw new Error('Media processing failed');
    
    await new Promise(r => setTimeout(r, 2000));
  }
  throw new Error('Media processing timeout');
}

export default {
  postToPlatform,
  postToMultiplePlatforms,
};
