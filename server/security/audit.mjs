import db from "../db/client.mjs";
import { logger } from "../utils/logger.mjs";

export async function audit(req, action, meta = {}) {
  try {
    const userId = req.user?.id ?? null;
    const ip = req.headers["x-forwarded-for"]?.toString()?.split(",")[0]?.trim() || req.socket?.remoteAddress || null;
    const ua = req.headers["user-agent"] || null;

    await db.execute(
      `INSERT INTO audit_logs (user_id, action, ip, user_agent, meta)
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, action, ip, ua, JSON.stringify(meta)]
    );
  } catch (err) {
    logger.warn("[Audit] Audit log write failed (non-blocking)", { action, error: err?.message || err });
  }
}