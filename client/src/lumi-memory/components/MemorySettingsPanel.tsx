/**
 * Phase 16 — Reflective Memory Layer
 *
 * Settings panel — see/edit current memory. All edits routed through
 * `memoryRouter.writeMemory()` so the audit pipeline + forbidden scan
 * always run.
 */

import { useMemo } from "react";
import { MMHBCard, MMHBButton, colors, spacing, typography, radius } from "@/design-system";
import {
  useMemoryConsent,
  useMemoryLiveEntries,
} from "../runtime/memoryHooks";
import {
  setConsent,
  writeMemory,
} from "../runtime/memoryRouter";
import {
  ALLOWED_MEMORY_FIELDS,
  type AllowedMemoryField,
} from "../state/allowedMemoryFields";
import { needsReconsent } from "../safety/memoryConsentRules";
import { MemoryResetButton } from "./MemoryResetButton";

export type MemorySettingsPanelProps = {
  onChange?: () => void;
};

const TONE_OPTIONS: ReadonlyArray<"warm" | "neutral" | "minimal"> = ["warm", "neutral", "minimal"];
const PACE_OPTIONS: ReadonlyArray<"slow" | "medium" | "flexible"> = ["slow", "medium", "flexible"];

export function MemorySettingsPanel({ onChange }: MemorySettingsPanelProps) {
  const consent = useMemoryStore(selectConsent);
  const entries = useMemoryStore(selectLiveEntries);

  const styles = useMemo(() => ({
    section: { padding: spacing.md, fontFamily: typography.fonts.body, color: colors.semantic.fgBody } as const,
    h: { fontFamily: typography.fonts.heading, fontSize: typography.heading.h3.size, color: colors.semantic.fgHeading, margin: 0, marginBottom: spacing.sm } as const,
    row: { display: "flex", flexDirection: "column", gap: spacing.xs, padding: `${spacing.sm} 0`, borderBottom: `1px solid ${colors.semantic.borderSubtle}` } as const,
    label: { color: colors.semantic.fgMuted, fontSize: typography.body.sm.size } as const,
    btnRow: { display: "flex", gap: spacing.xs, flexWrap: "wrap" } as const,
    note: { color: colors.semantic.fgMuted, fontSize: typography.body.xs.size, marginTop: spacing.xs } as const,
    callout: { padding: spacing.sm, borderRadius: radius.md, background: colors.semantic.stateHoverWash, color: colors.semantic.fgBody, marginBottom: spacing.sm, fontSize: typography.body.sm.size } as const,
  }), []);

  const reconsentNeeded = needsReconsent(consent);

  function handleConsent(next: "granted" | "declined" | "revoked") {
    setConsent(next);
    onChange?.();
  }

  function handleTone(t: typeof TONE_OPTIONS[number]) {
    writeMemory("preferredGreetingTone", t);
    onChange?.();
  }

  function handlePace(p: typeof PACE_OPTIONS[number]) {
    writeMemory("preferredPacing", p);
    onChange?.();
  }

  return (
    <MMHBCard elevation="elevated" data-testid="panel-memory-settings">
      <section style={styles.section} aria-labelledby="memory-settings-h">
        <h3 id="memory-settings-h" style={styles.h}>
          Memory settings
        </h3>

        {reconsentNeeded ? (
          <div style={styles.callout} data-testid="callout-memory-reconsent">
            Our memory policy was updated. Please re-confirm your choice below.
          </div>
        ) : null}

        <div style={styles.row}>
          <span style={styles.label}>Consent (current: {consent.state})</span>
          <div style={styles.btnRow}>
            <MMHBButton variant="primary" size="sm" onClick={() => handleConsent("granted")} data-testid="button-memory-consent-grant">
              Allow gentle memory
            </MMHBButton>
            <MMHBButton variant="tertiary" size="sm" onClick={() => handleConsent("declined")} data-testid="button-memory-consent-decline">
              No thanks
            </MMHBButton>
            {consent.state === "granted" ? (
              <MMHBButton variant="tertiary" size="sm" onClick={() => handleConsent("revoked")} data-testid="button-memory-consent-revoke">
                Stop remembering
              </MMHBButton>
            ) : null}
          </div>
          <p style={styles.note}>
            Lumi only remembers gentle preferences (pacing, greeting tone, UI). Never feelings, never vulnerability, never crisis history.
          </p>
        </div>

        <div style={styles.row}>
          <span style={styles.label}>Greeting tone (current: {entries.preferredGreetingTone?.value ?? "—"})</span>
          <div style={styles.btnRow}>
            {TONE_OPTIONS.map((t) => (
              <MMHBButton key={t} variant="secondary" size="sm" onClick={() => handleTone(t)} data-testid={`button-memory-tone-${t}`}>
                {t}
              </MMHBButton>
            ))}
          </div>
        </div>

        <div style={styles.row}>
          <span style={styles.label}>Pacing (current: {entries.preferredPacing?.value ?? "—"})</span>
          <div style={styles.btnRow}>
            {PACE_OPTIONS.map((p) => (
              <MMHBButton key={p} variant="secondary" size="sm" onClick={() => handlePace(p)} data-testid={`button-memory-pace-${p}`}>
                {p}
              </MMHBButton>
            ))}
          </div>
        </div>

        <div style={{ marginTop: spacing.md }}>
          <MemoryResetButton onReset={onChange} />
        </div>

        <p style={styles.note}>
          Showing {Object.values(entries).filter(Boolean).length} of {ALLOWED_MEMORY_FIELDS.length} memory fields. Open the transparency view to see everything.
        </p>
      </section>
    </MMHBCard>
  );
}
