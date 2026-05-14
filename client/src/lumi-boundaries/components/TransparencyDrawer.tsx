/**
 * Phase 24 — TransparencyDrawer
 *
 * Slide-out drawer showing all 4 boundaries with full copy. Closes via
 * backdrop click, Escape key, or explicit Close button.
 */

import { useEffect } from "react";
import { MMHBButton, colors, spacing, typography, radius } from "@/design-system";
import { BoundaryCard } from "./BoundaryCard";
import { listBoundaryCopy } from "../content/boundaryCopy";

export interface TransparencyDrawerProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly className?: string;
}

export function TransparencyDrawer({ open, onClose, className }: TransparencyDrawerProps) {
  useEffect(() => {
    if (!open || typeof window === "undefined") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  const cards = listBoundaryCopy();

  return (
    <div
      className={className}
      data-testid="transparency-drawer"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <div
        onClick={onClose}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(22, 58, 54, 0.32)",
        }}
      />
      <aside
        role="dialog"
        aria-label="What Lumi does and does not do"
        style={{
          position: "relative",
          width: "min(100vw, 480px)",
          height: "100%",
          background: "rgba(255, 255, 255, 0.98)",
          padding: spacing.lg,
          overflowY: "auto",
          boxShadow: `-4px 0 24px rgba(22, 58, 54, 0.18)`,
          borderTopLeftRadius: radius.md,
          borderBottomLeftRadius: radius.md,
          display: "flex",
          flexDirection: "column",
          gap: spacing.md,
        }}
      >
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <h2
            style={{
              fontFamily: typography.fonts.heading,
              color: colors.semantic.fgHeading,
              margin: 0,
            }}
          >
            What Lumi is — and isn't
          </h2>
          <MMHBButton
            variant="tertiary"
            size="sm"
            onClick={onClose}
            data-testid="transparency-drawer-close"
          >
            Close
          </MMHBButton>
        </header>
        <p
          style={{
            fontFamily: typography.fonts.body,
            color: colors.semantic.fgBody,
            margin: 0,
          }}
        >
          Lumi is a companion, not a person. These are the lines Lumi keeps,
          so you always know what you're talking with.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: spacing.sm }}>
          {cards.map((card) => (
            <BoundaryCard key={card.type} card={card} />
          ))}
        </div>
        <p
          style={{
            fontFamily: typography.fonts.body,
            color: colors.semantic.fgMuted,
            margin: 0,
            marginTop: spacing.sm,
          }}
        >
          If something feels heavy or unsafe, you can always reach{" "}
          <a
            href="/crisis"
            style={{ color: colors.semantic.accentSecondary, textDecoration: "underline" }}
            data-testid="transparency-drawer-crisis-link"
          >
            /crisis
          </a>
          .
        </p>
      </aside>
    </div>
  );
}
