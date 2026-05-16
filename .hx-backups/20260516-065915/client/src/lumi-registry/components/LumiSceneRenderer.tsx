/**
 * Phase 28 — Scene-driven Lumi renderer.
 *
 * Auto-resolves the canonical variant for a given scene ID via
 * `getSceneAssignment`. Renders an inline error state (never throws)
 * when a scene isn't registered. Optional override for variant lets
 * hosts opt into a fallback consciously.
 */

import * as React from "react";
import { useMemo, useEffect } from "react";

import { OfficialLumi, type OfficialLumiPosition } from "./OfficialLumi";
import {
  type LumiVariantId,
} from "../registry/officialLumiRegistry";
import {
  getSceneAssignment,
  validateSceneConfig,
} from "../registry/lumiSceneAssignments";
import { isDevEnvironment } from "../internal/devGate";

export interface LumiSceneRendererProps {
  readonly scene: string;
  /**
   * Fallback override. The scene assignment is authoritative — only
   * accepted when it exactly equals `assignment.fallback`. Any other
   * value is ignored (with a validation issue surfaced via callback).
   */
  readonly variantOverride?: LumiVariantId;
  /** When provided, page-placement policy is enforced via `OfficialLumi`. */
  readonly pageId?: string;
  readonly widthPx?: number;
  readonly isMobile?: boolean;
  readonly reducedMotion?: boolean;
  readonly className?: string;
  readonly onValidationError?: (issues: ReadonlyArray<string>) => void;
  readonly "data-testid"?: string;
}

const isDev = isDevEnvironment;

export const LumiSceneRenderer: React.FC<LumiSceneRendererProps> = ({
  scene,
  variantOverride,
  pageId,
  widthPx,
  isMobile = false,
  reducedMotion = false,
  className,
  onValidationError,
  "data-testid": dataTestId,
}) => {
  const assignment = useMemo(() => getSceneAssignment(scene), [scene]);

  const resolved = useMemo(() => {
    if (!assignment) {
      return {
        variant: null as LumiVariantId | null,
        position: "inline" as OfficialLumiPosition,
        sizePx: widthPx ?? 0,
        issues: [`scene "${scene}" is not registered`],
      };
    }
    // Trust boundary: scene assignment is authoritative. The override is
    // only accepted when it exactly matches the declared fallback —
    // anything else is ignored (architect finding #1).
    const overrideIssues: string[] = [];
    let v: LumiVariantId = assignment.variant;
    if (variantOverride !== undefined) {
      if (variantOverride === assignment.variant) {
        v = variantOverride;
      } else if (assignment.fallback && variantOverride === assignment.fallback) {
        v = variantOverride;
      } else {
        overrideIssues.push(
          `variantOverride "${variantOverride}" rejected — scene "${scene}" only allows variant "${assignment.variant}"${assignment.fallback ? ` or fallback "${assignment.fallback}"` : ""}`,
        );
      }
    }
    const sizePx = widthPx ?? assignment.maxSizePx;
    const validation = validateSceneConfig(scene, v, sizePx);
    const position: OfficialLumiPosition = assignment.position === "background" ? "background" : assignment.position;
    return { variant: v, position, sizePx, issues: [...overrideIssues, ...validation.issues] };
  }, [assignment, scene, variantOverride, widthPx]);

  useEffect(() => {
    if (resolved.issues.length > 0 && onValidationError) {
      onValidationError(resolved.issues);
    }
  }, [resolved.issues, onValidationError]);

  if (!assignment || resolved.variant === null) {
    if (isDev()) {
      // eslint-disable-next-line no-console
      console.warn(`[LumiSceneRenderer] No assignment for scene "${scene}". Rendering inline error state.`);
    }
    return (
      <div
        data-testid={dataTestId ?? "lumi-scene-error"}
        data-scene={scene}
        className={className}
        style={{
          display: "inline-block",
          padding: isDev() ? "4px 8px" : 0,
          fontSize: 11,
          color: isDev() ? "#dc2626" : "transparent",
          fontFamily: "system-ui, sans-serif",
          border: isDev() ? "1px dashed #dc2626" : "none",
          borderRadius: 4,
        }}
      >
        {isDev() ? `Lumi: unassigned scene "${scene}"` : null}
      </div>
    );
  }

  return (
    <>
      <OfficialLumi
        variant={resolved.variant}
        scene={scene}
        pageId={pageId}
        position={resolved.position}
        widthPx={resolved.sizePx}
        isMobile={isMobile}
        reducedMotion={reducedMotion}
        decorative
        className={className}
        data-testid={dataTestId}
      />
      {isDev() && resolved.issues.length > 0 && (
        <div
          aria-hidden="true"
          data-testid="lumi-scene-warning"
          style={{
            display: "block",
            marginTop: 4,
            padding: "2px 6px",
            fontSize: 10,
            background: "rgba(220, 38, 38, 0.9)",
            color: "white",
            borderRadius: 4,
            fontFamily: "system-ui, sans-serif",
            maxWidth: 240,
          }}
        >
          {resolved.issues.join(" · ")}
        </div>
      )}
    </>
  );
};
