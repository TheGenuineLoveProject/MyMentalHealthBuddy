/**
 * Phase 28 — Canonical Lumi component.
 *
 * The ONLY way to render Lumi in the product. Validates variant +
 * placement against the canonical registry, enforces size limits,
 * shows a dev-only warning overlay on placement violations, and
 * never throws — UI must never crash on a misconfigured Lumi.
 *
 * platform-evolution-ignore: documentation-only <img> mention; rendered image element below has alt/aria handling.
 * v5.8.64 — flipped to `<img>`-only rendering (literal-spec delta on top
 * of v5.8.63). The SVG render branch and `renderMode="svg"` default are
 * removed. The `renderMode` prop is preserved at the type level for
 * backward source compatibility but is functionally a no-op — every render
 * goes through `AssetLumiBody`. The page-policy gate (`canRenderLumi`) is
 * unchanged and still enforces the crisis-support trust boundary.
 */

import * as React from "react";
import { useEffect, useMemo, useState } from "react";

import {
  type LumiVariantId,
  getVariant,
  isCanonicalVariant,
  validateVariantPlacement,
} from "../registry/officialLumiRegistry";
import { getMaxSizeForContext } from "../registry/lumiPlacementRules";
import { canRenderLumi } from "../registry/lumiPagePlacementMap";
import { isDevEnvironment } from "../internal/devGate";

export type OfficialLumiPosition = "hero" | "card" | "inline" | "background";

/**
 * v5.8.64 — `renderMode` is preserved as a type for source compatibility but
 * platform-evolution-ignore: documentation-only <img> mention; rendered image element below has alt/aria handling.
 * the SVG branch has been removed. Both values resolve to `<img>`-only render.
 */
export type OfficialLumiRenderMode = "svg" | "asset";

/** Phase 30 — motion intensity. */
export type OfficialLumiMotion = "soft" | "reduced" | "none";

export interface OfficialLumiProps {
  readonly variant: LumiVariantId;
  readonly scene: string;
  readonly position: OfficialLumiPosition;
  /** When provided, the page-placement policy gate enforces forbidden surfaces (e.g. crisis-support). */
  readonly pageId?: string;
  readonly widthPx?: number;
  readonly heightPx?: number;
  readonly isMobile?: boolean;
  readonly reducedMotion?: boolean;
  readonly decorative?: boolean;
  readonly className?: string;
  readonly onClick?: () => void;
  /** Fired (in any environment) when placement / size validation reports issues. */
  readonly onValidationIssue?: (issues: ReadonlyArray<string>) => void;
  /**
   * @deprecated v5.8.64 — `renderMode` is accepted for source compatibility
 * platform-evolution-ignore: documentation-only <img> mention; rendered image element below has alt/aria handling.
   * but is a runtime no-op. Every render now goes through the `<img>` path.
   * Passing `"svg"` will emit a dev-only console warning and resolve to the
   * asset path. Remove this prop from call sites; it will be deleted in a
   * future release.
   */
  readonly renderMode?: OfficialLumiRenderMode;
  /** Motion intensity. Default `soft`. */
  readonly motion?: OfficialLumiMotion;
  /** Invoked if the asset image fails to load. */
  readonly onError?: (src: string) => void;
  readonly "data-testid"?: string;
}

const isDev = isDevEnvironment;

/**
 * platform-evolution-ignore: documentation-only <img> mention; rendered image element below has alt/aria handling.
 * Asset render body. Owns the `<img>` 404-fallback state (lives in its
 * own component so the conditional `useState` call is unconditional —
 * the parent `OfficialLumi` may bail out before this body is reached).
 *
 * platform-evolution-ignore: documentation-only <img> mention; rendered image element below has alt/aria handling.
 * On image load failure: the broken `<img>` is replaced by an empty,
 * still-sized container so layout doesn't jump and no broken-image UI
 * is shown. Optional `onError` callback fires with the failed src so
 * hosts can surface a fallback path.
 */
const AssetLumiBody: React.FC<{
  variantData: ReturnType<typeof getVariant>;
  finalSize: number;
  heightPx?: number;
  ariaLabel: string | undefined;
  decorative: boolean;
  dataTestId: string;
  variant: LumiVariantId;
  scene: string;
  position: OfficialLumiPosition;
  reducedMotion: boolean;
  effectiveMotion: OfficialLumiMotion;
  className?: string;
  interactive: boolean;
  onClick?: () => void;
  onError?: (src: string) => void;
}> = ({
  variantData,
  finalSize,
  heightPx,
  ariaLabel,
  decorative,
  dataTestId,
  variant,
  scene,
  position,
  reducedMotion,
  effectiveMotion,
  className,
  interactive,
  onClick,
  onError,
}) => {
  const [errored, setErrored] = useState(false);
  // Reset 404 fallback when src changes so the new asset gets a fresh load attempt.
  useEffect(() => {
    setErrored(false);
  }, [variantData.src]);
  const classes = ["lumi-official", `lumi-motion-${effectiveMotion}`, interactive ? "lumi-interactive" : null, className]
    .filter(Boolean)
    .join(" ");
  return (
    <div
      role="img"
      aria-hidden={decorative}
      aria-label={ariaLabel}
      data-testid={dataTestId}
      data-variant={variant}
      data-scene={scene}
      data-position={position}
      data-lumi-protected="true"
      data-render-mode="asset"
      data-asset-errored={errored ? "true" : undefined}
      data-reduced-motion={reducedMotion ? "true" : undefined}
      className={classes}
      style={{ width: finalSize, height: heightPx, cursor: interactive ? "pointer" : undefined }}
      onClick={onClick}
    >
      {!errored ? (
        <img
          src={variantData.src}
          alt={ariaLabel ?? variantData.alt}
          loading="lazy"
          decoding="async"
          draggable={false}
          width={finalSize}
          height={heightPx}
          onError={() => {
            setErrored(true);
            if (isDev()) {
              // eslint-disable-next-line no-console
              console.warn(`[OfficialLumi] asset failed to load: ${variantData.src}`);
            }
            if (onError) onError(variantData.src);
          }}
        />
      ) : (
        <div
          aria-hidden="true"
          style={{ width: finalSize, height: heightPx ?? finalSize, display: "block" }}
        />
      )}
    </div>
  );
};

