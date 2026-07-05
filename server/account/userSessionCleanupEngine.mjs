// server/account/userSessionCleanupEngine.mjs
// Track E6N — session/token/cookie cleanup skeleton only.
// Not wired into account deletion route yet.

export const USER_SESSION_CLEANUP_ENGINE_STATUS = {
  track: "E6N",
  status: "skeleton-not-wired",
  rule: "Do not execute session cleanup from account route until session revocation policy is approved.",
};

export function getSessionCleanupPlan() {
  return [
    { key: "refreshTokens", action: "revoke-or-delete", status: "policy-review" },
    { key: "sessions", action: "destroy-user-sessions", status: "policy-review" },
    { key: "cookies", action: "clear-auth-cookies", status: "policy-review" },
  ];
}

export async function cleanupUserSessionsDraftOnly() {
  throw new Error(
    "cleanupUserSessionsDraftOnly is not wired or executable yet. Approval gate required."
  );
}
