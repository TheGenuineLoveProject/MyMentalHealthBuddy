# Generated Diagnostics Drift Policy

## Purpose

Verification runs may generate local diagnostic files after commits are already pushed and synced.

These files are evidence artifacts, not production behavior.

## Rule

Generated diagnostic files should not create platform drift.

## Allowed Actions

- Restore tracked generated diagnostic files when they change only because a verification script reran.
- Remove untracked diagnostic artifacts when they are local run residue.
- Preserve committed architecture notes, scripts, and intentional diagnostic summaries.
- Never delete source files, routes, components, pages, schemas, migrations, public assets, or governance docs under this policy.

## Completion Gate

Before continuing to a new engineering phase:

- `git status` must be clean or only show intentional Phase-current files.
- `git rev-list --left-right --count origin/main...HEAD` must be `0   0`.
- Any remaining drift must be classified before action.

## Reason

This prevents repeated disappearing-output recovery loops from polluting the repository and causing false blockers.
