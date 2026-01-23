/**
 * Social Media Platforms Configuration
 * Supports: Instagram, TikTok, X (Twitter), YouTube, Facebook, Pinterest, Threads, LinkedIn
 */

export const PLATFORMS = {
  instagram: {
    id: 'instagram',
    name: 'Instagram',
    icon: 'instagram',
    color: '#E4405F',
    maxCharacters: 2200,
    maxHashtags: 30,
    supportsImages: true,
    supportsVideos: true,
    supportsCarousel: true,
    supportsReels: true,
    supportsStories: true,
    apiType: 'meta_graph',
    requiresBusinessAccount: true,
    rateLimit: { posts: 50, period: '24h' },
    contentTypes: ['photo', 'video', 'carousel', 'reel', 'story'],
    envKeys: ['META_ACCESS_TOKEN', 'INSTAGRAM_BUSINESS_ACCOUNT_ID'],
  },
  facebook: {
    id: 'facebook',
    name: 'Facebook',
    icon: 'facebook',
    color: '#1877F2',
    maxCharacters: 63206,
    supportsImages: true,
    supportsVideos: true,
    supportsCarousel: true,
    supportsReels: true,
    supportsStories: true,
    apiType: 'meta_graph',
    requiresBusinessAccount: true,
    rateLimit: { posts: 50, period: '24h' },
    contentTypes: ['photo', 'video', 'carousel', 'reel', 'story', 'link'],
    envKeys: ['META_ACCESS_TOKEN', 'FACEBOOK_PAGE_ID'],
  },
  tiktok: {
    id: 'tiktok',
    name: 'TikTok',
    icon: 'music',
    color: '#000000',
    maxCharacters: 2200,
    maxHashtags: 100,
    supportsImages: true,
    supportsVideos: true,
    supportsCarousel: false,
    apiType: 'tiktok_content',
    requiresBusinessAccount: true,
    rateLimit: { requests: 6, period: '1m' },
    contentTypes: ['video', 'photo'],
    envKeys: ['TIKTOK_ACCESS_TOKEN', 'TIKTOK_OPEN_ID'],
  },
  youtube: {
    id: 'youtube',
    name: 'YouTube',
    icon: 'youtube',
    color: '#FF0000',
    maxCharacters: 5000,
    supportsImages: false,
    supportsVideos: true,
    supportsShorts: true,
    apiType: 'youtube_data',
    requiresBusinessAccount: false,
    rateLimit: { uploads: 100, period: '24h' },
    contentTypes: ['video', 'short'],
    envKeys: ['YOUTUBE_API_KEY', 'YOUTUBE_CHANNEL_ID', 'YOUTUBE_REFRESH_TOKEN'],
  },
  x: {
    id: 'x',
    name: 'X (Twitter)',
    icon: 'twitter',
    color: '#000000',
    maxCharacters: 280,
    supportsImages: true,
    supportsVideos: true,
    supportsCarousel: false,
    apiType: 'x_api_v2',
    requiresBusinessAccount: false,
    requiresPaidTier: true,
    rateLimit: { tweets: 300, period: '3h' },
    contentTypes: ['tweet', 'thread', 'media'],
    envKeys: ['X_API_KEY', 'X_API_SECRET', 'X_ACCESS_TOKEN', 'X_ACCESS_TOKEN_SECRET', 'X_BEARER_TOKEN'],
  },
  threads: {
    id: 'threads',
    name: 'Threads',
    icon: 'at-sign',
    color: '#000000',
    maxCharacters: 500,
    supportsImages: true,
    supportsVideos: true,
    supportsCarousel: true,
    apiType: 'threads_api',
    requiresBusinessAccount: true,
    rateLimit: { posts: 250, period: '24h' },
    contentTypes: ['text', 'image', 'video', 'carousel'],
    envKeys: ['THREADS_ACCESS_TOKEN', 'THREADS_USER_ID'],
  },
  pinterest: {
    id: 'pinterest',
    name: 'Pinterest',
    icon: 'pin',
    color: '#E60023',
    maxCharacters: 500,
    supportsImages: true,
    supportsVideos: true,
    supportsIdeas: true,
    apiType: 'pinterest_api',
    requiresBusinessAccount: true,
    rateLimit: { pins: 1000, period: '24h' },
    contentTypes: ['pin', 'idea_pin', 'video_pin'],
    envKeys: ['PINTEREST_ACCESS_TOKEN', 'PINTEREST_BOARD_ID'],
  },
  linkedin: {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: 'linkedin',
    color: '#0A66C2',
    maxCharacters: 3000,
    supportsImages: true,
    supportsVideos: true,
    supportsCarousel: true,
    supportsArticles: true,
    apiType: 'linkedin_api',
    requiresBusinessAccount: false,
    rateLimit: { posts: 100, period: '24h' },
    contentTypes: ['post', 'article', 'image', 'video', 'document'],
    envKeys: ['LINKEDIN_ACCESS_TOKEN', 'LINKEDIN_ORGANIZATION_ID'],
  },
};

export const PLATFORM_LIST = Object.values(PLATFORMS);
export const PLATFORM_IDS = Object.keys(PLATFORMS);

export function getPlatform(id) {
  return PLATFORMS[id] || null;
}

export function getPlatformsByContentType(contentType) {
  return PLATFORM_LIST.filter(p => p.contentTypes.includes(contentType));
}

export function checkPlatformCredentials(platformId) {
  const platform = PLATFORMS[platformId];
  if (!platform) return { configured: false, missing: [] };
  
  const missing = platform.envKeys.filter(key => !process.env[key]);
  return {
    configured: missing.length === 0,
    missing,
    platform: platform.name,
  };
}

export function getConfiguredPlatforms() {
  return PLATFORM_LIST.map(p => ({
    ...p,
    ...checkPlatformCredentials(p.id),
  }));
}

export function getAllRequiredEnvKeys() {
  const allKeys = new Set();
  PLATFORM_LIST.forEach(p => p.envKeys.forEach(k => allKeys.add(k)));
  return Array.from(allKeys);
}
