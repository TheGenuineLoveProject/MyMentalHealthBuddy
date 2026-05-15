import { useState } from "react";
import { Redirect, Link } from "wouter";
import { MMHBFloatAvatar, MMHBAvatarRuntimeProvider } from "@/avatar-life";
import { MMHBCard, MMHBButton } from "@/design-system";
import {
  OptInPrompt,
  QuietNudge,
  useCircadianScheduler,
} from "@/lumi-circadian";
import {
  MemorySettingsPanel,
  MemoryTransparencyView,
  MemoryResetButton,
} from "@/lumi-memory";
import { GuidedPresenceRitual } from "@/lumi-rituals";
import { SceneTransitionController } from "@/lumi-scenes";
import { useFeatureFlags } from "@/contexts/FeatureFlagContext";
import { hasCompletedFirstCheckin } from "@/lib/firstCheckinFlag";
import SEO from "@/components/SEO";

/**
 * /presence — gentle gathering of all four opt-in modules.
 *
 * Two layers of gating per spec:
 *   1. Feature flag (`presencePage` + per-section flags) — admin/build-time toggle.
 *   2. Per-section in-page consent — each section requires intentional toggle ON;
 *      no batch-enable. The existing module surfaces (OptInPrompt, MemorySettings-
 *      Panel, ritual launch button, scene toggle) provide that consent affordance.
 *
 * Route guard: page redirects to / if the visitor has not completed their first
 * Calm Check-in (markFirstCheckinComplete() set on landing).
 *
 * The avatar renders in calmIdle as a visual anchor at the top.
 */
export default function Presence() {
  const { isEnabled } = useFeatureFlags();
  // Architect-driven hardening: initialize from the SSR-safe helper directly
  // so the very first render reflects the true gate state. The previous
  // pattern (useState(true) → useEffect) caused a one-frame flash of
  // Presence content for admins who hadn't completed first check-in.
  // `hasCompletedFirstCheckin()` returns false in SSR (no window), so
  // server-rendered output stays redirect-safe; client hydration matches
  // because the helper reads the same localStorage key on both passes.
  const [hasCheckin] = useState(() => hasCompletedFirstCheckin());

  // Route guard — gentle redirect (no error UI) if first check-in missing.
  if (!hasCheckin) {
    return <Redirect to="/" />;
  }

  // Page-level feature flag: if presencePage is off, treat as unmounted.
  if (!isEnabled("presencePage")) {
    return <Redirect to="/" />;
  }

  return (
    <MMHBAvatarRuntimeProvider surfaceContext="presence" defaultState="calmIdle">
      <PresencePageInner />
    </MMHBAvatarRuntimeProvider>
  );
}

function PresencePageInner() {
  const { isEnabled } = useFeatureFlags();
  const showCircadian = isEnabled("presenceCircadian");
  const showMemory = isEnabled("presenceMemory");
  const showRituals = isEnabled("presenceRituals");
  const showScenes = isEnabled("presenceScenes");

  // In-page user toggle for the ambient scene wrapper. Defaults OFF —
  // user must intentionally enable. No batch-enable across sections.
  const [scenesActive, setScenesActive] = useState(false);

  const inner = (
    <main
      className="mx-auto w-full max-w-3xl px-5 py-12 md:py-16 space-y-10"
      data-testid="page-presence"
    >
      <SEO
        title="Presence — MyMentalHealthBuddy"
        description="A quiet space for opt-in companions: gentle reminders, soft memory, presence rituals, and ambient scenes. All off by default. You choose."
      />

      <PresenceHeader />

      {showCircadian ? <CircadianSection /> : null}
      {showMemory ? <MemorySection /> : null}
      {showRituals ? <RitualsSection /> : null}
      {showScenes ? (
        <ScenesSection active={scenesActive} onToggle={setScenesActive} />
      ) : null}

      <CrisisFooter />
    </main>
  );

  // Wrap with SceneTransitionController only when the user intentionally
  // enabled scenes AND the section is feature-flag visible.
  if (showScenes && scenesActive) {
    return (
      <SceneTransitionController className="min-h-screen">
        {inner}
      </SceneTransitionController>
    );
  }
  return <div className="min-h-screen">{inner}</div>;
}

// ─── Header with Lumi avatar in calmIdle ───────────────────────────────────
function PresenceHeader() {
  return (
    <section
      className="flex flex-col items-center text-center space-y-4 pt-2"
      data-testid="section-presence-header"
    >
      <MMHBFloatAvatar
        imageSrc="/avatar-core/master/MMHB_FLOAT_IDLE_UNIT_v1_clean_master.png"
        state="calmIdle"
        size={180}
        alt="Lumi, your gentle wellness companion"
      />
      <h1
        className="font-serif text-3xl md:text-4xl"
        style={{ color: "var(--glp-sage-deep)" }}
        data-testid="text-presence-title"
      >
        Presence
      </h1>
      <p
        className="max-w-xl text-base md:text-lg"
        style={{ color: "var(--glp-ink)" }}
        data-testid="text-presence-subtitle"
      >
        A quiet space for soft companions. Each section is off by default —
        turn on only what feels welcome. Nothing here is required, and you can
        turn anything off at any moment.
      </p>
    </section>
  );
}

