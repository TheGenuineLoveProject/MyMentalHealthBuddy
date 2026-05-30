# Storage Hotspot Cluster Map — Phase H2.4 (ANALYSIS ONLY)

> **Mode:** HOTSPOT CLUSTER MAPPING — analysis only, no runtime change, no wrapper, no centralization, no migration.
> **Source:** `codex/storage/storageUsageAudit.json` (derived; re-run analysis to refresh).
> **Generated at:** 2026-05-30T22:43:02.205Z.
> **No runtime change · no wrapper · no centralization · no migration.** Excluded + sensitive clusters are observe-only.

## Domain separation (explicit)

- **Protected domains:** Security-sensitive values (tokens/session/credentials) OR any excluded domain — never migrated under storage hardening.
  - Sensitive domains observed: admin, auth, billing, chat
- **Public migration-safe domains:** ux-preferences, wellness-progress, tools-monitors, lumi-ux, analytics
- **Excluded domains (observe-only):** admin, auth, billing, chat, crisis, dashboard, healing, journal, provider
- **Triage-required (uncertain):** uncategorized

## Summary

| Cluster | Count | Notes |
| --- | --- | --- |
| Total findings analyzed | 605 | from audit |
| Density hotspots (top) | 20 | highest-density files |
| Repeated key patterns | 92 | keys used 2+ times |
| Duplicated persistence idioms | 3 | hand-rolled idioms |
| Inconsistent serialization files | 5 | JSON + raw writes mixed |
| Unsafe JSON.parse | 0 | excluded 0 / sensitive 0 |
| Missing try/catch access | 5 | excluded 4 / sensitive 4 |
| Hydration-risk findings | 78 | storage in init/render |
| SSR-risk findings | 469 | no window guard |
| Cross-domain leakage files | 3 | excluded+public co-reside |
| Public-safe migration candidate files | 31 | future additive only |

## 1. Highest-density storage files

| File | Findings | Mechanisms | Domains | Severity | Blast radius | Protected | Migration | Priority | Governance |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| client/src/components/lumi/LumiV6.tsx | 14 | sessionStorage | auth | high | multi-file | protected | no | P2 (observe only) | Touches excluded domain(s); observe-only, no change. |
| client/src/components/SelfCareChecklist.jsx | 13 | localStorage | wellness-progress | high | multi-file | non-protected | yes | P1 | Public-safe density hotspot; future additive hardening candidate. |
| client/src/components/HabitTracker.jsx | 12 | localStorage | wellness-progress | high | multi-file | non-protected | yes | P1 | Public-safe density hotspot; future additive hardening candidate. |
| client/src/pages/Settings.jsx | 12 | localStorage | uncategorized, ux-preferences | high | multi-file | non-protected | yes | P1 | Public-safe density hotspot; future additive hardening candidate. |
| client/src/pages/ChallengeDay.jsx | 9 | localStorage | journal, wellness-progress | high | single-file | protected (excluded domain) | partial | P2 (observe only) | Touches excluded domain(s); observe-only, no change. |
| client/src/pages/Reflection.jsx | 9 | localStorage | journal | high | single-file | protected (excluded domain) | no | P2 (observe only) | Touches excluded domain(s); observe-only, no change. |
| client/src/components/ReturnLoop.jsx | 8 | localStorage+sessionStorage | auth, uncategorized | high | single-file | protected | partial | P2 (observe only) | Touches excluded domain(s); observe-only, no change. |
| client/src/content/readingLevels.js | 8 | localStorage | uncategorized, ux-preferences | high | single-file | non-protected | yes | P1 | Public-safe density hotspot; future additive hardening candidate. |
| client/src/lib/api.ts | 8 | localStorage | auth, uncategorized | high | single-file | protected | partial | P2 (observe only) | Touches excluded domain(s); observe-only, no change. |
| client/src/pages/Admin.jsx | 8 | localStorage+sessionStorage | admin | high | single-file | protected | no | P2 (observe only) | Touches excluded domain(s); observe-only, no change. |
| client/src/pages/admin/AdminTools.jsx | 8 | localStorage | admin | high | single-file | protected | no | P2 (observe only) | Touches excluded domain(s); observe-only, no change. |
| client/src/components/AdminGuard.jsx | 7 | sessionStorage | admin | medium | single-file | protected | no | P2 (observe only) | Touches excluded domain(s); observe-only, no change. |
| client/src/hooks/useLumiAudio.js | 7 | localStorage | provider | medium | single-file | protected (excluded domain) | no | P2 (observe only) | Touches excluded domain(s); observe-only, no change. |
| client/src/components/DailyAffirmations.jsx | 6 | localStorage | uncategorized | medium | single-file | non-protected | yes | P2 | Public-safe density hotspot; future additive hardening candidate. |
| client/src/components/WelcomeBackBanner.jsx | 6 | localStorage+sessionStorage | auth, uncategorized | medium | single-file | protected | partial | P2 (observe only) | Touches excluded domain(s); observe-only, no change. |
| client/src/lib/queryClient.js | 6 | localStorage+sessionStorage | admin, auth, uncategorized | medium | single-file | protected | partial | P2 (observe only) | Touches excluded domain(s); observe-only, no change. |
| client/src/pages/GrowthAnalyticsPage.tsx | 6 | localStorage | analytics | medium | single-file | non-protected | yes | P2 | Public-safe density hotspot; future additive hardening candidate. |
| client/src/pages/admin/FeatureFlags.jsx | 6 | localStorage | admin | medium | single-file | protected | no | P2 (observe only) | Touches excluded domain(s); observe-only, no change. |
| client/src/components/MorningEveningRituals.jsx | 5 | localStorage | uncategorized, wellness-progress | medium | single-file | non-protected | yes | P2 | Public-safe density hotspot; future additive hardening candidate. |
| client/src/context/AuthContext.jsx | 5 | localStorage | auth | medium | single-file | protected | no | P2 (observe only) | Touches excluded domain(s); observe-only, no change. |

## 2. Repeated storage-key patterns

| Key | Occurrences | Files | Domains | Severity | Protected | Migration | Priority | Governance |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| adminSessionToken | 14 | 10 | admin | high | protected | no | P2 (observe only) | Same key read/written in multiple files — naming/serialization drift risk. |
| mmhb_token | 7 | 7 | admin, auth | high | protected | no | P2 (observe only) | Same key read/written in multiple files — naming/serialization drift risk. |
| glp-challenge-progress | 7 | 1 | wellness-progress | low | non-protected | yes | P2 | Localized key. |
| adminVerified | 6 | 4 | admin | high | protected | no | P2 (observe only) | Same key read/written in multiple files — naming/serialization drift risk. |
| glp_admin_feature_flags | 6 | 1 | admin | low | protected | no | P2 (observe only) | Localized key. |
| glp-scheduled-reminder | 5 | 2 | uncategorized | medium | non-protected | yes | P2 | Same key read/written in multiple files — naming/serialization drift risk. |
| mmhb_guest_id | 4 | 2 | uncategorized | medium | non-protected | yes | P2 | Same key read/written in multiple files — naming/serialization drift risk. |
| wellness_habits | 4 | 1 | wellness-progress | low | non-protected | yes | P2 | Localized key. |
| habits_completed_today | 4 | 1 | wellness-progress | low | non-protected | yes | P2 | Localized key. |
| selfcare_completed | 4 | 1 | wellness-progress | low | non-protected | yes | P2 | Localized key. |
| selfcare_streak | 4 | 1 | wellness-progress | low | non-protected | yes | P2 | Localized key. |
| values_explorer_data | 4 | 1 | tools-monitors | low | non-protected | yes | P2 | Localized key. |
| glp-mode | 4 | 2 | ux-preferences | medium | non-protected | yes | P2 | Same key read/written in multiple files — naming/serialization drift risk. |
| glp-calm-mode | 4 | 1 | ux-preferences | low | non-protected | yes | P2 | Localized key. |
| theme | 4 | 2 | provider, ux-preferences | medium | protected (excluded domain) | no | P2 (observe only) | Same key read/written in multiple files — naming/serialization drift risk. |
| glp_reflections | 4 | 2 | journal | medium | protected (excluded domain) | no | P2 (observe only) | Same key read/written in multiple files — naming/serialization drift risk. |
| glp_reflection_draft | 4 | 1 | journal | low | protected (excluded domain) | no | P2 (observe only) | Localized key. |
| glp-a11y-settings | 3 | 1 | ux-preferences | low | non-protected | yes | P2 | Localized key. |
| digital_detox_data | 3 | 1 | tools-monitors | low | non-protected | yes | P2 | Localized key. |
| selfcare_date | 3 | 1 | wellness-progress | low | non-protected | yes | P2 | Localized key. |
| lumi:v9:entered | 3 | 2 | auth | medium | protected | no | P2 (observe only) | Same key read/written in multiple files — naming/serialization drift risk. |
| lumi:v9:lastEmotion | 3 | 1 | auth | low | protected | no | P2 (observe only) | Localized key. |
| glp_reflection_xp | 3 | 2 | journal | medium | protected (excluded domain) | no | P2 (observe only) | Same key read/written in multiple files — naming/serialization drift risk. |
| glp-mood-background | 3 | 2 | dashboard, uncategorized | medium | protected (excluded domain) | no | P2 (observe only) | Same key read/written in multiple files — naming/serialization drift risk. |
| glp_admin_content | 3 | 1 | admin | low | protected | no | P2 (observe only) | Localized key. |
| glp_admin_alerts | 3 | 1 | admin | low | protected | no | P2 (observe only) | Localized key. |
| achievements_unlocked | 2 | 1 | uncategorized | low | non-protected | yes | P2 | Localized key. |
| earned_achievements | 2 | 1 | uncategorized | low | non-protected | yes | P2 | Localized key. |
| anger_management_data | 2 | 1 | auth, uncategorized | low | protected | no | P2 (observe only) | Localized key. |
| body_scan_sessions | 2 | 1 | auth | low | protected | no | P2 (observe only) | Localized key. |
| boundary_builder_data | 2 | 1 | uncategorized | low | non-protected | yes | P2 | Localized key. |
| favorite_strategies | 2 | 1 | uncategorized | low | non-protected | yes | P2 | Localized key. |
| savedAffirmations | 2 | 1 | uncategorized | low | non-protected | yes | P2 | Localized key. |
| affirmationDate | 2 | 1 | uncategorized | low | non-protected | yes | P2 | Localized key. |
| dailyAffirmationIndex | 2 | 1 | uncategorized | low | non-protected | yes | P2 | Localized key. |
| energy_booster_data | 2 | 1 | uncategorized | low | non-protected | yes | P2 | Localized key. |
| wellness_goals | 2 | 1 | wellness-progress | low | non-protected | yes | P2 | Localized key. |
| gratitudeEntries | 2 | 1 | uncategorized | low | non-protected | yes | P2 | Localized key. |
| habit_streaks | 2 | 1 | wellness-progress | low | non-protected | yes | P2 | Localized key. |
| habits_last_date | 2 | 1 | wellness-progress | low | non-protected | yes | P2 | Localized key. |
| hydration_data | 2 | 1 | uncategorized | low | non-protected | yes | P2 | Localized key. |
| laughterMinutes | 2 | 1 | healing | low | protected (excluded domain) | no | P2 (observe only) | Localized key. |
| lotus-dismissed | 2 | 1 | auth | low | protected | no | P2 (observe only) | Localized key. |
| meditation_sessions | 2 | 1 | auth | low | protected | no | P2 (observe only) | Localized key. |
| mindful_eating_data | 2 | 1 | uncategorized | low | non-protected | yes | P2 | Localized key. |
| mindful_walking_sessions | 2 | 1 | auth | low | protected | no | P2 (observe only) | Localized key. |
| mindfulness_bell_settings | 2 | 1 | uncategorized | low | non-protected | yes | P2 | Localized key. |
| mindfulness_bell_count | 2 | 1 | uncategorized | low | non-protected | yes | P2 | Localized key. |
| ritualStreak | 2 | 1 | wellness-progress | low | non-protected | yes | P2 | Localized key. |
| motivation_booster_data | 2 | 1 | uncategorized | low | non-protected | yes | P2 | Localized key. |
| glp_utm | 2 | 1 | uncategorized | low | non-protected | yes | P2 | Localized key. |
| reframing_history | 2 | 1 | uncategorized | low | non-protected | yes | P2 | Localized key. |
| viz_favorites | 2 | 1 | uncategorized | low | non-protected | yes | P2 | Localized key. |
| nap_count | 2 | 1 | uncategorized | low | non-protected | yes | P2 | Localized key. |
| pmr_sessions | 2 | 1 | auth | low | protected | no | P2 (observe only) | Localized key. |
| glp_quest_interest | 2 | 1 | uncategorized | low | non-protected | yes | P2 | Localized key. |
| glp-reminder-settings | 2 | 1 | uncategorized | low | non-protected | yes | P2 | Localized key. |
| resilienceStories | 2 | 1 | uncategorized | low | non-protected | yes | P2 | Localized key. |
| selfcare_total_points | 2 | 1 | wellness-progress | low | non-protected | yes | P2 | Localized key. |
| self_compassion_data | 2 | 1 | tools-monitors | low | non-protected | yes | P2 | Localized key. |
| sleep_history | 2 | 1 | tools-monitors | low | non-protected | yes | P2 | Localized key. |
| social_connection_data | 2 | 1 | uncategorized | low | non-protected | yes | P2 | Localized key. |
| soft_launch_banner_dismissed | 2 | 1 | auth | low | protected | no | P2 (observe only) | Localized key. |
| stress_monitor_data | 2 | 1 | tools-monitors | low | non-protected | yes | P2 | Localized key. |
| glp-voice-settings | 2 | 1 | uncategorized | low | non-protected | yes | P2 | Localized key. |
| weekly_reflections | 2 | 1 | journal | low | protected (excluded domain) | no | P2 (observe only) | Localized key. |
| last_wellness_score | 2 | 1 | wellness-progress | low | non-protected | yes | P2 | Localized key. |
| worry_time_data | 2 | 1 | tools-monitors | low | non-protected | yes | P2 | Localized key. |
| glp_health_pipeline_history | 2 | 1 | admin | low | protected | no | P2 (observe only) | Localized key. |
| glp_daily_ops_checklist | 2 | 1 | admin | low | protected | no | P2 (observe only) | Localized key. |
| glp_daily_ops_timestamps | 2 | 1 | admin | low | protected | no | P2 (observe only) | Localized key. |
| glp_tools_last_check | 2 | 2 | admin | medium | protected | no | P2 (observe only) | Same key read/written in multiple files — naming/serialization drift risk. |
| glp_onboarding_preferences | 2 | 2 | uncategorized | medium | non-protected | yes | P2 | Same key read/written in multiple files — naming/serialization drift risk. |
| mmhb-lumi-audio-enabled | 2 | 1 | provider | low | protected (excluded domain) | no | P2 (observe only) | Localized key. |
| lumi:audio:popped | 2 | 1 | auth | low | protected | no | P2 (observe only) | Localized key. |
| glp-liked-affirmations | 2 | 1 | uncategorized | low | non-protected | yes | P2 | Localized key. |
| glp_alignment_progress | 2 | 1 | uncategorized | low | non-protected | yes | P2 | Localized key. |
| glp-reflection-cards | 2 | 1 | journal | low | protected (excluded domain) | no | P2 (observe only) | Localized key. |
| dailyPractices | 2 | 1 | uncategorized | low | non-protected | yes | P2 | Localized key. |
| notifications | 2 | 1 | uncategorized | low | non-protected | yes | P2 | Localized key. |
| glp-affirmation-tone | 2 | 1 | uncategorized | low | non-protected | yes | P2 | Localized key. |
| glp-voice-enabled | 2 | 1 | uncategorized | low | non-protected | yes | P2 | Localized key. |
| glp_tools_auto_refresh | 2 | 1 | admin | low | protected | no | P2 (observe only) | Localized key. |
| glp_tools_status_filter | 2 | 1 | admin | low | protected | no | P2 (observe only) | Localized key. |
| glp_content_tiers_${selectedContent.id} | 2 | 1 | admin | low | protected | no | P2 (observe only) | Localized key. |
| social_drafts_v2 | 2 | 1 | admin | low | protected | no | P2 (observe only) | Localized key. |
| glp_daily_ops_history | 2 | 1 | admin | low | protected | no | P2 (observe only) | Localized key. |
| glp_notification_prefs | 2 | 1 | uncategorized | low | non-protected | yes | P2 | Localized key. |
| glp_ai_personality | 2 | 1 | uncategorized | low | non-protected | yes | P2 | Localized key. |
| glp_email_digest | 2 | 1 | uncategorized | low | non-protected | yes | P2 | Localized key. |
| mmhb-breathing-streak-v1 | 2 | 1 | wellness-progress | low | non-protected | yes | P2 | Localized key. |
| glp_meaning_map | 2 | 1 | uncategorized | low | non-protected | yes | P2 | Localized key. |

