import React from "react";
import EthicsSafetyBlock from "@/components/legal/EthicsSafetyBlock";

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Privacy</h1>
      <p className="mt-2 text-muted-foreground">
        Your inner world deserves dignity. Here’s how we treat your data.
      </p>

      <div className="mt-6 space-y-4">
        <EthicsSafetyBlock variant="card" showCrisis={false} />

        <section className="rounded-xl border bg-card p-5">
          <h2 className="text-lg font-semibold">What we store</h2>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            <li>Account details (if you create an account)</li>
            <li>Your entries (journals/reflections) only if you save them</li>
            <li>Basic usage metrics to improve the product (when enabled)</li>
          </ul>
        </section>

        <section className="rounded-xl border bg-card p-5">
          <h2 className="text-lg font-semibold">What we don’t do</h2>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            <li>We don’t sell personal data.</li>
            <li>We don’t claim to diagnose or track medical conditions.</li>
            <li>We don’t publish your private content without your consent.</li>
          </ul>
        </section>

        <section className="rounded-xl border bg-card p-5">
          <h2 className="text-lg font-semibold">Your control</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            You can delete your content and account (where supported). If you need
            help, use the Support page.
          </p>
        </section>
      </div>
    </main>
  );
}