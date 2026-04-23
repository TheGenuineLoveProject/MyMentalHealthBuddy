// server/ai/paywallPolicy.mjs
// Pure decision helper. No side effects, no I/O.
// Crisis paths must NEVER trigger a paywall.

const SUCCESS_THRESHOLD = 3;
const DAILY_THRESHOLD = 3;

export function shouldShowPaywall({
  isCrisis = false,
  successfulSessions = 0,
  dailySessions = 0,
  requestedPremium = false,
} = {}) {
  if (isCrisis) return false;
  if (requestedPremium) return true;
  if (successfulSessions >= SUCCESS_THRESHOLD) return true;
  if (dailySessions >= DAILY_THRESHOLD) return true;
  return false;
}

export function getPaywallReason({
  successfulSessions = 0,
  dailySessions = 0,
  requestedPremium = false,
} = {}) {
  if (requestedPremium) return "premium_feature";
  if (successfulSessions >= SUCCESS_THRESHOLD) return "value_proven";
  if (dailySessions >= DAILY_THRESHOLD) return "daily_limit";
  return null;
}
