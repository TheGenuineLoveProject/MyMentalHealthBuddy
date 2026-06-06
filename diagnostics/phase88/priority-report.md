# Phase 88 Priority Report

## Hard Truth
The platform should not proceed into new feature expansion until the audit findings are converted into isolated implementation phases. The current safest path is not broad refactoring. It is one verified gap at a time.

## Current State Snapshot
```json
{
  "allFiles": 57958,
  "codeFiles": 20711,
  "clientFiles": 1384,
  "pageFiles": 320,
  "componentFiles": 499,
  "frontendRoutesInApp": 999,
  "lazyImportsInApp": 269,
  "serverRouteFiles": 141,
  "mountedServerRoutes": 23,
  "likelyUnmountedServerRoutes": 124,
  "likelyOrphanPages": 49,
  "duplicateComponentGroups": 9,
  "rootShadowDirs": 5,
  "topLevelClutterFiles": 31,
  "markerFindings": 9010,
  "suspiciousButtons": 190,
  "offPaletteFiles": 718,
  "lumiFiles": 2870,
  "lumiReferences": 266,
  "duplicateFrontendRoutes": 0
}
```

## P0 — Runtime/API Risk
Likely unmounted server route modules detected: 80

- server/routes/account.mjs
- server/routes/accountActions.mjs
- server/routes/admin-security.mjs
- server/routes/admin-social-studio.mjs
- server/routes/ai-dashboard.mjs
- server/routes/analytics.mjs
- server/routes/api.mjs
- server/routes/audit-logs.mjs
- server/routes/awareness.mjs
- server/routes/badges.mjs
- server/routes/biometrics.mjs
- server/routes/canva-oauth.mjs
- server/routes/cognitive-enhancement.mjs
- server/routes/cognitive-lab.mjs
- server/routes/cognitive-mastery.mjs
- server/routes/collective-intelligence.mjs
- server/routes/community.mjs
- server/routes/consciousness-expansion.mjs
- server/routes/consciousness.mjs
- server/routes/contact.mjs
- server/routes/contemplative.mjs
- server/routes/content-generator.mjs
- server/routes/content-intelligence.mjs
- server/routes/content-studio.mjs
- server/routes/content.mjs
- server/routes/creativity.mjs
- server/routes/deep-learning.mjs
- server/routes/deploymentReadiness.mjs
- server/routes/dialectics.mjs
- server/routes/discernment.mjs
- server/routes/email.mjs
- server/routes/embodiment.mjs
- server/routes/emotional-mastery.mjs
- server/routes/emotional-resilience.mjs
- server/routes/ethical-reasoning.mjs
- server/routes/existential.mjs
- server/routes/favorites.mjs
- server/routes/feed.mjs
- server/routes/feedback.mjs
- server/routes/figma.mjs
- server/routes/foresight.mjs
- server/routes/gratitude.mjs
- server/routes/growth-journey.mjs
- server/routes/healing-intelligence.mjs
- server/routes/healing-modalities.mjs
- server/routes/healing-tools.mjs
- server/routes/healing.mjs
- server/routes/holistic-healing.mjs
- server/routes/human-potential.mjs
- server/routes/insights.mjs
- server/routes/integrationHealth.mjs
- server/routes/invites.mjs
- server/routes/journal.mjs
- server/routes/kernel.mjs
- server/routes/knowledge.mjs
- server/routes/leads.mjs
- server/routes/life-design.mjs
- server/routes/life-purpose.mjs
- server/routes/login.mjs
- server/routes/mastery-excellence.mjs
- server/routes/meaning-future.mjs
- server/routes/meaning.mjs
- server/routes/metacognition.mjs
- server/routes/metrics.mjs
- server/routes/metricsSummary.mjs
- server/routes/mfa.mjs
- server/routes/mind-body-integration.mjs
- server/routes/mirror.mjs
- server/routes/mood.mjs
- server/routes/narrative-drafts.mjs
- server/routes/narrative.mjs
- server/routes/neuro-integration.mjs
- server/routes/newsletter.mjs
- server/routes/object-storage.mjs
- server/routes/observability.mjs
- server/routes/onboarding.mjs
- server/routes/peacescape.mjs
- server/routes/peak-performance.mjs
- server/routes/perplexity.mjs
- server/routes/personal-growth.mjs

## P1 — Content/SEO Page Wiring Risk
Likely orphan frontend pages detected: 49

- client/src/pages/AffirmationsPage.jsx
- client/src/pages/BodyWellnessPage.jsx
- client/src/pages/BreathingExercisesPage.jsx
- client/src/pages/CalmingScenesPage.jsx
- client/src/pages/CognitiveToolsPage.jsx
- client/src/pages/ContentIndexPage.jsx
- client/src/pages/ControlDashboard.jsx
- client/src/pages/DailyRoutinesPage.jsx
- client/src/pages/DesignDashboard.jsx
- client/src/pages/Disclaimer.tsx
- client/src/pages/EmotionalIntelligencePage.jsx
- client/src/pages/ExamplesPage.jsx
- client/src/pages/GlossaryPage.jsx
- client/src/pages/GroundingTechniquesPage.jsx
- client/src/pages/HealingJourneysPage.jsx
- client/src/pages/HealingLibraryPage.jsx
- client/src/pages/HealthPage.jsx
- client/src/pages/HowToGuidesPage.jsx
- client/src/pages/InnerChildPage.jsx
- client/src/pages/MeditationGuidePage.jsx
- client/src/pages/NewsPage.jsx
- client/src/pages/NotFound.jsx
- client/src/pages/ProfessionalResourcesPage.jsx
- client/src/pages/QAPage.jsx
- client/src/pages/ResearchEvidencePage.jsx
- client/src/pages/ResourcesPage.jsx
- client/src/pages/SelfCareToolkitPage.jsx
- client/src/pages/SleepGuidePage.jsx
- client/src/pages/SoulWellnessPage.jsx
- client/src/pages/StressResponseGuidePage.jsx
- client/src/pages/SupportPage.tsx
- client/src/pages/Terms.tsx
- client/src/pages/WellnessGlossaryPage.jsx
- client/src/pages/WellnessHubPage.jsx
- client/src/pages/WireframeTemplates.jsx
- client/src/pages/_quarantine/legacy-landing/HealingLandingPage.jsx
- client/src/pages/_quarantine/legacy-landing/LandingV2.jsx
- client/src/pages/admin/_adminTools/AIDiagnosticsPanel.jsx
- client/src/pages/admin/_adminTools/AIRepairCenter.jsx
- client/src/pages/admin/_adminTools/DailyOpsRunbook.jsx
- client/src/pages/admin/_adminTools/GitIntegrityScanner.jsx
- client/src/pages/admin/_adminTools/PlatformCoverageReport.jsx
- client/src/pages/admin/_adminTools/PlatformIntegrityDeepScan.jsx
- client/src/pages/admin/_adminTools/PlatformIntegrityScanner.jsx
- client/src/pages/admin/_adminTools/QuickDiagnostics.jsx
- client/src/pages/admin/_adminToolsShared.js
- client/src/pages/dashboard/MoodTracker.jsx
- client/src/pages/discovery/DiscoveryPage.jsx
- client/src/pages/tools/ToolDirectoryPage.jsx

