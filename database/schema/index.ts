export * from "../../shared/schema.mjs";

/**
 * Canonical schema graph bridge.
 *
 * refreshTokens remains owned by:
 *   server/db/schema/refreshTokens.js
 *
 * This re-export makes that existing owner visible to the canonical
 * Drizzle schema root without introducing a second declaration.
 */
export { refreshTokens } from "../../server/db/schema/refreshTokens.js";
