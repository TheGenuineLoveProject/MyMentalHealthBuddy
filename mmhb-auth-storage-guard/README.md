# MMHB auth-storage guard review

This package contains a candidate one-file fix and disposable tests. It has not
been applied to Replit by the assistant. The original is reconstructed from the
complete storage source pasted by the user; the applier independently requires
the recorded report checksum and the candidate Git blob before changing a file.

## Changes
- New provider sign-ins create ordinary `user` accounts, never inferred admins.
- A new provider subject with an existing email is refused without any update;
  an explicit, reauthenticated linking workflow is required separately.
- Already mapped provider subjects retain the existing update path and roles.
- Getters/response field selection and local password authentication are unchanged.

## Run fixture tests (Python 3, Node 22+, Git)
From this extracted directory:

    python3 -I test-helper.py
    python3 -I run-behavior.py

Fixtures use temporary local Git repositories, mocked Drizzle chains and in-memory
rows. No real SQL, OIDC, browser or deployed route is exercised.

## Apply to the pinned Replit candidate
Use the conversation's SHA-256-checked command. `--apply` changes storage.mjs in
the restored candidate only and saves before/after files, a patch and test results
in that candidate repository's Git administrative directory. It also creates a
named local checkpoint commit from a separate temporary index before replacing
the file. The existing candidate HEAD and index are intentionally left unchanged:
the working file is modified, and a separate `refs/mmhb-fixes/...` reference protects
the complete patched snapshot. Do not use `git add .` or force-reset any branch.
A repeat run accepts the already-identical patched file and reuses the checkpoint.
Without `--apply`, the helper is a dry run and does not create a checkpoint.

## Intentional compatibility change
Unlinked or differently linked same-email provider sign-ins now fail closed.
No existing database role is demoted, no stored link is removed, and no new
account-link UI or administrator provisioning flow is supplied here. OIDC
callback handling and friendly collision messaging require integration testing.

The runtime is not started, no database is touched and nothing is published.
These files are private engineering artifacts, not runtime application modules.
