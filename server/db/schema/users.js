/**
 * Orphan-rescue re-export — see docs/changelog.md (v5.7.1).
 *
 * This file has zero static importers in the current graph but the v4.2
 * schema-drift guardrail kept flagging it because its hand-rolled `users`
 * pgTable had drifted away from the canonical definition in
 * `shared/schema.mjs` (email: text vs varchar(255), missing 14 columns).
 *
 * Per the "Non-destructive (never delete without permission)" rule we do
 * NOT remove the file — we redirect it to the single source of truth so
 * any future dynamic import gets the correct schema, and the guardrail
 * goes silent because the file no longer declares its own pgTable.
 */
export { users } from "../../../shared/schema.mjs";
