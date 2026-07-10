# Registry Schema Contracts

## Purpose

The registry schema layer formalizes the structural contracts of the PEOS
registry files without rewriting or restructuring existing registry data.

## Covered Registries

- `platform/registry/assets.json`
- `platform/registry/prompts.json`
- `platform/registry/routes.json`
- `platform/registry/components.json`
- `platform/registry/capabilities.json`

## Generated Schemas

Schemas are stored in:

`platform/schemas/registry/`

The schema manifest is stored in:

`platform/schemas/registry/manifest.json`

## Compatibility Strategy

The first schema generation pass uses the registry structures currently present
in the repository. It records:

- top-level type;
- currently required object properties;
- nested value types;
- array item structures;
- current heterogeneous array structures where present.

The generator does not modify the registry source files.

## Current Guarantee

A passing verification means:

1. all registered schema files exist;
2. all registries and schemas contain valid JSON;
3. each registry matches its generated structural contract;
4. required currently observed properties remain present;
5. incompatible primitive-type changes are detected.

## Important Limitations

A passing structural schema check does not yet establish:

- that every registered file exists;
- that every registered component export exists;
- that every registered route is mounted;
- that every prompt has complete safety metadata;
- that every capability has a corresponding learning object;
- that registry contents are clinically or commercially correct.

Those concerns require repository-drift, route, component, prompt, capability,
clinical-safety, and entitlement verification gates.

## Change Governance

Schema changes must be reviewed with their corresponding registry changes.

Do not regenerate schemas merely to make a failing registry pass. First determine
whether:

1. the registry change is valid and intentional;
2. the schema is outdated;
3. the registry contains accidental drift;
4. a migration or compatibility period is required.
