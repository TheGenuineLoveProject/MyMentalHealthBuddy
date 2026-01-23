# GLP Page Optimization Kit (A→Z)

## Last Updated: 2026-01-23

Repeatable templates for upgrading every page consistently with brand tokens, spacing, typography, accessibility, and SEO.

---

## 1. Master Page Upgrade Engine

```
NAME: GLP_PAGE_UPGRADE_ENGINE
TARGET: <PASTE EXACT ROUTE OR FILE PATH>
GOAL: Upgrade to GLP "Serenity Sage" visual/cognitive calm.

NON-NEGOTIABLE RULES:
- DRY-RUN FIRST
- NO deletes/renames
- Use GLP tokens + calm UI + WCAG AA
- Add microcopy via Wellness Microcopy Library
- No clinical promises; add SafetyFooter if emotionally intense
- Max 5 files, max 250 LOC per patch

OUTPUT FORMAT (DRY-RUN):
1) Page Intent + Primary CTA
2) Problems (crowding, hierarchy, buttons, contrast)
3) Proposed layout blueprint
4) Typography scale + spacing scale
5) Button sizing rules
6) Microcopy placement map
7) Accessibility fixes
8) SEO metadata
9) Analytics events
10) Patch plan
STOP and wait for: "APPLY PAGE PATCH 1"
```

---

## 2. Serenity Sage Layout Blueprint

Apply to every page:

### Section Order
1. **Calm Hero** - Title + 1-line benefit + primary CTA + secondary CTA
2. **Trust Strip** - 3 tiny points: privacy-first, supportive education, begin gently
3. **Main Content** - 2-column desktop, 1-column mobile
4. **Guided Steps** - 3-5 steps max; each step card has 1 action
5. **Support Panel** - micro-resets, "soft version" toggle, help link
6. **Footer** - Safety + disclaimer; crisis resources on relevant pages

### Spacing Rules
| Property | Desktop | Mobile |
|----------|---------|--------|
| Max width | 960-1100px | 100% |
| Section padding | 48-72px | 28-40px |
| Card gap | 16-24px | 12-16px |
| Line length | 55-75 chars | 55-75 chars |

### Typography Scale
| Element | Desktop | Mobile |
|---------|---------|--------|
| H1 | 40-56px | 30-36px |
| H2 | 28-32px | 22-26px |
| Body | 16-18px | 16px |
| Buttons | 14-16px | 14-16px |

### Button Sizing
- Min height: 44px (mobile accessible)
- Primary: prominent (glp-sage-deep)
- Secondary: subtle (outline)
- No tiny buttons anywhere

### No Overcrowding
- 1 primary CTA per section max
- Replace long paragraphs with bullets + microcards

---

## 3. Decrowd Page Prompt

```
NAME: GLP_DECROWD_PAGE
TARGET: <ROUTE OR FILE PATH>

Task:
1) Identify overcrowding sources
2) Rebuild into 5-7 simple sections using Layout Blueprint
3) Convert long text into bullets/accordion/microcards
4) Enforce button min height 44px
5) Add calm whitespace

DRY-RUN only. Wait for "APPLY DECROWD PATCH 1"
```

---

## 4. Title Scale Fix Prompt

```
NAME: GLP_TITLE_SCALE_FIX
TARGET: <ROUTE OR FILE PATH>

Goal:
- H1 must be largest text on page
- Enforce single typography scale source
- Ensure responsive sizes

DRY-RUN first. Provide exact className changes.
Wait for "APPLY TITLE PATCH 1"
```

---

## 5. Microcopy Injection Prompt

```
NAME: GLP_MICROCOPY_INJECTION
TARGET: <ROUTE OR FILE PATH>

Task:
1) Identify microcopy locations:
   - CTA buttons
   - Empty states
   - Form helper text
   - Success toasts
   - Error messages
   - Tooltips
   - Section headers

2) Insert from Microcopy Library with rotation rules:
   - Never reuse same phrase twice on page
   - Prefer softer variants for sensitive pages
   - Keep confirmations short

DRY-RUN only. Output table:
Component → location → microcopy key → exact string
Wait for "APPLY MICROCOPY PATCH 1"
```

