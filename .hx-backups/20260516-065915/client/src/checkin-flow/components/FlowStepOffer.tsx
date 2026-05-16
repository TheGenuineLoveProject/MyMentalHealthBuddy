/**
 * Phase 14 — Soft subscription invitation.
 * GUARDED: renders only when isSubscriptionMessagingAllowed(state) === true.
 * No FOMO, no scarcity. Decline is equally welcomed.
 */

import { MMHBButton } from "../../design-system/components/MMHBButton";
import { colors } from "../../design-system/tokens/colors";
import { typography } from "../../design-system/tokens/typography";
import { offerCopy } from "../copy/microCopy";
import {
  isSubscriptionMessagingAllowed,
  useCheckInFlowStore,
} from "../state/useCheckInFlowStore";

export type FlowStepOfferProps = {
  onAccept?: () => void;
};

export function FlowStepOffer({ onAccept }: FlowStepOfferProps) {
  const state = useCheckInFlowStore((s) => s);
  const acceptOffer = useCheckInFlowStore((s) => s.acceptOffer);
  const declineOffer = useCheckInFlowStore((s) => s.declineOffer);

  // Hard-render-guard. If anything is off, render nothing rather than risk leaking copy.
  if (!isSubscriptionMessagingAllowed(state)) {
    if (typeof console !== "undefined") {
      console.warn(
        "[checkin-flow] FlowStepOffer mounted without authorization — rendering null (CF-R001).",
      );
    }
    return null;
  }

  const handleAccept = () => {
    acceptOffer();
    onAccept?.();
  };

  return (
    <section
      data-testid="checkin-flow-step-offer"
      aria-labelledby="checkin-offer-title"
    >
      <h2
        id="checkin-offer-title"
        style={{
          fontFamily: typography.fonts.heading,
          fontSize: 24,
          color: colors.semantic.fgHeading,
          margin: "0 0 12px",
        }}
        data-testid="text-offer-title"
      >
        {offerCopy.title}
      </h2>
      <p
        style={{
          fontFamily: typography.fonts.body,
          fontSize: 16,
          color: colors.semantic.fgBody,
          lineHeight: 1.55,
          margin: "0 0 22px",
        }}
        data-testid="text-offer-body"
      >
        {offerCopy.body}
      </p>

      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          justifyContent: "flex-end",
          margin: "0 0 14px",
        }}
      >
        <MMHBButton
          variant="ghost"
          size="md"
          onClick={declineOffer}
          data-testid="button-offer-decline"
        >
          {offerCopy.secondaryCta}
        </MMHBButton>
        <MMHBButton
          variant="primary"
          size="md"
          onClick={handleAccept}
          data-testid="button-offer-accept"
        >
          {offerCopy.primaryCta}
        </MMHBButton>
      </div>

      <p
        style={{
          fontFamily: typography.fonts.body,
          fontSize: 13,
          color: colors.semantic.fgMuted,
          textAlign: "center",
          margin: "0 0 12px",
        }}
        data-testid="text-offer-reassurance"
      >
        {offerCopy.reassurance}
      </p>

      <p
        style={{
          fontFamily: typography.fonts.body,
          fontSize: 12,
          color: colors.semantic.fgMuted,
          textAlign: "center",
          margin: 0,
        }}
      >
        In crisis?{" "}
        <a
          href="/crisis"
          data-testid="link-crisis-offer"
          style={{ color: colors.palette.primarySage, fontWeight: 600 }}
        >
          /crisis
        </a>
      </p>
    </section>
  );
}
