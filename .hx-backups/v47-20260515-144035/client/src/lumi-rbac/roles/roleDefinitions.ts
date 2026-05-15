/**
 * @fileoverview Role Definitions
 * @module lumi-rbac/roles
 *
 * Role-Based Access Control for MyMentalHealthBuddy.
 * 4 domains: User, Therapist, Family, Admin.
 *
 * @version 1.0.0
 * @since Phase 39
 */

/** --- Domain Roles --- */
export type DomainRole = "user" | "therapist" | "family" | "admin";

/** --- Permission --- */
export type Permission =
  | "mood:create" | "mood:read" | "mood:delete"
  | "journal:create" | "journal:read" | "journal:delete"
  | "cbt:create" | "cbt:read" | "cbt:delete"
  | "breathing:start" | "breathing:complete"
  | "ai:chat" | "ai:history:read" | "ai:history:delete"
  | "profile:read" | "profile:update" | "profile:delete"
  | "settings:read" | "settings:update"
  | "notifications:read" | "notifications:update"
  | "library:read" | "library:download"
  | "client:read" | "client:notes:create" | "client:notes:read"
  | "client:progress:read"
  | "appointment:create" | "appointment:read" | "appointment:update"
  | "family:member:read" | "family:member:check-in"
  | "family:wellness:read"
  | "user:read" | "user:update" | "user:deactivate"
  | "content:manage" | "analytics:read"
  | "system:config" | "system:health"
  | "audit:read";

/** --- Role Permissions --- */
export const ROLE_PERMISSIONS: Record<DomainRole, Permission[]> = {
  user: [
    "mood:create", "mood:read", "mood:delete",
    "journal:create", "journal:read", "journal:delete",
    "cbt:create", "cbt:read", "cbt:delete",
    "breathing:start", "breathing:complete",
    "ai:chat", "ai:history:read", "ai:history:delete",
    "profile:read", "profile:update", "profile:delete",
    "settings:read", "settings:update",
    "notifications:read", "notifications:update",
    "library:read", "library:download",
  ],
  therapist: [
    "profile:read", "profile:update",
    "settings:read", "settings:update",
    "client:read", "client:notes:create", "client:notes:read",
    "client:progress:read",
    "appointment:create", "appointment:read", "appointment:update",
    "library:read", "library:download",
  ],
  family: [
    "family:member:read", "family:member:check-in",
    "family:wellness:read",
    "library:read", "library:download",
  ],
  admin: [
    "user:read", "user:update", "user:deactivate",
    "content:manage", "analytics:read",
    "system:config", "system:health",
    "audit:read",
  ],
};

/** --- Permission Scope --- */
export interface PermissionScope {
  role: DomainRole;
  resource: string;
  action: "read" | "create" | "update" | "delete";
  ownsOnly?: true;
  relatedOnly?: true;
}

/** --- Check if role has permission --- */
export function hasPermission(role: DomainRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

/** --- Get all permissions for a role --- */
export function getRolePermissions(role: DomainRole): readonly Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}

/** --- Validate access --- */
export function canAccess(
  role: DomainRole,
  permission: Permission,
  resourceOwnerId?: string,
  currentUserId?: string
): boolean {
  if (!hasPermission(role, permission)) return false;
  if (role === "therapist" && permission.startsWith("client:")) return true;
  if (role === "family" && permission.startsWith("family:")) return true;
  if (role === "admin") return true;
  if (role === "user" && resourceOwnerId && currentUserId) {
    return resourceOwnerId === currentUserId;
  }
  return true;
}

/** --- All roles --- */
export const ALL_ROLES: DomainRole[] = ["user", "therapist", "family", "admin"];

/** --- Role labels --- */
export const ROLE_LABELS: Record<DomainRole, string> = {
  user: "User",
  therapist: "Therapist / Counselor",
  family: "Family / Caregiver",
  admin: "Administrator",
};