---

## 6. Accessibility Patch Prompt

```
NAME: GLP_A11Y_PAGE_PATCH
TARGET: <ROUTE OR FILE PATH>

Checklist:
- One H1 only; headings in order
- Buttons have accessible names
- Form fields have labels + describedBy
- Focus visible styles exist
- Contrast meets AA
- Keyboard navigation works
- ARIA only when necessary

DRY-RUN only. Wait for "APPLY A11Y PATCH 1"
```

---

## 7. SEO Page Patch Prompt

```
NAME: GLP_SEO_PAGE_PATCH
TARGET: <ROUTE OR FILE PATH>

Deliver:
- Title tag (50-60 chars)
- Meta description (140-160 chars)
- OG title + description
- Canonical URL
- Schema type (WebPage, FAQPage, Article, etc.)
- Internal links (3-5)

DRY-RUN only. Wait for "APPLY SEO PATCH 1"
```

---

## 8. Page Done Checklist

Before marking any page complete:

### UI
- [ ] Not crowded, clear sectioning, consistent spacing
- [ ] Buttons >= 44px height
- [ ] H1 biggest; typography consistent

### Content
- [ ] Microcopy injected (no repetition)
- [ ] Beginner-friendly language available
- [ ] No clinical claims; disclaimers present
- [ ] SafetyFooter on emotional pages

### Accessibility
- [ ] Headings correct (one H1, ordered)
- [ ] Keyboard navigation usable
- [ ] Focus states visible
- [ ] Labels/ARIA correct

### SEO
- [ ] Title/meta/OG/canonical set
- [ ] Schema suggestion included
- [ ] Internal links added

### Performance
- [ ] No oversized images
- [ ] Avoid heavy components above fold

### Validation
- [ ] Build passes
- [ ] No console errors

---

## 9. Component Library Refactor Prompt

```
NAME: GLP_COMPONENT_LIBRARY_REFACTOR (NON-DESTRUCTIVE)

Goal: Clean component system without breaking anything:
- /components/ui (primitives)
- /components/sections (page sections)
- /components/features (tool-specific)
- /content (copy + microcopy JSON)
- /styles (tokens)

Rules:
- Keep old imports working (re-export index files)
- Do not rename exported component names
- DRY-RUN first with mapping plan
Wait for "APPLY COMPONENT PATCH 1"
```

---

## 10. Route Categories Reference

From `client/src/content/routes.js`:

| Category | Count | Description |
|----------|-------|-------------|
| landing | 7 | Public marketing pages |
| auth | 6 | Login, signup, password reset |
| core | 10 | Dashboard, journal, mood tracker |
| wellness | 29 | Breathing, grounding, affirmations, etc. |
| advanced | 12 | Mastery tools, wisdom synthesis |
| ai | 6 | AI chat, coach, insights |
| community | 4 | Social hub, community |
| content | 8 | Blog, guides, studio |
| support | 6 | FAQ, help, resources |
| legal | 5 | Privacy, terms, disclaimer |
| account | 4 | Profile, settings, billing |
| admin | 8 | Content admin, analytics |
| system | 4 | Design system, health check |

**Total: 119 routes + aliases**

---

## Quick Reference: Stimulation Profiles

| Profile | Use For | Characteristics |
|---------|---------|-----------------|
| `quiet` | Auth, crisis | Minimal motion, single action, low decoration |
| `structured` | Dashboard, core | Next-step prominent, tool cards, insights |
| `practice` | Wellness tools | 3-level reading, technique tags, safety footer |

---

## Next Steps

1. Run `GLP_PAGE_RUNLIST_GENERATOR` to get prioritized list
2. Pick Page 1 from the list
3. Run `GLP_PAGE_UPGRADE_ENGINE` with that route
4. Reply: "APPLY PAGE PATCH 1"
5. Repeat for each page
