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

export default function Terms() {
  const updated = "2025-12-28";

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-semibold">Terms of Service</h1>
      <p className="mt-2 text-sm opacity-80">Last updated: {updated}</p>

      <section className="mt-8 space-y-4 leading-relaxed">
        <p>
          By using The Genuine Love Project (“the Service”), you agree to these Terms. If you do not agree, do not use the Service.
        </p>

        <h2 className="text-xl font-semibold mt-6">1) Wellness-only, not therapy</h2>
        <p>
          The Service provides reflection tools and educational wellness content. It is not a substitute for professional care,
          diagnosis, or treatment.
        </p>

        <h2 className="text-xl font-semibold mt-6">2) Your responsibilities</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Use the Service lawfully and respectfully.</li>
          <li>Do not attempt to break security, scrape data, or misuse AI features.</li>
          <li>You are responsible for safeguarding your account credentials.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6">3) User content</h2>
        <p>
          You retain ownership of content you submit. You grant the Service a limited license to store and process it
          solely to operate and improve features you request (such as generating insights).
        </p>

        <h2 className="text-xl font-semibold mt-6">4) Subscriptions and billing</h2>
        <p>
          Paid features (if offered) are billed through Stripe. Subscription terms, renewal, and cancellation are handled through Stripe
          and your account settings where available.
        </p>

        <h2 className="text-xl font-semibold mt-6">5) Acceptable use</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>No hate, harassment, or harmful content.</li>
          <li>No attempts to generate instructions for wrongdoing or self-harm.</li>
          <li>No abuse of the platform or excessive automated traffic.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6">6) Disclaimers</h2>
        <p>
          The Service is provided “as is” without warranties. We do our best to keep it reliable but cannot guarantee uninterrupted access.
        </p>

        <h2 className="text-xl font-semibold mt-6">7) Limitation of liability</h2>
        <p>
          To the maximum extent permitted by law, we are not liable for indirect or consequential damages arising from your use of the Service.
        </p>

        <h2 className="text-xl font-semibold mt-6">8) Changes</h2>
        <p>
          We may update these Terms to improve clarity and safety. Continued use after changes means you accept the updated Terms.
        </p>
      </section>
    </main>
  );
}