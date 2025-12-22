import React from "react";

export default function FigmaPanel() {
  const url = import.meta.env.VITE_FIGMA_EMBED_URL || "";

  if (!url) {
    return (
      <div style={{ padding: 16 }}>
        <h2>Figma Panel</h2>
        <p>
          Missing <code>VITE_FIGMA_EMBED_URL</code>. Add it in Replit Secrets.
        </p>
      </div>
    );
  }

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <iframe
        title="Figma"
        src={url}
        style={{ border: 0, width: "100%", height: "100%" }}
        allowFullScreen
      />
    </div>
  );
}
type Props = {
  url?: string;
};