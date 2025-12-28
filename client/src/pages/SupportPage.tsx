import React, { useState } from "react";
import EthicsSafetyBlock from "@/components/legal/EthicsSafetyBlock";

export default function SupportPage() {
  const [copied, setCopied] = useState(false);

  const supportEmail = "support@thegenuineloveproject.com"; // change if needed

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Support</h1>
      <p className="mt-2 text-muted-foreground">
        You’re not alone. Here are safe ways to get help with the platform and your experience.
      </p>

      <div className="mt-6 space-y-4">
        <EthicsSafetyBlock variant="card" showCrisis />

        <section className="rounded-xl border bg-card p-5">
          <h2 className="text-lg font-semibold">Contact</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Email us at{" "}
            <span className="font-medium">{supportEmail}</span>{" "}
            and include:
          </p>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            <li>What page you were on</li>
            <li>What you expected to happen</li>
            <li>What happened instead (screenshots help)</li>
          </ul>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              className="rounded-lg border px-3 py-2 text-sm hover:bg-muted"
              onClick={async () => {
                await navigator.clipboard.writeText(supportEmail);
                setCopied(true);
                setTimeout(() => setCopied(false), 1200);
              }}
              type="button"
            >
              Copy email
            </button>
            {copied && (
              <span className="text-sm text-muted-foreground">Copied ✨</span>
            )}
          </div>
        </section>

        <section className="rounded-xl border bg-card p-5">
          <h2 className="text-lg font-semibold">If you feel emotionally overwhelmed</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Pause and choose a gentler step. Try: drink water, feel your feet on
            the floor, and take 5 slow breaths. If you feel unsafe, use the crisis
            resources above immediately.
          </p>
        </section>
      </div>
    </main>
  );
}