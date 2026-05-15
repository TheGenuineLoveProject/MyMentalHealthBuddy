/**
 * @fileoverview Lumi Notifications -- Barrel Export
 * @module lumi-notifications
 *
 * @version 1.0.0
 * @since Phase 38
 */

export {
  type NotificationChannel,
  type NotificationType,
  type Notification,
  type NotificationPreferences,
  DEFAULT_PREFERENCES,
  createNotification,
  NOTIFICATION_TEMPLATES,
  scheduleNotification,
  isInQuietHours,
  isNotificationAllowed,
  markNotificationRead,
  dismissNotification,
} from "./push/notificationService";

export {
  NOTIFICATION_RULES,
  FORBIDDEN_NOTIFICATION_CONTENT,
} from "./governance/notificationRules";
