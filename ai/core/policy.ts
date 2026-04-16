export type Engine   = 'healing' | 'business';
export type Audience = 'anonymous' | 'subscriber' | 'staff' | 'admin';

export const ENGINE_RULES = {
  healing: {
    allowedAudiences: new Set<Audience>(['anonymous', 'subscriber']),
    forbiddenTopics:  ['pricing', 'funnels', 'revenue', 'ad_spend', 'affiliate', 'competitor'],
  },
  business: {
    allowedAudiences: new Set<Audience>(['staff', 'admin']),
    forbiddenTopics:  ['user_journal', 'crisis_log', 'therapy_note', 'diagnosis', 'phi', 'user data'],
  },
} as const;

export function assertEngineAccess(engine: Engine, audience: Audience): void {
  if (!ENGINE_RULES[engine].allowedAudiences.has(audience)) {
    throw new Error(`RBAC: '${audience}' cannot access engine '${engine}'.`);
  }
}

/**
 * Normalize text for boundary matching: lowercase, collapse separators
 * (underscore, hyphen, dot, multiple spaces) so "therapy_note" and
 * "therapy note" and "therapy-note" all match consistently.
 */
function normalizeForMatch(s: string): string {
  return s.toLowerCase().replace(/[_\-.]+/g, ' ').replace(/\s+/g, ' ').trim();
}

export function assertDataBoundary(engine: Engine, text: string): void {
  const normalized = normalizeForMatch(text);
  for (const topic of ENGINE_RULES[engine].forbiddenTopics) {
    const normTopic = normalizeForMatch(topic);
    // Word-boundary aware match against the normalized text.
    const re = new RegExp(`\\b${normTopic.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`);
    if (re.test(normalized)) {
      throw new Error(`Data boundary violation: '${topic}' blocked in '${engine}'.`);
    }
  }
}
