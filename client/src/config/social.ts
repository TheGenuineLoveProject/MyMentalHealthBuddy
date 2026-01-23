/**
 * Verified Social Media Channels - The Genuine Love Project
 * 
 * OFFICIAL CHANNEL MAP (January 2026):
 * YouTube (Primary): @GenuineLoveProject - youtube.com/@GenuineLoveProject
 * TikTok: @genuineloveproject - tiktok.com/@genuineloveproject
 * Instagram: @thegenuineloveproject - instagram.com/thegenuineloveproject
 * Facebook: facebook.com/profile.php?id=61583664864191
 * X (Twitter): @GenuineLoveProj
 */

export const VERIFIED_CHANNELS = {
  youtube: {
    name: 'YouTube',
    handle: '@GenuineLoveProject',
    url: 'https://youtube.com/@GenuineLoveProject',
    status: 'verified',
  },
  tiktok: {
    name: 'TikTok',
    handle: '@genuineloveproject',
    url: 'https://tiktok.com/@genuineloveproject',
    status: 'live',
  },
  instagram: {
    name: 'Instagram',
    handle: '@thegenuineloveproject',
    url: 'https://instagram.com/thegenuineloveproject',
    status: 'active',
  },
  facebook: {
    name: 'Facebook',
    handle: 'The Genuine Love Project',
    url: 'https://facebook.com/profile.php?id=61583664864191',
    status: 'live',
  },
  x: {
    name: 'X',
    handle: '@GenuineLoveProj',
    url: 'https://x.com/GenuineLoveProj',
    status: 'active',
  },
} as const;

export const SOCIAL_LINKS = {
  website: 'https://thegenuineloveproject.com',
  youtube: VERIFIED_CHANNELS.youtube.url,
  tiktok: VERIFIED_CHANNELS.tiktok.url,
  instagram: VERIFIED_CHANNELS.instagram.url,
  facebook: VERIFIED_CHANNELS.facebook.url,
  x: VERIFIED_CHANNELS.x.url,
  threads: 'https://www.threads.net/@thegenuineloveproject',
  pinterest: 'https://www.pinterest.com/genuineloveproject',
  linkedin: 'https://www.linkedin.com/company/genuine-love-project',
} as const;

export type SocialPlatform = keyof typeof VERIFIED_CHANNELS;
export type SocialLink = keyof typeof SOCIAL_LINKS;
