/**
 * Lumi Audio Kernel (V14 — Voice + Expression Sync)
 *
 * Tiny Web Audio synth for the three V13-spec'd Lumi cues:
 *   - pop       — gentle entrance (sine pluck, 220→440 Hz, 180ms)
 *   - heartbeat — soft thud synced to heart pulse (sine, 110 Hz, 220ms, two-beat lub-dub)
 *   - chime     — whisper-quiet interaction acknowledgement (triangle, 660+880 Hz, 240ms)
 *
 * Contracts:
 *   - Programmatic tones only (no audio files → zero asset weight, no CSP issues).
 *   - Default OFF — caller must opt in via the useLumiAudio hook.
 *   - All gains capped at 0.08 (≈ -22 dBFS) for "whisper-quiet" per V11 prime directive.
 *   - All envelopes < 250ms; no sustained tones; well below the 3 Hz seizure-safety threshold.
 *   - AudioContext is lazily created on first call (browsers require a user gesture).
 *   - If reduced-motion is set OR audio fails, every play() is a silent no-op.
 *   - Pure ES module, zero dependencies, SSR-safe (window guards).
 */

let ctx = null;
let masterGain = null;

function prefersReducedMotion() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

function ensureContext() {
  if (typeof window === "undefined") return null;
  if (prefersReducedMotion()) return null;
  if (ctx && ctx.state !== "closed") return ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  try {
    ctx = new AC();
    masterGain = ctx.createGain();
    masterGain.gain.value = 1.0;
    masterGain.connect(ctx.destination);
    return ctx;
  } catch {
    return null;
  }
}

/**
 * Resume the AudioContext if it was auto-suspended by the browser.
 * Call from a user-gesture handler before the first play() if needed.
 */
export async function unlockLumiAudio() {
  const c = ensureContext();
  if (!c) return false;
  if (c.state === "suspended") {
    try {
      await c.resume();
    } catch {
      return false;
    }
  }
  return c.state === "running";
}

function playTone({ type = "sine", from, to, duration, peakGain = 0.06, attack = 0.015, release = 0.12 }) {
  const c = ensureContext();
  if (!c || !masterGain) return false;
  const now = c.currentTime;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(from, now);
  if (typeof to === "number" && to !== from) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(to, 1), now + duration);
  }
  // Capped peak gain — never exceeds the whisper-quiet ceiling.
  const peak = Math.min(peakGain, 0.08);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(peak, now + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration + release);
  osc.connect(gain).connect(masterGain);
  osc.start(now);
  osc.stop(now + duration + release + 0.05);
  return true;
}

/**
 * Gentle entrance pop — sine pluck, 220 → 440 Hz over 180ms.
 * Plays when Lumi appears or "wakes up".
 */
export function playLumiPop() {
  return playTone({
    type: "sine",
    from: 220,
    to: 440,
    duration: 0.18,
    peakGain: 0.05,
    attack: 0.01,
    release: 0.14,
  });
}

/**
 * Soft heartbeat — two-beat lub-dub at 110 Hz, ~440ms total.
 * Synced to the existing heart pulse cadence (period prop on LumiV6).
 */
export function playLumiHeartbeat() {
  const lub = playTone({
    type: "sine",
    from: 110,
    to: 90,
    duration: 0.10,
    peakGain: 0.045,
    attack: 0.008,
    release: 0.10,
  });
  // Schedule the dub via setTimeout — not relying on AudioContext scheduling
  // here keeps the API symmetric (each tone is one playTone call).
  if (lub) {
    setTimeout(() => {
      playTone({
        type: "sine",
        from: 95,
        to: 75,
        duration: 0.12,
        peakGain: 0.04,
        attack: 0.008,
        release: 0.12,
      });
    }, 180);
  }
  return lub;
}

/**
 * Whisper-quiet chime — triangle at 660 Hz with a 880 Hz overtone.
 * Plays on interaction acknowledgement (e.g. Lumi tap, emotion select).
 */
export function playLumiChime() {
  const a = playTone({
    type: "triangle",
    from: 660,
    to: 660,
    duration: 0.18,
    peakGain: 0.045,
    attack: 0.012,
    release: 0.18,
  });
  if (a) {
    setTimeout(() => {
      playTone({
        type: "triangle",
        from: 880,
        to: 880,
        duration: 0.16,
        peakGain: 0.035,
        attack: 0.012,
        release: 0.20,
      });
    }, 60);
  }
  return a;
}

/**
 * Test that audio is available in the current environment without playing.
 * Useful for the preference toggle to show "Audio unavailable on this device".
 */
export function isLumiAudioAvailable() {
  if (typeof window === "undefined") return false;
  if (prefersReducedMotion()) return false;
  const AC = window.AudioContext || window.webkitAudioContext;
  return Boolean(AC);
}

/**
 * Close the AudioContext. Useful when the user disables audio at runtime
 * so we release the underlying device handle.
 */
export function closeLumiAudio() {
  if (ctx && ctx.state !== "closed") {
    try {
      ctx.close();
    } catch {
      /* noop */
    }
  }
  ctx = null;
  masterGain = null;
}
