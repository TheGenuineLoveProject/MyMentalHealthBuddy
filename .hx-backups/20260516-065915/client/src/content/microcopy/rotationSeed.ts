/**
 * Rotation Seed Utility (Batch 10 - Phase 4)
 * Provides deterministic but non-repetitive microcopy selection
 */

export function getRotationSeed(routeKey: string, category: string): number {
  let hash = 0;
  const str = `${routeKey}-${category}`;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export function selectFromRotation<T>(items: T[], seed: number): T {
  if (items.length === 0) throw new Error('Cannot select from empty array');
  return items[seed % items.length];
}

export function getMicrocopyVariant(
  variants: string[],
  routeKey: string,
  category: string
): string {
  const seed = getRotationSeed(routeKey, category);
  return selectFromRotation(variants, seed);
}

export const CTA_VARIANTS = {
  soft: [
    'Begin when you\'re ready',
    'Take the first step',
    'Start your journey',
    'Explore at your pace',
    'Discover more',
  ],
  action: [
    'Get started',
    'Try it now',
    'Begin today',
    'Start now',
    'Let\'s go',
  ],
  gentle: [
    'Learn more',
    'See how it works',
    'Find out more',
    'Explore this',
    'Discover',
  ],
};

export const EMPTY_STATE_VARIANTS = {
  default: [
    'Nothing here yet, and that\'s okay.',
    'This space is waiting for you.',
    'Ready when you are.',
    'A fresh start awaits.',
    'Your journey begins here.',
  ],
  search: [
    'No results found.',
    'We couldn\'t find what you\'re looking for.',
    'Nothing matches your search.',
    'Try a different search term.',
  ],
  loading: [
    'Taking a moment...',
    'Preparing things for you...',
    'Just a moment...',
    'Loading...',
  ],
};

export const ERROR_RECOVERY_VARIANTS = [
  'Something didn\'t work. Try again when you\'re ready.',
  'We hit a small bump. Please try again.',
  'That didn\'t go as planned. Let\'s try again.',
  'Oops! Something went wrong. Take a breath and try again.',
];

export const SUCCESS_VARIANTS = [
  'Done! Nice work.',
  'All set. Well done.',
  'Success! You did it.',
  'Complete. Great job.',
  'Saved successfully.',
];

export const CONSENT_VARIANTS = [
  'Take your time. There\'s no rush.',
  'Go at your own pace.',
  'Only proceed when you feel ready.',
  'You\'re in control here.',
];
