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

let consentSaveBlocked = false;

function defaultConsentStorage() {
  try { return globalThis.localStorage; } catch { return null; }
}

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

export function readAnalyticsConsent(storage = defaultConsentStorage()) {
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
  storage = defaultConsentStorage(),
  navigatorLike = globalThis.navigator,
} = {}) {
  if (consentSaveBlocked) return false;

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
  storage = defaultConsentStorage(),
) {
  // A failed save must not keep analytics enabled in this module instance.
  consentSaveBlocked = true;
  const analyticsEnabled = consentData?.preferences?.analytics === true;
  const serialized = JSON.stringify(consentData);
  function writeVerified(key, value) {
    storage.setItem(key, value);
    if (storage.getItem(key) !== value) {
      throw new Error("Consent storage verification failed");
    }
  }

  // Establish a durable denial before changing the canonical preference.
  writeVerified(LEGACY_ANALYTICS_OPTOUT_KEY, "true");
  writeVerified(ANALYTICS_CONSENT_KEY, serialized);
  if (analyticsEnabled) {
    writeVerified(LEGACY_ANALYTICS_OPTOUT_KEY, "false");
  }
  consentSaveBlocked = false;

  try {
    globalThis.dispatchEvent?.(
      new CustomEvent(ANALYTICS_CONSENT_CHANGED_EVENT, {
        detail: { analyticsEnabled },
      }),
    );
  } catch {
    // Notification failure does not undo verified persistence.
  }
}
