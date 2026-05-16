/**
 * @fileoverview RBAC Middleware Specification
 * @module lumi-rbac/middleware
 *
 * Permission checking middleware for Express.
 * These are specs -- actual Express middleware uses these configs.
 *
 * @version 1.0.0
 * @since Phase 39
 */

import type { DomainRole, Permission } from "../roles/roleDefinitions";
import { canAccess } from "../roles/roleDefinitions";

/** --- RBAC Middleware Spec --- */
export interface RBACSpec {
  roleSource: "jwt";
  roleClaim: "role";
  defaultRole: "user";
  enforceOwnership: true;
  enforceTherapistClient: true;
  enforceFamilyRelationship: true;
  failClosed: true;
  logDenials: true;
  genericDenialMessage: "Access denied";
}

export const RBAC_SPEC: RBACSpec = {
  roleSource: "jwt",
  roleClaim: "role",
  defaultRole: "user",
  enforceOwnership: true,
  enforceTherapistClient: true,
  enforceFamilyRelationship: true,
  failClosed: true,
  logDenials: true,
  genericDenialMessage: "Access denied",
};

/** --- Permission Check Result --- */
export interface PermissionCheck {
  allowed: boolean;
  role: DomainRole;
  permission: Permission;
  reason?: string;
}

/** --- Check permission --- */
export function checkPermission(
  role: DomainRole,
  permission: Permission,
  resourceOwnerId?: string,
  currentUserId?: string
): PermissionCheck {
  const allowed = canAccess(role, permission, resourceOwnerId, currentUserId);
  return {
    allowed,
    role,
    permission,
    reason: allowed ? undefined : `Role "${role}" does not have permission "${permission}"`,
  };
}

/** --- Route protection spec --- */
export interface RouteProtection {
  path: string;
  method: string;
  requiredPermission: Permission;
  requiresOwnership?: true;
}

/** --- Route protection map --- */
export const PROTECTED_ROUTES: RouteProtection[] = [
  { path: "/api/v1/mood", method: "POST", requiredPermission: "mood:create" },
  { path: "/api/v1/mood", method: "GET", requiredPermission: "mood:read", requiresOwnership: true },
  { path: "/api/v1/mood/:id", method: "DELETE", requiredPermission: "mood:delete", requiresOwnership: true },
  { path: "/api/v1/therapy/journal", method: "POST", requiredPermission: "journal:create" },
  { path: "/api/v1/therapy/journal", method: "GET", requiredPermission: "journal:read", requiresOwnership: true },
  { path: "/api/v1/therapy/cbt/thought-record", method: "POST", requiredPermission: "cbt:create" },
  { path: "/api/v1/therapy/cbt/thought-records", method: "GET", requiredPermission: "cbt:read", requiresOwnership: true },
  { path: "/api/v1/ai/chat", method: "POST", requiredPermission: "ai:chat" },
  { path: "/api/v1/ai/chat/history", method: "GET", requiredPermission: "ai:history:read", requiresOwnership: true },
  { path: "/api/v1/ai/chat/history", method: "DELETE", requiredPermission: "ai:history:delete", requiresOwnership: true },
  { path: "/api/v1/user/profile", method: "GET", requiredPermission: "profile:read", requiresOwnership: true },
  { path: "/api/v1/user/profile", method: "PUT", requiredPermission: "profile:update", requiresOwnership: true },
  { path: "/api/v1/user/account", method: "DELETE", requiredPermission: "profile:delete", requiresOwnership: true },
];

/** --- Get required permission for route --- */
export function getRoutePermission(path: string, method: string): RouteProtection | undefined {
  return PROTECTED_ROUTES.find((r) => r.path === path && r.method === method);
}
