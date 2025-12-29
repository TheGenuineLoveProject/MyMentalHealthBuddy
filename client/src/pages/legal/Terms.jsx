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
    return (
      <main className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-3xl font-semibold">Terms of Service</h1>
        <p className="mt-4 text-sm opacity-80">Last updated: {new Date().toLocaleDateString()}</p>

        <section className="mt-8 space-y-4">
          <p>
            By using The Genuine Love Project (“Service”), you agree to these Terms. If you do not agree, do not use the
            Service.
          </p>

          <h2 className="text-xl font-semibold mt-6">1) Not medical care</h2>
          <p>
            The Service provides educational and self-reflection tools. It does not provide medical advice, diagnosis, or
            treatment. If you need urgent help, contact emergency services or a licensed professional.
          </p>

          <h2 className="text-xl font-semibold mt-6">2) Accounts</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account. You agree not to misuse the Service
            or attempt unauthorized access.
          </p>

          <h2 className="text-xl font-semibold mt-6">3) Subscriptions</h2>
          <p>
            Paid features may be offered through Stripe. Prices, billing cycles, cancellations, and refunds (if any) are
            described at checkout and may change over time.
          </p>

          <h2 className="text-xl font-semibold mt-6">4) Acceptable use</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>No harassment, hate, or threats.</li>
            <li>No illegal activity or attempts to exploit vulnerabilities.</li>
            <li>No scraping or abusive automation.</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6">5) Intellectual property</h2>
          <p>
            The Service’s content, design, code, and branding are owned by The Genuine Love Project or licensed to us. You
            may not copy, resell, or distribute without permission.
          </p>

          <h2 className="text-xl font-semibold mt-6">6) User content</h2>
          <p>
            You retain ownership of your content. You grant us a limited license to process it to provide the Service
            (e.g., saving journals, generating requested insights).
          </p>

          <h2 className="text-xl font-semibold mt-6">7) Disclaimer of warranties</h2>
          <p>
            The Service is provided “as is” without warranties of any kind. We do not guarantee outcomes, accuracy, or
            uninterrupted availability.
          </p>

          <h2 className="text-xl font-semibold mt-6">8) Limitation of liability</h2>
          <p>
            To the maximum extent permitted by law, we are not liable for indirect or consequential damages arising from
            your use of the Service.
          </p>

          <h2 className="text-xl font-semibold mt-6">9) Changes</h2>
          <p>We may update these Terms. Continued use after changes means you accept the updated Terms.</p>
        </section>
      </main>
    );
  }