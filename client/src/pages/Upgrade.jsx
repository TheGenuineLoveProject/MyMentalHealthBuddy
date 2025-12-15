export default function Upgrade() {
  return (
    <div>
      <h1>Upgrade to Pro</h1>
      <ul>
        <li>Advanced analytics</li>
        <li>AI insights</li>
        <li>Premium journaling</li>
      </ul>
      <button onClick={() => window.location.href="/api/billing/checkout"}>
        Upgrade Now
      </button>
    </div>
  );
}