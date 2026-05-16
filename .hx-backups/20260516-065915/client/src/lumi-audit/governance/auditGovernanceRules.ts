/**
 * @fileoverview Audit Governance Rules
 * @module lumi-audit/governance
 *
 * @version 1.0.0
 * @since Phase 40
 */

export const AUDIT_GOVERNANCE_RULES = [
  "Every PHI access MUST be logged -- read, create, update, delete.",
  "Every authentication event MUST be logged -- login, logout, failure, MFA.",
  "Every permission denial MUST be logged for security review.",
  "Audit logs MUST NOT contain: passwords, tokens, PHI content, SSN, DOB, addresses.",
  "Audit logs MUST contain: actor ID, role, action, resource type, timestamp, result.",
  "Audit logs MUST be tamper-proof (append-only, signed).",
  "Audit log retention: 7 years for auth/crisis/PHI, 90 days for AI prompts.",
  "Audit logs MUST be exportable by admin role only.",
  "Audit log deletion MUST require dual authorization.",
  "Failed login attempts MUST trigger alert after 5 attempts.",
  "Crisis interactions MUST be logged but with NO user-identifiable information.",
  "All audit log access itself MUST be logged (meta-audit).",
] as const;

export const AUDIT_DATA_CLASSIFICATIONS = {
  auth: { retentionDays: 2555, phi: false },
  data: { retentionDays: 2555, phi: true },
  crisis: { retentionDays: 2555, phi: false },
  permission: { retentionDays: 2555, phi: false },
  system: { retentionDays: 365, phi: false },
  ai: { retentionDays: 90, phi: true },
} as const;

if (AUDIT_GOVERNANCE_RULES.length < 12) {
  throw new Error(
    `[lumi-audit] AUDIT_GOVERNANCE_RULES floor violated: expected >=12, got ${AUDIT_GOVERNANCE_RULES.length}`
  );
}
