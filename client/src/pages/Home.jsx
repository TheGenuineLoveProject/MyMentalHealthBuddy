export default function Home() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Home Page Loaded ✔</h1>

      <p className="text-gray-700">
        Your main homepage is active and ready for UI integration.
      </p>

      <ul className="list-disc pl-6 space-y-2">
        <li><a className="text-blue-600 hover:underline" href="/auth-test">Auth Test</a></li>
        <li><a className="text-blue-600 hover:underline" href="/auth">Auth</a></li>
        <li><a className="text-blue-600 hover:underline" href="/analytics">Analytics</a></li>
        <li><a className="text-blue-600 hover:underline" href="/ai">AI Page</a></li>
      </ul>
    </div>
  );
}