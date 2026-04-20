import rateLimit from "express-rate-limit";

function keyByAdmin(req) {
  return req.user?.id || req.user?.email || req.ip;
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
