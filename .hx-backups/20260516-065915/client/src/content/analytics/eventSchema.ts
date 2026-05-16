export const EVENT_CATEGORIES = {
  NAVIGATION: 'navigation',
  ENGAGEMENT: 'engagement',
  WELLNESS: 'wellness',
  CONVERSION: 'conversion',
  ERROR: 'error'
} as const;

export const ANALYTICS_EVENTS = {
  pageView: {
    category: EVENT_CATEGORIES.NAVIGATION,
    action: 'page_view',
    params: ['page', 'referrer']
  },
  toolStart: {
    category: EVENT_CATEGORIES.WELLNESS,
    action: 'tool_start',
    params: ['toolId', 'tier']
  },
  toolComplete: {
    category: EVENT_CATEGORIES.WELLNESS,
    action: 'tool_complete',
    params: ['toolId', 'tier', 'duration']
  },
  journalEntry: {
    category: EVENT_CATEGORIES.ENGAGEMENT,
    action: 'journal_entry',
    params: ['promptType']
  },
  moodCheck: {
    category: EVENT_CATEGORIES.ENGAGEMENT,
    action: 'mood_check',
    params: ['moodCategory']
  },
  ctaClick: {
    category: EVENT_CATEGORIES.CONVERSION,
    action: 'cta_click',
    params: ['ctaId', 'location']
  },
  shareIntent: {
    category: EVENT_CATEGORIES.ENGAGEMENT,
    action: 'share_intent',
    params: ['contentType', 'platform']
  },
  errorOccurred: {
    category: EVENT_CATEGORIES.ERROR,
    action: 'error_occurred',
    params: ['errorType', 'page']
  },
  tierChange: {
    category: EVENT_CATEGORIES.ENGAGEMENT,
    action: 'tier_change',
    params: ['fromTier', 'toTier']
  },
  signUp: {
    category: EVENT_CATEGORIES.CONVERSION,
    action: 'sign_up',
    params: ['method']
  },
  subscriptionStart: {
    category: EVENT_CATEGORIES.CONVERSION,
    action: 'subscription_start',
    params: ['plan']
  }
} as const;

export type EventName = keyof typeof ANALYTICS_EVENTS;

export interface TrackEventParams {
  event: EventName;
  properties?: Record<string, string | number | boolean>;
}

export const FORBIDDEN_PARAMS = [
  'email', 'name', 'phone', 'address', 'ssn', 'password',
  'journalText', 'privateNote', 'personalMessage', 'content'
] as const;

export function sanitizeParams(params: Record<string, unknown>): Record<string, string | number | boolean> {
  const sanitized: Record<string, string | number | boolean> = {};
  
  for (const [key, value] of Object.entries(params)) {
    if (FORBIDDEN_PARAMS.includes(key as typeof FORBIDDEN_PARAMS[number])) {
      continue;
    }
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}