export const OfficialLumi: React.FC<OfficialLumiProps> = ({
  variant,
  scene,
  position,
  pageId,
  widthPx,
  heightPx,
  isMobile = false,
  reducedMotion = false,
  decorative = true,
  className,
  onClick,
  onValidationIssue,
  // renderMode prop accepted for source compatibility, ignored at runtime (v5.8.64 — img-only).
  renderMode,
  motion = "soft",
  onError,
  "data-testid": dataTestId,
}) => {
  const variantData = useMemo(() => {
    if (!isCanonicalVariant(variant)) return null;
    return getVariant(variant);
  }, [variant]);

  const cap = getMaxSizeForContext(position, isMobile);
  const variantCap = variantData?.sizeLimits?.[position === "background" ? "hero" : position] ?? cap;
  const requested = widthPx ?? variantCap;
  const finalSize = Math.min(requested, cap, variantCap);
  const sizeViolated = requested > Math.min(cap, variantCap);

  const policyDecision = useMemo(() => canRenderLumi({ pageId, variant }), [pageId, variant]);

  const validation = useMemo(() => {
    const issues: string[] = [];
    if (!isCanonicalVariant(variant)) {
      issues.push(`variant "${variant}" is not canonical`);
    }
    const placement = validateVariantPlacement(variant, scene);
    if (!placement.valid) issues.push(...placement.issues);
    if (sizeViolated) {
      issues.push(`size ${requested}px exceeds ceiling ${Math.min(cap, variantCap)}px (clamped to ${finalSize}px)`);
    }
    if (!policyDecision.allowed && policyDecision.reason) {
      issues.push(policyDecision.reason);
    }
    return { valid: issues.length === 0, issues };
  }, [variant, scene, sizeViolated, requested, cap, variantCap, finalSize, policyDecision]);

  // Always log + notify on validation issues, regardless of environment.
  React.useEffect(() => {
    if (validation.issues.length === 0) return;
    if (isDev()) {
      // eslint-disable-next-line no-console
      console.warn(`[OfficialLumi] placement issues for variant="${variant}" scene="${scene}":`, validation.issues);
    }
    if (onValidationIssue) onValidationIssue(validation.issues);
  }, [validation.issues, variant, scene, onValidationIssue]);

  // Trust boundary: page policy gate refuses render on forbidden surfaces
  // (crisis-support, etc.) regardless of host intent. All 17 page entries
  // remain authoritative — gate is the runtime enforcement of that map.
  if (!policyDecision.allowed) {
    return (
      <div
        aria-hidden="true"
        data-testid={dataTestId ?? "lumi-policy-blocked"}
        data-variant={variant}
        data-scene={scene}
        data-page-id={pageId}
        data-policy-blocked="true"
        style={{ display: "none" }}
      />
    );
  }

  if (!variantData) {
    return (
      <div
        role="img"
        aria-hidden={decorative}
        aria-label={decorative ? undefined : `Lumi (unknown variant: ${variant})`}
        data-testid={dataTestId ?? "lumi-fallback"}
        data-variant={variant}
        data-scene={scene}
        data-position={position}
        className={className}
        style={{ width: 0, height: 0, display: "inline-block" }}
      />
    );
  }

  // v5.8.64 — dev-only warning when a caller passes the deprecated `renderMode="svg"`
  // so the no-op semantics don't silently surprise anyone who expected the inline SVG.
  React.useEffect(() => {
    if (renderMode === "svg" && isDev()) {
      // eslint-disable-next-line no-console
      console.warn(
        `[OfficialLumi] renderMode="svg" is deprecated and a runtime no-op since v5.8.64; the canonical PNG asset is rendered instead. Remove the prop from this call site (variant="${variant}", scene="${scene}").`,
      );
    }
  }, [renderMode, variant, scene]);

  const ariaLabel = decorative ? undefined : variantData.name;
  const effectiveMotion: OfficialLumiMotion = reducedMotion ? "reduced" : motion;
  const interactive = typeof onClick === "function";

  return (
    <AssetLumiBody
      variantData={variantData}
      finalSize={finalSize}
      heightPx={heightPx}
      ariaLabel={ariaLabel}
      decorative={decorative}
      dataTestId={dataTestId ?? `lumi-${variant.toLowerCase()}`}
      variant={variant}
      scene={scene}
      position={position}
      reducedMotion={reducedMotion}
      effectiveMotion={effectiveMotion}
      className={className}
      interactive={interactive}
      onClick={onClick}
      onError={onError}
    />
  );
};
