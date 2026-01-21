*** Begin Patch
*** Add File: server/lib/authErrors.mjs
+/**
+ * Auth errors are intentionally uniform to prevent credential-stuffing oracles.
+ */
+export const AUTH_INVALID_MESSAGE = "Invalid credentials";
+
+export class AuthError extends Error {
+  /**
+   * @param {string} message
+   * @param {number} status
+   */
+  constructor(message = AUTH_INVALID_MESSAGE, status = 401) {
+    super(message);
+    this.name = "AuthError";
+    this.status = status;
+  }
+}
+
+/**
+ * Always respond with the same message for auth failures.
+ * @param {import("express").Response} res
+ * @param {number} [status=401]
+ */
+export function sendUniformAuthFailure(res, status = 401) {
+  return res.status(status).json({ message: AUTH_INVALID_MESSAGE });
+}
+

*** End Patch
*** Begin Patch
*** Add File: server/middleware/requireRole.mjs
+/**
+ * Must be used AFTER requireAuth.
+ * Returns 403 when authenticated-but-not-authorized.
+ * @param {string[]} roles
+ */
+export function requireRole(...roles) {
+  return (req, res, next) => {
+    const user = req.user;
+    if (!user) return res.status(401).json({ message: "Invalid credentials" });
+
+    const role = user.role || "user";
+    if (!roles.includes(role)) return res.status(403).json({ message: "Forbidden" });
+
+    return next();
+  };
+}
+
*** End Patch
*** Begin Patch
*** Add File: server/middleware/loginRateLimit.mjs
+import { sendUniformAuthFailure } from "../lib/authErrors.mjs";
+
+/**
+ * Minimal in-memory rate limiter (per-IP).
+ * Keeps enforcement but does not reveal rate-limit state in response body.
+ *
+ * NOTE: For production, replace with Redis-backed limiter.
+ */
+const attempts = new Map(); // ip -> { count, firstAt, blockedUntil }
+
+function nowMs() {
+  return Date.now();
+}
+
+/**
+ * @param {{ windowMs?: number, max?: number, blockMs?: number }} opts
+ */
+export function loginRateLimit(opts = {}) {
+  const windowMs = opts.windowMs ?? 15 * 60 * 1000;
+  const max = opts.max ?? 5;
+  const blockMs = opts.blockMs ?? 15 * 60 * 1000;
+
+  return (req, res, next) => {
+    const ip = req.ip || req.headers["x-forwarded-for"] || "unknown";
+    const entry = attempts.get(ip) || { count: 0, firstAt: nowMs(), blockedUntil: 0 };
+    const t = nowMs();
+
+    if (entry.blockedUntil && t < entry.blockedUntil) {
+      // Don’t leak rate-limit status via message body.
+      const retryAfterSec = Math.ceil((entry.blockedUntil - t) / 1000);
+      res.setHeader("Retry-After", String(retryAfterSec));
+      return sendUniformAuthFailure(res, 401);
+    }
+
+    // Reset window
+    if (t - entry.firstAt > windowMs) {
+      entry.count = 0;
+      entry.firstAt = t;
+      entry.blockedUntil = 0;
+    }
+
+    entry.count += 1;
+    if (entry.count > max) {
+      entry.blockedUntil = t + blockMs;
+      const retryAfterSec = Math.ceil(blockMs / 1000);
+      res.setHeader("Retry-After", String(retryAfterSec));
+      attempts.set(ip, entry);
+      return sendUniformAuthFailure(res, 401);
+    }
+
+    attempts.set(ip, entry);
+    return next();
+  };
+}
+
*** End Patch
*** Begin Patch
*** Update File: server/routes/auth.mjs
@@
+import { AUTH_INVALID_MESSAGE, sendUniformAuthFailure } from "../lib/authErrors.mjs";
+import { loginRateLimit } from "../middleware/loginRateLimit.mjs";
+import { findUserByEmail, verifyPassword } from "../services/users.mjs";
+import { issueAccessToken } from "../services/tokens.mjs";
+
+// Ensure limiter applies only to login endpoint.
+router.post("/login", loginRateLimit({ max: 5 }), async (req, res) => {
+  const { email, password } = req.body || {};
+
+  // Uniform failures for missing fields too (per your tests/security posture)
+  if (!email || !password) return sendUniformAuthFailure(res, 401);
+
+  const user = await findUserByEmail(String(email).toLowerCase());
+  if (!user) return sendUniformAuthFailure(res, 401);
+
+  const ok = await verifyPassword(user, String(password));
+  if (!ok) return sendUniformAuthFailure(res, 401);
+
+  const token = issueAccessToken({
+    id: user.id,
+    email: user.email,
+    role: user.role || "user",
+    name: user.name,
+  });
+
+  return res.status(200).json({
+    message: "Login successful",
+    token,
+    user: { id: user.id, email: user.email, name: user.name, role: user.role || "user" },
+  });
+});
+
*** End Patch
*** Begin Patch
*** Update File: server/routes/admin.mjs
@@
+import { requireAuth } from "../middleware/requireAuth.mjs";
+import { requireRole } from "../middleware/requireRole.mjs";
+
+// Order matters: 401 if no/invalid token, 403 if non-admin.
+router.use(requireAuth);
+router.use(requireRole("admin"));
+
+router.get("/health", (req, res) => {
+  res.json({ ok: true });
+});
+
*** End Patch
*** Begin Patch
*** Update File: shared/disclaimer.mjs
@@
-return "Some disclaimer text...";
+/**
+ * Export a value/function instead of using an illegal top-level return.
+ */
+export const DISCLAIMER_TEXT = "Some disclaimer text...";
+
+export function getDisclaimerText() {
+  return DISCLAIMER_TEXT;
+}
+
*** End Patch
*** Begin Patch
*** Update File: client/src/lib/mode.js
@@
-{
-}
+// ESLint no-empty: remove empty block or add intentional marker.
+void 0;
+
*** End Patch