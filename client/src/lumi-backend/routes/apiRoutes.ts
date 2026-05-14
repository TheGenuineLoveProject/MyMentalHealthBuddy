/**
 * @fileoverview API Routes Specification
 * @module lumi-backend/routes
 *
 * All backend routes for MyMentalHealthBuddy.
 * Routes are organized by domain (auth, user, therapy, crisis, etc.)
 *
 * @version 1.0.0
 * @since Phase 37
 */

import { API_CONFIG } from "../config/apiConfig";

/** --- Route Definition --- */
export interface ApiRoute {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  description: string;
  auth: boolean;
  rateLimit: "global" | "auth" | "api" | "crisis";
  hipaa?: boolean;
  body?: Record<string, string>;
  response?: Record<string, string>;
}

/** --- Auth Routes --- */
export const AUTH_ROUTES: ApiRoute[] = [
  { method: "POST", path: `${API_CONFIG.basePath}/auth/register`, description: "Register new user account", auth: false, rateLimit: "auth" },
  { method: "POST", path: `${API_CONFIG.basePath}/auth/login`, description: "User login (email/password)", auth: false, rateLimit: "auth" },
  { method: "POST", path: `${API_CONFIG.basePath}/auth/refresh`, description: "Refresh JWT access token", auth: false, rateLimit: "auth" },
  { method: "POST", path: `${API_CONFIG.basePath}/auth/logout`, description: "Logout and invalidate tokens", auth: true, rateLimit: "global" },
  { method: "POST", path: `${API_CONFIG.basePath}/auth/mfa/enable`, description: "Enable multi-factor authentication", auth: true, rateLimit: "auth" },
  { method: "POST", path: `${API_CONFIG.basePath}/auth/mfa/verify`, description: "Verify MFA code", auth: false, rateLimit: "auth" },
];

/** --- User Routes --- */
export const USER_ROUTES: ApiRoute[] = [
  { method: "GET", path: `${API_CONFIG.basePath}/user/profile`, description: "Get current user profile", auth: true, rateLimit: "api", hipaa: true },
  { method: "PUT", path: `${API_CONFIG.basePath}/user/profile`, description: "Update user profile", auth: true, rateLimit: "api", hipaa: true },
  { method: "DELETE", path: `${API_CONFIG.basePath}/user/account`, description: "Delete account and all data (GDPR)", auth: true, rateLimit: "api", hipaa: true },
  { method: "GET", path: `${API_CONFIG.basePath}/user/export`, description: "Export all user data (GDPR data portability)", auth: true, rateLimit: "api", hipaa: true },
  { method: "POST", path: `${API_CONFIG.basePath}/user/preferences`, description: "Update notification and privacy preferences", auth: true, rateLimit: "api" },
];

/** --- Mood & Tracker Routes --- */
export const TRACKER_ROUTES: ApiRoute[] = [
  { method: "POST", path: `${API_CONFIG.basePath}/mood`, description: "Submit mood entry", auth: true, rateLimit: "api", hipaa: true, body: { level: "number 1-5", note: "string?", emotions: "array?", triggers: "array?" } },
  { method: "GET", path: `${API_CONFIG.basePath}/mood`, description: "Get mood history", auth: true, rateLimit: "api", hipaa: true },
  { method: "POST", path: `${API_CONFIG.basePath}/mood/analyze`, description: "Analyze mood trends and patterns", auth: true, rateLimit: "api", hipaa: true },
  { method: "POST", path: `${API_CONFIG.basePath}/habits`, description: "Create new habit", auth: true, rateLimit: "api" },
  { method: "POST", path: `${API_CONFIG.basePath}/habits/:id/log`, description: "Log habit completion", auth: true, rateLimit: "api" },
  { method: "GET", path: `${API_CONFIG.basePath}/habits/:id/stats`, description: "Get habit statistics", auth: true, rateLimit: "api" },
];

