/**
 * Phase 34 — Crisis resources directory.
 *
 * Frozen, hard-coded list. Resources MUST be reachable without an
 * account, without payment, and without analytics tracking. International
 * coverage is required (governance Rule 6).
 */

export interface CrisisResource {
  readonly name: string;
  readonly phone?: string;
  readonly text?: string;
  readonly chatUrl?: string;
  readonly available: string;
  readonly region?: string;
}

export interface CrisisResourceDirectory {
  readonly us: ReadonlyArray<CrisisResource>;
  readonly international: ReadonlyArray<CrisisResource>;
}

export const CRISIS_RESOURCES: CrisisResourceDirectory = Object.freeze({
  us: Object.freeze([
    {
      name: "988 Suicide & Crisis Lifeline",
      phone: "988",
      text: "988",
      chatUrl: "https://988lifeline.org/chat",
      available: "24/7",
      region: "US",
    },
    {
      name: "Crisis Text Line",
      text: "HOME to 741741",
      available: "24/7",
      region: "US",
    },
    {
      name: "SAMHSA National Helpline",
      phone: "1-800-662-4357",
      available: "24/7",
      region: "US",
    },
  ]),
  international: Object.freeze([
    {
      name: "Befrienders Worldwide",
      phone: "Visit befrienders.org",
      chatUrl: "https://www.befrienders.org",
      available: "Varies by country",
      region: "International",
    },
    {
      name: "International Association for Suicide Prevention (IASP)",
      chatUrl: "https://www.iasp.info/resources/Crisis_Centres/",
      available: "Directory of regional helplines",
      region: "International",
    },
  ]),
});

export function getPrimaryUSResource(): CrisisResource {
  const r = CRISIS_RESOURCES.us[0];
  if (!r) throw new Error("[lumi-crisis] primary US resource missing");
  return r;
}
