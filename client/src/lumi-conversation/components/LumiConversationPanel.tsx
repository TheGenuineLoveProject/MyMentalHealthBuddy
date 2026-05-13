/**
 * Phase 15 (spec-aligned) — main orchestrator.
 *
 * Consumes the Zustand store, runs every user message through
 * runConversationRouter(), and renders message bubbles + grounding /
 * reflection cards as needed.
 *
 * Crisis safety has 3 layers:
 *   1. Router short-circuits on critical signals before bank lookup.
 *   2. Reducer marks `escalation: "critical"` as sticky.
 *   3. This component renders the resource bubble with emphasis and
 *      shows a persistent "/crisis" anchor in the panel header.
 *
 * Reduced-motion: there is no motion to disable; bubble fades are CSS
 * opacity transitions only and the design-system motion tokens already
 * respect `prefers-reduced-motion` upstream.
 */

import { useCallback, useMemo, type CSSProperties } from "react";
import { MMHBCard, MMHBButton } from "@/design-system";
import { colors, typography } from "@/design-system";
import {
  useConversationStore,
  selectShouldSuggestPause,
} from "../state/conversationState";
import { runConversationRouter } from "../runtime/conversationRouter";
import { pickGroundingPrompt } from "../content/groundingPrompts";
import { pickReflectionPrompt } from "../content/reflectionPrompts";
import { LumiMessageBubble } from "./LumiMessageBubble";
import { LumiInputBar } from "./LumiInputBar";
import { LumiGroundingResponse } from "./LumiGroundingResponse";
import { LumiReflectionCard } from "./LumiReflectionCard";

export type LumiConversationPanelProps = {
  /** Optional welcome line shown before the user types anything. */
  welcomeText?: string;
  /** Avatar slot — host can pass MMHBFloatAvatar or any element. */
  avatarSlot?: React.ReactNode;
};

const panelStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
  width: "100%",
  maxWidth: 720,
  marginInline: "auto",
};

const headerStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  flexWrap: "wrap",
};

const titleStyle: CSSProperties = {
  fontFamily: typography.fonts.heading,
  fontSize: 22,
  color: colors.semantic.fgBody,
  margin: 0,
};

const subtitleStyle: CSSProperties = {
  fontFamily: typography.fonts.body,
  fontSize: 14,
  color: colors.semantic.fgMuted,
  margin: 0,
};

const crisisLinkStyle: CSSProperties = {
  fontFamily: typography.fonts.body,
  fontSize: 13,
  color: colors.semantic.fgBody,
  textDecoration: "underline",
  textDecorationStyle: "dotted",
};

const turnsListStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 10,
  paddingBlock: 8,
};

const pauseBannerStyle: CSSProperties = {
  fontFamily: typography.fonts.body,
  fontSize: 13,
  color: colors.semantic.fgMuted,
  textAlign: "center",
  padding: 10,
};

