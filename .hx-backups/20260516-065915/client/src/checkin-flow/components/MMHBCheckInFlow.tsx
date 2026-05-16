/**
 * Phase 14 — Calm Check-In Entry Flow orchestrator.
 *
 * Renders the correct step based on store state. Standalone, opt-in.
 * Crisis link is rendered in every step for safety.
 *
 * USAGE:
 *   import { MMHBCheckInFlow } from "@/checkin-flow";
 *   <MMHBCheckInFlow onClose={() => navigate('/')} />
 */

import { useEffect } from "react";
import { MMHBCard } from "../../design-system/components/MMHBCard";
import { useCheckInFlowStore } from "../state/useCheckInFlowStore";
import { FlowStepBreathing } from "./FlowStepBreathing";
import { FlowStepCheckout } from "./FlowStepCheckout";
import { FlowStepComplete } from "./FlowStepComplete";
import { FlowStepOffer } from "./FlowStepOffer";
import { FlowStepWelcome } from "./FlowStepWelcome";

export type MMHBCheckInFlowProps = {
  /** Optional close handler (rendered as a quiet "leave" link in every step). */
  onClose?: () => void;
  /** Called when user accepts the offer (delegate to your subscription/onboarding entry). */
  onAcceptOffer?: () => void;
  /** Called once the flow reaches a terminal state (complete or declined). */
  onFinished?: (outcome: "complete" | "declined") => void;
};

export function MMHBCheckInFlow({
  onClose,
  onAcceptOffer,
  onFinished,
}: MMHBCheckInFlowProps) {
  const step = useCheckInFlowStore((s) => s.step);
  const reset = useCheckInFlowStore((s) => s.reset);

  // Reset on unmount so re-mount always begins fresh.
  useEffect(() => () => reset(), [reset]);

  // Notify parent on terminal states.
  useEffect(() => {
    if (step === "complete") onFinished?.("complete");
    if (step === "declined") onFinished?.("declined");
  }, [step, onFinished]);

  return (
    <MMHBCard
      data-testid="checkin-flow-shell"
      data-step={step}
      style={{
        maxWidth: 540,
        width: "100%",
        margin: "0 auto",
        padding: "32px 28px",
        position: "relative",
      }}
    >
      {step === "welcome" && <FlowStepWelcome onClose={onClose} />}
      {step === "breathing" && <FlowStepBreathing />}
      {step === "checkout" && <FlowStepCheckout />}
      {step === "offer" && <FlowStepOffer onAccept={onAcceptOffer} />}
      {(step === "complete" || step === "declined") && (
        <FlowStepComplete onClose={onClose} />
      )}
    </MMHBCard>
  );
}
