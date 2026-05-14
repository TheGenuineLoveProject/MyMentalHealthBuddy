/**
 * @fileoverview Lumi RBAC -- Barrel Export
 * @module lumi-rbac
 *
 * Role-Based Access Control.
 *
 * @version 1.0.0
 * @since Phase 39
 */

export {
  type DomainRole,
  type Permission,
  ROLE_PERMISSIONS,
  type PermissionScope,
  hasPermission,
  getRolePermissions,
  canAccess,
  ALL_ROLES,
  ROLE_LABELS,
} from "./roles/roleDefinitions";

export {
  type RBACSpec,
  RBAC_SPEC,
  type PermissionCheck,
  checkPermission,
  type RouteProtection,
  PROTECTED_ROUTES,
  getRoutePermission,
} from "./middleware/rbacMiddleware";
