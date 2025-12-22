export default function Publishing() {
  return (
    <div className="min-h-screen p-8" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <h1 className="text-3xl font-semibold mb-2">Publishing Studio</h1>
      <p style={{ color: "var(--muted)" }}>
        Draft → Review → Publish. (Next: role-based access + editor + scheduling)
      </p>
      <div className="mt-6 card p-6">
        <p style={{ color: "var(--muted)" }}>Next module: CMS tables + admin workflow.</p>
      </div>
    </div>
  );
}