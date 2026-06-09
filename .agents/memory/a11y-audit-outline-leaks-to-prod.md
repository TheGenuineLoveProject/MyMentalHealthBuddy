---
name: a11y audit dashed-outline leaks to production
description: phase58-visual-polish.css paints a red dashed box on alt-less images; it wrongly flags valid decorative aria-hidden images and ships to end users.
---

`phase58-visual-polish.css` contains `img[alt=""], img:not([alt]) { outline: 2px dashed rgba(220,38,38,.55) }` — a dev a11y-audit flag that is NOT dev-gated, so end users see red dashed boxes around images.

**Trap:** `alt=""` is the CORRECT pattern for decorative images (e.g. global navbar Lumi avatar in `BuddyAvatar.tsx`: `alt="" aria-hidden="true"`, parent `div role="img"` + `aria-label`). The rule flagged this valid decorative image → a stray dashed box top-left on every page including the homepage.

**Fix:** exclude intentionally-decorative images from the audit: `img[alt=""]:not([aria-hidden="true"]):not([role])` (and same for `img:not([alt])`). Don't add a descriptive alt to the avatar img — that would double-announce against the parent aria-label and break the decorative pattern.

**How to apply:** a faint dashed box around an image/avatar is almost certainly this audit rule, not a broken/401 asset. A `GET /user` 401 in console for a logged-out visitor is normal Bearer-auth behavior, unrelated.
