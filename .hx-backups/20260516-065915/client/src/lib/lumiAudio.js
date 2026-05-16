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
 * Gentle entrance pop — sine sweep, 800 → 1200 Hz over 300ms, vol 0.08.
 * Plays when Lumi appears (once per session via sessionStorage gate at the
 * call site, so this kernel stays stateless). Per V14 spec.
 */
export function playLumiPop() {
  return playTone({
    type: "sine",
    from: 800,
    to: 1200,
    duration: 0.30,
    peakGain: 0.08,
    attack: 0.012,
    release: 0.16,
  });
}

/**
 * Soft heartbeat — single sine thud at 110 Hz, ~180ms, vol 0.05. Per V14
 * spec the cadence is driven by the call site (LumiV6 schedules a play()
 * on its existing heart-pulse period), so this kernel just plays one beat
 * per call. Total envelope ~280ms — well under the 3 Hz seizure-safety
 * threshold even at the fastest emotion ("surprise" = 1.5 Hz pulse).
 */
export function playLumiHeartbeat() {
  return playTone({
    type: "sine",
    from: 110,
    to: 80,
    duration: 0.18,
    peakGain: 0.05,
    attack: 0.010,
    release: 0.10,
  });
}

/**
 * Whisper chime — bell-like harmonic stack (660 Hz fundamental + 1320 Hz
 * second harmonic) over 200ms, vol 0.06. Per V14 spec. The second harmonic
 * is fired from the same call so the bell character lands in one event;
 * call sites debounce to ≥2s between chimes.
 */
export function playLumiChime() {
  const fundamental = playTone({
    type: "triangle",
    from: 660,
    to: 660,
    duration: 0.20,
    peakGain: 0.06,
    attack: 0.010,
    release: 0.22,
  });
  if (fundamental) {
    // Second harmonic stacked at the same instant for a soft bell timbre.
    playTone({
      type: "sine",
      from: 1320,
      to: 1320,
      duration: 0.20,
      peakGain: 0.025,
      attack: 0.010,
      release: 0.22,
    });
  }
  return fundamental;
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
  // Drop the heartbeat ownership so the next mount can re-claim cleanly.
  if (_heartTimer) {
    try { clearInterval(_heartTimer); } catch { /* noop */ }
  }
  _heartTimer = null;
  _heartOwner = null;
  _heartPeriod = 0;
}

// =============================================================================
// V14 Coordinator — module-scoped state so every Lumi avatar in the app
// cooperates. Without this, N BuddyAvatars on a page would each fire N
// overlapping heartbeats and the chime would un-debounce across instances.
// =============================================================================

let _chimeAt = 0;
let _heartOwner = null;
let _heartTimer = null;
let _heartPeriod = 0;
let _poppedThisSession = false;

/**
 * One-shot entrance pop, gated by sessionStorage so multiple Lumi instances
 * (header / hero / chat / footer) all share a single "first pop per session".
 * Returns true if a sound actually fired, false on no-op (already popped,
 * audio off, reduced-motion, Web Audio unavailable).
 */
export function tryPlayPop() {
  if (_poppedThisSession) return false;
  try {
    if (typeof sessionStorage !== "undefined" &&
        sessionStorage.getItem("lumi:audio:popped") === "1") {
      _poppedThisSession = true;
      return false;
    }
  } catch { /* noop */ }
  const fired = playLumiPop();
  if (fired) {
    _poppedThisSession = true;
    try { sessionStorage.setItem("lumi:audio:popped", "1"); } catch { /* noop */ }
  }
  return fired;
}

/**
 * Whisper chime with a module-scoped debounce window. Default 2000 ms per
 * the V14 prime directive. Multiple avatars sharing a debounce window means
 * mashing different avatars (header logo + chat bubble + tool card) still
 * yields at most one chime every 2 s.
 */
export function tryPlayChime(minGapMs = 2000) {
  const now = Date.now();
  if (now - _chimeAt < minGapMs) return false;
  const fired = playLumiChime();
  if (fired) _chimeAt = now;
  return fired;
}

/**
 * Single-owner heartbeat coordinator. The first avatar to call `claimHeartbeat`
 * starts the interval and receives a token; subsequent callers get null and
 * stay silent. The owner must call `releaseHeartbeat(token)` on unmount.
 *
 * `periodMs` is clamped at 340 ms (≈2.94 Hz) per the V14 seizure-safety floor
 * — even if a future caller passes a faster period, the audio cadence is
 * pinned under 3 Hz. Visual heart pulse is independent and unclamped.
 */
export function claimHeartbeat(periodMs) {
  if (_heartOwner) return null;
  const safePeriod = Math.max(340, Math.round(periodMs || 800));
  const token = { id: Symbol("lumi-heartbeat") };
  _heartOwner = token;
  _heartPeriod = safePeriod;
  _heartTimer = setInterval(() => {
    playLumiHeartbeat();
  }, safePeriod);
  return token;
}

/**
 * Release the heartbeat ownership. Safe to call with a stale token (no-op).
 */
export function releaseHeartbeat(token) {
  if (!token || token !== _heartOwner) return;
  if (_heartTimer) {
    try { clearInterval(_heartTimer); } catch { /* noop */ }
  }
  _heartTimer = null;
  _heartOwner = null;
  _heartPeriod = 0;
}

/**
 * Read the current heartbeat period (for tests / introspection). 0 means
 * no active claim.
 */
export function getHeartbeatPeriod() {
  return _heartPeriod;
}
