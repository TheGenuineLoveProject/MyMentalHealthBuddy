import { useState, useEffect } from "react";
import { useRoute } from "wouter";

export default function BlogDraftViewer() {
  const [, params] = useRoute("/blog/draft/:id");
  const id = params?.id;
  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/admin/publishing/draft-packs/${encodeURIComponent(id)}`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) {
          setDraft(data.data);
        } else {
          setError(data.error || "Draft not found");
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: 32, textAlign: "center", color: "#6b7280" }}>
        Loading draft preview...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 32, textAlign: "center", color: "#ef4444" }}>
        {error}
      </div>
    );
  }

  if (!draft) {
    return (
      <div style={{ padding: 32, textAlign: "center", color: "#6b7280" }}>
        Draft not found
      </div>
    );
  }

  function renderMarkdown(md) {
    if (!md) return null;
    const lines = md.split("\n");
    const elements = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      if (line.startsWith("# ")) {
        elements.push(
          <h1
            key={i}
            style={{ fontSize: 28, fontWeight: 700, marginBottom: 16, color: "#1f2937" }}
          >
            {line.slice(2)}
          </h1>
        );
      } else if (line.startsWith("## ")) {
        elements.push(
          <h2
            key={i}
            style={{ fontSize: 22, fontWeight: 600, marginBottom: 12, marginTop: 24, color: "#1f2937" }}
          >
            {line.slice(3)}
          </h2>
        );
      } else if (line.startsWith("### ")) {
        elements.push(
          <h3
            key={i}
            style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, marginTop: 20, color: "#374151" }}
          >
            {line.slice(4)}
          </h3>
        );
      } else if (line.startsWith("---")) {
        elements.push(<hr key={i} style={{ margin: "24px 0", border: "none", borderTop: "1px solid #e5e7eb" }} />);
      } else if (line.startsWith("- ") || line.startsWith("* ")) {
        elements.push(
          <li key={i} style={{ fontSize: 15, color: "#374151", lineHeight: 1.7, marginLeft: 20 }}>
            {formatInline(line.slice(2))}
          </li>
        );
      } else if (/^\d+\.\s/.test(line)) {
        elements.push(
          <li key={i} style={{ fontSize: 15, color: "#374151", lineHeight: 1.7, marginLeft: 20, listStyleType: "decimal" }}>
            {formatInline(line.replace(/^\d+\.\s/, ""))}
          </li>
        );
      } else if (line.startsWith("*") && line.endsWith("*") && !line.startsWith("**")) {
        elements.push(
          <p key={i} style={{ fontSize: 15, fontStyle: "italic", color: "#4b5563", lineHeight: 1.7, marginBottom: 8 }}>
            {line.slice(1, -1)}
          </p>
        );
      } else if (line.trim() === "") {
        elements.push(<div key={i} style={{ height: 8 }} />);
      } else {
        elements.push(
          <p key={i} style={{ fontSize: 15, color: "#374151", lineHeight: 1.7, marginBottom: 8 }}>
            {formatInline(line)}
          </p>
        );
      }
      i++;
    }

    return elements;
  }

  function formatInline(text) {
    const parts = [];
    const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|\[(.+?)\]\((.+?)\))/g;
    let lastIndex = 0;
    let match;
    let keyIdx = 0;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      if (match[2]) {
        parts.push(<strong key={keyIdx++}>{match[2]}</strong>);
      } else if (match[3]) {
        parts.push(<em key={keyIdx++}>{match[3]}</em>);
      } else if (match[4] && match[5]) {
        const href = match[5].startsWith("/") ? match[5] : "#";
        parts.push(
          <a key={keyIdx++} href={href} style={{ color: "#2563eb", textDecoration: "underline" }}>
            {match[4]}
          </a>
        );
      }
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  }

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 16px" }}>
      <div
        style={{
          background: "#fef3c7",
          border: "1px solid #fbbf24",
          borderRadius: 8,
          padding: "8px 16px",
          marginBottom: 24,
          fontSize: 13,
          color: "#92400e",
        }}
      >
        Admin Preview Only — This draft is not publicly visible.
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <span
          style={{
            fontSize: 11,
            padding: "2px 8px",
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
            padding: "2px 8px",
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
            padding: "2px 8px",
            borderRadius: 4,
            background:
              draft.status === "posted"
                ? "#dcfce7"
                : draft.status === "approved"
                ? "#dbeafe"
                : "#f3f4f6",
            color:
              draft.status === "posted"
                ? "#166534"
                : draft.status === "approved"
                ? "#1e40af"
                : "#6b7280",
          }}
        >
          {draft.status}
        </span>
      </div>

      <article data-testid="draft-article">
        {renderMarkdown(draft.draftMarkdown || `## ${draft.title}\n\n${draft.captions?.instagram || "No content available."}`)}
      </article>

      {draft.safetyNote && (
        <div
          style={{
            marginTop: 32,
            padding: "12px 16px",
            background: "#fef2f2",
            borderRadius: 8,
            fontSize: 13,
            color: "#991b1b",
            border: "1px solid #fecaca",
          }}
        >
          {draft.safetyNote}
        </div>
      )}
    </div>
  );
}