## 3. Duplicated persistence logic

| Idiom | Occurrences | Files | Severity | Protected | Migration | Priority | Governance |
| --- | --- | --- | --- | --- | --- | --- | --- |
| setItem(key, JSON.stringify(...)) inline write | 170 | 128 | high | mixed | partial (public subset only) | P1 | Hand-rolled persistence idiom duplicated across files; standardization candidate for PUBLIC files only — excluded/sensitive occurrences observe-only. |
| JSON.parse(getItem(...)) inline read | 55 | 28 | high | mixed | partial (public subset only) | P1 | Hand-rolled persistence idiom duplicated across files; standardization candidate for PUBLIC files only — excluded/sensitive occurrences observe-only. |
| [storage-safe-write] try/catch idiom | 35 | 26 | high | mixed | partial (public subset only) | P1 | Hand-rolled persistence idiom duplicated across files; standardization candidate for PUBLIC files only — excluded/sensitive occurrences observe-only. |

## 4. Inconsistent serialization

| File | JSON writes | Raw writes | Severity | Protected | Migration | Priority | Governance |
| --- | --- | --- | --- | --- | --- | --- | --- |
| client/src/components/DailyAffirmations.jsx | 1 | 2 | medium | non-protected | yes | P2 | Mixes JSON and raw-string writes in one file — serialization drift risk. |
| client/src/components/HabitTracker.jsx | 7 | 1 | medium | non-protected | yes | P2 | Mixes JSON and raw-string writes in one file — serialization drift risk. |
| client/src/components/SelfCareChecklist.jsx | 3 | 6 | medium | non-protected | yes | P2 | Mixes JSON and raw-string writes in one file — serialization drift risk. |
| client/src/pages/Reflection.jsx | 2 | 2 | medium | protected (excluded domain) | no | P2 (observe only) | Mixes JSON and raw-string writes in one file — serialization drift risk. |
| client/src/pages/admin/AdminTools.jsx | 1 | 2 | medium | protected | no | P2 (observe only) | Mixes JSON and raw-string writes in one file — serialization drift risk. |

## 5. Unsafe JSON.parse usage

_None detected._

## 6. Missing try/catch persistence access

| File | Line | Domain | Excluded | Sensitive | Snippet |
| --- | --- | --- | --- | --- | --- |
| client/src/components/LotusGuide.jsx | 129 | auth | yes | yes | `sessionStorage.setItem('lotus-dismissed', 'true');` |
| client/src/components/SoftLaunchBanner.jsx | 27 | auth | yes | yes | `sessionStorage.setItem("soft_launch_banner_dismissed", "true");` |
| client/src/components/StressMonitor.jsx | 77 | tools-monitors | no | no | `localStorage.setItem("stress_monitor_data", JSON.stringify({` |
| client/src/pages/CanvaLanding.jsx | 60 | admin | yes | yes | `sessionStorage.setItem("adminVerified", "true");` |
| client/src/pages/CanvaLanding.jsx | 62 | admin | yes | yes | `sessionStorage.setItem("adminSessionToken", data.sessionToken);` |

## 7. Hydration-risk clusters

| File | Line | Domain | Excluded | Snippet |
| --- | --- | --- | --- | --- |
| client/src/components/AccessibilityToolbar.jsx | 25 | ux-preferences | no | `const stored = localStorage.getItem("glp-a11y-settings");` |
| client/src/components/AchievementBadges.jsx | 120 | uncategorized | no | `const saved = localStorage.getItem("achievements_unlocked");` |
| client/src/components/AchievementSystem.jsx | 85 | uncategorized | no | `const saved = localStorage.getItem("earned_achievements");` |
| client/src/components/AffirmationCards.jsx | 97 | uncategorized | no | `const saved = localStorage.getItem(STORAGE_KEY);` |
| client/src/components/AgeConfirmationModal.tsx | 17 | uncategorized | no | `const confirmed = localStorage.getItem(STORAGE_KEY);` |
| client/src/components/AgeConsentGate.jsx | 12 | uncategorized | no | `const stored = localStorage.getItem(CONSENT_STORAGE_KEY);` |
| client/src/components/AgeConsentGate.jsx | 162 | uncategorized | no | `const stored = localStorage.getItem(CONSENT_STORAGE_KEY);` |
| client/src/components/AngerManagement.jsx | 85 | uncategorized | no | `const saved = localStorage.getItem("anger_management_data");` |
| client/src/components/BodyScanMeditation.jsx | 27 | auth | yes | `const saved = localStorage.getItem("body_scan_sessions");` |
| client/src/components/BoundaryBuilder.jsx | 43 | uncategorized | no | `const saved = localStorage.getItem("boundary_builder_data");` |
| client/src/components/CBTThoughtDiary.jsx | 37 | uncategorized | no | `const saved = localStorage.getItem(STORAGE_KEY);` |
| client/src/components/ContentLevelToggle.jsx | 32 | uncategorized | no | `const stored = localStorage.getItem(STORAGE_KEY);` |
| client/src/components/CopingStrategies.jsx | 232 | uncategorized | no | `const saved = localStorage.getItem("favorite_strategies");` |
| client/src/components/DailyAffirmations.jsx | 77 | uncategorized | no | `const savedAffirmations = localStorage.getItem("savedAffirmations");` |
| client/src/components/DigitalDetox.jsx | 45 | tools-monitors | no | `const saved = localStorage.getItem("digital_detox_data");` |
| client/src/components/EmotionalIntelligenceQuiz.jsx | 56 | uncategorized | no | `const saved = localStorage.getItem(STORAGE_KEY);` |
| client/src/components/EnergyBooster.jsx | 71 | uncategorized | no | `const saved = localStorage.getItem("energy_booster_data");` |
| client/src/components/GoalProgress.jsx | 31 | wellness-progress | no | `const saved = localStorage.getItem("wellness_goals");` |
| client/src/components/GratitudeJar.jsx | 38 | uncategorized | no | `const saved = localStorage.getItem(STORAGE_KEY);` |
| client/src/components/HabitTracker.jsx | 20 | wellness-progress | no | `const savedHabits = localStorage.getItem("wellness_habits");` |
| client/src/components/HabitTracker.jsx | 21 | wellness-progress | no | `const savedCompleted = localStorage.getItem("habits_completed_today");` |
| client/src/components/HydrationTracker.jsx | 41 | uncategorized | no | `const saved = localStorage.getItem("hydration_data");` |
| client/src/components/LaughterTherapy.jsx | 113 | healing | yes | `const saved = localStorage.getItem("laughterMinutes");` |
| client/src/components/MeditationTimer.jsx | 32 | auth | yes | `const saved = localStorage.getItem("meditation_sessions");` |
| client/src/components/MicroWinPrompt.jsx | 41 | auth | yes | `try { return Boolean(window.localStorage.getItem(AUTH_TOKEN_KEY)); } catch { return false; }` |
| client/src/components/MindfulEating.jsx | 83 | uncategorized | no | `const saved = localStorage.getItem("mindful_eating_data");` |
| client/src/components/MindfulWalking.jsx | 90 | auth | yes | `const saved = localStorage.getItem("mindful_walking_sessions");` |
| client/src/components/MindfulnessBell.jsx | 50 | uncategorized | no | `const saved = localStorage.getItem("mindfulness_bell_settings");` |
| client/src/components/MindfulnessChallenges.jsx | 39 | uncategorized | no | `const saved = localStorage.getItem(STORAGE_KEY);` |
| client/src/components/ModeToggle.jsx | 17 | uncategorized | no | `const saved = localStorage.getItem(STORAGE_KEY) \|\| "";` |
| client/src/components/MorningEveningRituals.jsx | 32 | wellness-progress | no | `const saved = localStorage.getItem("morningRituals");` |
| client/src/components/MorningEveningRituals.jsx | 40 | wellness-progress | no | `const saved = localStorage.getItem("eveningRituals");` |
| client/src/components/MorningEveningRituals.jsx | 48 | wellness-progress | no | `const saved = localStorage.getItem("ritualStreak");` |
| client/src/components/MotivationBooster.jsx | 59 | uncategorized | no | `const saved = localStorage.getItem("motivation_booster_data");` |
| client/src/components/PositiveReframing.jsx | 59 | uncategorized | no | `const savedHistory = localStorage.getItem("reframing_history");` |
| client/src/components/PositiveVisualization.jsx | 103 | uncategorized | no | `const savedFavorites = localStorage.getItem("viz_favorites");` |
| client/src/components/PowerNap.jsx | 69 | uncategorized | no | `const saved = localStorage.getItem("nap_count");` |
| client/src/components/ProgressiveMuscleRelaxation.jsx | 31 | auth | yes | `const saved = localStorage.getItem("pmr_sessions");` |
| client/src/components/ResilienceStories.jsx | 25 | uncategorized | no | `const saved = localStorage.getItem("resilienceStories");` |
| client/src/components/SelfCareBingo.jsx | 66 | uncategorized | no | `const saved = localStorage.getItem(STORAGE_KEY);` |
| client/src/components/SelfCareChecklist.jsx | 62 | wellness-progress | no | `const savedDate = localStorage.getItem("selfcare_date");` |
| client/src/components/SelfCompassion.jsx | 88 | tools-monitors | no | `const saved = localStorage.getItem("self_compassion_data");` |
| client/src/components/SleepTracker.jsx | 35 | tools-monitors | no | `const savedHistory = localStorage.getItem("sleep_history");` |
| client/src/components/SocialConnection.jsx | 46 | uncategorized | no | `const savedData = localStorage.getItem("social_connection_data");` |
| client/src/components/SoftLaunchBanner.jsx | 10 | auth | yes | `const wasDismissed = sessionStorage.getItem("soft_launch_banner_dismissed");` |
| client/src/components/StressMonitor.jsx | 47 | tools-monitors | no | `const saved = localStorage.getItem("stress_monitor_data");` |
| client/src/components/ValuesExplorer.jsx | 49 | tools-monitors | no | `const saved = localStorage.getItem("values_explorer_data");` |
| client/src/components/WelcomeBackBanner.jsx | 43 | auth | yes | `try { return Boolean(window.localStorage.getItem(AUTH_TOKEN_KEY)); } catch { return false; }` |
| client/src/components/WorryTimeScheduler.jsx | 25 | tools-monitors | no | `const saved = localStorage.getItem("worry_time_data");` |
| client/src/components/admin/AIHealthPipeline.jsx | 13 | admin | yes | `try { const s = localStorage.getItem('glp_health_pipeline_history'); return s ? JSON.parse(s) : []; } catch { return []; }` |
| client/src/components/admin/DailyOpsChecklist.jsx | 9 | admin | yes | `const saved = localStorage.getItem('glp_daily_ops_checklist');` |
| client/src/components/admin/DailyOpsChecklist.jsx | 21 | admin | yes | `const saved = localStorage.getItem('glp_daily_ops_timestamps');` |
| client/src/components/layout/Header.jsx | 25 | ux-preferences | no | `return localStorage.getItem("glp-mode") \|\| "default";` |
| client/src/components/modules/ModulesPanel.tsx | 23 | uncategorized | no | `const raw = localStorage.getItem(key);` |
| client/src/components/patterns/InsightPatternLab.tsx | 38 | uncategorized | no | `const stateHistoryRaw = localStorage.getItem("glp_state_history");` |
| client/src/components/personalization/ToolRecommendations.jsx | 32 | uncategorized | no | `const prefs = ((()=>{try{return JSON.parse(localStorage.getItem("glp_onboarding_preferences") \|\| "{}");}catch(err){console.warn("[storage-safe-read]",err);retur` |
| client/src/components/ui/CalmModeToggle.jsx | 12 | ux-preferences | no | `return localStorage.getItem('glp-calm-mode') === 'true' \|\|` |
| client/src/components/ui/CalmModeToggle.jsx | 59 | ux-preferences | no | `return localStorage.getItem('glp-calm-mode') === 'true';` |
| client/src/components/ui/theme-provider.jsx | 23 | provider | yes | `? localStorage.getItem("theme") \|\| "system"` |
| client/src/context/EmotionContext.jsx | 123 | provider | yes | `const saved = localStorage.getItem(STORAGE_KEY);` |
| client/src/pages/AffirmationWall.jsx | 27 | uncategorized | no | `const stored = localStorage.getItem("glp-liked-affirmations");` |
| client/src/pages/AlignmentPath.jsx | 219 | uncategorized | no | `const stored = localStorage.getItem('glp_alignment_progress');` |
| client/src/pages/CourseCatalog.jsx | 24 | uncategorized | no | `const saved = localStorage.getItem(ENROLLMENT_KEY);` |
| client/src/pages/DailyPracticePage.jsx | 160 | uncategorized | no | `const saved = localStorage.getItem("dailyPractices");` |
| client/src/pages/GrowthPage.jsx | 118 | auth | yes | `return window.localStorage.getItem("mmhb_token");` |
| client/src/pages/PracticeLibrary.jsx | 26 | uncategorized | no | `const saved = localStorage.getItem(FAVORITES_KEY);` |
| client/src/pages/Reflection.jsx | 116 | journal | yes | `const [totalXp, setTotalXp] = useState(() => parseInt(localStorage.getItem("glp_reflection_xp") \|\| "0", 10));` |
| client/src/pages/Reflection.jsx | 144 | journal | yes | `const draft = localStorage.getItem("glp_reflection_draft");` |
| client/src/pages/WellnessDashboard.jsx | 307 | dashboard | yes | `const savedPref = localStorage.getItem("glp-mood-background") \|\| "adaptive";` |
| client/src/pages/admin/AdminTools.jsx | 38 | admin | yes | `const saved = localStorage.getItem(STORAGE_KEY);` |
| client/src/pages/admin/AdminTools.jsx | 51 | admin | yes | `const saved = localStorage.getItem(STORAGE_KEY);` |
| client/src/pages/admin/AdminTools.jsx | 64 | admin | yes | `try { return Number(localStorage.getItem('glp_tools_auto_refresh')) \|\| 0; } catch { return 0; }` |
| client/src/pages/admin/AdminTools.jsx | 67 | admin | yes | `try { return localStorage.getItem('glp_tools_status_filter') \|\| 'all'; } catch { return 'all'; }` |
| client/src/pages/admin/CommandCenter.jsx | 59 | admin | yes | `const saved = localStorage.getItem('glp_tools_last_check');` |
| client/src/pages/admin/NarrativeDrafts.jsx | 41 | admin | yes | `const token = localStorage.getItem("glp_admin_token");` |
| client/src/pages/admin/_adminTools/DailyOpsRunbook.jsx | 16 | admin | yes | `try { const s = localStorage.getItem('glp_daily_ops_history'); return s ? JSON.parse(s) : []; } catch { return []; }` |
| client/src/pages/tools/BreathingTool.jsx | 68 | wellness-progress | no | `const raw = window.localStorage.getItem("mmhb-breathing-streak-v1");` |
| client/src/pages/tools/GriefLetter.jsx | 31 | uncategorized | no | `const cached = localStorage.getItem(STORAGE_KEY);` |

