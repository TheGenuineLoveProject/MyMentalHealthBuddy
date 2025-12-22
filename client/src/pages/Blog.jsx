export default function Blog() {
  return (
    <div className="min-h-screen p-8" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <h1 className="text-3xl font-semibold mb-2">Blog</h1>
      <p style={{ color: "var(--muted)" }}>
        Publishing hub for healing articles, updates, and resources. (Next: connect to /api/posts)
      </p>
      <div className="mt-6 card p-6">
        <h2 className="text-xl font-semibold mb-2">First Post</h2>
        <p style={{ color: "var(--muted)" }}>Coming next: Markdown/MDX + editor + SEO.</p>
      </div>
    </div>
  );
}