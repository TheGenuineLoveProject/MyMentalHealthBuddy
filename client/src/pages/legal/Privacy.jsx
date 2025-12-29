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
  const updated = "2025-12-28";

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-semibold">Privacy Policy</h1>
      <p className="mt-2 text-sm opacity-80">Last updated: {updated}</p>

      <section className="mt-8 space-y-4 leading-relaxed">
        <p>
          The Genuine Love Project (“we”, “us”, “our”) is a wellness and self-reflection platform.
          We respect your privacy and aim to be transparent about what we collect and how it’s used.
        </p>

        <h2 className="text-xl font-semibold mt-6">1) What we collect</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><b>Account data</b>: email, login/session data, basic profile details.</li>
          <li><b>Content you choose to enter</b>: journaling, reflections, tool inputs, saved insights.</li>
          <li><b>Usage data</b>: pages visited, feature usage, basic device/browser signals (for reliability + security).</li>
          <li><b>Payment data</b>: if you subscribe, payments are processed by Stripe; we do not store full card numbers.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6">2) How we use data</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>To operate the app: authentication, saving your entries, generating insights you request.</li>
          <li>To improve safety + reliability: bug fixes, rate limiting, abuse prevention, performance monitoring.</li>
          <li>To provide customer support if you contact us.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6">3) AI features</h2>
        <p>
          Some features may use AI to generate reflections, summaries, or insights based on text you submit.
          You control what you enter. Do not submit sensitive personal information you do not want processed.
        </p>

        <h2 className="text-xl font-semibold mt-6">4) Sharing</h2>
        <p>
          We do not sell your personal data. We may share data with service providers strictly to run the platform
          (for example: hosting, logging/monitoring, database services, Stripe for billing).
        </p>

        <h2 className="text-xl font-semibold mt-6">5) Security</h2>
        <p>
          We use standard security controls (session management, HTTPS in production, rate limiting, and logging).
          No system is perfect; we continuously improve protections.
        </p>

        <h2 className="text-xl font-semibold mt-6">6) Your choices</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Access/update your profile.</li>
          <li>Request deletion of your account and associated data (where legally/technically feasible).</li>
          <li>Opt out of marketing communications (if applicable).</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6">7) Not medical advice</h2>
        <p>
          This platform provides wellness and journaling tools, not medical or clinical services. If you are in danger
          or considering self-harm, contact local emergency services immediately.
        </p>

        <h2 className="text-xl font-semibold mt-6">8) Contact</h2>
        <p>
          For privacy questions, contact the platform owner/administrator through the support channel listed on the site.
        </p>
      </section>
    </main>
  );
}