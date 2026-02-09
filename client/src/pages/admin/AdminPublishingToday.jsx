import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";

const PLATFORMS = [
  { key: "instagram", label: "Instagram" },
  { key: "x", label: "X / Twitter" },
  { key: "tiktok", label: "TikTok" },
  { key: "youtubeShorts", label: "YouTube Shorts" },
];

function CopyButton({ text, label }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      data-testid={`copy-${label.toLowerCase().replace(/\s+/g, "-")}`}
      onClick={handleCopy}
      style={{
        padding: "6px 14px",
        borderRadius: 6,
        border: "1px solid #d1d5db",
        background: copied ? "#d1fae5" : "#fff",
        color: copied ? "#065f46" : "#374151",
        cursor: "pointer",
        fontSize: 13,
        transition: "all 0.2s",
      }}
    >
      {copied ? "Copied!" : `Copy ${label}`}
    </button>
  );
}

export default function AdminPublishingToday() {
  const { user } = useAuth();
  const [drafts, setDrafts] = useState([]);
  const [featured, setFeatured] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [posting, setPosting] = useState(null);
  const [settingFeatured, setSettingFeatured] = useState(null);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [draftsRes, featuredRes] = await Promise.all([
        fetch("/api/admin/publishing/draft-packs", { credentials: "include" }),
        fetch("/api/admin/publishing/featured", { credentials: "include" }),
      ]);
      const draftsData = await draftsRes.json();
      const featuredData = await featuredRes.json();
      if (draftsData.ok) setDrafts(draftsData.data || []);
      if (featuredData.ok) setFeatured(featuredData.data?.[today] || null);
    } catch (err) {
      console.error("Failed to load publishing data", err);
    }
    setLoading(false);
  }

  async function handleSetFeatured(id) {
    setSettingFeatured(id);
    try {
      const res = await fetch("/api/admin/publishing/featured", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ date: today, glpId: id }),
      });
      const data = await res.json();
      if (data.ok) {
        setFeatured(data.data);
      }
    } catch (err) {
      console.error("Failed to set featured", err);
    }
    setSettingFeatured(null);
  }

  async function handleMarkPosted(id) {
    setPosting(id);
    try {
      const res = await fetch(`/api/admin/publishing/mark-posted/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await res.json();
      if (data.ok) {
        setDrafts((prev) =>
          prev.map((d) =>
            d.id === id ? { ...d, status: "posted", postedAt: data.data.postedAt } : d
          )
        );
      }
    } catch (err) {
      console.error("Failed to mark posted", err);
    }
    setPosting(null);
  }

  const readyDrafts = drafts.filter(
    (d) => d.status === "draft" || d.status === "approved"
  );
  const postedDrafts = drafts.filter((d) => d.status === "posted");

  const filtered =
    filter === "all"
      ? readyDrafts
      : readyDrafts.filter((d) => d.type === filter);

  const featuredDraft = featured
    ? drafts.find((d) => d.id === featured.glpId)
    : null;

  if (loading) {
    return (
      <div style={{ padding: 32, textAlign: "center", color: "#6b7280" }}>
        Loading publishing dashboard...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "24px 16px" }}>
      <h1
        data-testid="heading-todays-pick"
        style={{ fontSize: 24, fontWeight: 700, marginBottom: 4, color: "#1f2937" }}
      >
        Today's Publishing Pick
      </h1>
      <p style={{ color: "#6b7280", marginBottom: 24, fontSize: 14 }}>
        {today} &middot; {readyDrafts.length} drafts ready &middot;{" "}
        {postedDrafts.length} posted
      </p>

      {featuredDraft && (
        <div
          data-testid="featured-card"
          style={{
            background: "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)",
            border: "2px solid #86efac",
            borderRadius: 12,
            padding: 20,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#16a34a",
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              Today's Featured
            </span>
            <span
              style={{
                fontSize: 12,
                padding: "2px 8px",
                borderRadius: 4,
                background: "#dcfce7",
                color: "#166534",
              }}
            >
              {featuredDraft.pillar}
            </span>
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
            {featuredDraft.title}
          </h3>
          <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 16 }}>
            Type: {featuredDraft.type} &middot; CTA: {featuredDraft.primaryCta}
          </p>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
            {PLATFORMS.map((p) => (
              <CopyButton
                key={p.key}
                text={featuredDraft.captions?.[p.key] || ""}
                label={p.label}
              />
            ))}
          </div>

          {featuredDraft.status !== "posted" && (
            <button
              data-testid="button-mark-posted-featured"
              onClick={() => handleMarkPosted(featuredDraft.id)}
              disabled={posting === featuredDraft.id}
              style={{
                padding: "8px 20px",
                borderRadius: 8,
                border: "none",
                background: "#16a34a",
                color: "#fff",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: 14,
              }}
            >
              {posting === featuredDraft.id ? "Marking..." : "Mark as Posted"}
            </button>
          )}
          {featuredDraft.status === "posted" && (
            <span style={{ color: "#16a34a", fontWeight: 600, fontSize: 14 }}>
              Posted
            </span>
          )}
        </div>
      )}

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {["all", "social", "blog", "newsletter"].map((f) => (
          <button
            key={f}
            data-testid={`filter-${f}`}
            onClick={() => setFilter(f)}
            style={{
              padding: "6px 14px",
              borderRadius: 6,
              border: filter === f ? "2px solid #3b82f6" : "1px solid #d1d5db",
              background: filter === f ? "#eff6ff" : "#fff",
              color: filter === f ? "#1d4ed8" : "#374151",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: filter === f ? 600 : 400,
            }}
          >
            {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)} (
            {f === "all"
              ? readyDrafts.length
              : readyDrafts.filter((d) => d.type === f).length}
            )
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.length === 0 && (
          <p style={{ color: "#9ca3af", textAlign: "center", padding: 32 }}>
            No drafts available for this filter.
          </p>
        )}
        {filtered.map((draft) => (
          <div
            key={draft.id}
            data-testid={`draft-card-${draft.id}`}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 10,
              padding: 16,
              background:
                featured?.glpId === draft.id
                  ? "#f0fdf4"
                  : draft.status === "posted"
                  ? "#f9fafb"
                  : "#fff",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 8,
              }}
            >
              <div>
                <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>
                  {draft.title}
                </h4>
                <div style={{ display: "flex", gap: 6 }}>
                  <span
                    style={{
                      fontSize: 11,
                      padding: "2px 6px",
                      borderRadius: 4,
                      background: "#e0e7ff",
                      color: "#3730a3",
                    }}
                  >
                    {draft.type}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      padding: "2px 6px",
                      borderRadius: 4,
                      background: "#fef3c7",
                      color: "#92400e",
                    }}
                  >
                    {draft.pillar}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      padding: "2px 6px",
                      borderRadius: 4,
                      background: "#f3f4f6",
                      color: "#6b7280",
                    }}
                  >
                    {draft.primaryCta}
                  </span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  data-testid={`button-feature-${draft.id}`}
                  onClick={() => handleSetFeatured(draft.id)}
                  disabled={settingFeatured === draft.id || featured?.glpId === draft.id}
                  style={{
                    padding: "5px 12px",
                    borderRadius: 6,
                    border: "1px solid #d1d5db",
                    background:
                      featured?.glpId === draft.id ? "#dcfce7" : "#fff",
                    color:
                      featured?.glpId === draft.id ? "#166534" : "#374151",
                    cursor:
                      featured?.glpId === draft.id ? "default" : "pointer",
                    fontSize: 12,
                  }}
                >
                  {featured?.glpId === draft.id
                    ? "Featured"
                    : settingFeatured === draft.id
                    ? "Setting..."
                    : "Set as Today's Pick"}
                </button>
                {draft.status !== "posted" && (
                  <button
                    data-testid={`button-mark-posted-${draft.id}`}
                    onClick={() => handleMarkPosted(draft.id)}
                    disabled={posting === draft.id}
                    style={{
                      padding: "5px 12px",
                      borderRadius: 6,
                      border: "none",
                      background: "#3b82f6",
                      color: "#fff",
                      cursor: "pointer",
                      fontSize: 12,
                    }}
                  >
                    {posting === draft.id ? "..." : "Mark Posted"}
                  </button>
                )}
              </div>
            </div>

            <details style={{ marginTop: 8 }}>
              <summary
                style={{ cursor: "pointer", fontSize: 13, color: "#6b7280" }}
              >
                View captions & copy
              </summary>
              <div
                style={{
                  marginTop: 8,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {PLATFORMS.map((p) => (
                  <div
                    key={p.key}
                    style={{
                      background: "#f9fafb",
                      borderRadius: 6,
                      padding: 10,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 6,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#374151",
                        }}
                      >
                        {p.label}
                      </span>
                      <CopyButton
                        text={draft.captions?.[p.key] || ""}
                        label={p.label}
                      />
                    </div>
                    <p
                      style={{
                        fontSize: 12,
                        color: "#6b7280",
                        whiteSpace: "pre-wrap",
                        lineHeight: 1.5,
                        margin: 0,
                      }}
                    >
                      {draft.captions?.[p.key] || "No caption"}
                    </p>
                  </div>
                ))}
              </div>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
}
