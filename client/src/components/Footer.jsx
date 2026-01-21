import { DISCLAIMERS_COPY } from "../copy/disclaimers";
import { BRAND } from "@shared/brand.mjs";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer style={{
      padding: 18,
      borderTop: "1px solid rgba(0,0,0,.08)",
      background: "var(--gl-bg)"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img 
            src="/brand/logo-mark.png" 
            alt={BRAND.name} 
            style={{ width: 36, height: 36, objectFit: "contain" }}
          />
          <div>
            <strong>{BRAND.name}</strong>
            <div style={{ opacity: 0.75 }}>{BRAND.tagline}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/disclaimer">Disclaimer</Link>
        </div>
      </div>
    </footer>
  );
}
