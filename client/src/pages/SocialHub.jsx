export default function SocialHub() {
  return (
    <div className="min-h-screen p-8" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <h1 className="text-3xl font-semibold mb-2">Social Hub</h1>
      <p style={{ color: "var(--muted)" }}>
        Templates, captions, hashtags, and scheduling exports. (Next: connect Canva exports + post generator)
      </p>
      <div className="mt-6 card p-6">
        <ul className="list-disc ml-6" style={{ color: "var(--muted)" }}>
          <li>Instagram / Reels</li>
          <li>YouTube Shorts</li>
          <li>Pinterest</li>
          <li>LinkedIn</li>
        </ul>
      </div>
    </div>
  );
}