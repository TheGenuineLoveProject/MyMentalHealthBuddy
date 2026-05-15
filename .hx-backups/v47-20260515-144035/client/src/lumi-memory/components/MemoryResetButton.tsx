/**
 * Phase 16 — Reflective Memory Layer
 *
 * Instant-reset affordance. Two-tap (confirm) by default to prevent
 * accidental wipes; `requireConfirm={false}` opts out.
 */

import { useState } from "react";
import { MMHBButton } from "@/design-system";
import { resetMemory } from "../runtime/memoryRouter";

export type MemoryResetButtonProps = {
  requireConfirm?: boolean;
  onReset?: () => void;
  label?: string;
  confirmLabel?: string;
};

export function MemoryResetButton({
  requireConfirm = true,
  onReset,
  label = "Reset what Lumi remembers",
  confirmLabel = "Tap again to clear everything",
}: MemoryResetButtonProps) {
  const [armed, setArmed] = useState(false);

  function handleClick() {
    if (requireConfirm && !armed) {
      setArmed(true);
      return;
    }
    resetMemory();
    setArmed(false);
    onReset?.();
  }

  return (
    <MMHBButton
      variant={armed ? "primary" : "secondary"}
      size="md"
      onClick={handleClick}
      data-testid="button-memory-reset"
      aria-pressed={armed}
    >
      {armed ? confirmLabel : label}
    </MMHBButton>
  );
}
