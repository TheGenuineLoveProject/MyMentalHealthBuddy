export default function Privacy() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-semibold">Privacy Policy</h1>
      <p className="mt-4 text-sm opacity-80">Last updated: {new Date().toLocaleDateString()}</p>

      <section className="mt-8 space-y-4">
        <p>
          The Genuine Love Project (“we”, “us”) provides reflective tools for journaling, learning, and personal growth.
          This platform is not a medical service and does not provide clinical diagnosis or treatment.
        </p>

        <h2 className="text-xl font-semibold mt-6">What we collect</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><b>Account data:</b> email, profile settings, and basic preferences.</li>
          <li><b>User content:</b> journal entries, reflections, and tool inputs you submit.</li>
          <li><b>Usage data:</b> basic analytics and error logs to improve reliability.</li>
          <li><b>Billing data:</b> processed by Stripe (we do not store full card numbers).</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6">How we use information</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Provide and improve the platform features you request.</li>
          <li>Secure the platform and prevent abuse.</li>
          <li>Operate subscriptions and receipts through Stripe.</li>
          <li>Measure performance and fix bugs (e.g., error monitoring).</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6">AI features</h2>
        <p>
          Some tools may use AI to generate supportive reflections. You control what you submit.
          Do not include sensitive personal information you don’t want processed for generating responses.
        </p>

        <h2 className="text-xl font-semibold mt-6">Sharing</h2>
        <p>
          We do not sell your personal data. We share data only with service providers needed to run the platform
          (e.g., hosting, database, analytics, payments) and only as necessary.
        </p>

        <h2 className="text-xl font-semibold mt-6">Data retention & deletion</h2>
        <p>
          You may request deletion of your account and associated content where technically feasible and legally permitted.
          We may retain limited logs for security and compliance.
        </p>

        <h2 className="text-xl font-semibold mt-6">Security</h2>
        <p>
          We use standard safeguards (encryption in transit, access controls, rate limiting). No system is 100% secure,
          but we continuously improve protections.
        </p>

        <h2 className="text-xl font-semibold mt-6">Contact</h2>
        <p>
          For privacy questions, contact the platform owner via the contact method listed on the website.
        </p>
      </section>
    </div>
  );
}