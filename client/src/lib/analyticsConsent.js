/**
 * Canonical optional-analytics consent policy.
 *
 * Analytics is denied unless the user explicitly enables it.
 * Browser privacy signals override stored consent.
 */

export const ANALYTICS_CONSENT_KEY = "glp_cookie_consent";
export const LEGACY_ANALYTICS_OPTOUT_KEY = "analytics_opt_out";
export const ANALYTICS_CONSENT_CHANGED_EVENT =
  "glp:analytics-consent-changed";

function safeStorageGet(storage, key) {
  try {
    return storage?.getItem?.(key) ?? null;
  } catch {
    return null;
  }
}

function privacySignalEnabled(navigatorLike) {
  try {
    if (navigatorLike?.globalPrivacyControl === true) {
      return true;
    }

    const dnt = String(
      navigatorLike?.doNotTrack ??
      globalThis?.doNotTrack ??
      ""
    ).toLowerCase();

    return dnt === "1" || dnt === "yes";
  } catch {
    return false;
  }
}

export function readAnalyticsConsent(storage = globalThis.localStorage) {
  const raw = safeStorageGet(storage, ANALYTICS_CONSENT_KEY);

  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);

    if (!parsed || typeof parsed !== "object") {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function isAnalyticsAllowed({
  storage = globalThis.localStorage,
  navigatorLike = globalThis.navigator,
} = {}) {
  if (privacySignalEnabled(navigatorLike)) {
    return false;
  }

  if (
    safeStorageGet(storage, LEGACY_ANALYTICS_OPTOUT_KEY) ===
    "true"
  ) {
    return false;
  }

  const consent = readAnalyticsConsent(storage);

  return consent?.preferences?.analytics === true;
}

export function persistAnalyticsConsent(
  consentData,
  storage = globalThis.localStorage,
) {
  const analyticsEnabled =
    consentData?.preferences?.analytics === true;

  storage.setItem(
    ANALYTICS_CONSENT_KEY,
    JSON.stringify(consentData),
  );

  // Compatibility for any remaining legacy readers.
  storage.setItem(
    LEGACY_ANALYTICS_OPTOUT_KEY,
    analyticsEnabled ? "false" : "true",
  );

  try {
    globalThis.dispatchEvent?.(
      new CustomEvent(ANALYTICS_CONSENT_CHANGED_EVENT, {
        detail: { analyticsEnabled },
      }),
    );
  } catch {
    // Consent persistence must never break the interface.
  }
}
