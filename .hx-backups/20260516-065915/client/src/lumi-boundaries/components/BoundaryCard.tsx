/**
 * Phase 24 — BoundaryCard
 *
 * Single boundary card with expandable details. Design-system tokens only.
 */

import { useState } from "react";
import { MMHBCard, MMHBButton, colors, spacing, typography } from "@/design-system";
import type { BoundaryCopyCard } from "../content/boundaryCopy";

export interface BoundaryCardProps {
  readonly card: BoundaryCopyCard;
  readonly defaultExpanded?: boolean;
  readonly className?: string;
}

export function BoundaryCard({ card, defaultExpanded = false, className }: BoundaryCardProps) {
  const [expanded, setExpanded] = useState<boolean>(!!defaultExpanded);
  return (
    <MMHBCard
      elevation="resting"
      className={className}
      data-testid={`boundary-card-${card.type}`}
    >
      <div style={{ padding: spacing.md }}>
        <p
          style={{
            fontFamily: typography.fonts.heading,
            color: colors.semantic.fgHeading,
            margin: 0,
            marginBottom: spacing.xs,
          }}
        >
          {card.name}
        </p>
        <p
          style={{
            fontFamily: typography.fonts.body,
            color: colors.semantic.fgBody,
            margin: 0,
            marginBottom: spacing.sm,
          }}
        >
          {card.description}
        </p>

        {expanded ? (
          <div style={{ display: "flex", flexDirection: "column", gap: spacing.sm }}>
            <div>
              <p
                style={{
                  fontFamily: typography.fonts.heading,
                  color: colors.semantic.fgHeading,
                  margin: 0,
                  marginBottom: spacing.xs,
                  fontSize: "0.95em",
                }}
              >
                What Lumi does
              </p>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: spacing.md,
                  color: colors.semantic.fgBody,
                  fontFamily: typography.fonts.body,
                }}
              >
                {card.does.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
            <div>
              <p
                style={{
                  fontFamily: typography.fonts.heading,
                  color: colors.semantic.fgHeading,
                  margin: 0,
                  marginBottom: spacing.xs,
                  fontSize: "0.95em",
                }}
              >
                What Lumi does not do
              </p>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: spacing.md,
                  color: colors.semantic.fgMuted,
                  fontFamily: typography.fonts.body,
                }}
              >
                {card.doesNot.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
            <MMHBButton
              variant="tertiary"
              size="sm"
              onClick={() => setExpanded(false)}
              data-testid={`boundary-card-collapse-${card.type}`}
            >
              Hide details
            </MMHBButton>
          </div>
        ) : (
          <MMHBButton
            variant="tertiary"
            size="sm"
            onClick={() => setExpanded(true)}
            data-testid={`boundary-card-expand-${card.type}`}
          >
            Show details
          </MMHBButton>
        )}
      </div>
    </MMHBCard>
  );
}
