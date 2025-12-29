export default function Terms() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-semibold">Terms of Service</h1>
      <p className="mt-4 text-sm opacity-80">Last updated: {new Date().toLocaleDateString()}</p>

      <section className="mt-8 space-y-4">
        <p>
          By using The Genuine Love Project (“Service”), you agree to these Terms.
          If you do not agree, do not use the Service.
        </p>

        <h2 className="text-xl font-semibold mt-6">Not medical or emergency services</h2>
        <p>
          The Service provides educational and reflective tools only. It is not medical advice, therapy, diagnosis,
          or crisis support. If you are in immediate danger, contact local emergency services.
        </p>

        <h2 className="text-xl font-semibold mt-6">Your account</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>You are responsible for your account credentials and activity.</li>
          <li>You agree not to misuse the Service or attempt unauthorized access.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6">User content</h2>
        <p>
          You retain ownership of content you submit. You grant us permission to process it to operate the Service
          (including AI features you choose to use).
        </p>

        <h2 className="text-xl font-semibold mt-6">Subscriptions & billing</h2>
        <p>
          Paid plans are billed via Stripe. Subscription terms, cancellations, and refunds follow the plan details shown
          at checkout and applicable law.
        </p>

        <h2 className="text-xl font-semibold mt-6">Acceptable use</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>No illegal activity, harassment, hate, or exploitation.</li>
          <li>No attempts to reverse engineer or disrupt the Service.</li>
          <li>No uploading malware or harmful code.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6">Disclaimer</h2>
        <p>
          The Service is provided “as is” without warranties. We are not liable for decisions you make based on outputs.
          Use your judgment and seek qualified help when appropriate.
        </p>

        <h2 className="text-xl font-semibold mt-6">Changes</h2>
        <p>
          We may update these Terms. Continued use after updates means you accept the new Terms.
        </p>
      </section>
    </div>
  );
}