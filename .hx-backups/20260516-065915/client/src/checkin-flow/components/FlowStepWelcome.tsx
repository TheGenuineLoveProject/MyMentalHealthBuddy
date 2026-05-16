/**
 * Phase 14 — Welcome step.
 * Lumi greets, asks how the user is arriving, offers 6 mood options.
 * NO subscription content. Crisis link rendered.
 */

import { MMHBButton } from "../../design-system/components/MMHBButton";
import { colors } from "../../design-system/tokens/colors";
import { typography } from "../../design-system/tokens/typography";
import { moods, welcomeCopy } from "../copy/microCopy";
import { useCheckInFlowStore } from "../state/useCheckInFlowStore";

export type FlowStepWelcomeProps = {
  onClose?: () => void;
};

export function FlowStepWelcome({ onClose }: FlowStepWelcomeProps) {
  const selectedMood = useCheckInFlowStore((s) => s.selectedMood);
  const selectMood = useCheckInFlowStore((s) => s.selectMood);
  const startBreathing = useCheckInFlowStore((s) => s.startBreathing);

  const reflection = selectedMood
    ? moods.find((m) => m.id === selectedMood)?.reflection
    : null;

  return (
    <section data-testid="checkin-flow-step-welcome" aria-labelledby="checkin-welcome-title">
      <h2
        id="checkin-welcome-title"
        style={{
          fontFamily: typography.fonts.heading,
          fontSize: 28,
          color: colors.semantic.fgHeading,
          margin: "0 0 8px",
        }}
        data-testid="text-welcome-greeting"
      >
        {welcomeCopy.greeting}
      </h2>
      <p
        style={{
          fontFamily: typography.fonts.body,
          fontSize: 17,
          lineHeight: 1.55,
          color: colors.semantic.fgBody,
          margin: "0 0 6px",
        }}
        data-testid="text-welcome-intro"
      >
        {welcomeCopy.intro}
      </p>
      <p
        style={{
          fontFamily: typography.fonts.body,
          fontSize: 13,
          color: colors.semantic.fgMuted,
          margin: "0 0 24px",
        }}
      >
        {welcomeCopy.consent}
      </p>

      <div
        role="radiogroup"
        aria-label="How you are arriving today"
        data-testid="group-mood-options"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 10,
          margin: "0 0 20px",
        }}
      >
        {moods.map((m) => {
          const active = selectedMood === m.id;
          return (
            <button
              key={m.id}
              type="button"
              role="radio"
              aria-checked={active}
              data-testid={`button-mood-${m.id}`}
              onClick={() => selectMood(m.id)}
              style={{
                padding: "12px 14px",
                borderRadius: 14,
                fontFamily: typography.fonts.body,
                fontSize: 15,
                fontWeight: 500,
                cursor: "pointer",
                background: active
                  ? colors.semantic.stateActiveWash
                  : colors.semantic.bgCard,
                color: colors.semantic.fgHeading,
                border: `1px solid ${
                  active
                    ? colors.semantic.borderFocus
                    : colors.semantic.borderSubtle
                }`,
                transition: "background 200ms ease, border-color 200ms ease",
                minHeight: 48,
                textAlign: "center",
              }}
            >
              {m.label}
            </button>
          );
        })}
      </div>

      {reflection && (
        <p
          data-testid="text-mood-reflection"
          style={{
            fontFamily: typography.fonts.body,
            fontSize: 15,
            fontStyle: "italic",
            color: colors.semantic.fgBody,
            background: colors.aura.calm,
            padding: "14px 16px",
            borderRadius: 12,
            margin: "0 0 20px",
            lineHeight: 1.5,
          }}
        >
          {reflection}
        </p>
      )}

      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", flexWrap: "wrap" }}>
        {onClose && (
          <MMHBButton
            variant="ghost"
            size="md"
            onClick={onClose}
            data-testid="button-welcome-leave"
          >
            Maybe later
          </MMHBButton>
        )}
        <MMHBButton
          variant="primary"
          size="md"
          disabled={!selectedMood}
          onClick={startBreathing}
          data-testid="button-welcome-begin"
        >
          Begin a 60-second breath
        </MMHBButton>
      </div>

      <p
        style={{
          fontFamily: typography.fonts.body,
          fontSize: 12,
          color: colors.semantic.fgMuted,
          marginTop: 20,
          textAlign: "center",
        }}
      >
        {welcomeCopy.crisisLine.split("/crisis")[0]}
        <a
          href="/crisis"
          data-testid="link-crisis-welcome"
          style={{ color: colors.palette.primarySage, fontWeight: 600 }}
        >
          /crisis
        </a>
        {welcomeCopy.crisisLine.split("/crisis")[1]}
      </p>
    </section>
  );
}
