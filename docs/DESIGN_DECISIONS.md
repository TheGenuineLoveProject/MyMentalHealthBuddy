# Design Decisions Log

## Purpose
Documents all significant design decisions for The Genuine Love Project platform with context, options considered, and consequences.

---

## Decision Log

### DD-001: Semantic Color Token System
**Date:** December 2025
**Context:** Need consistent, maintainable color system across 109+ frontend pages
**Options Considered:**
1. Raw hex colors throughout
2. CSS custom properties only
3. Tailwind semantic tokens + CSS variables hybrid

**Chosen:** Option 3 - Hybrid approach
**Consequences:**
- Tailwind classes for component styling (`text-sage-600`, `bg-cream-50`)
- CSS variables for dynamic theming (`var(--sage-600)`)
- Single source of truth in `index.css` and `brand.css`

**Follow-ups:**
- Visual Doctor enforces no raw hex in components
- Documentation in `COLOR_SYSTEM.md`

---

### DD-002: Single Icon Library (Lucide React)
**Date:** December 2025
**Context:** Mixed icon libraries causing visual inconsistency
**Options Considered:**
1. Heroicons
2. FontAwesome
3. Lucide React
4. Custom SVG set

**Chosen:** Option 3 - Lucide React
**Consequences:**
- Consistent visual weight and style
- Tree-shakeable imports
- Exception: `react-icons/si` for brand logos only

**Follow-ups:**
- Icon Doctor validates single source
- Documentation in `ICONOGRAPHY_GUIDE.md`

---

### DD-003: Wouter for Client-Side Routing
**Date:** November 2025
**Context:** Need lightweight routing solution for React SPA
**Options Considered:**
1. React Router v6
2. Wouter
3. TanStack Router

**Chosen:** Option 2 - Wouter
**Consequences:**
- Smaller bundle size (~2KB vs ~12KB)
- Simple API, hooks-based
- Less feature-rich but sufficient for needs

**Follow-ups:**
- All internal links use `<Link>` component
- 404 fallback implemented

---

### DD-004: Trauma-Informed Design Language
**Date:** November 2025
**Context:** Mental wellness platform requires careful, supportive UX
**Options Considered:**
1. Clinical terminology
2. Casual/informal tone
3. Trauma-informed, non-clinical language

**Chosen:** Option 3 - Trauma-informed
**Consequences:**
- All microcopy reviewed for supportive tone
- No shame-inducing language
- Crisis resources prominently available
- Disclaimers present (educational, not clinical)

**Follow-ups:**
- Brand voice documented in `BRAND_VOICE.md`
- Content templates enforce patterns

---

### DD-005: Accessibility Baseline
**Date:** December 2025
**Context:** Ensure platform accessible to neurodivergent users
**Options Considered:**
1. WCAG 2.0 AA
2. WCAG 2.1 AA
3. WCAG 2.1 AA + neurodivergent accommodations

**Chosen:** Option 3 - Enhanced accessibility
**Consequences:**
- `prefers-reduced-motion` support throughout
- Low-stimulation mode available
- Reading/focus mode for long content
- Skip links, keyboard navigation, ARIA landmarks

**Follow-ups:**
- 338+ ARIA attributes documented
- Accessibility modes in settings

---

### DD-006: Glassmorphism + Gradient Design System
**Date:** December 2025
**Context:** Premium visual aesthetic for wellness platform
**Options Considered:**
1. Flat design
2. Material Design
3. Glassmorphism with brand gradients

**Chosen:** Option 3 - Glassmorphism
**Consequences:**
- Hero gradients with decorative orbs
- Glass cards with backdrop-blur
- Subtle animations (respecting reduced motion)
- Premium feel aligned with brand

**Follow-ups:**
- 6 keyframe animations defined
- Gold accent system for premium elements

---

### DD-007: Drizzle ORM for Database
**Date:** November 2025
**Context:** Type-safe database operations for PostgreSQL
**Options Considered:**
1. Prisma
2. Drizzle ORM
3. Raw SQL with pg

**Chosen:** Option 2 - Drizzle ORM
**Consequences:**
- TypeScript-first, type-safe queries
- Lightweight compared to Prisma
- Direct SQL control when needed
- Schema in `shared/schema.ts`

**Follow-ups:**
- `npm run db:push` for migrations
- No manual SQL migrations

---

### DD-008: Express.js Backend
**Date:** November 2025
**Context:** Server framework for Node.js backend
**Options Considered:**
1. Express.js
2. Fastify
3. Hono

**Chosen:** Option 1 - Express.js
**Consequences:**
- Mature ecosystem
- Extensive middleware support
- Wide developer familiarity
- Helmet, CORS, compression middleware

**Follow-ups:**
- Rate limiting enabled
- Session management via express-session

---

## Template for New Decisions

```markdown
### DD-XXX: [Title]
**Date:** [Month Year]
**Context:** [Why this decision was needed]
**Options Considered:**
1. [Option A]
2. [Option B]
3. [Option C]

**Chosen:** Option [N] - [Name]
**Consequences:**
- [Consequence 1]
- [Consequence 2]

**Follow-ups:**
- [Action item 1]
- [Action item 2]
```

---
Last Updated: January 2026
