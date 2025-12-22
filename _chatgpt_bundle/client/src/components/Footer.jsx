import { DISCLAIMERS_COPY } from "../copy/disclaimers";
import React from "react";
import { BRAND } from "@shared/brand.mjs";

export default function Footer() {
  return (
    <footer style={{
      padding: 18,
      borderTop: "1px solid rgba(0,0,0,.08)",
      background: "var(--gl-bg)"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div>
          <strong>{BRAND.name}</strong>
          <div style={{ opacity: 0.75 }}>{BRAND.tagline}</div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <a href="/legal/privacy">Privacy</a>
          <a href="/legal/terms">Terms</a>
          <a href="/legal/disclaimer">Disclaimer</a>
        </div>
      </div>
    </footer>
  );
}