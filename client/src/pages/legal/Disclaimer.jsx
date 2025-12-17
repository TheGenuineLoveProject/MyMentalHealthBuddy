import React from "react";
import { BRAND } from "@shared/brand.mjs";

export default function Page() {
  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ marginBottom: 8 }}>{BRAND.name}</h1>
      <p style={{ opacity: 0.8 }}>{BRAND.tagline}</p>
      <hr style={{ margin: "16px 0" }} />
      <p>TODO: Replace with the matching Figma frame layout.</p>
    </div>
  );
}