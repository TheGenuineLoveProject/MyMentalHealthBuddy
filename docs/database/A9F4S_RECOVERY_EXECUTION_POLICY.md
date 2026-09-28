# A9F4S Recovery and Production-Execution Policy

## Qualification status

The schema migration has been proven against an isolated restoration of the
current production schema.

The following sequence completed successfully:

Production schema-only archive
→ isolated PostgreSQL restore
→ hardened forward migration
→ exact canonical post-state
→ structural rollback
→ exact pre-state catalog fingerprint.

## Concurrency hardening

The hardened migration adds:

- `biometric_readings` — SHARE UPDATE EXCLUSIVE
- `discernment_attempts` — SHARE UPDATE EXCLUSIVE

The seven tables directly mutated by the migration retain ACCESS EXCLUSIVE
locking.

This prevents competing schema/index operations from invalidating the
correctness-invariant checks while avoiding unnecessarily exclusive locks on
the two invariant-owner tables.

## Provider classification

Detected provider class:

`NEON`

No provider-control-plane mutation was performed by A9F4S-R3.

No API key or database credential was printed.

## Recovery gate

Production execution remains prohibited until a provider-native recovery
checkpoint, PITR capability, snapshot, isolated branch, or technically
equivalent recovery mechanism has been verified.

Do not create a plaintext full-data production dump in the Replit workspace
merely to satisfy this gate.

If the provider is Neon, prefer a Neon-native branch/snapshot/PITR recovery
workflow.

## Production execution prerequisites

1. Verify provider-native recoverability.
2. Record a recovery point immediately before migration.
3. Re-run the exact live precondition audit.
4. Verify hardened-forward SHA-256.
5. Verify rollback SHA-256.
6. Enter an explicit bounded migration window.
7. Execute only the hardened forward artifact.
8. Immediately run canonical/live parity verification.
9. Run application/authentication regression qualification.
10. Keep rollback or provider recovery available until release verification
    closes.

## Explicitly forbidden

- drizzle-kit push
- replaying the entire canonical schema
- fabricating historical migration history
- weakening runtime correctness indexes
- executing the original unhardened forward artifact in production
- destructive cleanup outside the qualified residual set
- production migration without recovery proof

## Current authorization

Live production migration: **NOT AUTHORIZED**