// ─── Section 1 — Circadian (gentle reminders) ──────────────────────────────
function CircadianSection() {
  const scheduler = useCircadianScheduler();
  const isEnabledNow = scheduler.state.enabled;
  const phaseAnnouncements = scheduler.state.phaseChangeAnnouncementsEnabled;
  const pending = scheduler.state.pendingNudge;

  return (
    <section data-testid="section-presence-circadian">
      <SectionTitle>Gentle reminders</SectionTitle>
      <SectionDescription>
        Soft check-in nudges that respect quiet hours (10pm–7am) and never
        more than three a day. Off by default.
      </SectionDescription>

      <OptInPrompt
        enabled={isEnabledNow}
        phaseAnnouncementsEnabled={phaseAnnouncements}
        onOptIn={scheduler.optIn}
        onOptOut={scheduler.optOut}
        onTogglePhaseAnnouncements={scheduler.setPhaseChangeAnnouncements}
      />

      {pending ? (
        <div className="mt-4">
          <QuietNudge
            nudge={pending}
            onAcknowledge={scheduler.acknowledge}
            onSkip={scheduler.skip}
            onDismiss={scheduler.dismiss}
          />
        </div>
      ) : null}
    </section>
  );
}

// ─── Section 2 — Memory (soft preferences) ─────────────────────────────────
function MemorySection() {
  return (
    <section data-testid="section-presence-memory">
      <SectionTitle>Soft memory</SectionTitle>
      <SectionDescription>
        A small memory of your preferences only — never trauma narratives,
        never clinical labels. Off by default. You can review or reset
        anything here.
      </SectionDescription>

      <div className="space-y-4">
        <MemorySettingsPanel />
        <MemoryTransparencyView />
        <MemoryResetButton />
      </div>
    </section>
  );
}

// ─── Section 3 — Rituals (presence practices) ──────────────────────────────
function RitualsSection() {
  const [ritualKey, setRitualKey] = useState(null);

  return (
    <section data-testid="section-presence-rituals">
      <SectionTitle>Presence rituals</SectionTitle>
      <SectionDescription>
        Short, optional practices. You can skip any step or close the ritual
        at any time — there is no completion requirement.
      </SectionDescription>

      {ritualKey ? (
        <GuidedPresenceRitual
          ritualKey={ritualKey}
          onClose={() => setRitualKey(null)}
        />
      ) : (
        <MMHBCard variant="resting" className="space-y-3">
          <p style={{ color: "var(--glp-ink)" }}>
            Begin with a Soft Arrival — a gentle three-step welcome. You can
            stop at any moment.
          </p>
          <MMHBButton
            variant="primary"
            onClick={() => setRitualKey("softArrival")}
            data-testid="button-start-ritual-softArrival"
          >
            Begin Soft Arrival
          </MMHBButton>
        </MMHBCard>
      )}
    </section>
  );
}

// ─── Section 4 — Scenes (ambient backdrop) ─────────────────────────────────
function ScenesSection({ active, onToggle }) {
  return (
    <section data-testid="section-presence-scenes">
      <SectionTitle>Ambient scene</SectionTitle>
      <SectionDescription>
        Adds a soft, slow backdrop behind this page — gentle gradients and
        reduced-motion-safe transitions. Off by default.
      </SectionDescription>

      <MMHBCard variant="resting" className="space-y-3">
        <p style={{ color: "var(--glp-ink)" }}>
          Ambient scene is currently{" "}
          <strong>{active ? "on" : "off"}</strong>.
        </p>
        <MMHBButton
          variant={active ? "tertiary" : "primary"}
          onClick={() => onToggle(!active)}
          data-testid="button-toggle-scene"
        >
          {active ? "Turn off ambient scene" : "Turn on ambient scene"}
        </MMHBButton>
      </MMHBCard>
    </section>
  );
}

function SectionTitle({ children }) {
  return (
    <h2
      className="font-serif text-2xl md:text-3xl mb-2"
      style={{ color: "var(--glp-sage-deep)" }}
    >
      {children}
    </h2>
  );
}

function SectionDescription({ children }) {
  return (
    <p
      className="mb-4 text-sm md:text-base"
      style={{ color: "var(--glp-sage)" }}
    >
      {children}
    </p>
  );
}

function CrisisFooter() {
  return (
    <footer
      className="pt-8 border-t text-center text-sm"
      style={{
        borderColor: "var(--glp-sage-20)",
        color: "var(--glp-sage)",
      }}
      data-testid="footer-presence-crisis"
    >
      In crisis or need someone now?{" "}
      <Link
        href="/crisis"
        className="underline"
        style={{ color: "var(--glp-rose)" }}
      >
        Visit /crisis
      </Link>
      .
    </footer>
  );
}
