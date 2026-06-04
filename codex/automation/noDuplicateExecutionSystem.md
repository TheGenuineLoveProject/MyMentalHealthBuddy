# No Duplicate Execution System

## Rule
Before every phase:
1. Run git status --short
2. Confirm whether files already exist
3. Do not recreate completed docs
4. Commit current work before new work
5. Run verify gates once

## Phase Order
- governance
- audit
- visible page
- verification
- commit
- next single page or component

## Forbidden
- duplicate command blocks
- repeated doc creation
- mass runtime edits
- unchecked refactors
