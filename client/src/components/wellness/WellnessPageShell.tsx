import React from "react";
import { BenefitBlock } from "@/components/benefits/BenefitBlock";
import type { BenefitToken } from "@/lib/benefits";
import { ConsentStrip } from "@/components/wellness/ConsentStrip";
import { ClarityCard, type ClaritySpec } from "@/components/wellness/ClarityCard";
import { ExamplesAccordion, type ExampleTier } from "@/components/wellness/ExamplesAccordion";
import { SafetyFooterStrip } from "@/components/safety/SafetyFooterStrip";
import { CRISIS_PATH } from "@/lib/safety";

export function WellnessPageShell({
  title,
  subtitle,
  benefits,
  clarity,
  examples,
  children,
}: {
  title: string;
  subtitle?: string;
  benefits: BenefitToken[];
  clarity: ClaritySpec;
  examples: ExampleTier[];
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold">{title}</h1>
        {subtitle ? <p className="mt-2 opacity-80">{subtitle}</p> : null}
        <div className="mt-3">
          <a className="underline text-sm" href={CRISIS_PATH}>
            Need urgent help? Visit {CRISIS_PATH}.
          </a>
        </div>
      </header>

      <div className="grid gap-4">
        <BenefitBlock benefits={benefits} />
        <ConsentStrip />
        <ClarityCard spec={clarity} />
        <ExamplesAccordion tiers={examples} />
      </div>

      <section className="mt-6 rounded-xl border p-4">
        {children}
      </section>

      <div className="mt-8">
        <SafetyFooterStrip />
      </div>
    </main>
  );
}