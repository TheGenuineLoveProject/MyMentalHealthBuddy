/**
 * Phase 15 — Orchestrator: input + most-recent response only.
 *
 * Conversation history is INTENTIONALLY ephemeral (last response only).
 * No history reinforces the "tiny conversational presence" contract and
 * avoids the long-thread attachment loops the spec forbids.
 */

import { useCallback, useState } from "react";
import { generateResponse } from "../engine/companionEngine";
import type { CompanionResponse } from "../types/companionVoiceTypes";
import { MMHBCompanionInput } from "./MMHBCompanionInput";
import { MMHBCompanionMessage } from "./MMHBCompanionMessage";

export type MMHBCompanionProps = {
  /** Optional analytics hook — receives anonymized intent + category only. */
  onResponse?: (meta: {
    intent: CompanionResponse["intent"];
    detected: CompanionResponse["detected"];
    isCrisis: boolean;
  }) => void;
};

export function MMHBCompanion({ onResponse }: MMHBCompanionProps) {
  const [response, setResponse] = useState<CompanionResponse | null>(null);
  const [turnIndex, setTurnIndex] = useState(0);

  const handleSubmit = useCallback(
    (text: string) => {
      const next = generateResponse({ text, turnIndex });
      setResponse(next);
      setTurnIndex((t) => t + 1);
      onResponse?.({
        intent: next.intent,
        detected: next.detected,
        isCrisis: next.isCrisis,
      });
    },
    [turnIndex, onResponse],
  );

  return (
    <section data-testid="companion-orchestrator" style={{ display: "grid", gap: 16 }}>
      <MMHBCompanionInput onSubmit={handleSubmit} />
      {response && <MMHBCompanionMessage response={response} />}
    </section>
  );
}
