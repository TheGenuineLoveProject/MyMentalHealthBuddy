// server/account/userDataExportSectionMap.mjs
// Track E6W — export section mapping matrix only.
// Not wired into account export route yet.

export const USER_DATA_EXPORT_SECTION_MAP_STATUS = {
  track: "E6W",
  status: "section-map-design-not-wired",
  rule: "Do not wire into /api/account/export until export contract is approved.",
};

export const USER_DATA_EXPORT_SECTION_MAP = {
  profile: [],

  privateData: [
    "journals",
    "aiMessages",
    "therapySessions",
    "reflections",
    "concepts",
    "contentDrafts",
  ],

  sharedData: [
    "sharedReflections",
    "communityAffirmations",
    "blogComments",
  ],

  wellnessData: [
    "moods",
    "gratitudeEntries",
    "states",
    "dailyReflections",
    "dailyRituals",
    "valuesEntries",
    "boundaryScripts",
    "movementLogs",
    "coherenceEntries",
  ],

  progressData: [
    "userFavorites",
    "toolSessions",
    "userProgress",
    "dailyQuests",
    "badges",
    "protocolSessions",
    "outcomeMeasures",
  ],

  biometricData: [
    "biometricReadings",
    "biometricConnections",
    "nervousSystemStates",
  ],

  discernmentData: [
    "discernmentUserProgress",
    "discernmentAttempts",
    "awarenessDetections",
  ],

  accountSettings: [
    "userSettings",
    "userAvatars",
    "passwordResetTokens",
  ],

  exportMetadata: [
    "analyticsEvents",
  ],
};

export function getExportSectionMapSummary() {
  return {
    mode: "design-only",
    wired: false,
    sectionCount: Object.keys(USER_DATA_EXPORT_SECTION_MAP).length,
    tableCount: Object.values(USER_DATA_EXPORT_SECTION_MAP).flat().length,
    sections: USER_DATA_EXPORT_SECTION_MAP,
  };
}
