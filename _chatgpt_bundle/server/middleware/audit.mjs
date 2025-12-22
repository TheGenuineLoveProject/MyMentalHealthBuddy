import { writeAudit } from "../security/audit.mjs";

export function auditMiddleware(req, res, next) {
  const start = Date.now();

  res.on("finish", () => {
    const userId = req.user?.sub || null;

    // Only log API calls (keeps noise down)
    if (!req.originalUrl?.startsWith("/api/")) return;

    writeAudit({
      userId,
      ip: req.headers["x-forwarded-for"]?.toString()?.split(",")[0]?.trim() || req.socket.remoteAddress,
      userAgent: req.headers["user-agent"] || null,
      action: "API_REQUEST",
      route: req.originalUrl,
      method: req.method,
      statusCode: res.statusCode,
      meta: {
        durationMs: Date.now() - start,
      },
    });
  });

  next();
}