## P2 — Duplicate Ownership Risk
Duplicate component/page groups detected: 9


```
client/src/pages/BehaviorChangePage.jsx
client/src/pages/BehaviorChangePage.tsx
```

```
client/src/pages/Privacy.jsx
client/src/pages/Privacy.tsx
```

```
client/src/pages/Reflection.jsx
client/src/pages/reflection.tsx
```

```
client/src/components/StateTracker.jsx
client/src/components/StateTracker.tsx
```

```
client/src/components/UpsellModal.jsx
client/src/components/UpsellModal.tsx
```

```
client/src/components/ui/Button.jsx
client/src/components/ui/button.tsx
```

```
client/src/components/ui/Card.jsx
client/src/components/ui/card.tsx
```

```
client/src/components/ui/Label.jsx
client/src/components/ui/label.tsx
```

```
client/src/components/ui/ReflectionFooter.jsx
client/src/components/ui/ReflectionFooter.tsx
```

## P3 — Incomplete/Placeholder Content Risk
Stub/placeholder/TODO findings detected: 9010

- .archive/runtime-violations/server/routes/content.ts:15: // TODO: persist to DB
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/@squoosh/lib/build/index.js:1: 'use strict';Object.defineProperty(exports,"__esModule",{value:true});var worker_threads=require("worker_threads");var os=require("os");var fs=require("fs");var url=require("url");var webStreamsPolyfill=require("web-streams-polyfill");funct
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/@squoosh/lib/build/index.js:24: */function resize(input_image,input_width,input_height,output_width,output_height,typ_idx,premultiply,color_space_conversion){try{const retptr=wasm.__wbindgen_add_to_stack_pointer(-16);var ptr0=passArray8ToWasm0(input_image,wasm.__wbindgen_
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/@squoosh/lib/build/index.js:26: const writer=this.workerQueue.writable.getWriter();writer.write(worker);writer.releaseLock()})}}async _nextWorker(){const reader=this.workerQueue.readable.getReader();const{value,done}=await reader.read();reader.releaseLock();return value}a
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/base64-js/index.js:29: // Trim off extra bytes after placeholder bytes are found
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/base64-js/index.js:34: var placeHoldersLen = validLen === len
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/base64-js/index.js:38: return [validLen, placeHoldersLen]
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/base64-js/index.js:45: var placeHoldersLen = lens[1]
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/base64-js/index.js:46: return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/base64-js/index.js:49: function _byteLength (b64, validLen, placeHoldersLen) {
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/base64-js/index.js:50: return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/base64-js/index.js:57: var placeHoldersLen = lens[1]
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/base64-js/index.js:59: var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/base64-js/index.js:63: // if there are placeholders, only get up to the last complete 4 chars
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/base64-js/index.js:64: var len = placeHoldersLen > 0
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/base64-js/index.js:80: if (placeHoldersLen === 2) {
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/base64-js/index.js:87: if (placeHoldersLen === 1) {
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/chalk/index.d.ts:148: (text: TemplateStringsArray, ...placeholders: unknown[]): string;
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/chalk/source/templates.js:105: temporary.replace(TEMPLATE_REGEX, (m, escapeCharacter, inverse, style, close, character) => {
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/chalk/source/templates.js:99: module.exports = (chalk, temporary) => {
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/cli-spinners/index.d.ts:124: // TODO: Remove this for the next major release
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/commander/index.js:1348: baseDir = '.'; // dummy, probably not going to find executable!
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/commander/index.js:2049: // message: do not have all displayed text available so only passing placeholder.
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/commander/index.js:2129: // (Do not have all displayed text available so only passing placeholder.)
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/commander/index.js:21: * Get an array of the visible subcommands. Includes a placeholder for the implicit help command, if there is one.
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/commander/index.js:47: * Get an array of the visible options. Includes a placeholder for the implicit help option, if there is one.
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/commander/typings/index.d.ts:110: /** Get an array of the visible subcommands. Includes a placeholder for the implicit help command, if there is one. */
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/commander/typings/index.d.ts:112: /** Get an array of the visible options. Includes a placeholder for the implicit help option, if there is one. */
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/mimic-fn/index.d.ts:41: // TODO: Remove this for the next major release, refactor the whole definition to:
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/mimic-fn/index.js:12: // TODO: Remove this for the next major release
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/onetime/index.d.ts:60: // TODO: Remove this for the next major release
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/onetime/index.js:35: // TODO: Remove this for the next major release
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/readable-stream/errors-browser.js:113: return 'The ' + name + ' method is not implemented';
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/readable-stream/errors.js:101: return 'The ' + name + ' method is not implemented'
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/readable-stream/lib/_stream_readable.js:324: // TODO(ronag): Throw ERR_VALUE_OUT_OF_RANGE.
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/readable-stream/lib/_stream_transform.js:184: // TODO(BridgeAR): Write a test for these two error cases
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/readable-stream/lib/_stream_writable.js:265: // TODO: defer error events consistently everywhere, not just the cb
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/web-streams-polyfill/dist/polyfill.es2018.js:1058: // TODO: Test controller argument
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/web-streams-polyfill/dist/polyfill.es2018.js:1378: // TODO: Ideally in this branch detaching should happen only if the buffer is not consumed fully.
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/web-streams-polyfill/dist/polyfill.es2018.js:2167: // TODO(ricea): Fix alphabetical order.
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/web-streams-polyfill/dist/polyfill.es2018.js:355: // TODO Use BigInt if supported?
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/web-streams-polyfill/dist/polyfill.es2018.js:3978: // Stub implementation, overridden below
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/web-streams-polyfill/dist/polyfill.es2018.js:576: // FIXME Is this a bug in the specification, or in the test?
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/web-streams-polyfill/dist/polyfill.es2018.js:678: // Not implemented correctly
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/web-streams-polyfill/dist/polyfill.es2018.js:688: // Not implemented correctly
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/web-streams-polyfill/dist/polyfill.es2018.mjs:1052: // TODO: Test controller argument
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/web-streams-polyfill/dist/polyfill.es2018.mjs:1372: // TODO: Ideally in this branch detaching should happen only if the buffer is not consumed fully.
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/web-streams-polyfill/dist/polyfill.es2018.mjs:2161: // TODO(ricea): Fix alphabetical order.
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/web-streams-polyfill/dist/polyfill.es2018.mjs:349: // TODO Use BigInt if supported?
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/web-streams-polyfill/dist/polyfill.es2018.mjs:3972: // Stub implementation, overridden below
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/web-streams-polyfill/dist/polyfill.es2018.mjs:570: // FIXME Is this a bug in the specification, or in the test?
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/web-streams-polyfill/dist/polyfill.es2018.mjs:672: // Not implemented correctly
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/web-streams-polyfill/dist/polyfill.es2018.mjs:682: // Not implemented correctly
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/web-streams-polyfill/dist/polyfill.es6.js:1131: // TODO: Test controller argument
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/web-streams-polyfill/dist/polyfill.es6.js:1451: // TODO: Ideally in this branch detaching should happen only if the buffer is not consumed fully.
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/web-streams-polyfill/dist/polyfill.es6.js:2240: // TODO(ricea): Fix alphabetical order.
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/web-streams-polyfill/dist/polyfill.es6.js:355: // TODO Use BigInt if supported?
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/web-streams-polyfill/dist/polyfill.es6.js:4051: // Stub implementation, overridden below
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/web-streams-polyfill/dist/polyfill.es6.js:617: // Not implemented correctly
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/web-streams-polyfill/dist/polyfill.es6.js:627: // Not implemented correctly
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/web-streams-polyfill/dist/polyfill.es6.js:757: // FIXME Is this a bug in the specification, or in the test?
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/web-streams-polyfill/dist/polyfill.es6.mjs:1125: // TODO: Test controller argument
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/web-streams-polyfill/dist/polyfill.es6.mjs:1445: // TODO: Ideally in this branch detaching should happen only if the buffer is not consumed fully.
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/web-streams-polyfill/dist/polyfill.es6.mjs:2234: // TODO(ricea): Fix alphabetical order.
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/web-streams-polyfill/dist/polyfill.es6.mjs:349: // TODO Use BigInt if supported?
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/web-streams-polyfill/dist/polyfill.es6.mjs:4045: // Stub implementation, overridden below
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/web-streams-polyfill/dist/polyfill.es6.mjs:611: // Not implemented correctly
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/web-streams-polyfill/dist/polyfill.es6.mjs:621: // Not implemented correctly
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/web-streams-polyfill/dist/polyfill.es6.mjs:751: // FIXME Is this a bug in the specification, or in the test?
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/web-streams-polyfill/dist/polyfill.js:1204: // TODO: Test controller argument
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/web-streams-polyfill/dist/polyfill.js:1524: // TODO: Ideally in this branch detaching should happen only if the buffer is not consumed fully.
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/web-streams-polyfill/dist/polyfill.js:2330: // TODO(ricea): Fix alphabetical order.
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/web-streams-polyfill/dist/polyfill.js:4184: // Stub implementation, overridden below
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/web-streams-polyfill/dist/polyfill.js:457: // TODO Use BigInt if supported?
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/web-streams-polyfill/dist/polyfill.js:661: // Not implemented correctly
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/web-streams-polyfill/dist/polyfill.js:671: // Not implemented correctly
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/web-streams-polyfill/dist/polyfill.js:814: // FIXME Is this a bug in the specification, or in the test?
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/web-streams-polyfill/dist/polyfill.mjs:1198: // TODO: Test controller argument
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/web-streams-polyfill/dist/polyfill.mjs:1518: // TODO: Ideally in this branch detaching should happen only if the buffer is not consumed fully.
- .config/npm/node_global/lib/node_modules/@squoosh/cli/node_modules/web-streams-polyfill/dist/polyfill.mjs:2324: // TODO(ricea): Fix alphabetical order.

## P4 — Button Visibility Risk
Button label risk findings detected: 190

- client/src/components/AccessibilityAudit.jsx: button lacks visible text/aria-label/title
- client/src/components/AchievementBadge.jsx: button lacks visible text/aria-label/title
- client/src/components/AffirmationCards.jsx: button lacks visible text/aria-label/title
- client/src/components/AnxietyRelief.jsx: button lacks visible text/aria-label/title
- client/src/components/BoundaryBuilder.jsx: button lacks visible text/aria-label/title
- client/src/components/BreathingExercise.jsx: button lacks visible text/aria-label/title
- client/src/components/ContentStudio.jsx: button lacks visible text/aria-label/title
- client/src/components/CreativeExpression.jsx: button lacks visible text/aria-label/title
- client/src/components/DailyAffirmations.jsx: button lacks visible text/aria-label/title
- client/src/components/EmptyState.jsx: button lacks visible text/aria-label/title
- client/src/components/EmptyState.jsx: button lacks visible text/aria-label/title
- client/src/components/FeedbackWidget.jsx: button lacks visible text/aria-label/title
- client/src/components/HealingHero.jsx: button lacks visible text/aria-label/title
- client/src/components/HealingHero.jsx: button lacks visible text/aria-label/title
- client/src/components/JoinSection.jsx: button lacks visible text/aria-label/title
- client/src/components/LaughterTherapy.jsx: button lacks visible text/aria-label/title
- client/src/components/LevelUpModal.jsx: button lacks visible text/aria-label/title
- client/src/components/MeditationTimer.jsx: button lacks visible text/aria-label/title
- client/src/components/NewsletterSignup.jsx: button lacks visible text/aria-label/title
- client/src/components/PageTemplate.jsx: button lacks visible text/aria-label/title
- client/src/components/PositiveReframing.jsx: button lacks visible text/aria-label/title
- client/src/components/ReminderScheduler.jsx: button lacks visible text/aria-label/title
- client/src/components/ReminderSettings.jsx: button lacks visible text/aria-label/title
- client/src/components/SacredForm.jsx: button lacks visible text/aria-label/title
- client/src/components/SelfCompassion.jsx: button lacks visible text/aria-label/title
- client/src/components/ShareReflection.jsx: button lacks visible text/aria-label/title
- client/src/components/ShareReflection.jsx: button lacks visible text/aria-label/title
- client/src/components/SleepSanctuary.jsx: button lacks visible text/aria-label/title
- client/src/components/SleepTracker.jsx: button lacks visible text/aria-label/title
- client/src/components/SomaticRelease.jsx: button lacks visible text/aria-label/title
- client/src/components/StateTracker.jsx: button lacks visible text/aria-label/title
- client/src/components/StreakCelebration.jsx: button lacks visible text/aria-label/title
- client/src/components/ValuesExplorer.jsx: button lacks visible text/aria-label/title
- client/src/components/VoiceSettings.jsx: button lacks visible text/aria-label/title
- client/src/components/WeeklyReflection.jsx: button lacks visible text/aria-label/title
- client/src/components/WorryTimeScheduler.jsx: button lacks visible text/aria-label/title
- client/src/components/admin/AIKnowledgeHub.jsx: button lacks visible text/aria-label/title
- client/src/components/admin/ConsciousnessRegistryPanel.jsx: button lacks visible text/aria-label/title
- client/src/components/admin/OperationsPanel.jsx: button lacks visible text/aria-label/title
- client/src/components/admin/SOPMonitorPanel.jsx: button lacks visible text/aria-label/title
- client/src/components/admin/SystemHealthPanel.jsx: button lacks visible text/aria-label/title
- client/src/components/consciousness/QuestionReflection.tsx: button lacks visible text/aria-label/title
- client/src/components/consciousness/SilenceMode.tsx: button lacks visible text/aria-label/title
- client/src/components/content/ExamplesAccordion.jsx: button lacks visible text/aria-label/title
- client/src/components/content/GlossaryTerm.jsx: button lacks visible text/aria-label/title
- client/src/components/inquiry/DialecticalInquiry.tsx: button lacks visible text/aria-label/title
- client/src/components/journey/JourneyComposer.tsx: button lacks visible text/aria-label/title
- client/src/components/logic/LogicLatticeLab.tsx: button lacks visible text/aria-label/title
- client/src/components/lumi/LumiCustomizer.jsx: button lacks visible text/aria-label/title
- client/src/components/marketing/EmailCapture.jsx: button lacks visible text/aria-label/title
- client/src/components/metacognition/MetaCognitionStudio.tsx: button lacks visible text/aria-label/title
- client/src/components/mi/MITools.tsx: button lacks visible text/aria-label/title
- client/src/components/mi/MITools.tsx: button lacks visible text/aria-label/title
- client/src/components/mi/ReframingToolkit.tsx: button lacks visible text/aria-label/title
- client/src/components/paradox/ParadoxCartographer.tsx: button lacks visible text/aria-label/title
- client/src/components/patterns/InsightPatternLab.tsx: button lacks visible text/aria-label/title
- client/src/components/progress/TinyStepPanel.jsx: button lacks visible text/aria-label/title
- client/src/components/publishing/NewsletterInvite.jsx: button lacks visible text/aria-label/title
- client/src/components/publishing/NewsletterInvite.jsx: button lacks visible text/aria-label/title
- client/src/components/referral/ReferralInvite.jsx: button lacks visible text/aria-label/title
- client/src/components/semantic/SemanticMapping.tsx: button lacks visible text/aria-label/title
- client/src/components/share/IdentityMirror.jsx: button lacks visible text/aria-label/title
- client/src/components/share/InfinityHeartCard.jsx: button lacks visible text/aria-label/title
- client/src/components/share/InfinityHeartCard.jsx: button lacks visible text/aria-label/title
- client/src/components/share/ShareCardPrompt.tsx: button lacks visible text/aria-label/title
- client/src/components/share/ShareCardPrompt.tsx: button lacks visible text/aria-label/title
- client/src/components/share/ShareCardPrompt.tsx: button lacks visible text/aria-label/title
- client/src/components/share/ShareCardPrompt.tsx: button lacks visible text/aria-label/title
- client/src/components/share/ShareCardPrompt.tsx: button lacks visible text/aria-label/title
- client/src/components/share/StreakShare.jsx: button lacks visible text/aria-label/title
- client/src/components/stance/PhilosophicalStanceMapper.tsx: button lacks visible text/aria-label/title
- client/src/components/state/StateTracker.tsx: button lacks visible text/aria-label/title
- client/src/components/synthesis/SynthesisCollider.tsx: button lacks visible text/aria-label/title
- client/src/components/systems/SystemsResonance.tsx: button lacks visible text/aria-label/title
- client/src/components/systems/SystemsResonance.tsx: button lacks visible text/aria-label/title
- client/src/components/temporal/TemporalReflection.tsx: button lacks visible text/aria-label/title
- client/src/components/ui/Button.jsx: button lacks visible text/aria-label/title
- client/src/components/ui/EmptyState.jsx: button lacks visible text/aria-label/title
- client/src/components/ui/Hero.jsx: button lacks visible text/aria-label/title
- client/src/components/ui/Hero.jsx: button lacks visible text/aria-label/title

## P5 — Visual Palette Drift Risk
Files with off-palette hardcoded colors detected: 718

- .archive/attached_assets_2026-05-10/lumi-admin_1777440789106.css -> #2d6a4f, #c4e5d8, #a65d4a, #f0c4b8, #b34d3d, #8a5a00, #d4943a, #8a3a2a, #3a5a8a, #5a8ad4
- .archive/attached_assets_2026-05-10/lumi-admin_1777524566229.css -> #2d6a4f, #c4e5d8, #a65d4a, #f0c4b8, #b34d3d, #8a5a00, #d4943a, #8a3a2a, #3a5a8a, #5a8ad4
- .archive/attached_assets_2026-05-10/lumi-mascot_1777440789106.css -> #ffffff, #f4f7f4, #faf9f6, #a3c2a3, #f5a623, #fff8ed, #6b655c
- .archive/attached_assets_2026-05-10/lumi-mascot_1777524566228.css -> #ffffff, #f4f7f4, #faf9f6, #a3c2a3, #f5a623, #fff8ed, #6b655c
- .archive/attached_assets_2026-05-10/lumi-tokens_1777440789106.css -> #f4f7f4, #e3ebe3, #c8d9c8, #a3c2a3, #7aa87a, #5a8a5a, #4a7a4a, #3d6b3d, #2f5a2f, #1f3d1f, #112811, #fff8ed, #ffefc4, #ffe09a, #ffce6b, #ffb93d, #f5a623, #e09000, #b87200, #8a5a00, #5c3d00, #faf9f6, #f2f0eb, #e6e2da, #d1ccc0, #a8a095, #8a8278, #6b655c, #4d4842, #2e2c28, #1a1917, #7eb8a2, #d4ede4, #a8c686, #e1edd3, #e8927c, #f5d4cc, #8fa7d4, #d8e0f0, #f5c156, #fcebc7, #b8a9c9, #e5deec, #ffffff, #000000, #c45b4a, #f0d4d0, #d4943a, #f5e5d0
- .archive/attached_assets_2026-05-10/lumi-tokens_1777524566228.css -> #f4f7f4, #e3ebe3, #c8d9c8, #a3c2a3, #7aa87a, #5a8a5a, #4a7a4a, #3d6b3d, #2f5a2f, #1f3d1f, #112811, #fff8ed, #ffefc4, #ffe09a, #ffce6b, #ffb93d, #f5a623, #e09000, #b87200, #8a5a00, #5c3d00, #faf9f6, #f2f0eb, #e6e2da, #d1ccc0, #a8a095, #8a8278, #6b655c, #4d4842, #2e2c28, #1a1917, #7eb8a2, #d4ede4, #a8c686, #e1edd3, #e8927c, #f5d4cc, #8fa7d4, #d8e0f0, #f5c156, #fcebc7, #b8a9c9, #e5deec, #ffffff, #000000, #c45b4a, #f0d4d0, #d4943a, #f5e5d0
- .config/npm/node_global/lib/node_modules/vite-bundle-visualizer/node_modules/rollup-plugin-visualizer/dist/lib/flamegraph.css -> #2b2d42, #edf2f4
- .config/npm/node_global/lib/node_modules/vite-bundle-visualizer/node_modules/rollup-plugin-visualizer/dist/lib/network.css -> #2b2d42, #edf2f4
- .config/npm/node_global/lib/node_modules/vite-bundle-visualizer/node_modules/rollup-plugin-visualizer/dist/lib/sunburst.css -> #2b2d42, #edf2f4
- .config/npm/node_global/lib/node_modules/vite-bundle-visualizer/node_modules/rollup-plugin-visualizer/dist/lib/treemap.css -> #2b2d42, #edf2f4
- .hx-backups/20260516-065915/client/dist/assets/AvatarLab-B6WI5thR.css -> #f5f0e8, #a8c9a0, #f5a3a3, #1a1a1a, #2a2a2a, #4a7e722e, #fff
- .hx-backups/20260516-065915/client/dist/assets/BreathingTool-DS2q5R40.css -> #74c0fc1f, #0000, #a8d5ba24, #ffb88c1a, #c8b6ff24, #ffd93d24, #74c0fc, #74c0fc59, #a8d5ba4d, #74c0fc73, #74c0fc4d, #c8b6ff80, #c8b6ff52, #a8c9a073, #a8c9a04d, #74c0fc2e, #c8b6ff38, #a8c9a02e, #c8b6ff, #a8c9a0, #74c0fc33, #74c0fcf2, #c8b6fff2, #a8c9a0f2, #74c0fc00
- .hx-backups/20260516-065915/client/dist/assets/CanvaLanding-Bi6MZ_aZ.css -> #be862259, #be86228c, #be862266, #be862299, #f6f1e8, #163a36, #8fbf9f, #2f5d5d, #c4787a, #8fbf9f1a, #8fbf9f26, #8fbf9f33, #8fbf9f4d, #8fbf9f66, #2f5d5d1f, #2f5d5d33, #2f5d5d4d, #2f5d5d66, #c4787a1a, #c4787a26, #c4787a33, #c4787a4d, #0000, #fff, #be86224d, #be862280, #be86222e, #fcf6eaf2, #1ec8902e, #fff9, #be862214, #062a2a0f, #ffffff80, #ffffffb3, #be86223d, #be86221a, #062a2a14, #00000026, #00000080, #1ec89014, #062a2a0a, #6c58b80f, #d086720d, #1ec89040, #6c58b826, #1ec89000, #6c58b800, #f0d080, #163d3d0a, #163d3d0f
- .hx-backups/20260516-065915/client/dist/assets/CelebrationFlow-D71fqt0c.css -> #ffd93d38, #0000, #ffb88c26, #ffd93d1f, #a8c9a01a, #ffd93d, #ffd93d2e
- .hx-backups/20260516-065915/client/dist/assets/CheckIn-KbUv1xsW.css -> #c8b6ff2e, #0000, #c8b6ff1a, #ff9a8b0f, #ffd93d2e, #ffd93d14, #ffb88c0f, #c8b6ff
- .hx-backups/20260516-065915/client/dist/assets/CommandCenter-BfVTyNhP.css -> #fdfcfb, #f5f2ef, #8a9a5b33, #fff, #8a9a5b0d, #0000000a, #2d6a4f1a, #8a9a5b1a, #8a9a5b, #8a9a5b08, #0000, #8a9a5b14, #2c6e63, #888, #8a9a5b4d
- .hx-backups/20260516-065915/client/dist/assets/ContentStudioPage-DH_xWkv_.css -> #3a3a3a, #faf9f7, #0000, #8fbf9f1a, #8fbf9f4d, #2f5d5d, #8fbf9f, #8fbf9f26, #2f5d5d1a, #fff, #0000000d, #2f5d5d33, #8fbf9f33, #eac33b, #eac33b1a, #2f5d5d0d
- .hx-backups/20260516-065915/client/dist/assets/LumiV6Preview-DMCLDRmU.css -> #141e1917, #141e191a, #fff7e8c7, #fff7e88c, #fff7e81a, #0000, #fff8ee, #50321e2e, #2d1810, #ffffff8c, #ff8c4273, #ffb2478c, #ff8c4240, #1a1917, #fff, #ead7b9, #3c28141a, #d4546a, #a8c9a02e, #0000001a, #ffb247e6, #ffb247a6, #ff8c4200, #ffd93d8c, #ffb88c80, #ff9a8b80, #a8d5ba80, #c8b6ff80, #e8913a59, #e8913ad9, #e8913a8c, #e8913a00, #e8913ab3, #ffd93d99, #ffd93d, #ffc857, #a8c9a099, #74c0fc8c, #c8b6ff8c, #ff9a8b00, #ffd93d80, #ffd93d00, #ff9a8b8c, #c8b6ff00, #a8c9a073, #a8c9a000, #74c0fc80, #74c0fc1a, #a8c9a01a, #c8b6ff14
- .hx-backups/20260516-065915/client/dist/assets/Overview-DThRZbH-.css -> #fdfcfb, #f5f2ef, #d4a80040, #1a1917, #fff, #0000000a, #00000014, #2d6a4f1a, #8a9a5b0d, #5a8a5a, #c8d9c8, #f5faf5, #a3c2a3, #8a9a5b4d, #7a8c7e
- .hx-backups/20260516-065915/client/dist/assets/PeacescapePage-DfUayL-v.css -> #be86220d, #0000, #1ec8900d, #be86228c, #1ec890a6, #1ec8904d, #ffffffd9, #062a2a14, #062a2a12, #fffc, #be86222e, #2d503c1f, #fffffff5, #fcf6ea73, #1ec89033, #062a2a0a, #062a2a0d, #be862280, #1ec89052, #ffffffe6, #062a2a0f, #062a2a, #0d4a3d
- .hx-backups/20260516-065915/client/dist/assets/WellnessPageShell-DJNG-4h4.css -> #be86220a, #0000, #1ec8900b, #fffffff2, #fcf6ea66, #ffffffb3, #062a2a0a, #fff, #fcf6eaa6, #1ec89066, #ffffffd9, #062a2a0f, #be86221f, #062a2a0d, #fcf6ea4d, #1ec89033, #be862280, #1ec89099, #ffffffe6, #062a2a14, #1ec8904d, #fffc, #062a2a08, #fffffff7, #fcf6ea40, #1ec8902e, #062a2a, #0d4a3d
- .hx-backups/20260516-065915/client/dist/assets/ZenScape-CBZtDpQF.css -> #1f2933, #7fd8a859, #0000, #fffffff5, #2d503c2e, #2d503c14, #2d5040, #7fd8a82e, #7fd8a873, #7fd8a8b3, #f5fcf8fa, #7fd8a88c, #7fd8a838, #7fd8a824, #7fd8a8a6, #7fd8a800, #ffd75a1a, #ffd75a00, #faf8f3, #8fbf9f0f, #ffffffd9, #264f4f, #7fd8a8, #5ddb94, #ffd75a, #f4b6c2, #e08fa1, #ffd7ba, #ffe08a, #f0c46a, #ffaa6e, #9fd4f4, #7bb8e8, #d4e8fa, #c8b6f0, #a693dc, #f0e0f8, #ffb89d, #f09a85, #ffe2b5, #00000014, #fffffff2
- .hx-backups/20260516-065915/client/dist/assets/glp-pane-DKnephKp.css -> #1ec89033, #ffffffd9, #062a2a0a, #062a2a0d, #fff, #fcf6ea4d, #0000, #be862280, #1ec89099, #1ec8904d, #ffffffe6, #062a2a0f, #062a2a14, #be862238, #1ec89038, #ffffff0a, #0003, #00000040, #1f2937, #062a2a8c, #1ec8905c
- .hx-backups/20260516-065915/client/dist/assets/index-kUhkFgOY.css -> #141e1917, #141e191a, #7fd8a8, #6fe3b0, #5da3c9, #5ddb94, #ffd75a, #a78bfa, #0000, #000, #fff7e8f2, #fff7e8cc, #fff7e833, #2d1810, #ffffff8c, #ff8c4273, #ffb2478c, #ff8c4240, #faf9f7, #3a3a3a, #8fbf9f14, #f4c7c30f, #eac33b08, #2f5d5d, #fff, #8fbf9f4d, #8fbf9f26, #8fbf9f80, #8fbf9f40, #8fbf9f66, #8fbf9f99, #8fbf9f00, #ed5e76, #7a91b8, #ffaa508c, #ffaa5033, #ffaa5000, #ffb45ad9, #ffb45a4d, #ffb45a00, #f472b68c, #f472b62e, #f472b600, #ffb45acc, #f59e0b, #8fbf9f0d, #2f5d5d08, #f4c7c314, #2f5d5d0d, #8fbf9f1a
- .hx-backups/20260516-065915/client/dist/assets/lumi-registry-Pmn-ADNv.css -> #7e906e29
- .hx-backups/20260516-065915/client/dist/assets/sacred-C3NivM-a.css -> #0000, #2f5d5d, #8fbf9f, #fff, #2f5d5d4d, #2f5d5d66, #8fbf9f1a
- .hx-backups/20260516-065915/client/dist/assets/sacred-visuals-CKPEwYqm.css -> #f472b64d, #fbbf2433, #a78bfa1a, #f472b680, #fbbf244d, #a78bfa33, #facc1566, #facc154d, #facc151a, #38bdf866, #0ea5e933, #38bdf84d, #38bdf81a, #f472b666, #ec489933, #f472b61a, #4ade8066, #22c55e33, #4ade804d, #4ade801a, #2dd4bf66, #14b8a633, #2dd4bf4d, #2dd4bf1a, #fb718566, #f43f5e33, #fb71854d, #fb71851a, #818cf866, #6366f133, #818cf84d, #818cf81a, #fb923c66, #f9731633, #fb923c4d, #fb923c1a, #a78bfa66, #8b5cf633, #a78bfa4d, #fff4e6, #ffd6dd, #f0dafb, #dee2f7, #dbd1f0, #e9dbf0, #e0ebf5, #f7dee7, #fcf4e3, #2b2112, #240f13
- .hx-backups/20260516-065915/client/src/components/ContentLevelToggle.module.css -> #3a3a3a, #2f5d5d, #8fbf9f, #faf9f7, #eac33b
- .hx-backups/20260516-065915/client/src/components/ContentStudio.module.css -> #3a3a3a, #faf9f7, #2f5d5d, #8fbf9f, #eac33b
- .hx-backups/20260516-065915/client/src/components/PageTemplate.module.css -> #8fbf9f, #f4c7c3, #2f5d5d, #faf9f7, #3a3a3a, #eac33b, #fafaf8, #333, #245050, #d4a574, #f8f6f0, #fff
- .hx-backups/20260516-065915/client/src/components/SacredBackground.css -> #ffd700
- .hx-backups/20260516-065915/client/src/components/SafetyDisclaimer.module.css -> #2f5d5d, #3a3a3a, #8fbf9f, #f4c7c3
- .hx-backups/20260516-065915/client/src/components/avatar/BuddyAvatar.css -> #7FD8A8, #6FE3B0, #5DA3C9, #5DDB94, #FFD75A, #A78BFA, #2d1810
- .hx-backups/20260516-065915/client/src/components/lumi/LumiMascot.css -> #f59e0b
- .hx-backups/20260516-065915/client/src/components/lumi/LumiV6.css -> #fff8ee, #2d1810, #fff, #1a1917, #ead7b9, #d4546a, #FFD93D, #FFC857
- .hx-backups/20260516-065915/client/src/components/lumi/LumiV7.css -> #F5F0E8, #A8C9A0, #F5A3A3, #1A1A1A, #2A2A2A, #FFFFFF
- .hx-backups/20260516-065915/client/src/components/sacred/Hero.module.css -> #8fbf9f, #f4c7c3, #2f5d5d, #faf9f7, #3a3a3a, #eac33b
- .hx-backups/20260516-065915/client/src/components/sacred/Layout.module.css -> #faf9f7, #3a3a3a, #2f5d5d
- .hx-backups/20260516-065915/client/src/components/sacred/PlatformComponent.module.css -> #8fbf9f, #f4c7c3, #2f5d5d, #faf9f7, #3a3a3a, #eac33b
- .hx-backups/20260516-065915/client/src/components/sacred/SacredButton.module.css -> #8fbf9f, #f4c7c3, #2f5d5d, #faf9f7, #3a3a3a, #eac33b
- .hx-backups/20260516-065915/client/src/components/sacred/SacredFooter.module.css -> #faf9f7, #8fbf9f, #2f5d5d, #3a3a3a, #f4c7c3
- .hx-backups/20260516-065915/client/src/components/sacred/SacredSection.module.css -> #8fbf9f, #f4c7c3, #2f5d5d, #faf9f7, #3a3a3a, #eac33b
- .hx-backups/20260516-065915/client/src/components/zen/buddy-bubble.css -> #1f2933, #2d5040
- .hx-backups/20260516-065915/client/src/components/zen/zen-scape.css -> #faf8f3, #264f4f, #7FD8A8, #5DDB94, #FFD75A, #F4B6C2, #E08FA1, #FFD7BA, #FFE08A, #F0C46A, #FFAA6E, #9FD4F4, #7BB8E8, #D4E8FA, #C8B6F0, #A693DC, #F0E0F8, #FFB89D, #F09A85, #FFE2B5
- .hx-backups/20260516-065915/client/src/index.css -> #ffffff, #5A8A6E, #B4912A, #A87D68, #2F5D5D, #4a7a5e, #8B7023, #D4AF37, #F0D878, #5A4510, #8FBF9F, #16A34A, #DC2626, #f4f9f6, #e4f0e8, #c9e1d1, #a8cfb5, #3d6550, #335443, #2a4537, #fffbeb, #fef3c7, #fde68a, #fcd34d, #92751f, #7a5f18, #634c14, #4d3b10, #fef7f6, #fdeeed, #fbd6d4, #F4C7C3, #e6a9a4, #d48b85, #be6e68, #a55550, #8a4541, #733a37, #f0f5f5, #d8e5e5, #b1cbcb, #7fa5a5, #5a8585, #274d4d, #1f3f3f, #183232, #112525, #1A4F4F, #2D7A7A, #3CA0A0
- .hx-backups/20260516-065915/client/src/main.css -> #fff, #3d6b50, #4a7a5e, #5A8A6E
- .hx-backups/20260516-065915/client/src/pages/AutopilotFallback.module.css -> #8fbf9f, #f4c7c3, #2f5d5d, #faf9f7, #3a3a3a
- .hx-backups/20260516-065915/client/src/pages/ContentStudioPage.module.css -> #8fbf9f, #2f5d5d, #3a3a3a
- .hx-backups/20260516-065915/client/src/pages/admin/CommandCenter.module.css -> #fdfcfb, #f5f2ef, #8A9A5B, #2C6E63, #888
- .hx-backups/20260516-065915/client/src/pages/dashboard/Overview.module.css -> #fdfcfb, #f5f2ef, #FFD700, #1a1917, #2d5a3d, #c8d9c8, #ffffff, #5a8a5a, #a3c2a3, #f5faf5, #7a8c7e
- .hx-backups/20260516-065915/client/src/styles/accessibility.css -> #ffffff, #000000, #006400, #004d00, #e6ffe6, #ccffcc, #b3ffb3, #99ff99, #cc0000, #990000, #ffe6e6, #ffcccc, #cc9900, #996600, #fff5cc, #ffeb99, #e6ffff, #8FBF9F
- .hx-backups/20260516-065915/client/src/styles/brand-tokens.css -> #1ec890, #062a2a, #fcf6ea, #142626, #be8622, #d08672, #6c58b8, #E8913A, #C9701F, #5c4aa0, #ffffff, #dff1ee, #aedcd6, #74beb6, #3e9c94, #1c6e6c, #0e4e4e, #0b4040, #041e1e, #021414, #fdf2e8, #fbe0c5, #f6c388, #f0a55a, #a55a14, #82480f, #5e340a, #3a2106, #e0f9f0, #b2f0d6, #7ee5ba, #4cd8a0, #18a876, #148a60, #0e6c4a, #094e34, #04301e, #f8ede8, #efd4ca, #e2b2a4, #c07060, #ae584c, #984840, #7e3832, #642c26, #4a1e1a, #FFFFFF, #F5F2EE, #1A1A1A, #10b981
- .hx-backups/20260516-065915/client/src/styles/brand.css -> #D4AF37, #be8622, #062a2a, #2F5443
- .hx-backups/20260516-065915/client/src/styles/breathing-tool.css -> #74C0FC, #C8B6FF, #A8C9A0
- .hx-backups/20260516-065915/client/src/styles/canva-landing.css -> #F6F1E8, #C4787A, #fff, #FFFFFF, #f0d080, #b07c1c, #0a3a3a, #ffffff, #D4AF37, #2F5443, #0a3636, #0d4242, #062a2a, #9e7018, #fbe39a, #f4d271, #e7bf5d, #1ec890, #A8C9A0
- .hx-backups/20260516-065915/client/src/styles/celebration.css -> #FFD93D
- .hx-backups/20260516-065915/client/src/styles/checkin.css -> #C8B6FF
- .hx-backups/20260516-065915/client/src/styles/emotion-effects.css -> #8fbf9f, #d4af37, #f4c7c3, #fef9e7, #fff8e1, #fffbf0, #fff3e0, #ffe0b2, #f5f5dc, #fdf5e6, #fffaf0, #fff0f5, #ffe4ec, #fff5f8, #e8f5e9, #f1f8e9, #f5fff5, #c8e6c9, #e3f2fd, #f5f5f5, #fafafa, #eeeeee, #eceff1, #e0e0e0, #fce4ec, #f3e5f5, #ede7f6, #bbdefb, #e1f5fe, #ffebee, #ffcdd2, #fff5f5, #1a1a0f, #1f1a10, #1a1815, #0f1a1a, #101815, #121a18, #0f1520, #101822, #0f1a25, #1a0f18, #1a1020, #180f1a, #1a1a1a, #1f1f1f, #181818
- .hx-backups/20260516-065915/client/src/styles/hxos-vnext.css -> #E8913A, #6c58b8, #F6F1E8, #C4787A, #FAFAF7, #F0EDE6
- .hx-backups/20260516-065915/client/src/styles/lumi-a11y.css -> #ffffff
- .hx-backups/20260516-065915/client/src/styles/lumi-admin.css -> #d4ede4, #2d6a4f, #fcebc7, #8a5a00, #d4943a, #f0d4d0, #8a3a2a, #c45b4a, #d8e0f0, #3a5a8a, #5a8ad4, #ffffff, #5a2a20
- .hx-backups/20260516-065915/client/src/styles/lumi-buttons.css -> #ffffff, #1a1308, #fff
- .hx-backups/20260516-065915/client/src/styles/lumi-tokens.css -> #ffffff, #d4ede4, #e1edd3, #f5d4cc, #d8e0f0, #fcebc7, #e5deec, #000000, #c45b4a, #f0d4d0, #d4943a, #f5e5d0
- .hx-backups/20260516-065915/client/src/styles/peacescape-shell.css -> #062a2a, #0d4a3d
- .hx-backups/20260516-065915/client/src/styles/sacred-typography.css -> #3a3a3a, #2f5d5d, #8fbf9f
- .hx-backups/20260516-065915/client/src/styles/sacred.css -> #8fbf9f, #f4c7c3, #2f5d5d, #faf9f7, #3a3a3a, #eac33b, #274e4e, #3d7a7a
- .hx-backups/20260516-065915/client/src/styles/tokens.css -> #8fbf9f, #2f5d5d, #D4A520
- .hx-backups/20260516-065915/client/src/styles/v6-preview.css -> #FFD93D, #FFB88C
- .hx-backups/20260516-065915/client/src/styles/visual-benefits.css -> #fdfcf9, #2d3a35, #ffffff, #F4B942
- .hx-backups/20260516-065915/client/src/styles/wellness-shell.css -> #062a2a, #0d4a3d
- .hx-backups/v47-20260515-144035/client/dist/assets/AvatarLab-B6WI5thR.css -> #f5f0e8, #a8c9a0, #f5a3a3, #1a1a1a, #2a2a2a, #4a7e722e, #fff
- .hx-backups/v47-20260515-144035/client/dist/assets/BreathingTool-DS2q5R40.css -> #74c0fc1f, #0000, #a8d5ba24, #ffb88c1a, #c8b6ff24, #ffd93d24, #74c0fc, #74c0fc59, #a8d5ba4d, #74c0fc73, #74c0fc4d, #c8b6ff80, #c8b6ff52, #a8c9a073, #a8c9a04d, #74c0fc2e, #c8b6ff38, #a8c9a02e, #c8b6ff, #a8c9a0, #74c0fc33, #74c0fcf2, #c8b6fff2, #a8c9a0f2, #74c0fc00
- .hx-backups/v47-20260515-144035/client/dist/assets/CanvaLanding-Bi6MZ_aZ.css -> #be862259, #be86228c, #be862266, #be862299, #f6f1e8, #163a36, #8fbf9f, #2f5d5d, #c4787a, #8fbf9f1a, #8fbf9f26, #8fbf9f33, #8fbf9f4d, #8fbf9f66, #2f5d5d1f, #2f5d5d33, #2f5d5d4d, #2f5d5d66, #c4787a1a, #c4787a26, #c4787a33, #c4787a4d, #0000, #fff, #be86224d, #be862280, #be86222e, #fcf6eaf2, #1ec8902e, #fff9, #be862214, #062a2a0f, #ffffff80, #ffffffb3, #be86223d, #be86221a, #062a2a14, #00000026, #00000080, #1ec89014, #062a2a0a, #6c58b80f, #d086720d, #1ec89040, #6c58b826, #1ec89000, #6c58b800, #f0d080, #163d3d0a, #163d3d0f
- .hx-backups/v47-20260515-144035/client/dist/assets/CelebrationFlow-D71fqt0c.css -> #ffd93d38, #0000, #ffb88c26, #ffd93d1f, #a8c9a01a, #ffd93d, #ffd93d2e
- .hx-backups/v47-20260515-144035/client/dist/assets/CheckIn-KbUv1xsW.css -> #c8b6ff2e, #0000, #c8b6ff1a, #ff9a8b0f, #ffd93d2e, #ffd93d14, #ffb88c0f, #c8b6ff
- .hx-backups/v47-20260515-144035/client/dist/assets/CommandCenter-BfVTyNhP.css -> #fdfcfb, #f5f2ef, #8a9a5b33, #fff, #8a9a5b0d, #0000000a, #2d6a4f1a, #8a9a5b1a, #8a9a5b, #8a9a5b08, #0000, #8a9a5b14, #2c6e63, #888, #8a9a5b4d
- .hx-backups/v47-20260515-144035/client/dist/assets/ContentStudioPage-DH_xWkv_.css -> #3a3a3a, #faf9f7, #0000, #8fbf9f1a, #8fbf9f4d, #2f5d5d, #8fbf9f, #8fbf9f26, #2f5d5d1a, #fff, #0000000d, #2f5d5d33, #8fbf9f33, #eac33b, #eac33b1a, #2f5d5d0d
- .hx-backups/v47-20260515-144035/client/dist/assets/LumiV6Preview-DMCLDRmU.css -> #141e1917, #141e191a, #fff7e8c7, #fff7e88c, #fff7e81a, #0000, #fff8ee, #50321e2e, #2d1810, #ffffff8c, #ff8c4273, #ffb2478c, #ff8c4240, #1a1917, #fff, #ead7b9, #3c28141a, #d4546a, #a8c9a02e, #0000001a, #ffb247e6, #ffb247a6, #ff8c4200, #ffd93d8c, #ffb88c80, #ff9a8b80, #a8d5ba80, #c8b6ff80, #e8913a59, #e8913ad9, #e8913a8c, #e8913a00, #e8913ab3, #ffd93d99, #ffd93d, #ffc857, #a8c9a099, #74c0fc8c, #c8b6ff8c, #ff9a8b00, #ffd93d80, #ffd93d00, #ff9a8b8c, #c8b6ff00, #a8c9a073, #a8c9a000, #74c0fc80, #74c0fc1a, #a8c9a01a, #c8b6ff14
- .hx-backups/v47-20260515-144035/client/dist/assets/Overview-DThRZbH-.css -> #fdfcfb, #f5f2ef, #d4a80040, #1a1917, #fff, #0000000a, #00000014, #2d6a4f1a, #8a9a5b0d, #5a8a5a, #c8d9c8, #f5faf5, #a3c2a3, #8a9a5b4d, #7a8c7e
- .hx-backups/v47-20260515-144035/client/dist/assets/PeacescapePage-DfUayL-v.css -> #be86220d, #0000, #1ec8900d, #be86228c, #1ec890a6, #1ec8904d, #ffffffd9, #062a2a14, #062a2a12, #fffc, #be86222e, #2d503c1f, #fffffff5, #fcf6ea73, #1ec89033, #062a2a0a, #062a2a0d, #be862280, #1ec89052, #ffffffe6, #062a2a0f, #062a2a, #0d4a3d

## Next Safe Implementation Order
1. Finish Phase 87E if orphan API route wiring is still uncommitted.
2. Register already-built SEO/content pages only after API route gate is green.
3. Create a canonical page registry and sitemap inventory.
4. Quarantine root shadow trees only after zero live imports are proven.
5. Resolve duplicate component groups one family at a time.
6. Replace or hide placeholder/stub user-facing surfaces.
7. Enforce visual palette tokens and official Lumi/avatar usage with a visual gate.
8. Continue monetization and provider workflow only after route/content coherence is stable.

## Stop Condition
Do not implement any fix from this report until the first verified blocker is selected and isolated.
