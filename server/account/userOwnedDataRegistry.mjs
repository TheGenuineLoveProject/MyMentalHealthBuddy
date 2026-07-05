// server/account/userOwnedDataRegistry.mjs
// Track E6H — populated registry draft only.
// Not wired into delete/export yet.

import {
  journals, moods, aiMessages, therapySessions, gratitudeEntries,
  userFavorites, toolSessions, userProgress, dailyQuests,
  passwordResetTokens, states, dailyReflections, reflections,
  dailyRituals, concepts, contentDrafts, valuesEntries, boundaryScripts,
  movementLogs, coherenceEntries, badges, userSettings, analyticsEvents,
  protocolSessions, outcomeMeasures, biometricConnections, biometricReadings,
  nervousSystemStates, discernmentUserProgress, discernmentAttempts,
  awarenessDetections, userAvatars,
  sharedReflections, communityAffirmations, blogComments,
  socialPosts, blogPosts, digitalProducts,
  auditLog, sessions, webhookEvents, publishingEvents, agentDecisions,
  leads, invites, newsletterSubscribers, users
} from "../../shared/schema.mjs";

export const USER_OWNED_DATA_REGISTRY_STATUS = {
  track: "E6H",
  status: "populated-draft-not-wired",
  rule: "Do not implement until registry, lifecycle policy, export contract, and tests are approved.",
};

export const DELETE_TABLES = [
  { key: "journals", table: journals, column: "userId" },
  { key: "moods", table: moods, column: "userId" },
  { key: "aiMessages", table: aiMessages, column: "userId" },
  { key: "therapySessions", table: therapySessions, column: "userId" },
  { key: "gratitudeEntries", table: gratitudeEntries, column: "userId" },
  { key: "userFavorites", table: userFavorites, column: "userId" },
  { key: "toolSessions", table: toolSessions, column: "userId" },
  { key: "userProgress", table: userProgress, column: "userId" },
  { key: "dailyQuests", table: dailyQuests, column: "userId" },
  { key: "passwordResetTokens", table: passwordResetTokens, column: "userId" },
  { key: "states", table: states, column: "userId" },
  { key: "dailyReflections", table: dailyReflections, column: "userId" },
  { key: "reflections", table: reflections, column: "userId" },
  { key: "dailyRituals", table: dailyRituals, column: "userId" },
  { key: "concepts", table: concepts, column: "userId" },
  { key: "contentDrafts", table: contentDrafts, column: "userId" },
  { key: "valuesEntries", table: valuesEntries, column: "userId" },
  { key: "boundaryScripts", table: boundaryScripts, column: "userId" },
  { key: "movementLogs", table: movementLogs, column: "userId" },
  { key: "coherenceEntries", table: coherenceEntries, column: "userId" },
  { key: "badges", table: badges, column: "userId" },
  { key: "userSettings", table: userSettings, column: "userId" },
  { key: "analyticsEvents", table: analyticsEvents, column: "userId" },
  { key: "protocolSessions", table: protocolSessions, column: "userId" },
  { key: "outcomeMeasures", table: outcomeMeasures, column: "userId" },
  { key: "biometricConnections", table: biometricConnections, column: "userId" },
  { key: "biometricReadings", table: biometricReadings, column: "userId" },
  { key: "nervousSystemStates", table: nervousSystemStates, column: "userId" },
  { key: "discernmentUserProgress", table: discernmentUserProgress, column: "userId" },
  { key: "discernmentAttempts", table: discernmentAttempts, column: "userId" },
  { key: "awarenessDetections", table: awarenessDetections, column: "userId" },
  { key: "userAvatars", table: userAvatars, column: "userId" },
];

export const ANONYMIZE_TABLES = [
  { key: "sharedReflections", table: sharedReflections, column: "userId" },
  { key: "communityAffirmations", table: communityAffirmations, column: "userId" },
  { key: "blogComments", table: blogComments, column: "userId" },
  { key: "socialPosts", table: socialPosts, column: "authorId" },
  { key: "blogPosts", table: blogPosts, column: "authorId" },
  { key: "digitalProducts", table: digitalProducts, column: "authorId" },
];

export const RETAIN_POLICY_REVIEW_TABLES = [
  { key: "auditLog", table: auditLog, column: "userId" },
  { key: "sessions", table: sessions, column: "sid" },
  { key: "webhookEvents", table: webhookEvents, column: null },
  { key: "publishingEvents", table: publishingEvents, column: null },
  { key: "agentDecisions", table: agentDecisions, column: null },
  { key: "leads", table: leads, column: "email" },
  { key: "invites", table: invites, column: "email" },
  { key: "newsletterSubscribers", table: newsletterSubscribers, column: "email" },
  { key: "users", table: users, column: "id" },
];

export const EXPORT_TABLES = [
  ...DELETE_TABLES,
  { key: "sharedReflections", table: sharedReflections, column: "userId" },
  { key: "communityAffirmations", table: communityAffirmations, column: "userId" },
  { key: "blogComments", table: blogComments, column: "userId" },
];
