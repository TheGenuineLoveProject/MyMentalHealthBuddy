// server/utils/auditLogger.mjs
// Audit logging for security-sensitive operations

import { randomUUID } from "crypto";
import { db } from "../db/connection.mjs";
import { auditLog } from "../db/schema.mjs";
import { logger } from "../middleware/requestId.mjs";

export const AuditActions = {
  LOGIN_SUCCESS: "login_success",
  LOGIN_FAILED: "login_failed",
  LOGOUT: "logout",
  REGISTER: "register",
  PASSWORD_RESET_REQUEST: "password_reset_request",
  PASSWORD_RESET_COMPLETE: "password_reset_complete",
  PASSWORD_CHANGE: "password_change",
  ACCOUNT_DELETE: "account_delete",
  DATA_EXPORT: "data_export",
  AI_CHAT: "ai_chat",
  MOOD_CREATE: "mood_create",
  MOOD_UPDATE: "mood_update",
  MOOD_DELETE: "mood_delete",
  JOURNAL_CREATE: "journal_create",
  JOURNAL_UPDATE: "journal_update",
  JOURNAL_DELETE: "journal_delete",
  RATE_LIMIT_HIT: "rate_limit_hit",
  SUSPICIOUS_ACTIVITY: "suspicious_activity",
};

export async function logAuditEvent({
  userId = null,
  action,
  resourceType = null,
  resourceId = null,
  metadata = null,
  req = null,
}) {
  try {
    const ipAddress = req ? getClientIp(req) : null;
    const userAgent = req?.headers?.["user-agent"]?.substring(0, 500) || null;

    await db.insert(auditLog).values({
      id: randomUUID(),
      userId,
      action,
      resourceType,
      resourceId,
      metadata: metadata ? JSON.stringify(metadata) : null,
      ipAddress,
      userAgent,
    });

    logger.info("Audit event logged", {
      action,
      userId,
      resourceType,
      resourceId,
    });
  } catch (error) {
    logger.error("Failed to log audit event", {
      error: error.message,
      action,
      userId,
    });
  }
}

function getClientIp(req) {
  const forwardedFor = req.headers["x-forwarded-for"];
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return req.ip || req.connection?.remoteAddress || null;
}

export default { logAuditEvent, AuditActions };
