/**
 * Phase 28 — Canonical Lumi component.
 *
 * The ONLY way to render Lumi in the product. Validates variant +
 * placement against the canonical registry, enforces size limits,
 * shows a dev-only warning overlay on placement violations, and
 * never throws — UI must never crash on a misconfigured Lumi.
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

/** Phase 30 — render mode. `svg` keeps v5.8.62 behavior (default, no break). `asset` switches to the canonical PNG via `/lumi/official/`. */
export type OfficialLumiRenderMode = "svg" | "asset";

/** Phase 30 — motion intensity for asset render mode. */
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
  /** Phase 30 — render mode. Defaults to `svg` to preserve v5.8.62 behavior. */
  readonly renderMode?: OfficialLumiRenderMode;
  /** Phase 30 — motion intensity (asset mode only). Default `soft`. */
  readonly motion?: OfficialLumiMotion;
  /** Phase 30 — invoked if the asset image fails to load (asset mode only). */
  readonly onError?: (src: string) => void;
  readonly "data-testid"?: string;
}

const isDev = isDevEnvironment;

/**
 * Phase 30 — asset render body. Owns the `<img>` 404-fallback state
 * (must live in its own component so the conditional `useState` call is
 * unconditional — the parent `OfficialLumi` may bail out before the
 * asset branch is reached).
 *
 * On image load failure: the broken `<img>` is replaced by an empty,
 * still-sized container so layout doesn't jump and no broken-image UI
 * is shown. Optional `onError` callback fires with the failed src so
 * hosts can surface a fallback (e.g. swap to `renderMode="svg"`).
 */
const AssetLumiBody: React.FC<{
  variantData: ReturnType<typeof getVariant>;
  finalSize: number;
  heightPx?: number;
  ariaLabel: string;
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
  // Phase 30 — reset 404 fallback when src changes so the new asset gets a fresh load attempt.
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

const BODY_COLOR = "#FFF5F0";
const BELLY_COLOR = "#B0D0B3";
const SPROUT_COLOR = "#81C784";
const EYE_COLOR = "#5C6B5D";
const SMILE_COLOR = "#5C6B5D";

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
  renderMode = "svg",
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

  // Always log + notify on validation issues, regardless of environment —
  // dev-only logging swallowed real problems silently (architect finding #5).
  React.useEffect(() => {
    if (validation.issues.length === 0) return;
    if (isDev()) {
      // eslint-disable-next-line no-console
      console.warn(`[OfficialLumi] placement issues for variant="${variant}" scene="${scene}":`, validation.issues);
    }
    if (onValidationIssue) onValidationIssue(validation.issues);
  }, [validation.issues, variant, scene, onValidationIssue]);

  // Trust boundary: page policy gate refuses render on forbidden surfaces
  // (crisis-support, etc.) regardless of host intent (architect finding #2).
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

  const ariaLabel = decorative ? undefined : variantData.name;

  const containerStyle: React.CSSProperties = {
    width: finalSize,
    height: finalSize,
    display: "inline-block",
    position: "relative",
    cursor: onClick ? "pointer" : undefined,
  };

  const glowStyle: React.CSSProperties = {
    position: "absolute",
    inset: -finalSize * 0.15,
    borderRadius: "50%",
    background: `radial-gradient(circle, ${variantData.glowColor} 0%, transparent 70%)`,
    pointerEvents: "none",
  };

  const showDevWarning = isDev() && (!validation.valid || sizeViolated);

  // Phase 30 — asset render path. Renders the canonical PNG from
  // `variant.src` with CSS-driven motion classes. SSR-safe (no DOM
  // measurement). Glow is suppressed in asset mode — drop-shadow on
  // `.hero-lumi` covers the intended visual treatment.
  if (renderMode === "asset") {
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
  }

  return (
    <div
      role="img"
      aria-hidden={decorative}
      aria-label={ariaLabel}
      data-testid={dataTestId ?? `lumi-${variant.toLowerCase()}`}
      data-variant={variant}
      data-scene={scene}
      data-position={position}
      data-lumi-protected="true"
      data-render-mode="svg"
      data-reduced-motion={reducedMotion ? "true" : undefined}
      className={className}
      style={containerStyle}
      onClick={onClick}
    >
      <div aria-hidden="true" style={glowStyle} />
      <svg
        viewBox="0 0 100 110"
        width={finalSize}
        height={finalSize}
        style={{ display: "block", position: "relative", zIndex: 1 }}
        aria-hidden="true"
      >
        {/* Sprout — required identity feature */}
        <ellipse cx="50" cy="14" rx="3" ry="6" fill={SPROUT_COLOR} />
        <ellipse cx="46" cy="11" rx="3.5" ry="2.5" fill={SPROUT_COLOR} transform="rotate(-30 46 11)" />
        <ellipse cx="54" cy="11" rx="3.5" ry="2.5" fill={SPROUT_COLOR} transform="rotate(30 54 11)" />
        {/* Body — egg / bean silhouette */}
        <ellipse cx="50" cy="62" rx="32" ry="38" fill={BODY_COLOR} />
        {/* Belly */}
        <ellipse cx="50" cy="74" rx="20" ry="22" fill={BELLY_COLOR} opacity={0.85} />
        {/* Eyes */}
        <ellipse cx="40" cy="56" rx="2.4" ry="3" fill={EYE_COLOR} />
        <ellipse cx="60" cy="56" rx="2.4" ry="3" fill={EYE_COLOR} />
        {/* Subtle smile */}
        <path d="M 43 68 Q 50 72 57 68" stroke={SMILE_COLOR} strokeWidth="1.3" fill="none" strokeLinecap="round" />
      </svg>
      {showDevWarning && (
        <div
          style={{
            position: "absolute",
            top: -4,
            left: -4,
            right: -4,
            bottom: -4,
            border: "2px dashed rgba(220, 38, 38, 0.85)",
            borderRadius: 8,
            pointerEvents: "none",
            zIndex: 2,
          }}
          data-testid="lumi-dev-warning"
        >
          <div
            style={{
              position: "absolute",
              top: -22,
              left: 0,
              fontSize: 10,
              padding: "2px 6px",
              background: "rgba(220, 38, 38, 0.9)",
              color: "white",
              borderRadius: 4,
              whiteSpace: "nowrap",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            Lumi placement violation — see console
          </div>
        </div>
      )}
    </div>
  );
};
