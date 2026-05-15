/**
 * Phase 14 — Post-breathing feeling check.
 * 4 shift options. NO subscription content yet — that's the next step.
 */

import { MMHBButton } from "../../design-system/components/MMHBButton";
import { colors } from "../../design-system/tokens/colors";
import { typography } from "../../design-system/tokens/typography";
import { checkoutCopy, shiftOptions } from "../copy/microCopy";
import { useCheckInFlowStore } from "../state/useCheckInFlowStore";

export function FlowStepCheckout() {
  const selectedShift = useCheckInFlowStore((s) => s.selectedShift);
  const selectShift = useCheckInFlowStore((s) => s.selectShift);
  const goToOffer = useCheckInFlowStore((s) => s.goToOffer);

  const response = selectedShift
    ? shiftOptions.find((s) => s.id === selectedShift)?.response
    : null;

  return (
    <section
      data-testid="checkin-flow-step-checkout"
      aria-labelledby="checkin-checkout-title"
    >
      <h2
        id="checkin-checkout-title"
        style={{
          fontFamily: typography.fonts.heading,
          fontSize: 24,
          color: colors.semantic.fgHeading,
          margin: "0 0 6px",
        }}
        data-testid="text-checkout-title"
      >
        {checkoutCopy.title}
      </h2>
      <p
        style={{
          fontFamily: typography.fonts.body,
          fontSize: 15,
          color: colors.semantic.fgMuted,
          margin: "0 0 22px",
        }}
      >
        {checkoutCopy.subtitle}
      </p>

      <div
        role="radiogroup"
        aria-label="How you feel after the breathing"
        data-testid="group-shift-options"
        style={{ display: "grid", gap: 10, margin: "0 0 20px" }}
      >
        {shiftOptions.map((s) => {
          const active = selectedShift === s.id;
          return (
            <button
              key={s.id}
              type="button"
              role="radio"
              aria-checked={active}
              data-testid={`button-shift-${s.id}`}
              onClick={() => selectShift(s.id)}
              style={{
                padding: "14px 16px",
                borderRadius: 14,
                fontFamily: typography.fonts.body,
                fontSize: 15,
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
                textAlign: "left",
                minHeight: 48,
                transition: "background 200ms ease, border-color 200ms ease",
              }}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      {response && (
        <p
          data-testid="text-shift-response"
          style={{
            fontFamily: typography.fonts.body,
            fontSize: 15,
            fontStyle: "italic",
            color: colors.semantic.fgBody,
            background: colors.aura.warmth,
            padding: "14px 16px",
            borderRadius: 12,
            margin: "0 0 22px",
            lineHeight: 1.5,
          }}
        >
          {response}
        </p>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <MMHBButton
          variant="primary"
          size="md"
          disabled={!selectedShift}
          onClick={goToOffer}
          data-testid="button-checkout-continue"
        >
          Continue
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
        In crisis?{" "}
        <a
          href="/crisis"
          data-testid="link-crisis-checkout"
          style={{ color: colors.palette.primarySage, fontWeight: 600 }}
        >
          /crisis
        </a>
      </p>
    </section>
  );
}
