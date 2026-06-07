/**
 * client/src/utils/trackSignalEvent.js
 * Minimal, privacy-first signal event tracker
 * Non-blocking, dedupes per page load, no PII
 */

const PUBLISHING_EVENTS = [
  'blog_view',
  'blog_post_view',
  'newsletter_signup_submit',
  'newsletter_signup_success',
  'newsletter_unsubscribe',
  'pricing_view',
  'checkout_start',
];

const firedThisPage = new Set();

export function trackSignalEvent(eventType, metadata = {}) {
  if (!PUBLISHING_EVENTS.includes(eventType)) return;

  const dedupeKey = `${eventType}:${metadata.slug || metadata.page || ''}`;
  if (firedThisPage.has(dedupeKey)) return;
  firedThisPage.add(dedupeKey);

  const safeMetadata = {};
  const allowedKeys = ['page', 'slug', 'surface', 'source', 'campaign', 'content'];
  for (const key of allowedKeys) {
    if (metadata[key] !== undefined) {
      safeMetadata[key] = String(metadata[key]).substring(0, 200);
    }
  }

  try {
    fetch('/api/analytics/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_name: eventType,
        event_category: categoryFor(eventType),
        path: window.location.pathname,
        meta: safeMetadata,
      }),
    }).catch(() => {});
  } catch {
    // Silent failure — never block UI
  }
}

function categoryFor(eventType) {
  if (eventType.startsWith('newsletter')) return 'newsletter';
  if (eventType.startsWith('blog')) return 'content';
  if (eventType === 'pricing_view' || eventType.startsWith('checkout')) return 'conversion';
  return 'engagement';
}

export function resetSignalTracking() {
  firedThisPage.clear();
}
