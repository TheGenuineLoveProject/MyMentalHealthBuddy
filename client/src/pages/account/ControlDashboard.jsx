export default function ControlDashboard() {
  return (
    <div className="min-h-screen p-8" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <h1 className="text-3xl font-semibold mb-2">Control Dashboard</h1>
      <p style={{ color: "var(--muted)" }}>
        Platform controls: content, feature flags, analytics, support, and compliance. (Next: admin-only guard)
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-1">SEO</h2>
          <p style={{ color: "var(--muted)" }}>Sitemap, robots, meta, redirects.</p>
        </div>
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-1">Publishing</h2>
          <p style={{ color: "var(--muted)" }}>Draft review, schedules, approvals.</p>
        </div>
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-1">Social</h2>
          <p style={{ color: "var(--muted)" }}>Campaigns, exports, Canva templates.</p>
        </div>
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-1">Health</h2>
          <p style={{ color: "var(--muted)" }}>Deploy status + critical alerts.</p>
        </div>
      </div>
    </div>
  );
}