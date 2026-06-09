---
name: Global attribute-substring selectors hijack scoped classes
description: Broad [class*="..."] !important rules in global CSS silently restyle any new component whose class names contain those substrings.
---

Two global stylesheets carry overly-broad attribute-substring selectors with `!important`:
- `lumi-living-presence-phase64.css`: `[class*="cta"]`, `a[class*="primary"]`, `a[class*="secondary"]`, `[class*="btn"]`, `[class*="Button"]` → green gradient backgrounds, borders, box-shadows.
- `lumi-visual-system.css`: similar `[class*="btn"|"button"|"sage"|"gold"]` rules.
- `phase58-visual-polish.css`: `[class*="Card"]`, `[class*="Panel"]`, `[class*="pricing"]`, `[class*="Premium"]`, `[class*="Billing"]`.

**Symptom:** a brand-new scoped component (e.g. inline `<style>` page) gets an unexplained sage/green gradient panel or pill background it never declared. A class like `.cl-cta` is matched by `[class*="cta"]`; `.cl-btn-primary` by `a[class*="primary"]`.

**Why it wins:** the global rules use `!important`, so they beat even an explicit `background:#163A36` in a runtime-injected `<style>`.

**Fix (smallest, non-destructive):** rename YOUR scoped class names so they contain none of the hijacked substrings (`cta`, `btn`, `primary`, `secondary`, `button`, `card`, `panel`, `pricing`, `premium`, `billing`, `sage`, `gold` — case-sensitive). Do NOT edit the shared global rule; real CTAs/buttons across the app depend on it. Verify new names with `rg -no "your-prefix-[a-z-]+" file | rg -i "cta|btn|primary|secondary"`.

**How to apply:** when a new component shows phantom green/gradient chrome, grep global CSS for `\[class\*=` before debugging your own styles.
