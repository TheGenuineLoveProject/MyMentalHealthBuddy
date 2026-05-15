/**
 * Phase 14 — Terminal step.
 * Branches on store.step: "complete" (offer accepted) vs "declined".
 * Both paths are equally welcoming — no guilt, no nudging.
 */

import { MMHBButton } from "../../design-system/components/MMHBButton";
import { colors } from "../../design-system/tokens/colors";
import { typography } from "../../design-system/tokens/typography";
import { completeCopy, declinedCopy } from "../copy/microCopy";
import { useCheckInFlowStore } from "../state/useCheckInFlowStore";

export type FlowStepCompleteProps = {
  onClose?: () => void;
};

export function FlowStepComplete({ onClose }: FlowStepCompleteProps) {
  const step = useCheckInFlowStore((s) => s.step);
  const reset = useCheckInFlowStore((s) => s.reset);

  const copy = step === "declined" ? declinedCopy : completeCopy;
  const variant = step === "declined" ? "declined" : "complete";

  const handleClose = () => {
    onClose?.();
    reset();
  };

  return (
    <section
      data-testid={`checkin-flow-step-${variant}`}
      aria-labelledby="checkin-complete-title"
    >
      <h2
        id="checkin-complete-title"
        style={{
          fontFamily: typography.fonts.heading,
          fontSize: 24,
          color: colors.semantic.fgHeading,
          margin: "0 0 12px",
        }}
        data-testid="text-complete-title"
      >
        {copy.title}
      </h2>
      <p
        style={{
          fontFamily: typography.fonts.body,
          fontSize: 16,
          color: colors.semantic.fgBody,
          lineHeight: 1.55,
          margin: "0 0 22px",
        }}
        data-testid="text-complete-body"
      >
        {copy.body}
      </p>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <MMHBButton
          variant="primary"
          size="md"
          onClick={handleClose}
          data-testid="button-complete-close"
        >
          {copy.cta}
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
        Anytime, anywhere — if you need it,{" "}
        <a
          href="/crisis"
          data-testid="link-crisis-complete"
          style={{ color: colors.palette.primarySage, fontWeight: 600 }}
        >
          /crisis
        </a>{" "}
        is here.
      </p>
    </section>
  );
}
