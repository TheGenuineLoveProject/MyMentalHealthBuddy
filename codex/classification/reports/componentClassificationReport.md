# Component Classification Report

## Summary

- ORPHAN: 325
- ACTIVE: 109

## Rule

No component should be deleted only because it is marked ORPHAN.

## Safe meaning

ORPHAN means:
- not detected by current static scan
- may still be dynamic, lazy-loaded, future-use, or legacy
- requires human review before archive/delete

## First 50 orphan candidates

- client/src/components/AccessibilityToolbar.jsx
- client/src/components/AchievementBadge.jsx
- client/src/components/AchievementBadges.jsx
- client/src/components/AchievementSystem.jsx
- client/src/components/system/AdminErrorBoundary.jsx
- client/src/components/AdminGuard.jsx
- client/src/components/admin/AdminNavGrid.jsx
- client/src/components/admin/AdminQueryStates.jsx
- client/src/components/AffirmationCards.jsx
- client/src/components/AffirmationDeck.jsx
- client/src/components/AgeConfirmationModal.tsx
- client/src/components/AgeConsentGate.jsx
- client/src/components/AIChat.jsx
- client/src/components/chat/AIChatPanel.tsx
- client/src/components/AICompanion.jsx
- client/src/components/admin/AIHealthPipeline.jsx
- client/src/components/admin/AIKnowledgeBaseSummary.jsx
- client/src/components/admin/AIKnowledgeHub.jsx
- client/src/components/AIWellnessConcierge.jsx
- client/src/components/AngerManagement.jsx
- client/src/components/AnimatedPageTransition.jsx
- client/src/components/AnxietyRelief.jsx
- client/src/components/App.tsx
- client/src/components/layout/AppShell.tsx
- client/src/components/attention/AttentionEcology.d.ts
- client/src/components/attention/AttentionEcology.jsx
- client/src/components/autodidact/AutodidactForge.tsx
- client/src/components/ui/badge.tsx
- client/src/components/Badges.jsx
- client/src/components/beliefs/BeliefMapper.tsx
- client/src/components/BenefitsBlock.d.ts
- client/src/components/BenefitsSection.jsx
- client/src/components/BenefitStrip.tsx
- client/src/components/bias/BiasBlindSpots.tsx
- client/src/components/BodyScanMeditation.jsx
- client/src/components/BoundaryBuilder.jsx
- client/src/components/BrandGlow.tsx
- client/src/components/brand/BrandLogo.jsx
- client/src/components/BrandLogo.tsx
- client/src/components/BrandShell.jsx
- client/src/components/ui/BrandSpinner.jsx
- client/src/components/Breadcrumbs.jsx
- client/src/components/BreathingExercise.jsx
- client/src/components/avatar/BuddyPanel.tsx
- client/src/components/ui/CalmModeToggle.jsx
- client/src/components/navigation/CanonicalNavbar.jsx
- client/src/components/CBTThoughtDiary.jsx
- client/src/components/CelebrationOverlay.tsx
- client/src/components/ChatWidget.tsx
- client/src/components/content/ClarityCard.d.ts

## Next Safe Action

Create archive-candidate scoring, not deletion.
