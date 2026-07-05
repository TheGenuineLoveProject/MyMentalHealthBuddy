// server/account/userDataExportContract.mjs
// Track E6S — export contract helper skeleton only.
// Not wired into account export route yet.

export const USER_DATA_EXPORT_CONTRACT_STATUS = {
  track: "E6S",
  status: "contract-helper-skeleton-not-wired",
  rule: "Do not wire into /api/account/export until export contract is approved.",
};

export const USER_DATA_EXPORT_VERSION = "2026-07-e6s-v1";

export const USER_DATA_EXPORT_SECTIONS = [
  "profile",
  "privateData",
  "sharedData",
  "wellnessData",
  "progressData",
  "biometricData",
  "discernmentData",
  "accountSettings",
  "exportMetadata",
];

export function createEmptyUserDataExportEnvelope({ userId, generatedAt = new Date().toISOString() } = {}) {
  return {
    ok: true,
    exportVersion: USER_DATA_EXPORT_VERSION,
    generatedAt,
    userId: userId || null,
    source: "mymentalhealthbuddy-account-export",
    sections: Object.fromEntries(USER_DATA_EXPORT_SECTIONS.map((section) => [section, {}])),
    counts: {},
    warnings: [],
  };
}
