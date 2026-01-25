import React from "react";

export type ClaritySpec = {
  what: string;
  why: string;
  who: string;
  when: string;
  where: string;
  how: string;
};

export function ClarityCard({ spec }: { spec: ClaritySpec }) {
  return (
    <section aria-label="Clarity" className="rounded-xl border p-4">
      <h2 className="text-base font-semibold">Clarity (What this is)</h2>
      <dl className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-semibold opacity-70">WHAT</dt>
          <dd className="text-sm">{spec.what}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold opacity-70">WHY</dt>
          <dd className="text-sm">{spec.why}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold opacity-70">WHO</dt>
          <dd className="text-sm">{spec.who}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold opacity-70">WHEN</dt>
          <dd className="text-sm">{spec.when}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold opacity-70">WHERE</dt>
          <dd className="text-sm">{spec.where}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold opacity-70">HOW</dt>
          <dd className="text-sm">{spec.how}</dd>
        </div>
      </dl>
    </section>
  );
}