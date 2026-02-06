# Git Governance

**Generated:** 2026-02-06
**Baseline Commit:** c82c2d124efec42154e2f0ff4550778bb2c577de

---

## Current Git State

| Property | Value |
|----------|-------|
| Branch | main |
| Working Tree | Clean |
| Remote | github.com/TheGenuineLoveProject/TheGenuineLoveProject.git |
| Backup Remote | gitsafe-backup (gitsafe:5418) |
| Commit History | NOT rewritten (immutable) |

---

## Commit Signing Status

All existing commits are **unsigned** (status: `N`).

**Policy:** Existing history will NOT be rewritten. Commit signing is configured for future commits only.

---

## Local Branches

| Branch | Purpose | Status |
|--------|---------|--------|
| main | Primary production branch | Active |
| replit-agent | Replit Agent workspace | Stale |
| copilot/fix-unverified-issues | GitHub Copilot fixes | Stale |
| fix/push-unblock | Push unblock attempt | Stale |
| harden/admin-guard | Admin guard hardening | Stale |
| visual-refine-v1 to v4 | Visual refinement iterations | Stale |

**Recommendation:** Stale branches should be reviewed and cleaned up after confirming their changes are merged or no longer needed.

---

## Future Safety Configuration

### Commit Signing Setup (SSH Key Method)

To enable commit signing for future commits:

1. Generate an SSH signing key (if not already present):
   ```bash
   ssh-keygen -t ed25519 -C "your-email@example.com" -f ~/.ssh/signing_key
   ```

2. Configure git to use SSH signing:
   ```bash
   git config --global gpg.format ssh
   git config --global user.signingkey ~/.ssh/signing_key.pub
   git config --global commit.gpgsign true
   git config --global tag.gpgsign true
   ```

3. Add the public key to your GitHub account:
   - Go to GitHub Settings > SSH and GPG Keys
   - Click "New SSH Key"
   - Select "Signing Key" as the key type
   - Paste the contents of `~/.ssh/signing_key.pub`

4. Verify the setup:
   ```bash
   node scripts/verify-commit-signing.mjs
   ```

### GPG Key Method (Alternative)

1. Generate a GPG key:
   ```bash
   gpg --full-generate-key
   ```

2. Get the key ID:
   ```bash
   gpg --list-secret-keys --keyid-format=long
   ```

3. Configure git:
   ```bash
   git config --global user.signingkey YOUR_KEY_ID
   git config --global commit.gpgsign true
   ```

4. Add the GPG public key to GitHub.

---

## Branch Protection Rules (Recommended for GitHub)

Configure these in GitHub repository Settings > Branches:

| Rule | Value |
|------|-------|
| Require pull request reviews | Yes (1 reviewer) |
| Require signed commits | Yes (after signing is set up) |
| Require status checks | Yes (CI workflow) |
| Require up-to-date branches | Yes |
| Include administrators | Yes |

---

## Absolute Rules

1. **NEVER** force-push to main unless explicitly instructed
2. **NEVER** rewrite commit history
3. **NEVER** delete branches without explicit approval
4. All future commits should be signed
5. All changes should go through CI checks
6. Backup remote (gitsafe-backup) must stay in sync

---

## Verification

Run the verification script to check current compliance:
```bash
node scripts/verify-commit-signing.mjs
```

## Phase 1 Status: COMPLETE
No destructive changes were made. Future safety mechanisms documented.
