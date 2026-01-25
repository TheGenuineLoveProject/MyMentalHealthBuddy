import React from "react";
import { CRISIS_PATH, SAFETY_DISCLAIMER_SHORT, PAUSE_STOP_LINE } from "@/lib/safety";
import type { BenefitToken } from "@/lib/benefits";

export function BenefitBlock({
  benefits,
  seconds = "30–90 seconds",
}: {
  benefits: BenefitToken[];
  seconds?: string;
}) {
  return (
    <section aria-label="Benefits" className="rounded-xl border p-4">
      <p className="text-sm">
        <strong>What you’ll get:</strong> {benefits.join(" • ")}
      </p>
      <p className="text-sm">
        <strong>Time:</strong> {seconds}
      </p>
      <p className="text-sm">
        <strong>Control:</strong> {PAUSE_STOP_LINE}
      </p>
      <p className="text-sm">
        <strong>Note:</strong> {SAFETY_DISCLAIMER_SHORT}{" "}
        <a className="underline" href={CRISIS_PATH}>
          If you’re in crisis, visit {CRISIS_PATH}.
        </a>
      </p>
    </section>
  );
}