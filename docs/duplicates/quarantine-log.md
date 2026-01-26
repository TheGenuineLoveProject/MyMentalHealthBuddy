# Quarantine Log

> Record of files moved to quarantine instead of deleted.

## Format

```
## Quarantine: <timestamp>
- **From**: <original path>
- **To**: <quarantine path>
- **Reason**: <why quarantined>
- **Restore**: `mv <to> <from>`
```

---

## Quarantine Actions

_No files quarantined yet._

---

## Restore Instructions

To restore all quarantined files:
```bash
bash scripts/restore-quarantine.sh
```

To restore specific files:
```bash
mv _quarantine/<timestamp>/<path> <original-path>
```

---

_Last updated: January 2026_
