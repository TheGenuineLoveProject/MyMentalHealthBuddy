import { useCallback, useEffect, useRef, useState } from "react";

/**
 * useBuddyEmotion — pure mapping hook that turns app context into one of
 * Lumi's 10 emotion states. Designed to compose with <LumiMascot/> via:
 *
 *   const { emotion, celebrate, setEmotion } = useBuddyEmotion(context);
 *   <LumiMascot emotion={emotion} onEmote={celebrate} />
 *
 * Pure function logic — no chat surgery, no global side effects. Parents
 * pass in whatever signals they have (typing, lastMessageType, etc.) and
 * we produce a single canonical emotion.
 */

const VALID = new Set([
  "neutral", "listening", "empathy", "joy", "concern",
  "reflection", "celebration", "sleepy", "surprise", "comfort",
]);

export function deriveEmotion(ctx = {}) {
  if (ctx.crisisActive)        return "concern";
  if (ctx.celebrationTrigger)  return "celebration";
  if (ctx.calmModeActive ||
      ctx.breathingActive)     return "comfort";
  if (ctx.lastMessageType === "crisis")       return "concern";
  if (ctx.lastMessageType === "celebration")  return "celebration";
  if (ctx.lastMessageType === "comfort")      return "comfort";
  if (ctx.lastMessageType === "reflection")   return "reflection";
  if (ctx.lastMessageType === "joy")          return "joy";
  if (ctx.lastMessageType === "empathy")      return "empathy";
  if (ctx.lastMessageType === "surprise")     return "surprise";
  if (ctx.idleSeconds && ctx.idleSeconds > 90) return "sleepy";
  if (ctx.userTyping)          return "listening";
  if (ctx.assistantTyping)     return "listening";
  return "neutral";
}

export default function useBuddyEmotion(ctx = {}) {
  const derived = deriveEmotion(ctx);
  const [override, setOverride] = useState(null);
  const overrideTimer = useRef(null);

  // Clear any expired override timer when unmounting.
  useEffect(() => () => {
    if (overrideTimer.current) clearTimeout(overrideTimer.current);
  }, []);

  /**
   * celebrate — fires a brief celebration emotion that lasts `ms` ms then
   * snaps back to derived. Wires up nicely as <LumiMascot onEmote={celebrate}/>.
   */
  const celebrate = useCallback((nextEmotion = "celebration", ms = 1800) => {
    if (!VALID.has(nextEmotion)) nextEmotion = "celebration";
    setOverride(nextEmotion);
    if (overrideTimer.current) clearTimeout(overrideTimer.current);
    overrideTimer.current = setTimeout(() => setOverride(null), ms);
  }, []);

  /**
   * setEmotion — explicit override to a fixed emotion (no auto-clear).
   * Pass null to clear and resume context-derived emotion.
   */
  const setEmotion = useCallback((next) => {
    if (next == null) {
      if (overrideTimer.current) clearTimeout(overrideTimer.current);
      setOverride(null);
      return;
    }
    if (!VALID.has(next)) return;
    if (overrideTimer.current) clearTimeout(overrideTimer.current);
    setOverride(next);
  }, []);

  return {
    emotion: override || derived,
    derived,
    override,
    celebrate,
    setEmotion,
  };
}
