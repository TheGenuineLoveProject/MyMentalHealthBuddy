/**
 * shared/utm.mjs — Canonical UTM builder for The Genuine Love Project
 * Privacy-respecting: never includes PII (no email, no userId)
 * Supports internal paths ("/blog") and absolute URLs
 */

const DEFAULTS = {
  source: 'glp',
  medium: 'owned',
  campaign: 'publishing',
};

export function buildUtmUrl(baseUrlOrPath, params = {}) {
  const { source, medium, campaign, content } = { ...DEFAULTS, ...params };

  const separator = baseUrlOrPath.includes('?') ? '&' : '?';
  const parts = [];

  if (source) parts.push(`utm_source=${encodeURIComponent(source)}`);
  if (medium) parts.push(`utm_medium=${encodeURIComponent(medium)}`);
  if (campaign) parts.push(`utm_campaign=${encodeURIComponent(campaign)}`);
  if (content) parts.push(`utm_content=${encodeURIComponent(content)}`);

  if (parts.length === 0) return baseUrlOrPath;

  return `${baseUrlOrPath}${separator}${parts.join('&')}`;
}

export { DEFAULTS as UTM_DEFAULTS };
