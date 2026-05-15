/**
 * Phase 14 — Calm Check-In Entry Flow governance.
 * 14 rules · 6 blocking · 8 warning.
 *
 * USAGE:
 *   import { auditFlow } from "@/checkin-flow";
 *   const failures = auditFlow(state, copy);
 *   if (failures.some(f => f.severity === "blocking")) throw new Error(...);
 */

import {
  FORBIDDEN_PHRASES,
  REQUIRED_TONE_PHRASES,
  breathingCopy,
  checkoutCopy,
  completeCopy,
  declinedCopy,
  moods,
  offerCopy,
  shiftOptions,
  welcomeCopy,
} from "../copy/microCopy";
import {
  REQUIRE_BREATHING_BEFORE_OFFER,
  getStoreApiSurface,
} from "../state/useCheckInFlowStore";
import type { FlowState } from "../types/checkInFlowTypes";

export type RuleSeverity = "blocking" | "warning";

export type CheckInFlowRule = {
  readonly id: string;
  readonly severity: RuleSeverity;
  readonly description: string;
  readonly check: (state: FlowState) => boolean;
};

const allCopyText = (): string => {
  const parts = [
    welcomeCopy.greeting, welcomeCopy.intro, welcomeCopy.consent,
    breathingCopy.title, breathingCopy.subtitle, breathingCopy.cancel,
    checkoutCopy.title, checkoutCopy.subtitle,
    offerCopy.title, offerCopy.body, offerCopy.primaryCta, offerCopy.secondaryCta, offerCopy.reassurance,
    completeCopy.title, completeCopy.body, completeCopy.cta,
    declinedCopy.title, declinedCopy.body, declinedCopy.cta,
    ...moods.flatMap((m) => [m.label, m.reflection]),
    ...shiftOptions.flatMap((s) => [s.label, s.response]),
  ];
  return parts.join(" \n ").toLowerCase();
};

const preOfferText = (): string => {
  // Everything that may be visible BEFORE the offer step.
  const parts = [
    welcomeCopy.greeting, welcomeCopy.intro, welcomeCopy.consent,
    breathingCopy.title, breathingCopy.subtitle, breathingCopy.cancel,
    checkoutCopy.title, checkoutCopy.subtitle,
    ...moods.flatMap((m) => [m.label, m.reflection]),
    ...shiftOptions.flatMap((s) => [s.label, s.response]),
  ];
  return parts.join(" \n ").toLowerCase();
};

const SUBSCRIPTION_TERMS = [
  "subscribe", "subscription", "upgrade", "premium", "plan",
  "checkout", "buy", "purchase", "pay", "$", "trial",
];

export const rules: readonly CheckInFlowRule[] = [
  {
    id: "CF-R001",
    severity: "blocking",
    description: "Subscription messaging never appears before breathing is completed.",
    check: (s) =>
      !s.subscriptionMentioned ||
      (s.subscriptionMentioned && s.breathingCompleted),
  },
  {
    id: "CF-R002",
    severity: "warning",
    description: "Welcome copy contains no subscription terms.",
    check: () => {
      const text = (welcomeCopy.greeting + welcomeCopy.intro + welcomeCopy.consent).toLowerCase();
      return !SUBSCRIPTION_TERMS.some((t) => text.includes(t));
    },
  },
  {
    id: "CF-R003",
    severity: "warning",
    description: "Breathing-step copy contains no subscription terms.",
    check: () => {
      const text = (breathingCopy.title + breathingCopy.subtitle).toLowerCase();
      // 'checkout' here refers to the FLOW step name (post-breathing feeling check),
      // never to a payment checkout. Allow.
      return !SUBSCRIPTION_TERMS
        .filter((t) => t !== "checkout")
        .some((t) => text.includes(t));
    },
  },
  {
    id: "CF-R004",
    severity: "warning",
    description:
      "Early exit is always reachable — store exposes both reset() and declineOffer() actions.",
    check: () => {
      const api = getStoreApiSurface();
      return api.reset === "function" && api.declineOffer === "function";
    },
  },
  {
    id: "CF-R005",
    severity: "warning",
    description: "Crisis routing is referenced in welcome copy.",
    check: () => welcomeCopy.crisisLine.includes("/crisis"),
  },
  {
    id: "CF-R006",
    severity: "warning",
    description: "No persuasive 'you should / you must' language anywhere.",
    check: () => {
      const text = allCopyText();
      return !["you should", "you must"].some((p) => text.includes(p));
    },
  },
  {
    id: "CF-R007",
    severity: "warning",
    description: "MI tone phrases ('you choose', 'no pressure', etc.) appear in offer copy.",
    check: () => {
      const text = (offerCopy.body + offerCopy.reassurance).toLowerCase();
      return REQUIRED_TONE_PHRASES.some((p) => text.includes(p));
    },
  },
  {
    id: "CF-R008",
    severity: "blocking",
    description: "No FOMO / scarcity tactics anywhere in the flow copy.",
    check: () => {
      const text = allCopyText();
      return !FORBIDDEN_PHRASES.some((p) => text.includes(p));
    },
  },
  {
    id: "CF-R009",
    severity: "warning",
    description: "Each mood has a non-empty reflection (affirmation).",
    check: () => moods.every((m) => m.reflection.trim().length > 8),
  },
  {
    id: "CF-R010",
    severity: "warning",
    description: "Each shift outcome has a non-empty reflective response.",
    check: () => shiftOptions.every((s) => s.response.trim().length > 8),
  },
  {
    id: "CF-R011",
    severity: "blocking",
    description:
      "User can decline the offer at any point — declineOffer() exists and a 'declined' terminal step is type-reachable.",
    check: () => {
      const api = getStoreApiSurface();
      // Structural: action must exist. The 'declined' literal in FlowStep is
      // verified at compile time by TypeScript; this runtime probe guards
      // against accidental removal of the action.
      return api.declineOffer === "function";
    },
  },
  {
    id: "CF-R012",
    severity: "blocking",
    description: "No diagnosis / clinical-treatment language in flow copy.",
    check: () => {
      const text = allCopyText();
      const banned = ["diagnose", "diagnosis", "disorder", "treat your", "cure", "patient"];
      return !banned.some((p) => text.includes(p));
    },
  },
  {
    id: "CF-R013",
    severity: "blocking",
    description: "Crisis routing string '/crisis' is preserved in welcome copy.",
    check: () => welcomeCopy.crisisLine.includes("/crisis"),
  },
  {
    id: "CF-R014",
    severity: "blocking",
    description: "Pre-offer copy carries no subscription / payment language (no hard-sell modal copy can leak).",
    check: () =>
      !SUBSCRIPTION_TERMS
        .filter((t) => t !== "checkout") // step name, not payment
        .some((t) => preOfferText().includes(t)),
  },
] as const;

export type RuleResult = {
  readonly id: string;
  readonly severity: RuleSeverity;
  readonly description: string;
};

/** Returns failing rules. Empty array = healthy. */
export function auditFlow(state: FlowState): readonly RuleResult[] {
  return rules
    .filter((r) => !r.check(state))
    .map(({ id, severity, description }) => ({ id, severity, description }));
}

/** Module-level invariant — Wave 1 cannot regress this constant. */
export const REQUIRE_BREATHING_BEFORE_OFFER_LOCKED =
  REQUIRE_BREATHING_BEFORE_OFFER === true;
