/**
 * Phase 16 — Reflective Memory Layer
 *
 * Full visibility view: shows EVERY live memory entry plus the audit log.
 * Read-only; no edits here. Pair with MemorySettingsPanel for editing.
 */

import { useMemo } from "react";
import { MMHBCard, colors, spacing, typography, radius } from "@/design-system";
import {
  useMemoryAudit,
  useMemoryConsent,
  useMemoryLiveEntries,
} from "../runtime/memoryHooks";
import { RETENTION_DAYS } from "../safety/memoryRetentionRules";
import type { AllowedMemoryField } from "../state/allowedMemoryFields";

export type MemoryTransparencyViewProps = {
  /** Optional override (test injection). Defaults to Date.now(). */
  nowMs?: number;
};

export function MemoryTransparencyView({ nowMs }: MemoryTransparencyViewProps) {
  const now = nowMs ?? Date.now();
  const consent = useMemoryConsent();
  const entries = useMemoryLiveEntries(now);
  const audit = useMemoryAudit();

  const liveRows = useMemo(() => {
    return Object.entries(entries)
      .filter(([, e]) => e !== undefined)
      .map(([field, e]) => {
        const expiresInDays = Math.max(
          0,
          Math.ceil(((e!.expiresAtMs - now) / (24 * 60 * 60 * 1000))),
        );
        return {
          field: field as AllowedMemoryField,
          value: JSON.stringify(e!.value),
          retentionDays: RETENTION_DAYS[field as AllowedMemoryField],
          expiresInDays,
        };
      });
  }, [entries, now]);

  const styles = {
    section: { padding: spacing.md, fontFamily: typography.fonts.body, color: colors.semantic.fgBody } as const,
    h: { fontFamily: typography.fonts.heading, fontSize: typography.heading.h3.size, color: colors.semantic.fgHeading, margin: 0, marginBottom: spacing.sm } as const,
    row: { display: "flex", justifyContent: "space-between", gap: spacing.sm, padding: `${spacing.xs} 0`, borderBottom: `1px solid ${colors.semantic.borderSubtle}` } as const,
    label: { color: colors.semantic.fgMuted, fontSize: typography.body.sm.size } as const,
    val: { color: colors.semantic.fgBody, fontSize: typography.body.sm.size, textAlign: "right" } as const,
    note: { color: colors.semantic.fgMuted, fontSize: typography.body.xs.size, marginTop: spacing.xs } as const,
    auditList: { listStyle: "none", padding: 0, margin: 0, maxHeight: "240px", overflowY: "auto", borderRadius: radius.md } as const,
    auditItem: { padding: `${spacing.xs} 0`, fontSize: typography.body.xs.size, color: colors.semantic.fgMuted, borderBottom: `1px solid ${colors.semantic.borderSubtle}` } as const,
  };

  return (
    <MMHBCard elevation="resting" data-testid="view-memory-transparency">
      <section style={styles.section} aria-labelledby="memory-transparency-h">
        <h3 id="memory-transparency-h" style={styles.h}>
          What Lumi remembers
        </h3>
        <p style={styles.note}>
          Memory is opt-in and editable. Nothing about feelings, vulnerabilities, or crisis history is stored.
        </p>

        <div style={{ marginTop: spacing.md }}>
          <div style={styles.row}>
            <span style={styles.label}>Consent</span>
            <span style={styles.val} data-testid="text-memory-consent-state">{consent.state}</span>
          </div>
          {liveRows.length === 0 ? (
            <p style={styles.note} data-testid="text-memory-empty">Nothing remembered right now.</p>
          ) : (
            liveRows.map((r) => (
              <div key={r.field} style={styles.row} data-testid={`row-memory-${r.field}`}>
                <span style={styles.label}>{r.field}</span>
                <span style={styles.val}>
                  {r.value} · expires in ~{r.expiresInDays}d (max {r.retentionDays}d)
                </span>
              </div>
            ))
          )}
        </div>

        <div style={{ marginTop: spacing.md }}>
          <h4 style={{ ...styles.h, fontSize: typography.heading.h4.size }}>Recent activity</h4>
          {audit.length === 0 ? (
            <p style={styles.note} data-testid="text-memory-audit-empty">No activity yet.</p>
          ) : (
            <ul style={styles.auditList} data-testid="list-memory-audit">
              {audit.slice().reverse().slice(0, 50).map((a) => (
                <li key={a.id} style={styles.auditItem}>
                  {new Date(a.atMs).toLocaleString()} · {a.kind}
                  {a.field ? ` · ${a.field}` : ""}
                  {a.reasonHint ? ` · ${a.reasonHint}` : ""}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </MMHBCard>
  );
}
