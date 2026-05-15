/**
 * Phase 23 — captionsMode
 *
 * Caption is the universal accessible surface. Every voice utterance also
 * emits a caption that lingers for 1500ms after audio ends. Captions
 * surface even when voice is disabled (text-only mode).
 */

export const CAPTION_LINGER_MS = 1500 as const;

export interface Caption {
  readonly id: string;
  readonly text: string;
  readonly createdAtMs: number;
  /** Wall-clock ms timestamp at which the caption may be removed. */
  readonly lingerUntilMs: number;
}

let captionSeq = 0;

export function makeCaption(text: string, now: number = Date.now()): Caption {
  captionSeq += 1;
  const safeText = (text ?? "").toString().trim();
  return {
    id: `caption-${now}-${captionSeq}`,
    text: safeText,
    createdAtMs: now,
    lingerUntilMs: now + CAPTION_LINGER_MS,
  };
}

export function isCaptionExpired(caption: Caption, now: number = Date.now()): boolean {
  return now >= caption.lingerUntilMs;
}
