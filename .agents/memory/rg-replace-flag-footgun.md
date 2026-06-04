---
name: ripgrep replace-flag footgun
description: Why rg output sometimes shows bogus `n` text — it's the --replace flag, not file corruption.
---

`rg -r` is the **--replace** flag. Writing `rg -rn "pat" file` parses as `--replace=n`, so every match is printed replaced by the literal `n` (e.g. a CTA label `Get Pro` shows as `n`). This looks exactly like file/token corruption but the file is untouched.

**How to apply:** use `-n` (line numbers) and `-c`/`-l` (count/list) — never `-r` unless you intend to substitute. If output shows suspicious single-letter tokens, suspect your own flag before concluding the source is broken.
