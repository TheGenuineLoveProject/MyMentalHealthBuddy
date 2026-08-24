import React from "react";
import { OfficialLumi, canRenderLumi } from "@/lumi-registry";
import "./LumiPresenceLayer.css";

const GLOBAL_VARIANT = "LUMI_FLOAT_IDLE" as const;

function normalizePath(pathname: string): string {
  const normalized = (pathname || "/").toLowerCase().replace(/\/+$/, "");
  return normalized || "/";
}

function isCrisisRoute(pathname: string): boolean {
  return normalizePath(pathname) === "/crisis";
}

function captionFromPath(pathname: string): string {
  const path = normalizePath(pathname);

  if (
    path.includes("pricing") ||
    path.includes("premium") ||
    path.includes("billing") ||
    path.includes("subscription")
  ) {
    return "Lumi is cheering your next step.";
  }

  if (
    path.includes("safety") ||
    path.includes("privacy") ||
    path.includes("terms")
  ) {
    return "Lumi is keeping the space gentle.";
  }

  if (
    path.includes("journal") ||
    path.includes("mirror") ||
    path.includes("reflect")
  ) {
    return "Lumi is here while you reflect.";
  }

  if (
    path.includes("tools") ||
    path.includes("wellness") ||
    path.includes("mood") ||
    path.includes("check")
  ) {
    return "Lumi is here with gentle support.";
  }

  if (path.includes("admin")) {
    return "Lumi is watching the system calmly.";
  }

  return "Lumi is here with you.";
}

export default function LumiPresenceLayer() {
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "/";

  /*
   * Constitutional safety boundary:
   *
   * The global presence layer is mounted outside App and therefore exists
   * independently of individual route components. Crisis must be resolved
   * through the canonical page-placement policy before ANY Lumi-specific
   * ambient scene or image is rendered.
   *
   * Passing crisis-support into canRenderLumi makes the canonical registry
   * the authority. Its forbidden assignment fails closed.
   */
  const pageId = isCrisisRoute(pathname)
    ? "crisis-support"
    : undefined;

  const policyDecision = canRenderLumi({
    pageId,
    variant: GLOBAL_VARIANT,
  });

  /*
   * Return before the ambient scene and aside.
   *
   * This is intentionally stronger than merely allowing OfficialLumi to
   * return its hidden policy-blocked placeholder because the canonical
   * crisis rule also prohibits decorative Lumi ambience and animations.
   */
  if (!policyDecision.allowed) {
    return null;
  }

  const caption = captionFromPath(pathname);

  return (
    <>
      <div
        className="lumi-ambient-scene"
        aria-hidden="true"
        data-testid="lumi-ambient-scene"
      />

      <aside
        className="lumi-presence-layer"
        aria-label="Lumi visual companion"
        data-testid="lumi-presence-layer"
      >
        <OfficialLumi
          variant={GLOBAL_VARIANT}
          scene="global-presence-runtime-idle"
          position="card"
          pageId={pageId}
          widthPx={132}
          decorative={false}
          motion="soft"
          data-testid="lumi-brand-avatar"
        />

        <p className="lumi-presence-caption">
          {caption}
        </p>
      </aside>
    </>
  );
}