## 8. SSR-risk clusters

| File | Line | Domain | Excluded | Snippet |
| --- | --- | --- | --- | --- |
| client/src/api/fetchWithAuth.js | 1 | uncategorized | no | `// Safe localStorage helpers for environments with blocked storage` |
| client/src/api/fetchWithAuth.js | 4 | uncategorized | no | `return localStorage.getItem(key);` |
| client/src/api/fetchWithAuth.js | 12 | uncategorized | no | `localStorage.setItem(key, value);` |
| client/src/components/AccessibilityToolbar.jsx | 25 | ux-preferences | no | `const stored = localStorage.getItem("glp-a11y-settings");` |
| client/src/components/AccessibilityToolbar.jsx | 70 | ux-preferences | no | `try { localStorage.setItem("glp-a11y-settings", JSON.stringify(newSettings)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/components/AccessibilityToolbar.jsx | 76 | ux-preferences | no | `try { localStorage.setItem("glp-a11y-settings", JSON.stringify(DEFAULT_A11Y_SETTINGS)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/components/AchievementBadges.jsx | 120 | uncategorized | no | `const saved = localStorage.getItem("achievements_unlocked");` |
| client/src/components/AchievementBadges.jsx | 144 | uncategorized | no | `try { localStorage.setItem("achievements_unlocked", JSON.stringify(updated)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/components/AchievementSystem.jsx | 85 | uncategorized | no | `const saved = localStorage.getItem("earned_achievements");` |
| client/src/components/AchievementSystem.jsx | 123 | uncategorized | no | `try { localStorage.setItem("earned_achievements", JSON.stringify(updated)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/components/AdminGuard.jsx | 10 | admin | yes | `*      stored as { adminVerified, adminSessionToken } in sessionStorage.` |
| client/src/components/AdminGuard.jsx | 28 | admin | yes | `// Path 1: token-based admin session in sessionStorage` |
| client/src/components/AdminGuard.jsx | 30 | admin | yes | `const verified = sessionStorage.getItem("adminVerified") === "true";` |
| client/src/components/AdminGuard.jsx | 31 | admin | yes | `const sessionToken = sessionStorage.getItem("adminSessionToken");` |
| client/src/components/AdminGuard.jsx | 48 | admin | yes | `sessionStorage.removeItem("adminVerified");` |
| client/src/components/AdminGuard.jsx | 49 | admin | yes | `sessionStorage.removeItem("adminSessionToken");` |
| client/src/components/AdminGuard.jsx | 56 | admin | yes | `// sessionStorage unavailable (e.g. private mode) — fall through.` |
| client/src/components/AffirmationCards.jsx | 97 | uncategorized | no | `const saved = localStorage.getItem(STORAGE_KEY);` |
| client/src/components/AffirmationCards.jsx | 147 | uncategorized | no | `try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/components/AgeConfirmationModal.tsx | 17 | uncategorized | no | `const confirmed = localStorage.getItem(STORAGE_KEY);` |
| client/src/components/AgeConfirmationModal.tsx | 39 | uncategorized | no | `try { localStorage.setItem(STORAGE_KEY, "true"); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/components/AgeConsentGate.jsx | 12 | uncategorized | no | `const stored = localStorage.getItem(CONSENT_STORAGE_KEY);` |
| client/src/components/AgeConsentGate.jsx | 20 | uncategorized | no | `try { localStorage.setItem(CONSENT_STORAGE_KEY, 'true'); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/components/AgeConsentGate.jsx | 162 | uncategorized | no | `const stored = localStorage.getItem(CONSENT_STORAGE_KEY);` |
| client/src/components/AgeConsentGate.jsx | 170 | uncategorized | no | `try { localStorage.removeItem(CONSENT_STORAGE_KEY); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/components/AngerManagement.jsx | 85 | uncategorized | no | `const saved = localStorage.getItem("anger_management_data");` |
| client/src/components/AngerManagement.jsx | 131 | auth | yes | `try { localStorage.setItem("anger_management_data", JSON.stringify({ sessions: newSessions })); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/components/BodyScanMeditation.jsx | 27 | auth | yes | `const saved = localStorage.getItem("body_scan_sessions");` |
| client/src/components/BodyScanMeditation.jsx | 44 | auth | yes | `try { localStorage.setItem("body_scan_sessions", newCount.toString()); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/components/BoundaryBuilder.jsx | 43 | uncategorized | no | `const saved = localStorage.getItem("boundary_builder_data");` |
| client/src/components/BoundaryBuilder.jsx | 55 | uncategorized | no | `localStorage.setItem("boundary_builder_data", JSON.stringify({` |
| client/src/components/CBTThoughtDiary.jsx | 37 | uncategorized | no | `const saved = localStorage.getItem(STORAGE_KEY);` |
| client/src/components/CBTThoughtDiary.jsx | 54 | uncategorized | no | `try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/components/CBTThoughtDiary.jsx | 73 | uncategorized | no | `try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/components/ConsentBanner.jsx | 17 | uncategorized | no | `const consent = localStorage.getItem(CONSENT_KEY);` |
| client/src/components/ConsentBanner.jsx | 34 | uncategorized | no | `try { localStorage.setItem(CONSENT_KEY, JSON.stringify(consentData)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/components/ContentLevelToggle.jsx | 6 | uncategorized | no | `* - localStorage persistence` |
| client/src/components/ContentLevelToggle.jsx | 32 | uncategorized | no | `const stored = localStorage.getItem(STORAGE_KEY);` |
| client/src/components/ContentLevelToggle.jsx | 43 | uncategorized | no | `localStorage.setItem(STORAGE_KEY, newLevel);` |
| client/src/components/CopingStrategies.jsx | 232 | uncategorized | no | `const saved = localStorage.getItem("favorite_strategies");` |
| client/src/components/CopingStrategies.jsx | 247 | uncategorized | no | `try { localStorage.setItem("favorite_strategies", JSON.stringify(newFavorites)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/components/DailyAffirmations.jsx | 77 | uncategorized | no | `const savedAffirmations = localStorage.getItem("savedAffirmations");` |
| client/src/components/DailyAffirmations.jsx | 83 | uncategorized | no | `const lastDate = localStorage.getItem("affirmationDate");` |
| client/src/components/DailyAffirmations.jsx | 87 | uncategorized | no | `try { localStorage.setItem("affirmationDate", today); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/components/DailyAffirmations.jsx | 88 | uncategorized | no | `localStorage.setItem("dailyAffirmationIndex", randomIndex.toString());` |
| client/src/components/DailyAffirmations.jsx | 90 | uncategorized | no | `const savedIndex = localStorage.getItem("dailyAffirmationIndex");` |
| client/src/components/DailyAffirmations.jsx | 122 | uncategorized | no | `try { localStorage.setItem("savedAffirmations", JSON.stringify(newSaved)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/components/DigitalDetox.jsx | 45 | tools-monitors | no | `const saved = localStorage.getItem("digital_detox_data");` |
| client/src/components/DigitalDetox.jsx | 90 | tools-monitors | no | `localStorage.setItem("digital_detox_data", JSON.stringify({` |
| client/src/components/DigitalDetox.jsx | 115 | tools-monitors | no | `localStorage.setItem("digital_detox_data", JSON.stringify({` |
| client/src/components/EmotionLog.jsx | 50 | uncategorized | no | `try { localStorage.setItem('glp_emotion_${new Date().toISOString().split('T')[0]}', JSON.stringify(entry)); } catch (err) { console.warn("[storage-safe-write]",` |
| client/src/components/EmotionalIntelligenceQuiz.jsx | 56 | uncategorized | no | `const saved = localStorage.getItem(STORAGE_KEY);` |
| client/src/components/EmotionalIntelligenceQuiz.jsx | 109 | uncategorized | no | `try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedResults)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/components/EnergyBooster.jsx | 71 | uncategorized | no | `const saved = localStorage.getItem("energy_booster_data");` |
| client/src/components/EnergyBooster.jsx | 117 | uncategorized | no | `localStorage.setItem("energy_booster_data", JSON.stringify({` |
| client/src/components/FeedbackPrompt.tsx | 38 | uncategorized | no | `const existing = localStorage.getItem("mmhb_guest_id");` |
| client/src/components/FeedbackPrompt.tsx | 41 | uncategorized | no | `try { localStorage.setItem("mmhb_guest_id", id); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/components/FeedbackPrompt.tsx | 50 | auth | yes | `return localStorage.getItem("mmhb_token");` |
| client/src/components/GoalProgress.jsx | 31 | wellness-progress | no | `const saved = localStorage.getItem("wellness_goals");` |
| client/src/components/GoalProgress.jsx | 39 | wellness-progress | no | `try { localStorage.setItem("wellness_goals", JSON.stringify(updatedGoals)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/components/GratitudeJar.jsx | 38 | uncategorized | no | `const saved = localStorage.getItem(STORAGE_KEY);` |
| client/src/components/GratitudeJar.jsx | 56 | uncategorized | no | `try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/components/GratitudeJar.jsx | 64 | uncategorized | no | `try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/components/GratitudePrompt.jsx | 100 | uncategorized | no | `const existing = ((()=>{try{return JSON.parse(localStorage.getItem("gratitudeEntries") \|\| "[]");}catch(err){console.warn("[storage-safe-read]",err);return JSON.` |
| client/src/components/GratitudePrompt.jsx | 109 | uncategorized | no | `try { localStorage.setItem("gratitudeEntries", JSON.stringify(updated)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/components/HabitTracker.jsx | 20 | wellness-progress | no | `const savedHabits = localStorage.getItem("wellness_habits");` |
| client/src/components/HabitTracker.jsx | 21 | wellness-progress | no | `const savedCompleted = localStorage.getItem("habits_completed_today");` |
| client/src/components/HabitTracker.jsx | 22 | wellness-progress | no | `const savedStreaks = localStorage.getItem("habit_streaks");` |
| client/src/components/HabitTracker.jsx | 23 | wellness-progress | no | `const lastDate = localStorage.getItem("habits_last_date");` |
| client/src/components/HabitTracker.jsx | 30 | wellness-progress | no | `try { localStorage.setItem("wellness_habits", JSON.stringify(DEFAULT_HABITS)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/components/HabitTracker.jsx | 40 | wellness-progress | no | `try { localStorage.setItem("habits_last_date", today); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/components/HabitTracker.jsx | 41 | wellness-progress | no | `localStorage.setItem("habits_completed_today", JSON.stringify({}));` |
| client/src/components/HabitTracker.jsx | 52 | wellness-progress | no | `try { localStorage.setItem("habits_completed_today", JSON.stringify(updated)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/components/HabitTracker.jsx | 61 | wellness-progress | no | `try { localStorage.setItem("habit_streaks", JSON.stringify(newStreaks)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/components/HabitTracker.jsx | 76 | wellness-progress | no | `try { localStorage.setItem("wellness_habits", JSON.stringify(updated)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/components/HabitTracker.jsx | 84 | wellness-progress | no | `try { localStorage.setItem("wellness_habits", JSON.stringify(updated)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/components/HabitTracker.jsx | 89 | wellness-progress | no | `try { localStorage.setItem("habits_completed_today", JSON.stringify(updatedCompleted)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/components/HydrationTracker.jsx | 41 | uncategorized | no | `const saved = localStorage.getItem("hydration_data");` |
| client/src/components/HydrationTracker.jsx | 56 | uncategorized | no | `localStorage.setItem("hydration_data", JSON.stringify({` |
| client/src/components/LaughterTherapy.jsx | 113 | healing | yes | `const saved = localStorage.getItem("laughterMinutes");` |
| client/src/components/LaughterTherapy.jsx | 166 | healing | yes | `try { localStorage.setItem("laughterMinutes", newMinutes.toString()); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/components/MeditationTimer.jsx | 32 | auth | yes | `const saved = localStorage.getItem("meditation_sessions");` |
| client/src/components/MeditationTimer.jsx | 54 | auth | yes | `try { localStorage.setItem("meditation_sessions", newCount.toString()); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/components/MindfulEating.jsx | 83 | uncategorized | no | `const saved = localStorage.getItem("mindful_eating_data");` |
| client/src/components/MindfulEating.jsx | 126 | uncategorized | no | `try { localStorage.setItem("mindful_eating_data", JSON.stringify({ meals: newCount })); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/components/MindfulWalking.jsx | 90 | auth | yes | `const saved = localStorage.getItem("mindful_walking_sessions");` |
| client/src/components/MindfulWalking.jsx | 132 | auth | yes | `try { localStorage.setItem("mindful_walking_sessions", newTotal.toString()); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/components/MindfulnessBell.jsx | 50 | uncategorized | no | `const saved = localStorage.getItem("mindfulness_bell_settings");` |
| client/src/components/MindfulnessBell.jsx | 58 | uncategorized | no | `const savedCount = localStorage.getItem("mindfulness_bell_count");` |
| client/src/components/MindfulnessBell.jsx | 70 | uncategorized | no | `localStorage.setItem("mindfulness_bell_settings", JSON.stringify({` |
| client/src/components/MindfulnessBell.jsx | 120 | uncategorized | no | `localStorage.setItem("mindfulness_bell_count", JSON.stringify({` |
| client/src/components/MindfulnessChallenges.jsx | 39 | uncategorized | no | `const saved = localStorage.getItem(STORAGE_KEY);` |
| client/src/components/MindfulnessChallenges.jsx | 51 | uncategorized | no | `localStorage.setItem(STORAGE_KEY, JSON.stringify({` |
| client/src/components/ModeToggle.jsx | 17 | uncategorized | no | `const saved = localStorage.getItem(STORAGE_KEY) \|\| "";` |
| client/src/components/ModeToggle.jsx | 25 | ux-preferences | no | `try { localStorage.setItem(STORAGE_KEY, modeId); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/components/MorningEveningRituals.jsx | 32 | wellness-progress | no | `const saved = localStorage.getItem("morningRituals");` |
| client/src/components/MorningEveningRituals.jsx | 40 | wellness-progress | no | `const saved = localStorage.getItem("eveningRituals");` |
| client/src/components/MorningEveningRituals.jsx | 48 | wellness-progress | no | `const saved = localStorage.getItem("ritualStreak");` |
| client/src/components/MorningEveningRituals.jsx | 64 | uncategorized | no | `localStorage.setItem(key, JSON.stringify({` |
| client/src/components/MorningEveningRituals.jsx | 87 | wellness-progress | no | `try { localStorage.setItem("ritualStreak", JSON.stringify(newStreak)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/components/MotivationBooster.jsx | 59 | uncategorized | no | `const saved = localStorage.getItem("motivation_booster_data");` |
| client/src/components/MotivationBooster.jsx | 115 | uncategorized | no | `try { localStorage.setItem("motivation_booster_data", JSON.stringify(data)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/components/NewsletterSignup.jsx | 7 | uncategorized | no | `const stored = localStorage.getItem("glp_utm");` |
| client/src/components/NewsletterSignup.jsx | 26 | uncategorized | no | `try { localStorage.setItem("glp_utm", JSON.stringify(utmData)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/components/PositiveReframing.jsx | 59 | uncategorized | no | `const savedHistory = localStorage.getItem("reframing_history");` |
| client/src/components/PositiveReframing.jsx | 82 | uncategorized | no | `try { localStorage.setItem("reframing_history", JSON.stringify(newHistory)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/components/PositiveVisualization.jsx | 103 | uncategorized | no | `const savedFavorites = localStorage.getItem("viz_favorites");` |
| client/src/components/PositiveVisualization.jsx | 164 | uncategorized | no | `try { localStorage.setItem("viz_favorites", JSON.stringify(newFavorites)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/components/PowerNap.jsx | 69 | uncategorized | no | `const saved = localStorage.getItem("nap_count");` |
| client/src/components/PowerNap.jsx | 97 | uncategorized | no | `localStorage.setItem("nap_count", JSON.stringify({` |
| client/src/components/ProgressiveMuscleRelaxation.jsx | 31 | auth | yes | `const saved = localStorage.getItem("pmr_sessions");` |
| client/src/components/ProgressiveMuscleRelaxation.jsx | 56 | auth | yes | `try { localStorage.setItem("pmr_sessions", newCount.toString()); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/components/ReminderScheduler.jsx | 37 | uncategorized | no | `const stored = localStorage.getItem("glp-reminder-settings");` |
| client/src/components/ReminderScheduler.jsx | 59 | uncategorized | no | `localStorage.setItem("glp-reminder-settings", JSON.stringify(settings));` |
| client/src/components/ReminderScheduler.jsx | 103 | uncategorized | no | `localStorage.setItem("glp-scheduled-reminder", JSON.stringify({` |
| client/src/components/ResilienceStories.jsx | 25 | uncategorized | no | `const saved = localStorage.getItem("resilienceStories");` |
| client/src/components/ResilienceStories.jsx | 42 | uncategorized | no | `try { localStorage.setItem("resilienceStories", JSON.stringify(stories)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/components/SelfCareBingo.jsx | 66 | uncategorized | no | `const saved = localStorage.getItem(STORAGE_KEY);` |
| client/src/components/SelfCareBingo.jsx | 98 | uncategorized | no | `localStorage.setItem(STORAGE_KEY, JSON.stringify({` |
| client/src/components/SelfCareBingo.jsx | 136 | uncategorized | no | `localStorage.setItem(STORAGE_KEY, JSON.stringify({` |
| client/src/components/SelfCareChecklist.jsx | 62 | wellness-progress | no | `const savedDate = localStorage.getItem("selfcare_date");` |
| client/src/components/SelfCareChecklist.jsx | 63 | wellness-progress | no | `const savedCompleted = localStorage.getItem("selfcare_completed");` |
| client/src/components/SelfCareChecklist.jsx | 64 | wellness-progress | no | `const savedStreak = localStorage.getItem("selfcare_streak");` |
| client/src/components/SelfCareChecklist.jsx | 65 | wellness-progress | no | `const savedPoints = localStorage.getItem("selfcare_total_points");` |
| client/src/components/SelfCareChecklist.jsx | 81 | wellness-progress | no | `try { localStorage.setItem("selfcare_streak", newStreak.toString()); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/components/SelfCareChecklist.jsx | 84 | wellness-progress | no | `localStorage.setItem("selfcare_streak", "0");` |
| client/src/components/SelfCareChecklist.jsx | 88 | wellness-progress | no | `try { localStorage.setItem("selfcare_streak", "0"); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/components/SelfCareChecklist.jsx | 90 | wellness-progress | no | `localStorage.setItem("selfcare_date", today);` |
| client/src/components/SelfCareChecklist.jsx | 91 | wellness-progress | no | `localStorage.setItem("selfcare_completed", JSON.stringify({}));` |
| client/src/components/SelfCareChecklist.jsx | 93 | wellness-progress | no | `try { localStorage.setItem("selfcare_date", today); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/components/SelfCareChecklist.jsx | 101 | wellness-progress | no | `try { localStorage.setItem("selfcare_completed", JSON.stringify(updated)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/components/SelfCareChecklist.jsx | 106 | wellness-progress | no | `try { localStorage.setItem("selfcare_total_points", newTotal.toString()); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/components/SelfCareChecklist.jsx | 111 | wellness-progress | no | `try { localStorage.setItem("selfcare_completed", JSON.stringify({})); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/components/SelfCompassion.jsx | 88 | tools-monitors | no | `const saved = localStorage.getItem("self_compassion_data");` |
| client/src/components/SelfCompassion.jsx | 152 | tools-monitors | no | `try { localStorage.setItem("self_compassion_data", JSON.stringify(data)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/components/SleepTracker.jsx | 35 | tools-monitors | no | `const savedHistory = localStorage.getItem("sleep_history");` |
| client/src/components/SleepTracker.jsx | 97 | tools-monitors | no | `try { localStorage.setItem("sleep_history", JSON.stringify(updatedHistory)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/components/SocialConnection.jsx | 46 | uncategorized | no | `const savedData = localStorage.getItem("social_connection_data");` |
| client/src/components/SocialConnection.jsx | 80 | uncategorized | no | `localStorage.setItem("social_connection_data", JSON.stringify({` |
| client/src/components/SoftLaunchBanner.jsx | 10 | auth | yes | `const wasDismissed = sessionStorage.getItem("soft_launch_banner_dismissed");` |
| client/src/components/SoftLaunchBanner.jsx | 27 | auth | yes | `sessionStorage.setItem("soft_launch_banner_dismissed", "true");` |
| client/src/components/StressMonitor.jsx | 47 | tools-monitors | no | `const saved = localStorage.getItem("stress_monitor_data");` |
| client/src/components/StressMonitor.jsx | 77 | tools-monitors | no | `localStorage.setItem("stress_monitor_data", JSON.stringify({` |
| client/src/components/ValuesExplorer.jsx | 49 | tools-monitors | no | `const saved = localStorage.getItem("values_explorer_data");` |
| client/src/components/ValuesExplorer.jsx | 92 | tools-monitors | no | `localStorage.setItem("values_explorer_data", JSON.stringify({` |
| client/src/components/ValuesExplorer.jsx | 115 | tools-monitors | no | `localStorage.setItem("values_explorer_data", JSON.stringify({` |
| client/src/components/ValuesExplorer.jsx | 129 | tools-monitors | no | `try { localStorage.removeItem("values_explorer_data"); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/components/VoiceSettings.jsx | 49 | uncategorized | no | `const stored = localStorage.getItem("glp-voice-settings");` |
| client/src/components/VoiceSettings.jsx | 70 | uncategorized | no | `localStorage.setItem("glp-voice-settings", JSON.stringify(settings));` |
| client/src/components/WeeklyReflection.jsx | 80 | journal | yes | `const saved = localStorage.getItem("weekly_reflections");` |
| client/src/components/WeeklyReflection.jsx | 127 | journal | yes | `try { localStorage.setItem("weekly_reflections", JSON.stringify(updated)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/components/WellnessScore.jsx | 69 | wellness-progress | no | `const savedScore = localStorage.getItem("last_wellness_score");` |
| client/src/components/WellnessScore.jsx | 80 | wellness-progress | no | `try { localStorage.setItem("last_wellness_score", Math.round(totalScore).toString()); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/components/WellnessStreakDashboard.jsx | 39 | dashboard | yes | `const saved = localStorage.getItem(STORAGE_KEY);` |
| client/src/components/WellnessStreakDashboard.jsx | 58 | dashboard | yes | `try { localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/components/WorryTimeScheduler.jsx | 25 | tools-monitors | no | `const saved = localStorage.getItem("worry_time_data");` |
| client/src/components/WorryTimeScheduler.jsx | 51 | tools-monitors | no | `try { localStorage.setItem("worry_time_data", JSON.stringify(data)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/components/admin/AIHealthPipeline.jsx | 13 | admin | yes | `try { const s = localStorage.getItem('glp_health_pipeline_history'); return s ? JSON.parse(s) : []; } catch { return []; }` |
| client/src/components/admin/AIHealthPipeline.jsx | 91 | admin | yes | `try { localStorage.setItem('glp_health_pipeline_history', JSON.stringify(newHistory)); } catch {}` |
| client/src/components/admin/DailyOpsChecklist.jsx | 9 | admin | yes | `const saved = localStorage.getItem('glp_daily_ops_checklist');` |
| client/src/components/admin/DailyOpsChecklist.jsx | 21 | admin | yes | `const saved = localStorage.getItem('glp_daily_ops_timestamps');` |
| client/src/components/admin/DailyOpsChecklist.jsx | 56 | admin | yes | `localStorage.setItem('glp_daily_ops_checklist', JSON.stringify({ date: new Date().toDateString(), items: updated }));` |
| client/src/components/admin/DailyOpsChecklist.jsx | 63 | admin | yes | `localStorage.setItem('glp_daily_ops_timestamps', JSON.stringify({ date: new Date().toDateString(), stamps }));` |
| client/src/components/admin/DailyToolsPanel.jsx | 82 | admin | yes | `localStorage.setItem('glp_tools_last_check', JSON.stringify({` |
| client/src/components/admin/OrchestratorTestPanel.jsx | 25 | admin | yes | `const jwt = localStorage.getItem(TOKEN_KEY);` |
| client/src/components/admin/OrchestratorTestPanel.jsx | 27 | admin | yes | `const sess = sessionStorage.getItem(SESSION_TOKEN_KEY);` |
| client/src/components/avatar/BuddyAvatar.tsx | 348 | lumi-ux | no | `//   - Default OFF (lumi:audio:enabled localStorage)` |
| client/src/components/avatar/BuddyAvatar.tsx | 351 | auth | yes | `//   - tryPop() is sessionStorage-gated app-wide (one pop per session` |
| client/src/components/avatar/BuddyAvatar.tsx | 362 | auth | yes | `//    sessionStorage gate ensures it happens at most once per session).` |
| client/src/components/beliefs/BeliefMapper.tsx | 22 | uncategorized | no | `return ((()=>{try{return JSON.parse(localStorage.getItem(STORAGE_KEY) \|\| "[]");}catch(err){console.warn("[storage-safe-read]",err);return JSON.parse("[]");}})()` |
| client/src/components/beliefs/BeliefMapper.tsx | 29 | uncategorized | no | `try { localStorage.setItem(STORAGE_KEY, JSON.stringify(beliefs)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/components/consciousness/SilenceMode.tsx | 15 | uncategorized | no | `const existing = ((()=>{try{return JSON.parse(localStorage.getItem(key) \|\| "[]");}catch(err){console.warn("[storage-safe-read]",err);return JSON.parse("[]");}})` |
| client/src/components/consciousness/SilenceMode.tsx | 21 | uncategorized | no | `try { localStorage.setItem(key, JSON.stringify([entry, ...existing].slice(0, 100))); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/components/growth/GrowthTimeline.tsx | 21 | journal | yes | `const reflections = ((()=>{try{return JSON.parse(localStorage.getItem(STORAGE_KEYS.reflections) \|\| "[]");}catch(err){console.warn("[storage-safe-read]",err);ret` |
| client/src/components/growth/GrowthTimeline.tsx | 32 | uncategorized | no | `const beliefs = ((()=>{try{return JSON.parse(localStorage.getItem(STORAGE_KEYS.beliefs) \|\| "[]");}catch(err){console.warn("[storage-safe-read]",err);return JSON` |
| client/src/components/growth/GrowthTimeline.tsx | 42 | uncategorized | no | `const silence = ((()=>{try{return JSON.parse(localStorage.getItem(STORAGE_KEYS.silence) \|\| "[]");}catch(err){console.warn("[storage-safe-read]",err);return JSON` |
| client/src/components/lumi/LumiCompanion.jsx | 67 | lumi-ux | no | `* localStorage and reads them back on next mount.` |
| client/src/components/lumi/LumiV6.tsx | 34 | auth | yes | `*       last-seen emotion in sessionStorage; on remount with a different` |
| client/src/components/lumi/LumiV6.tsx | 46 | auth | yes | `*       time Lumi enters the viewport in a session. sessionStorage-gated so` |
| client/src/components/lumi/LumiV6.tsx | 186 | auth | yes | `*  'lumi:memory:<memoryKey>' in sessionStorage; on remount with a` |
| client/src/components/lumi/LumiV6.tsx | 592 | auth | yes | `try { prev = sessionStorage.getItem(storageKey); } catch { /* private mode */ }` |
| client/src/components/lumi/LumiV6.tsx | 596 | auth | yes | `try { sessionStorage.setItem(storageKey, emotion); } catch { /* noop */ }` |
| client/src/components/lumi/LumiV6.tsx | 599 | auth | yes | `try { sessionStorage.setItem(storageKey, emotion); } catch { /* noop */ }` |
| client/src/components/lumi/LumiV6.tsx | 607 | auth | yes | `// IntersectionObserver waits for Lumi to enter viewport; sessionStorage` |
| client/src/components/lumi/LumiV6.tsx | 616 | auth | yes | `try { seen = sessionStorage.getItem("lumi:v9:entered") === "1"; } catch { /* private mode */ }` |
| client/src/components/lumi/LumiV6.tsx | 622 | auth | yes | `try { sessionStorage.setItem("lumi:v9:entered", "1"); } catch { /* noop */ }` |
| client/src/components/lumi/LumiV6.tsx | 625 | auth | yes | `// V14: gentle entrance pop via the module coordinator (sessionStorage` |
| client/src/components/lumi/LumiV6.tsx | 738 | auth | yes | `// On mount, check sessionStorage for the last emotion this browser session` |
| client/src/components/lumi/LumiV6.tsx | 753 | auth | yes | `try { last = sessionStorage.getItem("lumi:v9:lastEmotion"); } catch { /* private mode */ }` |
| client/src/components/lumi/LumiV6.tsx | 760 | auth | yes | `try { sessionStorage.setItem("lumi:v9:lastEmotion", effectiveEmotion); } catch { /* noop */ }` |
| client/src/components/lumi/LumiV6.tsx | 763 | auth | yes | `try { sessionStorage.setItem("lumi:v9:lastEmotion", effectiveEmotion); } catch { /* noop */ }` |
| client/src/components/modules/ModulesPanel.tsx | 23 | uncategorized | no | `const raw = localStorage.getItem(key);` |
| client/src/components/modules/ModulesPanel.tsx | 31 | uncategorized | no | `localStorage.setItem(key, JSON.stringify(value));` |
| client/src/components/patterns/InsightPatternLab.tsx | 38 | uncategorized | no | `const stateHistoryRaw = localStorage.getItem("glp_state_history");` |
| client/src/components/personalization/ToolRecommendations.jsx | 32 | uncategorized | no | `const prefs = ((()=>{try{return JSON.parse(localStorage.getItem("glp_onboarding_preferences") \|\| "{}");}catch(err){console.warn("[storage-safe-read]",err);retur` |
| client/src/context/EmotionContext.jsx | 123 | provider | yes | `const saved = localStorage.getItem(STORAGE_KEY);` |
| client/src/context/EmotionContext.jsx | 158 | provider | yes | `localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));` |
| client/src/context/EmotionContext.jsx | 196 | provider | yes | `try { localStorage.removeItem(STORAGE_KEY); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/hooks/useAnalytics.mjs | 14 | provider | yes | `return localStorage.getItem("analytics_opt_out") === "true";` |
| client/src/lib/aiChat.ts | 15 | chat | yes | `let id = localStorage.getItem(GUEST_ID_KEY);` |
| client/src/lib/aiChat.ts | 18 | chat | yes | `try { localStorage.setItem(GUEST_ID_KEY, id); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/lib/aiChat.ts | 25 | chat | yes | `// localStorage.getItem can throw in some sandboxed iframe / private-mode` |
| client/src/lib/aiChat.ts | 29 | chat | yes | `token = localStorage.getItem(TOKEN_KEY);` |
| client/src/lib/atlas/philosophicalAtlas.ts | 231 | uncategorized | no | `const existing: AtlasPath[] = ((()=>{try{return JSON.parse(localStorage.getItem(key) \|\| "[]");}catch(err){console.warn("[storage-safe-read]",err);return JSON.pa` |
| client/src/lib/atlas/philosophicalAtlas.ts | 238 | uncategorized | no | `try { localStorage.setItem(key, JSON.stringify(existing.slice(0, 50))); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/lib/atlas/philosophicalAtlas.ts | 242 | uncategorized | no | `return ((()=>{try{return JSON.parse(localStorage.getItem("glp_atlas_paths") \|\| "[]");}catch(err){console.warn("[storage-safe-read]",err);return JSON.parse("[]")` |
| client/src/lib/attention/attentionEcology.ts | 76 | uncategorized | no | `const stored = localStorage.getItem(STORAGE_KEY);` |
| client/src/lib/attention/attentionEcology.ts | 83 | uncategorized | no | `try { localStorage.setItem(STORAGE_KEY, JSON.stringify(profile)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/lib/autodidact/autodidactForge.ts | 135 | uncategorized | no | `const existing: AutodidactPlan[] = ((()=>{try{return JSON.parse(localStorage.getItem(key) \|\| "[]");}catch(err){console.warn("[storage-safe-read]",err);return JS` |
| client/src/lib/autodidact/autodidactForge.ts | 143 | uncategorized | no | `try { localStorage.setItem(key, JSON.stringify(existing.slice(0, 10))); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/lib/autodidact/autodidactForge.ts | 147 | uncategorized | no | `return ((()=>{try{return JSON.parse(localStorage.getItem("glp_autodidact_plans") \|\| "[]");}catch(err){console.warn("[storage-safe-read]",err);return JSON.parse(` |
| client/src/lib/autodidact/autodidactForge.ts | 152 | uncategorized | no | `const existing: AutodidactPlan[] = ((()=>{try{return JSON.parse(localStorage.getItem(key) \|\| "[]");}catch(err){console.warn("[storage-safe-read]",err);return JS` |
| client/src/lib/autodidact/autodidactForge.ts | 153 | uncategorized | no | `localStorage.setItem(key, JSON.stringify(existing.filter(p => p.id !== id)));` |
| client/src/lib/bias/biasBlindSpots.ts | 174 | uncategorized | no | `try { localStorage.setItem(key, JSON.stringify(updated)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/lib/bias/biasBlindSpots.ts | 178 | uncategorized | no | `const stored = localStorage.getItem("glp_bias_profile");` |
| client/src/lib/buddyTelemetry.ts | 42 | uncategorized | no | `* Get-or-create a stable guest identifier in localStorage.` |
| client/src/lib/buddyTelemetry.ts | 51 | uncategorized | no | `* Returns an empty string if localStorage is unavailable (private` |
| client/src/lib/buddyTelemetry.ts | 56 | uncategorized | no | `const existing = localStorage.getItem(GUEST_ID_KEY);` |
| client/src/lib/buddyTelemetry.ts | 59 | uncategorized | no | `try { localStorage.setItem(GUEST_ID_KEY, fresh); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/lib/buddyTelemetry.ts | 62 | uncategorized | no | `/* localStorage unavailable — proceed without guest header */` |
| client/src/lib/creative/creativeProblemSolving.ts | 116 | uncategorized | no | `const stored = localStorage.getItem(STORAGE_KEY);` |
| client/src/lib/creative/creativeProblemSolving.ts | 123 | uncategorized | no | `try { localStorage.setItem(STORAGE_KEY, JSON.stringify(profile)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/lib/decision/decisionArchitecture.ts | 113 | uncategorized | no | `const existing: DecisionFrame[] = ((()=>{try{return JSON.parse(localStorage.getItem(key) \|\| "[]");}catch(err){console.warn("[storage-safe-read]",err);return JSO` |
| client/src/lib/decision/decisionArchitecture.ts | 121 | uncategorized | no | `try { localStorage.setItem(key, JSON.stringify(existing.slice(0, 25))); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/lib/decision/decisionArchitecture.ts | 125 | uncategorized | no | `return ((()=>{try{return JSON.parse(localStorage.getItem("glp_decision_frames") \|\| "[]");}catch(err){console.warn("[storage-safe-read]",err);return JSON.parse("` |
| client/src/lib/decision/decisionArchitecture.ts | 130 | uncategorized | no | `const existing: DecisionFrame[] = ((()=>{try{return JSON.parse(localStorage.getItem(key) \|\| "[]");}catch(err){console.warn("[storage-safe-read]",err);return JSO` |
| client/src/lib/decision/decisionArchitecture.ts | 131 | uncategorized | no | `localStorage.setItem(key, JSON.stringify(existing.filter(f => f.id !== id)));` |
| client/src/lib/epistemic/epistemicCalibration.ts | 99 | uncategorized | no | `try { localStorage.setItem(key, JSON.stringify(updated)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/lib/epistemic/epistemicCalibration.ts | 103 | uncategorized | no | `const stored = localStorage.getItem("glp_epistemic_profile");` |
| client/src/lib/existential/existentialInquiry.ts | 108 | uncategorized | no | `const stored = localStorage.getItem(STORAGE_KEY);` |
| client/src/lib/existential/existentialInquiry.ts | 115 | uncategorized | no | `try { localStorage.setItem(STORAGE_KEY, JSON.stringify(profile)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/lib/export/reflectionExport.ts | 12 | journal | yes | `return ((()=>{try{return JSON.parse(localStorage.getItem(STORAGE_KEY) \|\| "[]");}catch(err){console.warn("[storage-safe-read]",err);return JSON.parse("[]");}})()` |
| client/src/lib/export/reflectionExport.ts | 116 | journal | yes | `try { localStorage.removeItem(STORAGE_KEY); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/lib/inquiry/dialecticalInquiry.ts | 119 | uncategorized | no | `const existing = ((()=>{try{return JSON.parse(localStorage.getItem(key) \|\| "[]");}catch(err){console.warn("[storage-safe-read]",err);return JSON.parse("[]");}})` |
| client/src/lib/inquiry/dialecticalInquiry.ts | 120 | auth | yes | `localStorage.setItem(key, JSON.stringify([session, ...existing].slice(0, 30)));` |
| client/src/lib/inquiry/dialecticalInquiry.ts | 125 | uncategorized | no | `return ((()=>{try{return JSON.parse(localStorage.getItem(key) \|\| "[]");}catch(err){console.warn("[storage-safe-read]",err);return JSON.parse("[]");}})());` |
| client/src/lib/journey/journeyComposer.ts | 120 | uncategorized | no | `const existing: JourneyFlow[] = ((()=>{try{return JSON.parse(localStorage.getItem(key) \|\| "[]");}catch(err){console.warn("[storage-safe-read]",err);return JSON.` |
| client/src/lib/journey/journeyComposer.ts | 127 | uncategorized | no | `try { localStorage.setItem(key, JSON.stringify(existing.slice(0, 30))); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/lib/journey/journeyComposer.ts | 131 | uncategorized | no | `return ((()=>{try{return JSON.parse(localStorage.getItem("glp_journey_flows") \|\| "[]");}catch(err){console.warn("[storage-safe-read]",err);return JSON.parse("[]` |
| client/src/lib/journey/journeyComposer.ts | 136 | uncategorized | no | `const existing: JourneyFlow[] = ((()=>{try{return JSON.parse(localStorage.getItem(key) \|\| "[]");}catch(err){console.warn("[storage-safe-read]",err);return JSON.` |
| client/src/lib/journey/journeyComposer.ts | 137 | uncategorized | no | `localStorage.setItem(key, JSON.stringify(existing.filter(f => f.id !== id)));` |
| client/src/lib/logic/logicLatticeLab.ts | 99 | auth | yes | `const existing: LogicSession[] = ((()=>{try{return JSON.parse(localStorage.getItem(key) \|\| "[]");}catch(err){console.warn("[storage-safe-read]",err);return JSON` |
| client/src/lib/logic/logicLatticeLab.ts | 107 | uncategorized | no | `try { localStorage.setItem(key, JSON.stringify(existing.slice(0, 30))); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/lib/logic/logicLatticeLab.ts | 111 | auth | yes | `return ((()=>{try{return JSON.parse(localStorage.getItem("glp_logic_sessions") \|\| "[]");}catch(err){console.warn("[storage-safe-read]",err);return JSON.parse("[` |
| client/src/lib/logic/logicLatticeLab.ts | 116 | auth | yes | `const existing: LogicSession[] = ((()=>{try{return JSON.parse(localStorage.getItem(key) \|\| "[]");}catch(err){console.warn("[storage-safe-read]",err);return JSON` |
| client/src/lib/logic/logicLatticeLab.ts | 117 | uncategorized | no | `localStorage.setItem(key, JSON.stringify(existing.filter(s => s.id !== id)));` |
| client/src/lib/mastery/deepWork.ts | 95 | uncategorized | no | `const stored = localStorage.getItem(STORAGE_KEY);` |
| client/src/lib/mastery/deepWork.ts | 108 | uncategorized | no | `try { localStorage.setItem(STORAGE_KEY, JSON.stringify(profile)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/lib/mastery/mentalModels.ts | 142 | uncategorized | no | `const stored = localStorage.getItem(STORAGE_KEY);` |
| client/src/lib/mastery/mentalModels.ts | 149 | uncategorized | no | `try { localStorage.setItem(STORAGE_KEY, JSON.stringify(library)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/lib/metacognition/metacognitionDashboard.ts | 120 | dashboard | yes | `try { localStorage.setItem(key, JSON.stringify(updated)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/lib/metacognition/metacognitionDashboard.ts | 124 | dashboard | yes | `const stored = localStorage.getItem("glp_metacognitive_profile");` |
| client/src/lib/metacognition/metacognitionStudio.ts | 171 | uncategorized | no | `const existing = ((()=>{try{return JSON.parse(localStorage.getItem(key) \|\| "[]");}catch(err){console.warn("[storage-safe-read]",err);return JSON.parse("[]");}})` |
| client/src/lib/metacognition/metacognitionStudio.ts | 172 | auth | yes | `localStorage.setItem(key, JSON.stringify([session, ...existing].slice(0, 30)));` |
| client/src/lib/metacognition/metacognitionStudio.ts | 176 | auth | yes | `return ((()=>{try{return JSON.parse(localStorage.getItem("glp_metacognition_sessions") \|\| "[]");}catch(err){console.warn("[storage-safe-read]",err);return JSON.` |
| client/src/lib/mindscape/mindscapeNavigator.ts | 95 | uncategorized | no | `const stored = localStorage.getItem(STORAGE_KEY);` |
| client/src/lib/mindscape/mindscapeNavigator.ts | 109 | uncategorized | no | `try { localStorage.setItem(STORAGE_KEY, JSON.stringify(map)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/lib/mode.js | 6 | ux-preferences | no | `try { localStorage.setItem("glp-mode", mode \|\| "default"); } catch { /* localStorage unavailable */ }` |
| client/src/lib/mode.js | 11 | ux-preferences | no | `const saved = localStorage.getItem("glp-mode");` |
| client/src/lib/mode.js | 13 | uncategorized | no | `} catch { /* localStorage unavailable */ }` |
| client/src/lib/moral/moralReasoning.ts | 94 | uncategorized | no | `const stored = localStorage.getItem(STORAGE_KEY);` |
| client/src/lib/moral/moralReasoning.ts | 101 | uncategorized | no | `try { localStorage.setItem(STORAGE_KEY, JSON.stringify(dilemmas)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/lib/narrative/narrativeIdentity.ts | 79 | uncategorized | no | `const stored = localStorage.getItem(STORAGE_KEY);` |
| client/src/lib/narrative/narrativeIdentity.ts | 94 | uncategorized | no | `try { localStorage.setItem(STORAGE_KEY, JSON.stringify(narrative)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/lib/paradox/paradoxCartographer.ts | 108 | auth | yes | `const existing: ParadoxSession[] = ((()=>{try{return JSON.parse(localStorage.getItem(key) \|\| "[]");}catch(err){console.warn("[storage-safe-read]",err);return JS` |
| client/src/lib/paradox/paradoxCartographer.ts | 116 | uncategorized | no | `try { localStorage.setItem(key, JSON.stringify(existing.slice(0, 25))); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/lib/paradox/paradoxCartographer.ts | 120 | uncategorized | no | `return ((()=>{try{return JSON.parse(localStorage.getItem("glp_paradox_maps") \|\| "[]");}catch(err){console.warn("[storage-safe-read]",err);return JSON.parse("[]"` |
| client/src/lib/paradox/paradoxCartographer.ts | 125 | auth | yes | `const existing: ParadoxSession[] = ((()=>{try{return JSON.parse(localStorage.getItem(key) \|\| "[]");}catch(err){console.warn("[storage-safe-read]",err);return JS` |
| client/src/lib/paradox/paradoxCartographer.ts | 126 | uncategorized | no | `localStorage.setItem(key, JSON.stringify(existing.filter(s => s.id !== id)));` |
| client/src/lib/patterns/insightPatternLab.ts | 173 | uncategorized | no | `const existing = ((()=>{try{return JSON.parse(localStorage.getItem(key) \|\| "[]");}catch(err){console.warn("[storage-safe-read]",err);return JSON.parse("[]");}})` |
| client/src/lib/patterns/insightPatternLab.ts | 174 | auth | yes | `localStorage.setItem(key, JSON.stringify([session, ...existing].slice(0, 20)));` |
| client/src/lib/patterns/insightPatternLab.ts | 178 | auth | yes | `return ((()=>{try{return JSON.parse(localStorage.getItem("glp_pattern_lab_sessions") \|\| "[]");}catch(err){console.warn("[storage-safe-read]",err);return JSON.pa` |
| client/src/lib/semantic/semanticMapping.ts | 98 | uncategorized | no | `const existing: SemanticMap[] = ((()=>{try{return JSON.parse(localStorage.getItem(key) \|\| "[]");}catch(err){console.warn("[storage-safe-read]",err);return JSON.` |
| client/src/lib/semantic/semanticMapping.ts | 106 | uncategorized | no | `try { localStorage.setItem(key, JSON.stringify(existing.slice(0, 20))); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/lib/semantic/semanticMapping.ts | 110 | uncategorized | no | `return ((()=>{try{return JSON.parse(localStorage.getItem("glp_semantic_maps") \|\| "[]");}catch(err){console.warn("[storage-safe-read]",err);return JSON.parse("[]` |
| client/src/lib/semantic/semanticMapping.ts | 115 | uncategorized | no | `const existing: SemanticMap[] = ((()=>{try{return JSON.parse(localStorage.getItem(key) \|\| "[]");}catch(err){console.warn("[storage-safe-read]",err);return JSON.` |
| client/src/lib/semantic/semanticMapping.ts | 116 | uncategorized | no | `localStorage.setItem(key, JSON.stringify(existing.filter(m => m.id !== id)));` |
| client/src/lib/stance/philosophicalStance.ts | 163 | uncategorized | no | `try { localStorage.setItem(key, JSON.stringify(updated)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/lib/stance/philosophicalStance.ts | 167 | uncategorized | no | `const stored = localStorage.getItem("glp_philosophical_profile");` |
| client/src/lib/synthesis/synthesisCollider.ts | 93 | auth | yes | `const existing: ColliderSession[] = ((()=>{try{return JSON.parse(localStorage.getItem(key) \|\| "[]");}catch(err){console.warn("[storage-safe-read]",err);return J` |
| client/src/lib/synthesis/synthesisCollider.ts | 101 | uncategorized | no | `try { localStorage.setItem(key, JSON.stringify(existing.slice(0, 20))); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/lib/synthesis/synthesisCollider.ts | 105 | auth | yes | `return ((()=>{try{return JSON.parse(localStorage.getItem("glp_synthesis_sessions") \|\| "[]");}catch(err){console.warn("[storage-safe-read]",err);return JSON.pars` |
| client/src/lib/synthesis/synthesisCollider.ts | 110 | auth | yes | `const existing: ColliderSession[] = ((()=>{try{return JSON.parse(localStorage.getItem(key) \|\| "[]");}catch(err){console.warn("[storage-safe-read]",err);return J` |
| client/src/lib/synthesis/synthesisCollider.ts | 111 | uncategorized | no | `localStorage.setItem(key, JSON.stringify(existing.filter(s => s.id !== id)));` |
| client/src/lib/systems/systemsResonance.ts | 125 | ux-preferences | no | `const existing: SystemModel[] = ((()=>{try{return JSON.parse(localStorage.getItem(key) \|\| "[]");}catch(err){console.warn("[storage-safe-read]",err);return JSON.` |
| client/src/lib/systems/systemsResonance.ts | 133 | uncategorized | no | `try { localStorage.setItem(key, JSON.stringify(existing.slice(0, 20))); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/lib/systems/systemsResonance.ts | 137 | ux-preferences | no | `return ((()=>{try{return JSON.parse(localStorage.getItem("glp_system_models") \|\| "[]");}catch(err){console.warn("[storage-safe-read]",err);return JSON.parse("[]` |
| client/src/lib/systems/systemsResonance.ts | 142 | ux-preferences | no | `const existing: SystemModel[] = ((()=>{try{return JSON.parse(localStorage.getItem(key) \|\| "[]");}catch(err){console.warn("[storage-safe-read]",err);return JSON.` |
| client/src/lib/systems/systemsResonance.ts | 143 | uncategorized | no | `localStorage.setItem(key, JSON.stringify(existing.filter(m => m.id !== id)));` |
| client/src/lib/temporal/temporalReflection.ts | 98 | journal | yes | `const existing = ((()=>{try{return JSON.parse(localStorage.getItem(key) \|\| "[]");}catch(err){console.warn("[storage-safe-read]",err);return JSON.parse("[]");}})` |
| client/src/lib/temporal/temporalReflection.ts | 99 | journal | yes | `localStorage.setItem(key, JSON.stringify([integration, ...existing].slice(0, 30)));` |
| client/src/lib/temporal/temporalReflection.ts | 104 | journal | yes | `return ((()=>{try{return JSON.parse(localStorage.getItem(key) \|\| "[]");}catch(err){console.warn("[storage-safe-read]",err);return JSON.parse("[]");}})());` |
| client/src/lib/thought/thoughtExperiments.ts | 149 | auth | yes | `const existing: ExperimentSession[] = ((()=>{try{return JSON.parse(localStorage.getItem(key) \|\| "[]");}catch(err){console.warn("[storage-safe-read]",err);return` |
| client/src/lib/thought/thoughtExperiments.ts | 156 | uncategorized | no | `try { localStorage.setItem(key, JSON.stringify(existing.slice(0, 50))); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/lib/thought/thoughtExperiments.ts | 160 | auth | yes | `return ((()=>{try{return JSON.parse(localStorage.getItem("glp_thought_sessions") \|\| "[]");}catch(err){console.warn("[storage-safe-read]",err);return JSON.parse(` |
| client/src/lib/thought/thoughtExperiments.ts | 165 | auth | yes | `const existing: ExperimentSession[] = ((()=>{try{return JSON.parse(localStorage.getItem(key) \|\| "[]");}catch(err){console.warn("[storage-safe-read]",err);return` |
| client/src/lib/thought/thoughtExperiments.ts | 166 | uncategorized | no | `localStorage.setItem(key, JSON.stringify(existing.filter(s => s.id !== id)));` |
| client/src/lib/values/valuesClarity.ts | 65 | uncategorized | no | `const stored = localStorage.getItem(STORAGE_KEY);` |
| client/src/lib/values/valuesClarity.ts | 72 | uncategorized | no | `try { localStorage.setItem(STORAGE_KEY, JSON.stringify(profile)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/lib/weave/knowledgeWeave.ts | 106 | uncategorized | no | `const existing: KnowledgeWeave[] = ((()=>{try{return JSON.parse(localStorage.getItem(key) \|\| "[]");}catch(err){console.warn("[storage-safe-read]",err);return JS` |
| client/src/lib/weave/knowledgeWeave.ts | 114 | uncategorized | no | `try { localStorage.setItem(key, JSON.stringify(existing.slice(0, 15))); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/lib/weave/knowledgeWeave.ts | 118 | uncategorized | no | `return ((()=>{try{return JSON.parse(localStorage.getItem("glp_knowledge_weaves") \|\| "[]");}catch(err){console.warn("[storage-safe-read]",err);return JSON.parse(` |
| client/src/lib/weave/knowledgeWeave.ts | 123 | uncategorized | no | `const existing: KnowledgeWeave[] = ((()=>{try{return JSON.parse(localStorage.getItem(key) \|\| "[]");}catch(err){console.warn("[storage-safe-read]",err);return JS` |
| client/src/lib/weave/knowledgeWeave.ts | 124 | uncategorized | no | `localStorage.setItem(key, JSON.stringify(existing.filter(w => w.id !== id)));` |
| client/src/lumi-cbt/engine/CBTSessionEngine.ts | 31 | auth | yes | `* + 'replaceSessions()' with their own storage layer (e.g. localStorage,` |
| client/src/lumi-memory/state/memoryStore.ts | 101 | lumi-ux | no | `// diagnostic, would grow unbounded across reloads and bloat localStorage).` |
| client/src/lumi-memory/state/memoryStore.ts | 170 | lumi-ux | no | `storage: createJSONStorage(() => localStorage),` |
| client/src/lumi-memory/state/memoryStore.ts | 173 | lumi-ux | no | `// it would (a) bloat localStorage and (b) leak rejection metadata` |
| client/src/main.jsx | 102 | uncategorized | no | `try { localStorage.setItem('glp-scheduled-reminder', JSON.stringify(event.data.data)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/main.jsx | 105 | uncategorized | no | `localStorage.removeItem('glp-scheduled-reminder');` |
| client/src/main.jsx | 110 | uncategorized | no | `const stored = localStorage.getItem('glp-scheduled-reminder');` |
| client/src/main.jsx | 133 | uncategorized | no | `localStorage.setItem('glp-scheduled-reminder', JSON.stringify({` |
| client/src/pages/AdminLogin.jsx | 12 | admin | yes | `* 4h JWT session token in sessionStorage under the existing keys` |
| client/src/pages/AdminLogin.jsx | 41 | admin | yes | `if (sessionStorage.getItem("adminVerified") === "true") {` |
| client/src/pages/AdminLogin.jsx | 71 | admin | yes | `sessionStorage.setItem("adminVerified", "true");` |
| client/src/pages/AdminLogin.jsx | 73 | admin | yes | `sessionStorage.setItem("adminSessionToken", data.sessionToken);` |
| client/src/pages/AffirmationWall.jsx | 27 | uncategorized | no | `const stored = localStorage.getItem("glp-liked-affirmations");` |
| client/src/pages/AffirmationWall.jsx | 70 | uncategorized | no | `try { localStorage.setItem("glp-liked-affirmations", JSON.stringify([...newLiked])); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/pages/AlignmentPath.jsx | 219 | uncategorized | no | `const stored = localStorage.getItem('glp_alignment_progress');` |
| client/src/pages/AlignmentPath.jsx | 235 | uncategorized | no | `try { localStorage.setItem('glp_alignment_progress', JSON.stringify(updated)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/pages/AtlasDashboard.tsx | 167 | dashboard | yes | `const saved = localStorage.getItem(STORAGE_KEY);` |
| client/src/pages/AtlasDashboard.tsx | 180 | dashboard | yes | `try { localStorage.setItem(STORAGE_KEY, JSON.stringify(profile)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/pages/CanvaLanding.jsx | 60 | admin | yes | `sessionStorage.setItem("adminVerified", "true");` |
| client/src/pages/CanvaLanding.jsx | 62 | admin | yes | `sessionStorage.setItem("adminSessionToken", data.sessionToken);` |
| client/src/pages/Challenge.jsx | 82 | uncategorized | no | `const cached = localStorage.getItem(STORAGE_KEY);` |
| client/src/pages/Challenge.jsx | 86 | uncategorized | no | `const cached = localStorage.getItem(STORAGE_KEY);` |
| client/src/pages/Challenge.jsx | 90 | uncategorized | no | `const cached = localStorage.getItem(STORAGE_KEY);` |
| client/src/pages/Challenge.jsx | 114 | uncategorized | no | `try { localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/pages/Challenge.jsx | 117 | uncategorized | no | `localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));` |
| client/src/pages/ChallengeDay.jsx | 47 | wellness-progress | no | `const saved = localStorage.getItem("glp-challenge-progress");` |
| client/src/pages/ChallengeDay.jsx | 75 | wellness-progress | no | `const saved = localStorage.getItem("glp-challenge-progress");` |
| client/src/pages/ChallengeDay.jsx | 78 | wellness-progress | no | `try { localStorage.setItem("glp-challenge-progress", JSON.stringify(progress)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/pages/ChallengeDay.jsx | 96 | wellness-progress | no | `const saved = localStorage.getItem("glp-challenge-progress");` |
| client/src/pages/ChallengeDay.jsx | 99 | wellness-progress | no | `try { localStorage.setItem("glp-challenge-progress", JSON.stringify(progress)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/pages/ChallengeDay.jsx | 114 | wellness-progress | no | `const saved = localStorage.getItem("glp-challenge-progress");` |
| client/src/pages/ChallengeDay.jsx | 117 | wellness-progress | no | `try { localStorage.setItem("glp-challenge-progress", JSON.stringify(progress)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/pages/ChallengeDay.jsx | 129 | journal | yes | `const saved = localStorage.getItem("glp-reflection-cards");` |
| client/src/pages/ChallengeDay.jsx | 138 | journal | yes | `try { localStorage.setItem("glp-reflection-cards", JSON.stringify(cards)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/pages/CognitiveArchitecturePage.tsx | 100 | uncategorized | no | `const raw = localStorage.getItem(STORAGE_KEY);` |
| client/src/pages/CognitiveArchitecturePage.tsx | 108 | uncategorized | no | `try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/pages/CollaborativeLabPage.tsx | 101 | uncategorized | no | `const saved = localStorage.getItem(STORAGE_KEY);` |
| client/src/pages/CollaborativeLabPage.tsx | 113 | uncategorized | no | `try { localStorage.setItem(STORAGE_KEY, JSON.stringify(profile)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/pages/CourseCatalog.jsx | 24 | uncategorized | no | `const saved = localStorage.getItem(ENROLLMENT_KEY);` |
| client/src/pages/CourseCatalog.jsx | 55 | uncategorized | no | `localStorage.setItem(ENROLLMENT_KEY, JSON.stringify(updatedEnrollments));` |
| client/src/pages/DailyPracticePage.jsx | 160 | uncategorized | no | `const saved = localStorage.getItem("dailyPractices");` |
| client/src/pages/DailyPracticePage.jsx | 170 | uncategorized | no | `localStorage.setItem("dailyPractices", JSON.stringify({` |
| client/src/pages/DailyRitualPage.tsx | 198 | uncategorized | no | `const existing = ((()=>{try{return JSON.parse(localStorage.getItem(STORAGE_KEY) \|\| "[]");}catch(err){console.warn("[storage-safe-read]",err);return JSON.parse("` |
| client/src/pages/DailyRitualPage.tsx | 200 | uncategorized | no | `localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));` |
| client/src/pages/DailyWisdomOraclePage.tsx | 111 | uncategorized | no | `const raw = localStorage.getItem(STORAGE_KEY);` |
| client/src/pages/DailyWisdomOraclePage.tsx | 119 | uncategorized | no | `try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/pages/Dashboard.jsx | 611 | journal | yes | `const entries = ((()=>{try{return JSON.parse(localStorage.getItem("glp_reflections") \|\| "[]");}catch(err){console.warn("[storage-safe-read]",err);return JSON.pa` |
| client/src/pages/Dashboard.jsx | 630 | journal | yes | `const totalXp = parseInt(localStorage.getItem("glp_reflection_xp") \|\| "0", 10);` |
| client/src/pages/GrowthAnalyticsPage.tsx | 37 | analytics | no | `const saved = localStorage.getItem(STORAGE_KEY);` |
| client/src/pages/GrowthAnalyticsPage.tsx | 72 | analytics | no | `const data = localStorage.getItem(key);` |
| client/src/pages/GrowthAnalyticsPage.tsx | 84 | analytics | no | `const data = localStorage.getItem(key);` |
| client/src/pages/GrowthAnalyticsPage.tsx | 96 | analytics | no | `const data = localStorage.getItem(key);` |
| client/src/pages/GrowthAnalyticsPage.tsx | 108 | analytics | no | `const data = localStorage.getItem(key);` |
| client/src/pages/GrowthAnalyticsPage.tsx | 120 | analytics | no | `const data = localStorage.getItem(key);` |
| client/src/pages/GuidedJournalingPage.tsx | 112 | journal | yes | `const stored = localStorage.getItem(STORAGE_KEY);` |
| client/src/pages/GuidedJournalingPage.tsx | 119 | journal | yes | `try { localStorage.setItem(STORAGE_KEY, JSON.stringify(profile)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/pages/InsightCardsPage.tsx | 50 | uncategorized | no | `const stored = localStorage.getItem(STORAGE_KEY);` |
| client/src/pages/InsightCardsPage.tsx | 57 | uncategorized | no | `try { localStorage.setItem(STORAGE_KEY, JSON.stringify(library)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/pages/KnowledgeSynthesisPage.tsx | 54 | uncategorized | no | `const saved = localStorage.getItem(STORAGE_KEY);` |
| client/src/pages/KnowledgeSynthesisPage.tsx | 67 | uncategorized | no | `localStorage.setItem(STORAGE_KEY, JSON.stringify({` |
| client/src/pages/LumiV6Preview.jsx | 522 | auth | yes | `try { sessionStorage.removeItem("lumi:v9:entered"); } catch { /* noop */ }` |
| client/src/pages/LumiV6Preview.jsx | 679 | lumi-ux | no | `* gated behind a localStorage preference. Per-surface auto-wiring is deferred` |
| client/src/pages/LumiV6Preview.jsx | 699 | lumi-ux | no | `in <code>localStorage</code> as <code>lumi:audio:enabled</code>.` |
| client/src/pages/MetaLearningPage.tsx | 53 | uncategorized | no | `const raw = localStorage.getItem(STORAGE_KEY);` |
| client/src/pages/MetaLearningPage.tsx | 61 | uncategorized | no | `try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/pages/PhilosophicalInquiryPage.tsx | 48 | uncategorized | no | `const raw = localStorage.getItem(STORAGE_KEY);` |
| client/src/pages/PhilosophicalInquiryPage.tsx | 56 | uncategorized | no | `try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/pages/PracticeLibrary.jsx | 26 | uncategorized | no | `const saved = localStorage.getItem(FAVORITES_KEY);` |
| client/src/pages/PracticeLibrary.jsx | 73 | uncategorized | no | `localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));` |
| client/src/pages/Presence.jsx | 43 | uncategorized | no | `// because the helper reads the same localStorage key on both passes.` |
| client/src/pages/Pricing.jsx | 207 | billing | yes | `window.localStorage.setItem("mmhb-pricing-lead", JSON.stringify({ email, at: Date.now() }));` |
| client/src/pages/ProgressDashboardPage.tsx | 37 | dashboard | yes | `const stored = localStorage.getItem(key);` |
| client/src/pages/Reflection.jsx | 100 | journal | yes | `localStorage.setItem("glp_reflections", JSON.stringify(local));` |
| client/src/pages/Reflection.jsx | 106 | journal | yes | `return ((()=>{try{return JSON.parse(localStorage.getItem("glp_reflections") \|\| "[]");}catch(err){console.warn("[storage-safe-read]",err);return JSON.parse("[]")` |
| client/src/pages/Reflection.jsx | 116 | journal | yes | `const [totalXp, setTotalXp] = useState(() => parseInt(localStorage.getItem("glp_reflection_xp") \|\| "0", 10));` |
| client/src/pages/Reflection.jsx | 144 | journal | yes | `const draft = localStorage.getItem("glp_reflection_draft");` |
| client/src/pages/Reflection.jsx | 151 | journal | yes | `try { localStorage.setItem("glp_reflection_draft", text); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/pages/Reflection.jsx | 153 | journal | yes | `localStorage.removeItem("glp_reflection_draft");` |
| client/src/pages/Reflection.jsx | 171 | journal | yes | `try { localStorage.removeItem("glp_reflection_draft"); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/pages/Reflection.jsx | 178 | journal | yes | `try { localStorage.setItem("glp_reflections", JSON.stringify(localEntries)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/pages/Reflection.jsx | 191 | journal | yes | `try { localStorage.setItem("glp_reflection_xp", String(newTotal)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/pages/ResilienceMetricsPage.tsx | 76 | uncategorized | no | `const saved = localStorage.getItem(STORAGE_KEY);` |
| client/src/pages/ResilienceMetricsPage.tsx | 98 | uncategorized | no | `try { localStorage.setItem(STORAGE_KEY, JSON.stringify(profile)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/pages/Settings.jsx | 84 | ux-preferences | no | `const savedTheme = localStorage.getItem("theme") \|\| "light";` |
| client/src/pages/Settings.jsx | 85 | uncategorized | no | `const savedNotifications = localStorage.getItem("notifications") !== "false";` |
| client/src/pages/Settings.jsx | 86 | ux-preferences | no | `const savedMode = localStorage.getItem(VISUAL_MODE_KEY) \|\| "";` |
| client/src/pages/Settings.jsx | 87 | uncategorized | no | `const savedTone = localStorage.getItem("glp-affirmation-tone") \|\| "gentle";` |
| client/src/pages/Settings.jsx | 88 | uncategorized | no | `const savedVoice = localStorage.getItem("glp-voice-enabled") === "true";` |
| client/src/pages/Settings.jsx | 89 | uncategorized | no | `const savedMoodBg = localStorage.getItem("glp-mood-background") \|\| "adaptive";` |
| client/src/pages/Settings.jsx | 104 | ux-preferences | no | `try { localStorage.setItem(VISUAL_MODE_KEY, modeId); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/pages/Settings.jsx | 150 | ux-preferences | no | `try { localStorage.setItem("theme", theme); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/pages/Settings.jsx | 151 | uncategorized | no | `localStorage.setItem("notifications", String(notifications));` |
| client/src/pages/Settings.jsx | 152 | uncategorized | no | `localStorage.setItem("glp-affirmation-tone", affirmationTone);` |
| client/src/pages/Settings.jsx | 153 | uncategorized | no | `localStorage.setItem("glp-voice-enabled", String(voiceEnabled));` |
| client/src/pages/Settings.jsx | 154 | uncategorized | no | `try { localStorage.setItem("glp-mood-background", moodBackground); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/pages/Start.tsx | 391 | uncategorized | no | `const existing = localStorage.getItem("mmhb_guest_id");` |
| client/src/pages/Start.tsx | 394 | uncategorized | no | `try { localStorage.setItem("mmhb_guest_id", id); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/pages/Start.tsx | 541 | auth | yes | `try { token = localStorage.getItem("mmhb_token"); } catch { /* noop */ }` |
| client/src/pages/StrategyMapsPage.tsx | 289 | uncategorized | no | `const saved = localStorage.getItem(STORAGE_KEY);` |
| client/src/pages/StrategyMapsPage.tsx | 301 | uncategorized | no | `try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/pages/SystemsThinkingPage.tsx | 45 | uncategorized | no | `const raw = localStorage.getItem(STORAGE_KEY);` |
| client/src/pages/SystemsThinkingPage.tsx | 53 | uncategorized | no | `try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/pages/ToolsPage.jsx | 97 | uncategorized | no | `const existing = ((()=>{try{return JSON.parse(localStorage.getItem(key) \|\| "[]");}catch(err){console.warn("[storage-safe-read]",err);return JSON.parse("[]");}})` |
| client/src/pages/ToolsPage.jsx | 104 | uncategorized | no | `try { localStorage.setItem(key, JSON.stringify([entry, ...existing].slice(0, 50))); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/pages/WellnessDashboard.jsx | 307 | dashboard | yes | `const savedPref = localStorage.getItem("glp-mood-background") \|\| "adaptive";` |
| client/src/pages/WellnessGoals.jsx | 35 | uncategorized | no | `const saved = localStorage.getItem(STORAGE_KEY);` |
| client/src/pages/WellnessGoals.jsx | 40 | wellness-progress | no | `try { localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_GOALS)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/pages/WellnessGoals.jsx | 50 | wellness-progress | no | `localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedGoals));` |
| client/src/pages/WisdomPracticesPage.tsx | 64 | uncategorized | no | `const saved = localStorage.getItem(STORAGE_KEY);` |
| client/src/pages/WisdomPracticesPage.tsx | 77 | uncategorized | no | `try { localStorage.setItem(STORAGE_KEY, JSON.stringify(profile)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/pages/WisdomSynthesisPage.tsx | 49 | uncategorized | no | `const raw = localStorage.getItem(STORAGE_KEY);` |
| client/src/pages/WisdomSynthesisPage.tsx | 57 | uncategorized | no | `try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/pages/admin/AdminTools.jsx | 38 | admin | yes | `const saved = localStorage.getItem(STORAGE_KEY);` |
| client/src/pages/admin/AdminTools.jsx | 51 | admin | yes | `const saved = localStorage.getItem(STORAGE_KEY);` |
| client/src/pages/admin/AdminTools.jsx | 64 | admin | yes | `try { return Number(localStorage.getItem('glp_tools_auto_refresh')) \|\| 0; } catch { return 0; }` |
| client/src/pages/admin/AdminTools.jsx | 67 | admin | yes | `try { return localStorage.getItem('glp_tools_status_filter') \|\| 'all'; } catch { return 'all'; }` |
| client/src/pages/admin/AdminTools.jsx | 76 | admin | yes | `localStorage.setItem(STORAGE_KEY, JSON.stringify({` |
| client/src/pages/admin/AdminTools.jsx | 151 | admin | yes | `try { localStorage.setItem('glp_tools_auto_refresh', String(autoRefreshInterval)); } catch {}` |
| client/src/pages/admin/AdminTools.jsx | 167 | admin | yes | `try { localStorage.setItem('glp_tools_status_filter', statusFilter); } catch {}` |
| client/src/pages/admin/AdminTools.jsx | 173 | admin | yes | `try { localStorage.removeItem(STORAGE_KEY); } catch {}` |
| client/src/pages/admin/AnalyticsDashboard.jsx | 150 | admin | yes | `<strong>Privacy-first analytics:</strong> No PII, no fingerprinting, no session replay. Users can opt out via localStorage.` |
| client/src/pages/admin/CommandCenter.jsx | 59 | admin | yes | `const saved = localStorage.getItem('glp_tools_last_check');` |
| client/src/pages/admin/ContentStudioAdmin.jsx | 41 | admin | yes | `const cached = localStorage.getItem("glp_admin_content");` |
| client/src/pages/admin/ContentStudioAdmin.jsx | 51 | admin | yes | `try { localStorage.setItem("glp_admin_content", JSON.stringify(DEFAULT_CONTENT)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/pages/admin/ContentStudioAdmin.jsx | 64 | admin | yes | `const cached = localStorage.getItem('glp_content_tiers_${selectedContent.id}');` |
| client/src/pages/admin/ContentStudioAdmin.jsx | 82 | admin | yes | `localStorage.setItem('glp_content_tiers_${selectedContent.id}', JSON.stringify(tierContent));` |
| client/src/pages/admin/ContentStudioAdmin.jsx | 91 | admin | yes | `try { localStorage.setItem("glp_admin_content", JSON.stringify(updated)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/pages/admin/FeatureFlags.jsx | 37 | admin | yes | `const cached = localStorage.getItem("glp_admin_feature_flags");` |
| client/src/pages/admin/FeatureFlags.jsx | 47 | admin | yes | `try { localStorage.setItem("glp_admin_feature_flags", JSON.stringify(DEFAULT_FLAGS)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/pages/admin/FeatureFlags.jsx | 52 | admin | yes | `localStorage.setItem("glp_admin_feature_flags", JSON.stringify(DEFAULT_FLAGS));` |
| client/src/pages/admin/FeatureFlags.jsx | 72 | admin | yes | `localStorage.setItem("glp_admin_feature_flags", JSON.stringify(updated));` |
| client/src/pages/admin/FeatureFlags.jsx | 121 | admin | yes | `localStorage.setItem("glp_admin_feature_flags", JSON.stringify(updated));` |
| client/src/pages/admin/FeatureFlags.jsx | 139 | admin | yes | `localStorage.setItem("glp_admin_feature_flags", JSON.stringify(updated));` |
| client/src/pages/admin/HealthDashboard.jsx | 210 | admin | yes | `const token = localStorage.getItem("adminSessionToken");` |
| client/src/pages/admin/NarrativeDrafts.jsx | 41 | admin | yes | `const token = localStorage.getItem("glp_admin_token");` |
| client/src/pages/admin/SocialStudioAdmin.jsx | 140 | admin | yes | `const saved = localStorage.getItem("social_drafts_v2");` |
| client/src/pages/admin/SocialStudioAdmin.jsx | 147 | admin | yes | `try { localStorage.setItem("social_drafts_v2", JSON.stringify(newDrafts)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/pages/admin/SystemAlerts.jsx | 36 | admin | yes | `const cached = localStorage.getItem("glp_admin_alerts");` |
| client/src/pages/admin/SystemAlerts.jsx | 46 | admin | yes | `try { localStorage.setItem("glp_admin_alerts", JSON.stringify(DEFAULT_ALERTS)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/pages/admin/SystemAlerts.jsx | 64 | admin | yes | `localStorage.setItem("glp_admin_alerts", JSON.stringify(updated));` |
| client/src/pages/admin/_adminTools/DailyOpsRunbook.jsx | 16 | admin | yes | `try { const s = localStorage.getItem('glp_daily_ops_history'); return s ? JSON.parse(s) : []; } catch { return []; }` |
| client/src/pages/admin/_adminTools/DailyOpsRunbook.jsx | 177 | admin | yes | `try { localStorage.setItem('glp_daily_ops_history', JSON.stringify(newHistory)); } catch {}` |
| client/src/pages/pathways/CalmPlan.jsx | 46 | ux-preferences | no | `try { localStorage.setItem("glp_calm_plan", JSON.stringify(plan)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/pages/pathways/GoalOnboarding.jsx | 55 | uncategorized | no | `try { localStorage.setItem("glp_onboarding_preferences", JSON.stringify(preferences)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/pages/pathways/ValuesToActions.jsx | 57 | uncategorized | no | `try { localStorage.setItem("glp_values_plan", JSON.stringify(plan)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/pages/preferences/NotificationPreferences.jsx | 73 | uncategorized | no | `const cached = localStorage.getItem("glp_notification_prefs");` |
| client/src/pages/preferences/NotificationPreferences.jsx | 94 | uncategorized | no | `try { localStorage.setItem("glp_notification_prefs", JSON.stringify(settings)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/pages/preferences/SafetyPreferences.jsx | 76 | uncategorized | no | `const cached = localStorage.getItem(STORAGE_KEY);` |
| client/src/pages/preferences/SafetyPreferences.jsx | 80 | uncategorized | no | `const cached = localStorage.getItem(STORAGE_KEY);` |
| client/src/pages/preferences/SafetyPreferences.jsx | 101 | uncategorized | no | `try { localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/pages/settings/AIPersonality.jsx | 76 | uncategorized | no | `const cached = localStorage.getItem("glp_ai_personality");` |
| client/src/pages/settings/AIPersonality.jsx | 93 | uncategorized | no | `try { localStorage.setItem("glp_ai_personality", JSON.stringify(settings)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/pages/settings/EmailDigest.jsx | 37 | uncategorized | no | `const cached = localStorage.getItem("glp_email_digest");` |
| client/src/pages/settings/EmailDigest.jsx | 64 | uncategorized | no | `try { localStorage.setItem("glp_email_digest", JSON.stringify(settings)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/pages/tools/BreathTool.jsx | 52 | uncategorized | no | `const history = JSON.parse(localStorage.getItem(getStorageKey()) \|\| "[]");` |
| client/src/pages/tools/BreathTool.jsx | 59 | uncategorized | no | `try { localStorage.setItem(getStorageKey(), JSON.stringify(history)); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/pages/tools/GriefLetter.jsx | 31 | uncategorized | no | `const cached = localStorage.getItem(STORAGE_KEY);` |
| client/src/pages/tools/GriefLetter.jsx | 45 | uncategorized | no | `try { localStorage.removeItem(STORAGE_KEY); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/pages/tools/GriefLetter.jsx | 49 | uncategorized | no | `try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ recipient, content: letterContent, savedAt: new Date().toISOString() })); } catch (err) { console.warn(` |
| client/src/pages/tools/GriefLetter.jsx | 68 | uncategorized | no | `try { localStorage.removeItem(STORAGE_KEY); } catch (err) { console.warn("[storage-safe-write]", err); }` |
| client/src/pages/tools/MeaningMap.jsx | 46 | uncategorized | no | `const cached = localStorage.getItem("glp_meaning_map");` |
| client/src/pages/tools/MeaningMap.jsx | 85 | uncategorized | no | `try { localStorage.setItem("glp_meaning_map", JSON.stringify({ answers, coreValues, meaningStatement })); } catch (err) { console.warn("[storage-safe-write]", e` |
| client/src/pages/tools/WeeklyReflection.jsx | 58 | journal | yes | `try { localStorage.setItem('glp_weekly_${Date.now()}', JSON.stringify({ answers, weekRange: getWeekRange() })); } catch (err) { console.warn("[storage-safe-writ` |
| client/src/utils/LocalSync.js | 37 | uncategorized | no | `const stored = localStorage.getItem(SYNC_STORAGE_KEY);` |
| client/src/utils/LocalSync.js | 46 | uncategorized | no | `localStorage.setItem(SYNC_STORAGE_KEY, JSON.stringify(this.pendingItems));` |

## 9. Cross-domain persistence leakage risk

| File | Domains | Findings | Severity | Protected | Migration | Priority | Governance |
| --- | --- | --- | --- | --- | --- | --- | --- |
| client/src/pages/ChallengeDay.jsx | journal, wellness-progress | 9 | high | protected (mixed excluded + public) | no (mixed) — do not migrate while excluded data co-resides | P1 (separation review) | Excluded and public storage concerns co-reside in one file — Primary Law separation risk. Observe only; no change in H2.4. |
| client/src/components/avatar/BuddyAvatar.tsx | auth, lumi-ux | 3 | high | protected (mixed excluded + public) | no (mixed) — do not migrate while excluded data co-resides | P1 (separation review) | Excluded and public storage concerns co-reside in one file — Primary Law separation risk. Observe only; no change in H2.4. |
| client/src/pages/LumiV6Preview.jsx | auth, lumi-ux | 3 | high | protected (mixed excluded + public) | no (mixed) — do not migrate while excluded data co-resides | P1 (separation review) | Excluded and public storage concerns co-reside in one file — Primary Law separation risk. Observe only; no change in H2.4. |

## 10. Public-safe future migration candidates

| File | Findings | Domains | Keys | Migration | Priority | Governance |
| --- | --- | --- | --- | --- | --- | --- |
| client/src/components/SelfCareChecklist.jsx | 13 | wellness-progress | selfcare_completed, selfcare_date, selfcare_streak, selfcare_total_points | yes (additive, future, separately authorized) | P1 | Public, non-sensitive, non-excluded — eligible for future additive guarded-accessor adoption. NO change in H2.4. |
| client/src/components/HabitTracker.jsx | 12 | wellness-progress | habit_streaks, habits_completed_today, habits_last_date, wellness_habits | yes (additive, future, separately authorized) | P1 | Public, non-sensitive, non-excluded — eligible for future additive guarded-accessor adoption. NO change in H2.4. |
| client/src/pages/ChallengeDay.jsx | 7 | wellness-progress | glp-challenge-progress | yes (additive, future, separately authorized) | P1 | Public, non-sensitive, non-excluded — eligible for future additive guarded-accessor adoption. NO change in H2.4. |
| client/src/pages/GrowthAnalyticsPage.tsx | 6 | analytics |  | yes (additive, future, separately authorized) | P1 | Public, non-sensitive, non-excluded — eligible for future additive guarded-accessor adoption. NO change in H2.4. |
| client/src/components/MorningEveningRituals.jsx | 4 | wellness-progress | eveningRituals, morningRituals, ritualStreak | yes (additive, future, separately authorized) | P1 | Public, non-sensitive, non-excluded — eligible for future additive guarded-accessor adoption. NO change in H2.4. |
| client/src/components/ValuesExplorer.jsx | 4 | tools-monitors | values_explorer_data | yes (additive, future, separately authorized) | P1 | Public, non-sensitive, non-excluded — eligible for future additive guarded-accessor adoption. NO change in H2.4. |
| client/src/components/ui/CalmModeToggle.jsx | 4 | ux-preferences | glp-calm-mode | yes (additive, future, separately authorized) | P1 | Public, non-sensitive, non-excluded — eligible for future additive guarded-accessor adoption. NO change in H2.4. |
| client/src/pages/Settings.jsx | 4 | ux-preferences | theme | yes (additive, future, separately authorized) | P1 | Public, non-sensitive, non-excluded — eligible for future additive guarded-accessor adoption. NO change in H2.4. |
| client/src/components/AccessibilityToolbar.jsx | 3 | ux-preferences | glp-a11y-settings | yes (additive, future, separately authorized) | P2 | Public, non-sensitive, non-excluded — eligible for future additive guarded-accessor adoption. NO change in H2.4. |
| client/src/components/DigitalDetox.jsx | 3 | tools-monitors | digital_detox_data | yes (additive, future, separately authorized) | P2 | Public, non-sensitive, non-excluded — eligible for future additive guarded-accessor adoption. NO change in H2.4. |
| client/src/lib/systems/systemsResonance.ts | 3 | ux-preferences | glp_system_models | yes (additive, future, separately authorized) | P2 | Public, non-sensitive, non-excluded — eligible for future additive guarded-accessor adoption. NO change in H2.4. |
| client/src/lumi-memory/state/memoryStore.ts | 3 | lumi-ux |  | yes (additive, future, separately authorized) | P2 | Public, non-sensitive, non-excluded — eligible for future additive guarded-accessor adoption. NO change in H2.4. |
| client/src/components/GoalProgress.jsx | 2 | wellness-progress | wellness_goals | yes (additive, future, separately authorized) | P2 | Public, non-sensitive, non-excluded — eligible for future additive guarded-accessor adoption. NO change in H2.4. |
| client/src/components/SelfCompassion.jsx | 2 | tools-monitors | self_compassion_data | yes (additive, future, separately authorized) | P2 | Public, non-sensitive, non-excluded — eligible for future additive guarded-accessor adoption. NO change in H2.4. |
| client/src/components/SleepTracker.jsx | 2 | tools-monitors | sleep_history | yes (additive, future, separately authorized) | P2 | Public, non-sensitive, non-excluded — eligible for future additive guarded-accessor adoption. NO change in H2.4. |
| client/src/components/StressMonitor.jsx | 2 | tools-monitors | stress_monitor_data | yes (additive, future, separately authorized) | P2 | Public, non-sensitive, non-excluded — eligible for future additive guarded-accessor adoption. NO change in H2.4. |
| client/src/components/WellnessScore.jsx | 2 | wellness-progress | last_wellness_score | yes (additive, future, separately authorized) | P2 | Public, non-sensitive, non-excluded — eligible for future additive guarded-accessor adoption. NO change in H2.4. |
| client/src/components/WorryTimeScheduler.jsx | 2 | tools-monitors | worry_time_data | yes (additive, future, separately authorized) | P2 | Public, non-sensitive, non-excluded — eligible for future additive guarded-accessor adoption. NO change in H2.4. |
| client/src/components/layout/Header.jsx | 2 | ux-preferences | glp-mode | yes (additive, future, separately authorized) | P2 | Public, non-sensitive, non-excluded — eligible for future additive guarded-accessor adoption. NO change in H2.4. |
| client/src/content/readingLevels.js | 2 | ux-preferences |  | yes (additive, future, separately authorized) | P2 | Public, non-sensitive, non-excluded — eligible for future additive guarded-accessor adoption. NO change in H2.4. |
| client/src/lib/mode.js | 2 | ux-preferences | glp-mode | yes (additive, future, separately authorized) | P2 | Public, non-sensitive, non-excluded — eligible for future additive guarded-accessor adoption. NO change in H2.4. |
| client/src/pages/CelebrationFlow.jsx | 2 | wellness-progress | mmhb-completion-streak | yes (additive, future, separately authorized) | P2 | Public, non-sensitive, non-excluded — eligible for future additive guarded-accessor adoption. NO change in H2.4. |
| client/src/pages/CheckIn.jsx | 2 | wellness-progress | mmhb-checkin-streak | yes (additive, future, separately authorized) | P2 | Public, non-sensitive, non-excluded — eligible for future additive guarded-accessor adoption. NO change in H2.4. |
| client/src/pages/LumiV6Preview.jsx | 2 | lumi-ux |  | yes (additive, future, separately authorized) | P2 | Public, non-sensitive, non-excluded — eligible for future additive guarded-accessor adoption. NO change in H2.4. |
| client/src/pages/WellnessGoals.jsx | 2 | wellness-progress |  | yes (additive, future, separately authorized) | P2 | Public, non-sensitive, non-excluded — eligible for future additive guarded-accessor adoption. NO change in H2.4. |
| client/src/pages/tools/BreathingTool.jsx | 2 | wellness-progress | mmhb-breathing-streak-v1 | yes (additive, future, separately authorized) | P2 | Public, non-sensitive, non-excluded — eligible for future additive guarded-accessor adoption. NO change in H2.4. |
| client/src/components/ModeToggle.jsx | 1 | ux-preferences |  | yes (additive, future, separately authorized) | P2 | Public, non-sensitive, non-excluded — eligible for future additive guarded-accessor adoption. NO change in H2.4. |
| client/src/components/avatar/BuddyAvatar.tsx | 1 | lumi-ux |  | yes (additive, future, separately authorized) | P2 | Public, non-sensitive, non-excluded — eligible for future additive guarded-accessor adoption. NO change in H2.4. |
| client/src/components/lumi/LumiCompanion.jsx | 1 | lumi-ux |  | yes (additive, future, separately authorized) | P2 | Public, non-sensitive, non-excluded — eligible for future additive guarded-accessor adoption. NO change in H2.4. |
| client/src/lib/firstCheckinFlag.ts | 1 | ux-preferences |  | yes (additive, future, separately authorized) | P2 | Public, non-sensitive, non-excluded — eligible for future additive guarded-accessor adoption. NO change in H2.4. |
| client/src/pages/pathways/CalmPlan.jsx | 1 | ux-preferences | glp_calm_plan | yes (additive, future, separately authorized) | P2 | Public, non-sensitive, non-excluded — eligible for future additive guarded-accessor adoption. NO change in H2.4. |

---

**Scope note:** This map is observational. It modifies no runtime code, replaces no storage mechanism, adds no wrapper/library, centralizes nothing, and migrates nothing. Protected, excluded, and sensitive clusters are listed for awareness only. Crisis routing and business↔healing separation are unaffected. Companion governance docs: `docs/governance/storage/`.
