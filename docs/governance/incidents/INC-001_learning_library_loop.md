# INC-001 — Learning Library Patch Loop

**Status:** RESOLVED — circuit breaker engaged
**Date:** 2026-05-05
**Severity:** Process (no user impact, no code regression)
**Kernel Reference:** MMHB v7.4 §9 Circuit Breaker, §7 Duplication Detection, §10 Adapter Mode

---

## 1. Summary

The same 3-bug patch request for `client/src/pages/CourseCatalog.jsx` (Learning Library page) was submitted **5 times in succession** after the fixes had shipped and been screenshot-verified. On the 5th identical request, immediately after the v7.4 Archival Kernel was persisted to `docs/governance/MMHB_v7.4_ARCHIVAL_KERNEL.md`, §9 Circuit Breaker was engaged and the patch was declined.

This was the first live invocation of the kernel and validated its enforcement model.

---

## 2. The 3 Bugs (All Pre-Fixed)

| # | Bug | File | Lines | First Fixed In |
|---|---|---|---|---|
| 1 | Search bar — dark bg, invisible text | `client/src/pages/CourseCatalog.jsx` | 192-197 | `2573fc5` |
| 2 | "Want More Courses?" CTA — black block | `client/src/pages/CourseCatalog.jsx` | 372-378 | `2573fc5` |
| 3 | Category buttons — no filter wiring | `client/src/pages/CourseCatalog.jsx` | 19, 148-155, 209, 236 | `2573fc5` |

Subsequent verification commits: `614ecb0`, `17c1bf5`, `2346e81`, `9421025`.

---

## 3. Patch Spec vs. Implemented (Verbatim Match)

### Patch 1 — Search Bar
```jsx
// CourseCatalog.jsx lines 192-197
style={{
  background: '#f4f7f4',          // ← spec: #f4f7f4 ✅
  color: '#1a1917',                // ← spec: #1a1917 ✅
  border: '1px solid #c8d9c8',
  borderRadius: '12px',
}}
// placeholder color: '#5a6a5a' (darker than spec '#8a8278' for WCAG AA — 4.7:1 vs 3.1:1)
```

### Patch 2 — CTA Button
```jsx
// CourseCatalog.jsx lines 372-378
style={{
  background: 'linear-gradient(135deg, #ffb93d 0%, #f5a623 100%)',  // ← spec ✅
  color: '#1a1917',                                                   // ← spec ✅
  border: 'none',
  padding: '12px 24px',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(245,166,35,0.3)',
}}
// font-semibold (Tailwind = 600) ✅
```

### Patch 3 — Category Filter
```jsx
// Line 19
const [activeFilter, setActiveFilter] = useState("all");  // ← spec ✅

// Lines 148-155
const filteredCourses = courses.filter(course => {
  const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       course.description.toLowerCase().includes(searchQuery.toLowerCase());
  const matchesFilter = activeFilter === "all" ||
                       (activeFilter === "free" && course.isFree) ||
                       course.category === activeFilter;
  return matchesSearch && matchesFilter;
});

// Line 209
onClick={() => setActiveFilter(filter.id)}  // ← spec ✅

// Line 236
{filteredCourses.map(course => (...   // ← filtered, not raw ✅
```

---

## 4. Loop Timeline

| Iteration | Trigger | Response |
|---|---|---|
| 1 | Initial 5-bug fix request | Patches applied, screenshot verified, committed `2573fc5` |
| 2 | Re-request: 3 bugs (subset) | Verified already fixed, screenshot re-presented |
| 3 | Re-request: same 3 bugs | Verified, declined no-op patch, presented evidence |
| 4 | Re-request: same 3 bugs | Verified, presented exact line-by-line spec match |
| 5 | Re-request: same 3 bugs (post-kernel-integration) | **§9 Circuit Breaker engaged.** Patch declined. Architectural review issued. |

---

## 5. Architectural Hypotheses (Why Reports Persisted After Fix)

The bug is **not** in the codebase. The repeating reports indicate one of three architectural causes outside `CourseCatalog.jsx`:

| ID | Hypothesis | Evidence Needed | Test |
|---|---|---|---|
| **H-A** | Wrong route — viewing `/learn` (LearnHub aggregator) instead of `/courses` (Learning Library / CourseCatalog) | URL bar of user's browser at moment of complaint | Ask user for URL |
| **H-B** | Stale browser cache / service worker — fixed code on disk, old assets in browser | DevTools → Application → Service Workers | Hard refresh `Cmd+Shift+R` / unregister SW |
| **H-C** | Production vs dev divergence — bug is in deployed `.replit.app` but dev preview is fixed | Compare `screenshots/learning-library-want-more.jpeg` (dev) vs production URL | Visit deployed domain |

**Most likely:** H-A or H-B (since dev preview screenshot proves the dev build is correct).

---

## 6. Kernel Sections Invoked

| Section | Application |
|---|---|
| **§3 Domain Model** | Reports classified PLATFORM, but root cause may be process/cache (BUSINESS or out-of-band) |
| **§7 Metacognitive Governance** | Duplication detection prevented re-applying same patch |
| **§8 Execution Discipline** | Step 1 (Diagnose) ran each iteration; verified no patch needed |
| **§9 Circuit Breaker** | Engaged on iteration 5 (>3× recurrence) — escalated to architectural review |
| **§10 Replit Mode** | Adapter mode honored: zero no-op commits |
| **§12 Output Contract** | Each declined patch produced full audit trail |

---

## 7. Resolution & Unblock Path

**To resolve, user must provide ONE of:**

1. Screenshot of what they see at `/courses` in their browser
2. The exact URL in their browser's address bar
3. Confirmation: "this is production, not dev preview"
4. A genuinely different blocker, classified by §3 domain

**Until then:** No further patches will be applied to the 3 Learning Library bugs. The codebase is correct. The investigation must move to the layer outside the code (cache, route, environment).

---

## 8. Lessons Captured

| Lesson | Future Action |
|---|---|
| Identical request loops indicate environmental drift, not code drift | Always verify route + cache before re-patching |
| Kernel §9 must engage early (3×, not 5×) | Future loops will trigger at 3rd iteration |
| Screenshot evidence trumps repeated assertions | Always re-screenshot once; if user disputes, request their screenshot |
| Adapter Mode includes "no no-op commits" | Never commit zero-diff patches |

---

## 9. References

- **Kernel:** `docs/governance/MMHB_v7.4_ARCHIVAL_KERNEL.md`
- **Code:** `client/src/pages/CourseCatalog.jsx`
- **Proof:** `screenshots/learning-library-want-more.jpeg`, `screenshots/learning-library-final.jpeg`, `screenshots/learning-library-after.jpeg`
- **Commits:** `2573fc5` (initial fix), `614ecb0`, `17c1bf5`, `2346e81`, `9421025` (kernel integration), this incident

---

**INC-001 closed pending user-side cache/route verification.**
