import React from "react";

export default function FigmaPanel() {
  // Paste your FIGMA EMBED LINK here (Share → Get embed code → copy URL)
  const figmaEmbedUrl =
    import.meta.env.VITE_FIGMA_EMBED_URL ||
    "https://www.figma.com/embed?embed_host=share&url=https://www.figma.com/file/FILEKEY/NAME";

  return (
    <div style={{ height: "calc(100vh - 64px)", width: "100%" }}>
      <iframe
        title="Figma"
        src={figmaEmbedUrl}
        style={{ border: 0, width: "100%", height: "100%" }}
        allowFullScreen
      />
    </div>
  );
}