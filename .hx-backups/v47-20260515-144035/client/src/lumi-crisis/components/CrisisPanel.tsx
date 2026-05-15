/**
 * Phase 34 — Crisis panel component (opt-in).
 *
 * Trust boundary: this surface MUST NEVER render Lumi or any decorative
 * element (governance Rule 1; placement-map enforces `crisis-support`
 * variant === null + assignment === forbidden). Inline styles only — no
 * design-token coupling so the panel works even if tokens fail to load.
 */

import * as React from "react";
import { CRISIS_RESOURCES, getPrimaryUSResource } from "../resources/crisisResources";

export interface CrisisPanelProps {
  readonly onClose?: () => void;
  readonly fullResourcesHref?: string;
  readonly className?: string;
  readonly "data-testid"?: string;
}

const CONTAINER_STYLE: React.CSSProperties = {
  background: "#FFFFFF",
  color: "#1A1A1A",
  padding: "24px",
  borderRadius: "12px",
  maxWidth: "560px",
  margin: "0 auto",
  fontFamily: "system-ui, -apple-system, sans-serif",
  lineHeight: 1.5,
};

const HEADING_STYLE: React.CSSProperties = {
  fontSize: "1.5rem",
  fontWeight: 600,
  marginBottom: "16px",
  color: "#1A1A1A",
};

const PRIMARY_CTA_STYLE: React.CSSProperties = {
  display: "block",
  width: "100%",
  padding: "16px 24px",
  fontSize: "1.25rem",
  fontWeight: 600,
  color: "#FFFFFF",
  background: "#1B5E20",
  border: "none",
  borderRadius: "8px",
  textAlign: "center",
  textDecoration: "none",
  marginBottom: "12px",
  minHeight: "56px",
};

const SECONDARY_CTA_STYLE: React.CSSProperties = {
  display: "block",
  width: "100%",
  padding: "12px 16px",
  fontSize: "1rem",
  fontWeight: 500,
  color: "#1A1A1A",
  background: "#F5F5F5",
  border: "1px solid #1A1A1A",
  borderRadius: "8px",
  textAlign: "center",
  textDecoration: "none",
  marginBottom: "16px",
};

const NOTE_STYLE: React.CSSProperties = {
  fontSize: "0.95rem",
  color: "#444444",
  marginBottom: "16px",
};

export const CrisisPanel: React.FC<CrisisPanelProps> = ({
  onClose,
  fullResourcesHref,
  className,
  "data-testid": dataTestId,
}) => {
  const primary = getPrimaryUSResource();
  const text = CRISIS_RESOURCES.us[1];
  return (
    <div
      role="region"
      aria-label="Crisis support resources"
      data-testid={dataTestId ?? "crisis-panel"}
      data-crisis-panel="true"
      className={className}
      style={CONTAINER_STYLE}
    >
      <h2 style={HEADING_STYLE}>You are not alone.</h2>
      <a
        href={`tel:${primary.phone}`}
        style={PRIMARY_CTA_STYLE}
        data-testid="link-call-988"
      >
        Call {primary.phone} — {primary.name}
      </a>
      {text ? (
        <a
          href="sms:741741?body=HOME"
          style={SECONDARY_CTA_STYLE}
          data-testid="link-text-crisis"
        >
          Text {text.text}
        </a>
      ) : null}
      <p style={NOTE_STYLE}>
        These resources are available 24/7, free, and confidential.
      </p>
      {fullResourcesHref ? (
        <a
          href={fullResourcesHref}
          style={{ color: "#1B5E20", textDecoration: "underline" }}
          data-testid="link-full-resources"
        >
          See all crisis resources, including international.
        </a>
      ) : null}
      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          data-testid="button-close-crisis-panel"
          style={{
            marginTop: "16px",
            background: "transparent",
            color: "#1A1A1A",
            border: "1px solid #CCCCCC",
            padding: "8px 16px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Close
        </button>
      ) : null}
    </div>
  );
};
