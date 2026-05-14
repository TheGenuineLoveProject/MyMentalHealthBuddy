/**
 * @fileoverview Notification Service
 * @module lumi-notifications/push
 *
 * Push, email, and SMS notification system.
 * All channels opt-in. All channels revocable.
 * No marketing notifications.
 *
 * @version 1.0.0
 * @since Phase 38
 */

/** --- Notification Channel --- */
export type NotificationChannel = "push" | "email" | "sms";

/** --- Notification Type --- */
export type NotificationType =
  | "reminder"
  | "crisis-followup"
  | "achievement"
  | "system"
  | "emergency";

/** --- Notification --- */
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  channel: NotificationChannel;
  title: string;
  body: string;
  actionUrl?: string;
  scheduledAt?: string;
  sentAt?: string;
  readAt?: string;
  dismissedAt?: string;
}

/** --- Notification Preferences --- */
export interface NotificationPreferences {
  push: { enabled: boolean; types: NotificationType[] };
  email: { enabled: boolean; types: NotificationType[] };
  sms: { enabled: boolean; types: NotificationType[] };
  quietHours: [number, number] | null;
  timezone: string;
}

export const DEFAULT_PREFERENCES: NotificationPreferences = {
  push: { enabled: false, types: ["reminder", "crisis-followup"] },
  email: { enabled: false, types: ["reminder", "achievement"] },
  sms: { enabled: false, types: ["crisis-followup", "emergency"] },
  quietHours: [22, 7],
  timezone: "America/New_York",
};

/** --- Create notification --- */
export function createNotification(
  userId: string,
  type: NotificationType,
  channel: NotificationChannel,
  title: string,
  body: string,
  extras?: Partial<Notification>
): Notification {
  return {
    id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    userId,
    type,
    channel,
    title,
    body,
    ...extras,
  };
}

/** --- Templates --- */
export const NOTIFICATION_TEMPLATES: Record<string, { title: string; body: string }> = {
  "check-in-reminder": {
    title: "A gentle check-in",
    body: "How are you feeling today? A moment with Lumi might help.",
  },
  "breathing-reminder": {
    title: "Take a breath",
    body: "A short breathing exercise is ready when you are.",
  },
  "crisis-followup": {
    title: "Checking in on you",
    body: "We hope you're doing okay. Lumi is here if you need to talk.",
  },
  "milestone-quiet": {
    title: "A gentle milestone",
    body: "You've been checking in with Lumi. Thank you for trusting this space.",
  },
};

/** --- Schedule notification --- */
export function scheduleNotification(notification: Notification, at: Date): Notification {
  return { ...notification, scheduledAt: at.toISOString() };
}

/** --- Check quiet hours --- */
export function isInQuietHours(
  preferences: NotificationPreferences,
  checkTime: Date = new Date()
): boolean {
  if (!preferences.quietHours) return false;
  const [start, end] = preferences.quietHours;
  const hour = checkTime.getHours();
  if (start < end) return hour >= start && hour < end;
  return hour >= start || hour < end;
}

/** --- Check if allowed --- */
export function isNotificationAllowed(
  preferences: NotificationPreferences,
  type: NotificationType,
  channel: NotificationChannel
): boolean {
  const channelPrefs = preferences[channel];
  if (!channelPrefs.enabled) return false;
  if (!channelPrefs.types.includes(type)) return false;
  if (isInQuietHours(preferences)) return false;
  return true;
}

/** --- Mark as read --- */
export function markNotificationRead(notification: Notification): Notification {
  return { ...notification, readAt: new Date().toISOString() };
}

/** --- Dismiss --- */
export function dismissNotification(notification: Notification): Notification {
  return { ...notification, dismissedAt: new Date().toISOString() };
}
