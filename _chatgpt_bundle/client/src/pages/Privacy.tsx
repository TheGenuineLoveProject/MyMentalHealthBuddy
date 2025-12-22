export default function Privacy() {
  return (
    <main className="mx-auto max-w-3xl p-6 space-y-4">
      <h1 className="text-3xl font-heading">Privacy Policy (Summary)</h1>

      <p>
        We built The Genuine Love Project to be privacy-first. We only collect what’s needed to run
        the service and improve reliability.
      </p>

      <h2 className="text-xl font-heading pt-4">What we may collect</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>Account data (email, basic profile)</li>
        <li>App usage data (to improve performance and fix bugs)</li>
        <li>Content you submit (journals/chats) only as needed to provide the features you request</li>
      </ul>

      <h2 className="text-xl font-heading pt-4">What we don’t do</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>We do not sell your personal data.</li>
        <li>We do not use your data to target you with sensitive advertising.</li>
      </ul>

      <h2 className="text-xl font-heading pt-4">Your choices</h2>
      <p>
        You can request data export or deletion where available. If you have questions, contact support.
      </p>

      <p className="text-sm opacity-80 pt-6">
        This is a summary for launch. Replace with a full policy before large-scale release.
      </p>
    </main>
  );
}