import React from "react";
import { brand } from "../brand/tokens";

export default function BrandHero() {
  return (
    <div className="container" style={{ padding: "42px 0 26px" }}>
      <div className="glass" style={{ padding: 26 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <img
            src={brand.assets.logoMark}
            alt={brand.name}
            style={{ width: 56, height: 56, borderRadius: 12 }}
          />
          <div style={{ flex: 1, minWidth: 220 }}>
            <div className="badge">AI-Powered Mental Wellness Platform</div>
            <h1 style={{ margin: "12px 0 6px", fontSize: 44, lineHeight: 1.05 }}>
              Your Safe Space for Mental Wellness
            </h1>
            <div style={{ fontSize: 16, opacity: 0.85, maxWidth: 760 }}>
              Track your mood, journal your thoughts, and connect with an AI companion that truly listens — available
              24/7, private by design.
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <a className="btn" href="/login">Sign In →</a>
            <a className="btn secondary" href="/api/login">Create Account</a>
          </div>
        </div>

        <div style={{ marginTop: 18, display: "flex", gap: 14, flexWrap: "wrap", opacity: 0.9 }}>
          <div>✅ Mood tracking</div>
          <div>✅ Journaling</div>
          <div>✅ AI support</div>
          <div>✅ Crisis resources</div>
        </div>
      </div>
    </div>
  );
}