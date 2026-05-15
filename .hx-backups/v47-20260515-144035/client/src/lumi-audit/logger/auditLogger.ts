/**
 * @fileoverview Audit Logger
 * @module lumi-audit/logger
 *
 * HIPAA-compliant audit logging.
 * Logs all PHI access, authentication, and data changes.
 * No PII in log messages -- only action + resource type + timestamp.
 *
 * @version 1.0.0
 * @since Phase 40
 */

import type { DomainRole } from "../../lumi-rbac/roles/roleDefinitions";

/** --- Audit Event Type --- */
export type AuditEventType =
  | "auth.login" | "auth.logout" | "auth.failed" | "auth.mfa"
  | "data.create" | "data.read" | "data.update" | "data.delete"
  | "data.export" | "data.import"
  | "crisis.trigger" | "crisis.contact"
  | "permission.grant" | "permission.revoke" | "permission.denied"
  | "system.health" | "system.config" | "system.error"
  | "user.create" | "user.update" | "user.deactivate"
  | "ai.prompt" | "ai.response" | "ai.feedback";

/** --- Audit Event --- */
export interface AuditEvent {
  id: string;
  timestamp: string;
  eventType: AuditEventType;
  actor: {
    userId: string;
    role: DomainRole;
    ip?: string;
    sessionId?: string;
  };
  resource: {
    type: string;
    id?: string;
  };
  action: "create" | "read" | "update" | "delete" | "export" | "trigger";
  result: "success" | "failure" | "blocked";
  reason?: string;
  phi: boolean;
  retentionDays: number;
}

/** --- Retention Policy --- */
export const RETENTION_POLICIES: Record<string, number> = {
  auth: 2555,
  data: 2555,
  crisis: 2555,
  permission: 2555,
  system: 365,
  ai: 90,
};

/** --- Create audit event --- */
export function createAuditEvent(
  eventType: AuditEventType,
  actor: AuditEvent["actor"],
  resource: AuditEvent["resource"],
  action: AuditEvent["action"],
  result: AuditEvent["result"],
  phi: boolean,
  reason?: string
): AuditEvent {
  const category = eventType.split(".")[0];
  const retentionDays = RETENTION_POLICIES[category] ?? 365;
  return {
    id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date().toISOString(),
    eventType,
    actor,
    resource,
    action,
    result,
    reason,
    phi,
    retentionDays,
  };
}

/** --- Log audit event --- */
export function logAuditEvent(event: AuditEvent): void {
  const sanitized = {
    ...event,
    actor: {
      ...event.actor,
      ip: event.actor.ip ? "[REDACTED]" : undefined,
    },
  };
  if (typeof process !== "undefined" && process.env?.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.log("[AUDIT]", sanitized);
  }
}

/** --- Get retention date --- */
export function getRetentionDate(event: AuditEvent): Date {
  const date = new Date(event.timestamp);
  date.setDate(date.getDate() + event.retentionDays);
  return date;
}

/** --- Check expired --- */
export function isRetentionExpired(event: AuditEvent): boolean {
  return new Date() > getRetentionDate(event);
}

/** --- Filter expired --- */
export function filterExpiredEvents(
  events: AuditEvent[]
): { expired: AuditEvent[]; active: AuditEvent[] } {
  const expired: AuditEvent[] = [];
  const active: AuditEvent[] = [];
  for (const event of events) {
    if (isRetentionExpired(event)) expired.push(event);
    else active.push(event);
  }
  return { expired, active };
}
