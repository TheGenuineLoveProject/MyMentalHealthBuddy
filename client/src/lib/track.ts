import { ANALYTICS_EVENTS, sanitizeParams, type EventName } from '@/content/analytics/eventSchema';

const IS_DEV = import.meta.env.DEV;
const ANALYTICS_ENABLED = Boolean(import.meta.env.VITE_GA_MEASUREMENT_ID);

function log(message: string, data?: unknown) {
  if (IS_DEV) {
    console.log(`[Analytics] ${message}`, data || '');
  }
}

export function track(eventName: EventName, properties?: Record<string, unknown>) {
  const eventConfig = ANALYTICS_EVENTS[eventName];
  if (!eventConfig) {
    log(`Unknown event: ${eventName}`);
    return;
  }

  const sanitizedProps = properties ? sanitizeParams(properties) : {};

  if (IS_DEV) {
    log(`Event: ${eventConfig.action}`, {
      category: eventConfig.category,
      ...sanitizedProps
    });
    return;
  }

  if (!ANALYTICS_ENABLED || !window.gtag) {
    return;
  }

  window.gtag('event', eventConfig.action, {
    event_category: eventConfig.category,
    ...sanitizedProps
  });
}

export function trackPageView(page: string) {
  track('pageView', { page, referrer: document.referrer || 'direct' });
}

export function trackToolUsage(toolId: string, tier: string, action: 'start' | 'complete', duration?: number) {
  if (action === 'start') {
    track('toolStart', { toolId, tier });
  } else {
    track('toolComplete', { toolId, tier, duration: duration || 0 });
  }
}

export function trackError(errorType: string, page: string) {
  track('errorOccurred', { errorType, page });
}

export function trackConversion(type: 'cta' | 'signup' | 'subscription', details: Record<string, string>) {
  if (type === 'cta') {
    track('ctaClick', details);
  } else if (type === 'signup') {
    track('signUp', details);
  } else {
    track('subscriptionStart', details);
  }
}

export function trackShare(contentType: string, platform: string) {
  track('shareIntent', { contentType, platform });
}

export function trackTierChange(fromTier: string, toTier: string) {
  track('tierChange', { fromTier, toTier });
}
