import React from "react";
import { BRAND } from "@shared/brand.mjs";

export default function Page() {
  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ marginBottom: 8 }}>{BRAND.name}</h1>
      <p style={{ opacity: 0.8 }}>{BRAND.tagline}</p>
      <hr style={{ margin: "16px 0" }} />
      <p>TODO: Replace with the matching Figma frame layout.</p>
    </div>
  );
}

export default function Privacy() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-semibold">Privacy Policy</h1>
      <p className="mt-4 text-sm opacity-80">Last updated: {new Date().toLocaleDateString()}</p>

      <section className="mt-8 space-y-4">
        <p>
          The Genuine Love Project (“we”, “us”) respects your privacy. This policy explains what we collect, why we collect
          it, and how you can control your information.
        </p>

        <h2 className="text-xl font-semibold mt-6">1) What we collect</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><b>Account info:</b> email, login identifiers, subscription status.</li>
          <li><b>Wellness content you submit:</b> journal entries, reflections, tool inputs.</li>
          <li><b>Technical data:</b> IP address, device/browser details, logs for security and debugging.</li>
          <li><b>Payments:</b> handled by Stripe; we store only minimal subscription metadata (not full card numbers).</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6">2) How we use data</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Provide and improve platform features.</li>
          <li>Keep the platform secure (fraud prevention, abuse prevention, auditing).</li>
          <li>Operate subscriptions and account access.</li>
          <li>Generate optional insights you request (e.g., summaries, reflections).</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6">3) AI features</h2>
        <p>
          If you use AI chat/reflection tools, your prompts may be processed to generate responses. Do not submit
          highly sensitive information you do not want processed. AI content is for educational/support purposes only.
        </p>

        <h2 className="text-xl font-semibold mt-6">4) Sharing</h2>
        <p>
          We do not sell your personal information. We share data only with service providers needed to run the platform
          (e.g., hosting, error monitoring, payments) and only as required by law.
        </p>

        <h2 className="text-xl font-semibold mt-6">5) Security</h2>
        <p>
          We use reasonable safeguards such as encryption in transit, access controls, and monitoring. No method is 100%
          secure, but we continuously improve protection.
        </p>

        <h2 className="text-xl font-semibold mt-6">6) Your choices</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Request account deletion (where available).</li>
          <li>Update your profile and settings.</li>
          <li>Opt out of non-essential emails if offered.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6">7) Contact</h2>
        <p>If you have privacy questions, contact us via the site’s contact page.</p>

        <div className="mt-8 rounded-lg border p-4 text-sm opacity-80">
          <b>Important:</b> The Genuine Love Project is not a medical provider. If you are in immediate danger or crisis,
          contact local emergency services.
        </div>
      </section>
    </main>
  );
}