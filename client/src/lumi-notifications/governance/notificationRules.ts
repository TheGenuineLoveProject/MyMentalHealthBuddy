/**
 * @fileoverview Notification Governance Rules
 * @module lumi-notifications/governance
 *
 * @version 1.0.0
 * @since Phase 38
 */

export const NOTIFICATION_RULES = [
  "All notification channels are OPT-IN (default: OFF).",
  "User can disable any channel at any time -- no confirmation required.",
  "Quiet hours: 10pm-7am by default. No notifications sent during quiet hours.",
  "No marketing or promotional notifications. Ever.",
  "No 'X days in a row' streak notifications.",
  "No 'Don't miss out' or FOMO language.",
  "Maximum 3 reminder notifications per day.",
  "Crisis follow-ups: max 1 per 48 hours, gentle tone only.",
  "Achievement notifications: max 1 per week, no celebration language.",
  "System notifications: account/security only, no feature announcements.",
  "All notification content reviewed for tone before sending.",
  "User can export notification history.",
  "Notification data auto-deleted after 90 days.",
  "SMS: only for crisis follow-up and true emergencies.",
  "Email: never include PHI in subject line or preview text.",
  "Push: never include PHI in notification text -- use generic prompts only.",
] as const;

export const FORBIDDEN_NOTIFICATION_CONTENT = [
  "Streak notifications",
  "Gamification badges",
  "Points/levels announcements",
  "Marketing messages",
  "Urgency language (hurry, limited time)",
  "Social comparison",
  "Leaderboard updates",
  "App store reviews requests",
  "Premium upgrade pushes",
  "Daily motivational quotes",
] as const;

if (NOTIFICATION_RULES.length < 16) {
  throw new Error(
    `[lumi-notifications] NOTIFICATION_RULES floor violated: expected >=16, got ${NOTIFICATION_RULES.length}`
  );
}
if (FORBIDDEN_NOTIFICATION_CONTENT.length < 10) {
  throw new Error(
    `[lumi-notifications] FORBIDDEN_NOTIFICATION_CONTENT floor violated: expected >=10, got ${FORBIDDEN_NOTIFICATION_CONTENT.length}`
  );
}
