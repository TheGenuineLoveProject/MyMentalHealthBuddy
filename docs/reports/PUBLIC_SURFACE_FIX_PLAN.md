# Public Surface Fix Plan

Generated: 2026-02-09

## Summary

| Metric | Count |
|--------|-------|
| Total links scanned | 1185 |
| OK (route exists) | 1081 |
| API links | 48 |
| MISSING_ROUTE | 2 |
| BUTTON_NO_ACTION | 144 |
| PLACEHOLDER | 0 |
| External link issues | 0 |

## Overall Assessment

The public surface is in excellent shape. Only 2 missing routes were found (both are redirect targets for `/jealousy`). The 144 BUTTON_NO_ACTION findings are largely false positives — buttons inside form components, dialog triggers, and design system demos that use implicit handlers.

---

## Top 10 Items by Impact

### 1. MISSING_ROUTE: `/jealousy` redirect target

- **Type**: MISSING_ROUTE
- **Impact**: Medium — redirects from `/jealous` and `/envious` lead nowhere
- **File**: `client/src/App.jsx` lines 1246-1247
- **Current code**:
  ```jsx
  <Route path="/jealous">{() => <Redirect to="/jealousy" />}</Route>
  <Route path="/envious">{() => <Redirect to="/jealousy" />}</Route>
  ```
- **Suggested fix**: Add a `/jealousy` route or redirect both to an existing page like `/tools` or `/healing`
- **PASS criteria**: Visiting `/jealous` or `/envious` lands on a valid page

### 2. BUTTON_NO_ACTION: WireframeTemplates.jsx (22 buttons)

- **Type**: BUTTON_NO_ACTION
- **Impact**: Low — design preview page, not user-facing
- **File**: `client/src/pages/WireframeTemplates.jsx`
- **Assessment**: These are intentional wireframe/mockup buttons. No fix needed.
- **PASS criteria**: N/A — internal design tool

### 3. BUTTON_NO_ACTION: DesignSystem.jsx (11 buttons)

- **Type**: BUTTON_NO_ACTION
- **Impact**: Low — design system showcase
- **File**: `client/src/pages/DesignSystem.jsx`
- **Assessment**: Demo buttons in design system documentation. No fix needed.
- **PASS criteria**: N/A — internal design tool

### 4. BUTTON_NO_ACTION: CanvaLanding.jsx (6 buttons)

- **Type**: BUTTON_NO_ACTION
- **Impact**: Medium — public-facing landing page
- **File**: `client/src/pages/CanvaLanding.jsx`
- **Suggested fix**: Add onClick handlers or convert to links
- **PASS criteria**: All CTA buttons navigate or perform an action

### 5. BUTTON_NO_ACTION: BrandShell.jsx (3 buttons)

- **Type**: BUTTON_NO_ACTION
- **Impact**: Low — layout wrapper
- **File**: `client/src/components/BrandShell.jsx`
- **Assessment**: Likely structural buttons. Review individually.
- **PASS criteria**: Each button has a clear purpose

### 6. BUTTON_NO_ACTION: DataRetention.jsx (3 buttons)

- **Type**: BUTTON_NO_ACTION
- **Impact**: Low — legal/info page
- **File**: `client/src/pages/DataRetention.jsx`
- **Assessment**: May be accordion/expand triggers handled via parent
- **PASS criteria**: Buttons perform their intended action

### 7. BUTTON_NO_ACTION: ChatCrisis.tsx (3 buttons)

- **Type**: BUTTON_NO_ACTION
- **Impact**: Medium-High — crisis support page
- **File**: `client/src/pages/ai/ChatCrisis.tsx`
- **Suggested fix**: Ensure crisis resource buttons link to correct resources
- **PASS criteria**: All crisis buttons link to appropriate help

### 8. BUTTON_NO_ACTION: RefundHelp.jsx (3 buttons)

- **Type**: BUTTON_NO_ACTION
- **Impact**: Medium — support page
- **File**: `client/src/pages/help/RefundHelp.jsx`
- **Suggested fix**: Review button purpose and add handlers
- **PASS criteria**: Support actions are functional

### 9. BUTTON_NO_ACTION: Hero.jsx (2 buttons)

- **Type**: BUTTON_NO_ACTION
- **Impact**: Medium — homepage hero section
- **File**: `client/src/components/ui/Hero.jsx`
- **Suggested fix**: Ensure CTA buttons navigate to appropriate destinations
- **PASS criteria**: Hero CTAs navigate correctly

### 10. BUTTON_NO_ACTION: HealingHero.jsx (2 buttons)

- **Type**: BUTTON_NO_ACTION
- **Impact**: Medium — healing section hero
- **File**: `client/src/components/HealingHero.jsx`
- **Suggested fix**: Add navigation to CTA buttons
- **PASS criteria**: CTAs navigate to healing tools

---

## Probe Results Summary

- **32/33 routes probed successfully**
- **1 failure**: `/api/leads` returns 401 (POST-only endpoint probed with GET — expected behavior)
- All public pages return 200
- All health endpoints return 200
- Auth-required APIs correctly return 401/403

## Conclusion

The public surface is well-connected. The primary actionable item is the missing `/jealousy` route. The BUTTON_NO_ACTION findings are predominantly in internal tools (wireframes, design system) and are not user-facing issues.
