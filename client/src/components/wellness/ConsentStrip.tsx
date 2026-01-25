import React from "react";
import { CRISIS_PATH, PAUSE_STOP_LINE, SAFETY_DISCLAIMER_SHORT } from "@/lib/safety";

export function ConsentStrip({
  tone = "gentle",
}: {
  tone?: "gentle" | "direct";
}) {
  const line =
    tone === "direct"
      ? "Pause, skip, or stop anytime. Only do what feels safe for you."
      : "You’re in control. Pause, skip, or stop anytime. Choose what feels safe.";

  return (
    <div className="rounded-xl border p-4 text-sm">
      <p className="font-medium">{line}</p>
      <p className="mt-2 opacity-90">
        {SAFETY_DISCLAIMER_SHORT}{" "}
        <a className="underline" href={CRISIS_PATH}>
          If you need urgent help, visit {CRISIS_PATH}.
        </a>
      </p>
      <p className="mt-2 opacity-80">{PAUSE_STOP_LINE}</p>
    </div>
  );
}