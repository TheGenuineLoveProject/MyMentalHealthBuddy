/**
 * Phase 28 — Scene-driven Lumi renderer.
 *
 * Auto-resolves the canonical variant for a given scene ID via
 * `getSceneAssignment`. Renders an inline error state (never throws)
 * when a scene isn't registered. Optional override for variant lets
 * hosts opt into a fallback consciously.
 */

import * as React from "react";
import { useMemo, useEffect, useState } from "react";

import { OfficialLumi, type OfficialLumiPosition } from "./OfficialLumi";
import {
  type LumiVariantId,
} from "../registry/officialLumiRegistry";
import {
  getSceneAssignment,
  validateSceneConfig,
} from "../registry/lumiSceneAssignments";
import { getLumiSceneMaster } from "../registry/lumiSceneMasters";
import { canRenderLumi } from "../registry/lumiPagePlacementMap";
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
  /**
   * Presentation is character-first by default.
   * "scene" opts into the governed full-scene media master when available.
   */
  readonly presentation?: "character" | "scene";
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
  presentation = "character",
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

  const sceneMaster = useMemo(
    () => resolved.variant ? getLumiSceneMaster(resolved.variant) : undefined,
    [resolved.variant],
  );

  const sceneDisplayWidth = assignment
    ? Math.min(resolved.sizePx, assignment.maxSizePx)
    : resolved.sizePx;

  const policyDecision = useMemo(
    () => resolved.variant
      ? canRenderLumi({ pageId, variant: resolved.variant })
      : null,
    [pageId, resolved.variant],
  );

  const [sceneAssetErrored, setSceneAssetErrored] = useState(false);

  useEffect(() => {
    setSceneAssetErrored(false);
  }, [sceneMaster?.pngSrc, sceneMaster?.webpSrc]);

  useEffect(() => {
    if (
      presentation === "scene" &&
      resolved.variant &&
      !sceneMaster &&
      onValidationError
    ) {
      onValidationError([
        `scene presentation requested for "${resolved.variant}" but no governed scene master exists; falling back to canonical character`,
      ]);
    }
  }, [presentation, resolved.variant, sceneMaster, onValidationError]);

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

  if (
    presentation === "scene" &&
    resolved.variant &&
    policyDecision &&
    !policyDecision.allowed
  ) {
    return (
      <div
        aria-hidden="true"
        data-testid={dataTestId ?? "lumi-policy-blocked"}
        data-variant={resolved.variant}
        data-scene={scene}
        data-page-id={pageId}
        data-policy-blocked="true"
        data-presentation="scene"
        style={{ display: "none" }}
      />
    );
  }

  if (
    presentation === "scene" &&
    resolved.variant &&
    sceneMaster &&
    !sceneAssetErrored
  ) {
    return (
      <div
        aria-hidden={sceneMaster.decorative}
        data-testid={dataTestId ?? `lumi-scene-${resolved.variant.toLowerCase()}`}
        data-variant={resolved.variant}
        data-scene={scene}
        data-position={resolved.position}
        data-presentation="scene"
        data-lumi-protected="true"
        data-reduced-motion={reducedMotion ? "true" : undefined}
        className={className}
        style={{
          width: sceneDisplayWidth,
          maxWidth: "100%",
          display: "block",
        }}
      >
        <picture>
          <source
            srcSet={sceneMaster.webpSrc}
            type="image/webp"
          />
          <img
            src={sceneMaster.pngSrc}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            draggable={false}
            width={sceneMaster.width}
            height={sceneMaster.height}
            style={{
              display: "block",
              width: "100%",
              height: "auto",
              objectFit: "cover",
              objectPosition: sceneMaster.objectPosition,
            }}
            onError={() => setSceneAssetErrored(true)}
          />
        </picture>
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
    </>
  );
};
