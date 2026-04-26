import rateLimit, { ipKeyGenerator } from "express-rate-limit";

// Per-admin key with safe IPv6 fallback. Authenticated admins are keyed by
// stable identity (id → email); unauthenticated requests fall back to an IPv6-
// normalised IP key via ipKeyGenerator (the express-rate-limit v7 helper that
// collapses an IPv6 address to its /64 prefix so a malicious client cannot
// rotate the last 64 bits to bypass per-IP limits — see ERR_ERL_KEY_GEN_IPV6).
function keyByAdmin(req) {
  if (req.user?.id) return `admin:id:${req.user.id}`;
  if (req.user?.email) return `admin:email:${req.user.email}`;
  return `admin:ip:${ipKeyGenerator(req.ip)}`;
}

function jsonHandler(message) {
  return (_req, res) => res.status(429).json({ ok: false, error: message });
}

export const adminAiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: keyByAdmin,
  handler: jsonHandler("Rate limit reached for admin AI generation. Try again shortly."),
});

export const adminImageLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: keyByAdmin,
  handler: jsonHandler("Hourly image-generation limit reached for this admin."),
});

export const adminBulkLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: keyByAdmin,
  handler: jsonHandler("Bulk-action rate limit reached. Try again shortly."),
});
