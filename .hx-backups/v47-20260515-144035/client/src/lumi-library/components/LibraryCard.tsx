/**
 * Phase 35 — Library card component (opt-in).
 *
 * No progress tracking, no completion %, no streaks. Inline styles
 * only — no design-token coupling so the card works in isolation.
 */

import * as React from "react";
import type { LibraryItem } from "../content/libraryCatalog";

export interface LibraryCardProps {
  readonly item: LibraryItem;
  readonly onDownload?: (item: LibraryItem) => void;
  readonly className?: string;
  readonly "data-testid"?: string;
}

const CARD_STYLE: React.CSSProperties = {
  background: "#FFFFFF",
  border: "1px solid #E5E5E0",
  borderRadius: "12px",
  padding: "20px",
  fontFamily: "system-ui, -apple-system, sans-serif",
  color: "#1A1A1A",
  lineHeight: 1.5,
};

const TITLE_STYLE: React.CSSProperties = {
  fontSize: "1.125rem",
  fontWeight: 600,
  marginBottom: "8px",
};

const BADGE_STYLE: React.CSSProperties = {
  display: "inline-block",
  fontSize: "0.75rem",
  fontWeight: 500,
  padding: "2px 8px",
  borderRadius: "6px",
  background: "#F0F4EF",
  color: "#3D5C3F",
  marginBottom: "8px",
  textTransform: "capitalize",
};

const DESCRIPTION_STYLE: React.CSSProperties = {
  fontSize: "0.95rem",
  color: "#4A4A4A",
  marginBottom: "12px",
};

const META_ROW_STYLE: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
  alignItems: "center",
  marginBottom: "12px",
  fontSize: "0.85rem",
  color: "#666666",
};

const TAG_STYLE: React.CSSProperties = {
  background: "#F5F5F0",
  padding: "2px 8px",
  borderRadius: "6px",
};

const BUTTON_STYLE: React.CSSProperties = {
  background: "#3D5C3F",
  color: "#FFFFFF",
  border: "none",
  padding: "8px 16px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: 500,
};

export const LibraryCard: React.FC<LibraryCardProps> = ({
  item,
  onDownload,
  className,
  "data-testid": dataTestId,
}) => {
  return (
    <article
      className={className}
      data-testid={dataTestId ?? `card-library-${item.id}`}
      style={CARD_STYLE}
    >
      <span style={BADGE_STYLE} data-testid={`badge-type-${item.id}`}>{item.type}</span>
      <h3 style={TITLE_STYLE} data-testid={`text-title-${item.id}`}>{item.title}</h3>
      <p style={DESCRIPTION_STYLE} data-testid={`text-description-${item.id}`}>{item.description}</p>
      <div style={META_ROW_STYLE}>
        {item.tags.map((tag) => (
          <span key={tag} style={TAG_STYLE} data-testid={`tag-${item.id}-${tag}`}>{tag}</span>
        ))}
        <span data-testid={`text-minutes-${item.id}`}>{item.estimatedMinutes} min read</span>
      </div>
      {item.downloadable && onDownload ? (
        <button
          type="button"
          onClick={() => onDownload(item)}
          style={BUTTON_STYLE}
          data-testid={`button-download-${item.id}`}
        >
          Download
        </button>
      ) : null}
    </article>
  );
};
