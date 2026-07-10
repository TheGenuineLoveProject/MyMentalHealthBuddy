# Registry Semantic Audit

## Purpose

The registry semantic audit discovers and validates the current structural
characteristics of the PEOS registry files before strict JSON schemas are
introduced.

## Registries Evaluated

- `platform/registry/assets.json`
- `platform/registry/prompts.json`
- `platform/registry/routes.json`
- `platform/registry/components.json`
- `platform/registry/capabilities.json`

## Current Audit Guarantees

The audit verifies:

1. Every required registry file exists.
2. Every registry contains valid JSON.
3. Top-level structure and keys are reported.
4. Detectable record collections are counted.
5. Common identifier fields are inspected.
6. Duplicate detectable identities fail the audit.
7. Suspicious path-like values are reported.
8. The audit does not rewrite registry content.

## Important Limitation

A passing semantic audit does not yet prove that every registry entry points to
a real repository asset, route, component, prompt, or capability. Repository
drift detection and strict schema validation are separate later gates.

## Evidence Artifact

The machine-readable audit is written to:

`tmp/governance/registry-semantic-audit.json`

The `tmp` artifact is operational evidence and should not be committed unless a
specific evidence-retention policy requires it.
