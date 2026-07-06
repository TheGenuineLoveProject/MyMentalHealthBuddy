/**
 * DEPRECATED / NOT RUNTIME-MOUNTED
 *
 * Reference template only.
 * Do not import, register, or mount in production.
 * Active runtime route: server/routes/object-storage.mjs
 */

export {
  ObjectStorageService,
  ObjectNotFoundError,
  objectStorageClient,
} from "./objectStorage";

export type {
  ObjectAclPolicy,
  ObjectAccessGroup,
  ObjectAccessGroupType,
  ObjectAclRule,
} from "./objectAcl";

export {
  canAccessObject,
  getObjectAclPolicy,
  setObjectAclPolicy,
} from "./objectAcl";

export { registerObjectStorageRoutes } from "./routes";

