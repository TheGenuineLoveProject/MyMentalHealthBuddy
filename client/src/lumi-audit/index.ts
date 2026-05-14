/**
 * @fileoverview Lumi Audit -- Barrel Export
 * @module lumi-audit
 *
 * HIPAA-compliant audit logging.
 *
 * @version 1.0.0
 * @since Phase 40
 */

export {
  type AuditEventType,
  type AuditEvent,
  RETENTION_POLICIES,
  createAuditEvent,
  logAuditEvent,
  getRetentionDate,
  isRetentionExpired,
  filterExpiredEvents,
} from "./logger/auditLogger";

export {
  AUDIT_GOVERNANCE_RULES,
  AUDIT_DATA_CLASSIFICATIONS,
} from "./governance/auditGovernanceRules";
