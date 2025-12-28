import React from "react";
import EthicsSafetyBlock from "@/components/legal/EthicsSafetyBlock";

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Terms</h1>
      <p className="mt-2 text-muted-foreground">
        A simple agreement: be kind, be safe, and respect the space.
      </p>

      <div className="mt-6 space-y-4">
        <EthicsSafetyBlock variant="card" showCrisis={false} />

        <section className="rounded-xl border bg-card p-5">
          <h2 className="text-lg font-semibold">Respectful use</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            You agree not to use the platform to harass, exploit, or harm others,
            or to post illegal content.
          </p>
        </section>

        <section className="rounded-xl border bg-card p-5">
          <h2 className="text-lg font-semibold">No emergency services</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            We do not provide crisis response. If you are in danger, contact local
            emergency services immediately.
          </p>
        </section>

        <section className="rounded-xl border bg-card p-5">
          <h2 className="text-lg font-semibold">Changes</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            We may update these terms. Continued use means you accept the newest
            version.
          </p>
        </section>
      </div>
    </main>
  );
}