export function LumiConversationPanel({
  welcomeText = "Hi. I'm Lumi — a calm, brief presence. Take whatever pace feels right.",
  avatarSlot,
}: LumiConversationPanelProps) {
  const turns = useConversationStore((s) => s.turns);
  const step = useConversationStore((s) => s.step);
  const escalation = useConversationStore((s) => s.escalation);
  const appendTurn = useConversationStore((s) => s.appendTurn);
  const setStep = useConversationStore((s) => s.setStep);
  const setEscalation = useConversationStore((s) => s.setEscalation);
  const markPauseSuggested = useConversationStore((s) => s.markPauseSuggested);
  const reset = useConversationStore((s) => s.reset);

  const shouldSuggestPause = useConversationStore(selectShouldSuggestPause);

  const groundingPrompt = useMemo(() => pickGroundingPrompt(turns.length), [turns.length]);
  const reflectionPrompt = useMemo(() => pickReflectionPrompt(turns.length), [turns.length]);

  const handleUserSubmit = useCallback(
    (text: string) => {
      // Append user turn first so router sees latest depth.
      appendTurn({ speaker: "user", text });
      const state = useConversationStore.getState();
      const decision = runConversationRouter({
        userText: text,
        state,
      });
      if (decision.escalation === "critical") {
        setEscalation("critical");
      } else if (decision.escalation === "elevated") {
        setEscalation("elevated");
      }
      appendTurn({
        speaker: "lumi",
        text: decision.responseText,
        tone: decision.tone,
        escalation: decision.escalation,
      });
      if (decision.suggestPause) {
        markPauseSuggested();
      }
    },
    [appendTurn, setEscalation, markPauseSuggested],
  );

  const handleLeave = useCallback(() => {
    reset();
  }, [reset]);

  const handleGroundingDone = useCallback(() => {
    appendTurn({
      speaker: "lumi",
      text: "Glad you tried. We can stay quiet here for a moment, if you'd like.",
      tone: "calm",
      cardKind: "grounding",
    });
    setStep("conversing");
  }, [appendTurn, setStep]);

  const handleReflectionContinue = useCallback(() => {
    appendTurn({
      speaker: "lumi",
      text: "Thank you for sitting with that. You can take it at your own pace from here.",
      tone: "calm",
      cardKind: "reflection",
    });
    setStep("conversing");
  }, [appendTurn, setStep]);

  const skipCard = useCallback(() => setStep("conversing"), [setStep]);

  return (
    <section
      data-testid="lumi-conversation-panel"
      data-step={step}
      data-escalation={escalation}
      style={panelStyle}
      aria-label="Conversation with Lumi"
    >
      <MMHBCard elevation="elevated">
        <div style={headerStyle}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {avatarSlot}
            <div>
              <h2 style={titleStyle}>Lumi</h2>
              <p style={subtitleStyle}>
                Brief, gentle, never a substitute for a person.
              </p>
            </div>
          </div>
          <a
            href="/crisis"
            style={crisisLinkStyle}
            data-testid="link-lumi-crisis"
          >
            /crisis is always here
          </a>
        </div>
      </MMHBCard>

      {turns.length === 0 ? (
        <MMHBCard elevation="resting">
          <p
            style={{
              fontFamily: typography.fonts.body,
              fontSize: 16,
              lineHeight: 1.6,
              color: colors.semantic.fgBody,
              margin: 0,
            }}
            data-testid="text-lumi-welcome"
          >
            {welcomeText}
          </p>
        </MMHBCard>
      ) : (
        <div style={turnsListStyle} data-testid="lumi-turns-list">
          {turns.map((t) => (
            <LumiMessageBubble
              key={t.id}
              turn={t}
              emphasizeResource={t.escalation === "critical"}
            />
          ))}
        </div>
      )}

      {step === "grounding" && (
        <LumiGroundingResponse
          prompt={groundingPrompt}
          onDone={handleGroundingDone}
          onSkip={skipCard}
        />
      )}

      {step === "reflecting" && (
        <LumiReflectionCard
          prompt={reflectionPrompt}
          onContinue={handleReflectionContinue}
          onSkip={skipCard}
        />
      )}

      {shouldSuggestPause && (
        <div style={pauseBannerStyle} data-testid="lumi-pause-banner">
          We've been talking for a bit. Resting here is always okay — no streak, no progress to lose.
        </div>
      )}

      <MMHBCard elevation="resting">
        <LumiInputBar
          onSubmit={handleUserSubmit}
          onLeave={handleLeave}
          disabled={escalation === "critical" ? false : false}
        />
      </MMHBCard>

      <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
        <MMHBButton
          variant="tertiary"
          size="sm"
          onClick={() => setStep("grounding")}
          data-testid="button-lumi-pivot-grounding"
        >
          Try a grounding moment
        </MMHBButton>
        <MMHBButton
          variant="tertiary"
          size="sm"
          onClick={() => setStep("reflecting")}
          data-testid="button-lumi-pivot-reflecting"
        >
          Open a reflection
        </MMHBButton>
      </div>
    </section>
  );
}
