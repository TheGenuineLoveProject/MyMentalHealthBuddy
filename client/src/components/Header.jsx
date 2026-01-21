import React from "react";
import { BRAND } from "@shared/brand.mjs";

export default function Header() {
  return (
    <header style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "14px 18px", borderBottom: "1px solid rgba(0,0,0,.08)",
      background: "var(--gl-bg)"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <img src="/brand/logo.svg" alt={BRAND.name} style={{ height: 28 }} />
        <strong style={{ color: "var(--gl-text)" }}>{BRAND.name}</strong>
      </div>

      <nav style={{ display: "flex", gap: 12 }}>
        <a href="/" style={{ color: "var(--gl-text)" }}>Home</a>
        <a href="/dashboard" style={{ color: "var(--gl-text)" }}>Dashboard</a>
        <a href="/settings" style={{ color: "var(--gl-text)" }}>Settings</a>
      </nav>
    </header>
  );
}