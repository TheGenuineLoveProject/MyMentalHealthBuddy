import { db } from "../db/client.mjs";
import { auditLog } from "../../shared/schema.mjs";
import { logger } from "../utils/logger.mjs";

export async function logAudit({
  userId = null,
  action,
  resourceType = null,
  resourceId = null,
  metadata = null,
  ipAddress = null,
  userAgent = null,
}) {
  try {
    await db.insert(auditLog).values({
      userId,
      action,
      resourceType,
      resourceId,
      metadata: metadata ? JSON.stringify(metadata) : null,
      ipAddress,
      userAgent: userAgent?.substring(0, 500),
    });
  } catch (err) {
    logger.error("Audit log insert failed", { error: err?.message });
  }
}

export function getClientIp(req) {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.socket?.remoteAddress ||
    null
  );
}

export const AUDIT_ACTIONS = {
  LOGIN_SUCCESS: "auth.login.success",
  LOGIN_FAILED: "auth.login.failed",
  LOGOUT: "auth.logout",
  REGISTER: "auth.register",
  PASSWORD_RESET_REQUEST: "auth.password_reset.request",
  PASSWORD_RESET_COMPLETE: "auth.password_reset.complete",
  ADMIN_ACCESS: "admin.access",
  ADMIN_ACTION: "admin.action",
  ROLE_CHANGE: "admin.role_change",
  USER_DELETE: "admin.user_delete",
  SUBSCRIPTION_CHANGE: "billing.subscription_change",
};
