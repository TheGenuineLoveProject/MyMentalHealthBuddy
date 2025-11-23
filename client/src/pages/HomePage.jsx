export default function HomePage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold mb-4">Home Page Loaded ✔️</h1>
      <p>Your UI is now active and connected.</p>

      <div className="mt-4 space-y-2">
        <a href="/auth" className="text-blue-600 underline">Auth Page</a><br/>
        <a href="/protected" className="text-blue-600 underline">Protected Route</a><br/>
        <a href="/analytics" className="text-blue-600 underline">Analytics</a><br/>
        <a href="/ai-test" className="text-blue-600 underline">AI Page</a>
      </div>
    </div>
  );
}
