import React from "react";
import LumiBrandAvatar, { type LumiEmotion } from "./LumiBrandAvatar";
import "./LumiPresenceLayer.css";

function emotionFromPath(pathname: string): LumiEmotion {
  const path = pathname.toLowerCase();
  if (path.includes("pricing") || path.includes("premium") || path.includes("billing") || path.includes("subscription")) return "celebrate";
  if (path.includes("safety") || path.includes("privacy") || path.includes("terms") || path.includes("crisis")) return "calm";
  if (path.includes("journal") || path.includes("mirror") || path.includes("reflect")) return "reflect";
  if (path.includes("tools") || path.includes("wellness") || path.includes("mood") || path.includes("check")) return "supportive";
  if (path.includes("admin")) return "guide";
  return "curious";
}

export default function LumiPresenceLayer() {
  const pathname = typeof window !== "undefined" ? window.location.pathname : "/";
  const emotion = emotionFromPath(pathname);

  return (
    <>
      <div className="lumi-ambient-scene" aria-hidden="true" data-testid="lumi-ambient-scene" />
      <aside className="lumi-presence-layer" aria-label="Lumi visual companion" data-testid="lumi-presence-layer">
        <LumiBrandAvatar emotion={emotion} size="md" />
        <p className="lumi-presence-caption">
          {emotion === "celebrate" ? "Lumi is cheering your next step." :
           emotion === "calm" ? "Lumi is keeping the space gentle." :
           emotion === "reflect" ? "Lumi is here while you reflect." :
           emotion === "guide" ? "Lumi is watching the system calmly." :
           "Lumi is here with you."}
        </p>
      </aside>
    </>
  );
}