/** --- CBT & Therapy Routes --- */
export const THERAPY_ROUTES: ApiRoute[] = [
  { method: "POST", path: `${API_CONFIG.basePath}/therapy/cbt/thought-record`, description: "Submit thought record", auth: true, rateLimit: "api", hipaa: true },
  { method: "GET", path: `${API_CONFIG.basePath}/therapy/cbt/thought-records`, description: "Get thought record history", auth: true, rateLimit: "api", hipaa: true },
  { method: "POST", path: `${API_CONFIG.basePath}/therapy/cbt/behavioral-activation`, description: "Submit behavioral activation schedule", auth: true, rateLimit: "api", hipaa: true },
  { method: "POST", path: `${API_CONFIG.basePath}/therapy/breathing`, description: "Start breathing exercise session", auth: true, rateLimit: "api" },
  { method: "POST", path: `${API_CONFIG.basePath}/therapy/breathing/:id/complete`, description: "Complete breathing exercise", auth: true, rateLimit: "api" },
  { method: "GET", path: `${API_CONFIG.basePath}/therapy/progress`, description: "Get overall therapy progress", auth: true, rateLimit: "api", hipaa: true },
  { method: "POST", path: `${API_CONFIG.basePath}/therapy/journal`, description: "Submit journal entry", auth: true, rateLimit: "api", hipaa: true },
  { method: "GET", path: `${API_CONFIG.basePath}/therapy/journal`, description: "Get journal entries", auth: true, rateLimit: "api", hipaa: true },
];

/** --- AI Agent Routes --- */
export const AGENT_ROUTES: ApiRoute[] = [
  { method: "POST", path: `${API_CONFIG.basePath}/ai/chat`, description: "Send message to Lumi AI agent", auth: true, rateLimit: "api", hipaa: true, body: { message: "string", conversationId: "string?" }, response: { response: "string", messageId: "string", crisisDetected: "boolean" } },
  { method: "POST", path: `${API_CONFIG.basePath}/ai/chat/:id/feedback`, description: "Rate AI response helpfulness", auth: true, rateLimit: "api" },
  { method: "GET", path: `${API_CONFIG.basePath}/ai/chat/history`, description: "Get conversation history", auth: true, rateLimit: "api", hipaa: true },
  { method: "DELETE", path: `${API_CONFIG.basePath}/ai/chat/history`, description: "Delete all conversation history", auth: true, rateLimit: "api", hipaa: true },
];

/** --- Crisis Routes --- */
export const CRISIS_ROUTES: ApiRoute[] = [
  { method: "GET", path: `${API_CONFIG.basePath}/crisis/resources`, description: "Get crisis resources (no auth required)", auth: false, rateLimit: "crisis" },
  { method: "POST", path: `${API_CONFIG.basePath}/crisis/detect`, description: "Detect crisis indicators in text", auth: false, rateLimit: "crisis" },
  { method: "POST", path: `${API_CONFIG.basePath}/crisis/contact`, description: "Log crisis contact attempt (no PII stored)", auth: false, rateLimit: "crisis", hipaa: false },
];

/** --- Notification Routes --- */
export const NOTIFICATION_ROUTES: ApiRoute[] = [
  { method: "POST", path: `${API_CONFIG.basePath}/notifications/preferences`, description: "Update notification preferences", auth: true, rateLimit: "api" },
  { method: "GET", path: `${API_CONFIG.basePath}/notifications`, description: "Get pending notifications", auth: true, rateLimit: "api" },
  { method: "POST", path: `${API_CONFIG.basePath}/notifications/test`, description: "Send test notification", auth: true, rateLimit: "api" },
  { method: "DELETE", path: `${API_CONFIG.basePath}/notifications/:id`, description: "Dismiss notification", auth: true, rateLimit: "api" },
];

/** --- Library Routes --- */
export const LIBRARY_ROUTES: ApiRoute[] = [
  { method: "GET", path: `${API_CONFIG.basePath}/library`, description: "Get library catalog", auth: false, rateLimit: "global" },
  { method: "GET", path: `${API_CONFIG.basePath}/library/:id/download`, description: "Download library item", auth: false, rateLimit: "global" },
];

/** --- Health Check --- */
export const HEALTH_ROUTE: ApiRoute = {
  method: "GET",
  path: "/health",
  description: "Health check endpoint (no auth)",
  auth: false,
  rateLimit: "global",
};

/** --- All Routes --- */
export const ALL_ROUTES: ApiRoute[] = [
  ...AUTH_ROUTES,
  ...USER_ROUTES,
  ...TRACKER_ROUTES,
  ...THERAPY_ROUTES,
  ...AGENT_ROUTES,
  ...CRISIS_ROUTES,
  ...NOTIFICATION_ROUTES,
  ...LIBRARY_ROUTES,
  HEALTH_ROUTE,
];

/** --- Route Statistics --- */
export function getRouteStats(): {
  total: number;
  authRequired: number;
  public: number;
  hipaaProtected: number;
} {
  const total = ALL_ROUTES.length;
  const authRequired = ALL_ROUTES.filter((r) => r.auth).length;
  const hipaaProtected = ALL_ROUTES.filter((r) => r.hipaa).length;
  return {
    total,
    authRequired,
    public: total - authRequired,
    hipaaProtected,
  };
}
