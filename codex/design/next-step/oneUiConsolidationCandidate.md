# One UI Consolidation Candidate — Audit (Read-Only)

> **Status:** Audit only. No code was modified. Compiled 2026-05-30 from the current green state.
> **Mandate:** Identify exactly ONE safest public, non-protected, non-healing, non-auth, non-admin UI consolidation candidate where a repeated inline UI pattern can later be replaced by an existing canonical component. No implementation in this phase.

---

## Selected Candidate

**Replace the bespoke inline submit-button spinner in `client/src/pages/Contact.jsx` with the existing canonical `client/src/components/ui/BrandSpinner.jsx`.**

### Exact file path
- Target: `client/src/pages/Contact.jsx`
- Canonical replacement component (already exists, do not create): `client/src/components/ui/BrandSpinner.jsx`

### Exact pattern (verbatim, line 245)
```jsx
<div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin motion-reduce:animate-none" aria-hidden="true" />
```
Context — inside the form submit button, gated on the mutation pending state (lines 236–254):
```jsx
<button type="submit" disabled={contactMutation.isPending} ... data-testid="button-submit">
  {contactMutation.isPending ? (
    <>
      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin motion-reduce:animate-none" aria-hidden="true" />
      <span>Sending...</span>
    </>
  ) : (
    <>
      <Send className="w-5 h-5" aria-hidden="true" />
      <span>Send Message</span>
    </>
  )}
</button>
```

This is exactly the in-button loading state that `BrandSpinner` was authored to replace. Its own docstring reads: *"Drop-in replacement for `<Loader2 className=\"w-4 h-4 animate-spin\" />` for in-button / inline-text loading states."*

### Why this is a *repeated* UI pattern (not a one-off)
The identical bespoke spinner markup appears verbatim on at least one other public page:
- `client/src/pages/CanvaLanding.jsx:1210` — `<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin motion-reduce:animate-none" />`

So the pattern is a genuine duplication candidate across public surfaces. **This audit selects only Contact.jsx as the single safest first target;** CanvaLanding is noted for a future, separate phase (larger file, ~1210+ lines = bigger blast radius).

### Why it is public
`client/src/App.jsx:1632` registers the route with **no** `ProtectedRoute` wrapper:
```jsx
<Route path="/contact"><Contact /></Route>
```
Aliases also resolve here publicly: `/feedback` → `ConfigRoute "/contact"`, `/contact-us` → `Redirect to /contact`. There is no auth guard, no `RouteGuard`, no plan/admin gate on this route.

### Why it is safe
- **Not in any excluded category:** not journal, crisis, healing, chat, billing, account, dashboard, admin, provider, or auth. It is a public marketing/contact page.
- **Not a shared primitive:** the change is to a single page file, not to a shared component consumed elsewhere. `BrandSpinner` already exists and is already used as the canonical inline spinner, so no new shared surface is introduced.
- **Small, self-contained file:** `Contact.jsx` is 278 lines; the spinner is a single isolated element in one button's pending branch.
- **No logic change required:** the swap is purely presentational — the `contactMutation.isPending` gate, the `data-testid="button-submit"`, the layout, and the "Sending..." label all stay identical.
- **Reduced-motion already respected** both before (`motion-reduce:animate-none`) and after (`BrandSpinner` is gated by `prefers-reduced-motion` via the `.brand-spinner` class in `index.css`), so accessibility behavior is preserved or improved.
- **Crisis routing untouched:** this page's crisis/support copy and links are unrelated to the spinner element.

### Fidelity consideration to carry into the implementation phase (not a blocker)
The current spinner is **white** (`border-t-white`) to sit on the sage-gradient button. `BrandSpinner` uses the sage-aurora vocabulary by default. A faithful swap must preserve contrast on the gradient button — e.g. pass an appropriate `className`/size (`size={20}` to match `w-5 h-5`) and verify the spinner remains visible against the dark-sage gradient. This is a visual-parity detail for the future change, documented here so it is not lost.

---

## Blast Radius
- **Files touched (future change):** exactly one — `client/src/pages/Contact.jsx`.
- **Components affected:** none shared. `BrandSpinner` is imported, not modified.
- **Routes affected:** `/contact` only (plus its aliases `/feedback`, `/contact-us` which render the same page).
- **Runtime/server/API:** none. Frontend-only, presentational.
- **Data/state:** none. Mutation logic, form state, and test IDs unchanged.
- **Build/deploy:** rebuild of the client bundle only; no dependency or config change.

## Rollback Plan
- **Mechanism:** single-file revert. The change is isolated to one JSX element in one file.
- **Steps:** restore the original `<div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin motion-reduce:animate-none" aria-hidden="true" />` element and remove the `BrandSpinner` import if it was added solely for this swap.
- **Checkpoint:** the platform auto-checkpoints before/after the change, so a one-click rollback to the pre-change checkpoint is also available.
- **Risk if rolled back:** none — returns to the exact current green state.

## Verification Plan (for the future implementation phase)
1. `node --check server/app.mjs` → syntax OK (server unaffected; sanity gate).
2. `npm run build` → `✓ built`.
3. `npm run verify:all` → expect `Summary: 121 pass, 0 warn, 0 fail` (build + duplicate audit + route-governance scan + copyright scan).
4. HTTP smoke: `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5000/contact` → `200`.
5. Visual parity check (screenshot `/contact`): submit button renders `Send Message` idle state; pending state shows the canonical spinner + `Sending...` with adequate contrast on the sage gradient.
6. Reduced-motion check: with `prefers-reduced-motion: reduce`, the spinner does not animate.
7. Crisis routing intact: page still surfaces its support/crisis copy and links.

---

## This Audit's Verification
Per task scope, only `npm run verify:all` was run (no code changed). Result is recorded in the accompanying summary.

## Stop Point
Audit complete. **No code modified.** Awaiting explicit authorization before implementing the Contact.jsx → BrandSpinner consolidation.
