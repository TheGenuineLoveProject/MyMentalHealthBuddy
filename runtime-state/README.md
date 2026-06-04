# Runtime State Isolation

Purpose:
Separate runtime-generated operational state from canonical source code.

This directory contains:
- telemetry
- ai memory cache
- usage counters
- event logs

Rules:
- never import into frontend bundles
- never commit generated runtime state
- never store secrets here
- never store protected health data here
- never use runtime state for monetization targeting

Operational Policy:
Runtime state is ephemeral and deployment-safe.
