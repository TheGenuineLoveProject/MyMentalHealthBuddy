import React from "react";

export default function FigmaPanel({
  src,
  title = "Figma",
  height = 720,
  className = "",
}) {
  // Accept either a full Figma embed URL or a normal Figma file URL
  const embed =
    src && src.includes("embed")
      ? src
      : src
      ? `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(src)}`
      : "";

  return (
    <div className={`w-full ${className}`}>
      <div className="mb-2 text-sm text-slate-600">
        {title}
      </div>

      {embed ? (
        <iframe
          title={title}
          className="w-full rounded-lg border border-slate-200 bg-white"
          style={{ height }}
          src={embed}
          allowFullScreen
        />
      ) : (
        <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">
          No Figma link provided.
        </div>
      )}
    </div>
  );
}