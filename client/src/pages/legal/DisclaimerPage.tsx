import React from "react";
import EthicsSafetyBlock from "@/components/legal/EthicsSafetyBlock";

export default function DisclaimerPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Disclaimer</h1>
      <p className="mt-2 text-muted-foreground">
        Clear boundaries protect you. We’re here for reflection, not replacement
        of professional care.
      </p>

      <div className="mt-6 space-y-4">
        <EthicsSafetyBlock variant="card" showCrisis />

        <section className="rounded-xl border bg-card p-5">
          <h2 className="text-lg font-semibold">Not Medical Advice</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Content on this site is for educational and supportive purposes only.
            It is not medical, psychiatric, or therapeutic advice, and it does not
            create a clinician–patient relationship.
          </p>
        </section>

        <section className="rounded-xl border bg-card p-5">
          <h2 className="text-lg font-semibold">Use at Your Pace</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            If a prompt or reflection feels overwhelming, pause. Choose a gentler
            practice, reach out to someone you trust, or seek licensed support.
          </p>
        </section>
      </div>
    </main>
  );
}