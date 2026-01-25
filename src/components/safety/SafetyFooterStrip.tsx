import React from "react";
import { AGE_18_PLUS_LINE, SAFETY_DISCLAIMER_SHORT, CRISIS_PATH } from "@/lib/safety";

export function SafetyFooterStrip() {
  return (
    <div className="w-full border-t py-3 text-xs opacity-90">
      <div className="mx-auto max-w-5xl px-4 flex flex-col gap-1">
        <span>18+ only • {SAFETY_DISCLAIMER_SHORT} • Pause/stop anytime • <a className="underline" href={CRISIS_PATH}>{CRISIS_PATH}</a></span>
        <span className="opacity-80">{AGE_18_PLUS_LINE}</span>
      </div>
    </div>
  );
}