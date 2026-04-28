// server/awareness/detection/pipeline.mjs
// MMHB CONSCIOUSNESS OS v2.0 — Prompt 3.2: Awareness Detection Pipeline
//
// Three-layer manipulation / distortion / fallacy detector.
//
//   LAYER 1 — RuleMatcher        (deterministic, target <50 ms)
//   LAYER 2 — MLClassifier       (statistical, target 100-200 ms; STUB)
//   LAYER 3 — LLMReasoner        (reasoning, 1-3 s; async, opt-in)
//
// Persists ensemble outputs to the existing `content_scores` table
// (created in v2.0 Phase 0). NO new DB tables introduced.
//
// Locked-file posture:
//   • OpenAI client is imported READ-ONLY from server/ai/openaiClient.mjs.
//   • No locked AI surface is modified or replaced.
//   • Layer 1 NEVER blocks the user response path; the chat-side
//     middleware (server/awareness/middleware.mjs) is built but NOT
//     auto-mounted because that wiring would require unlocking
//     server/routes/ai.mjs (an explicitly locked file). Operators can
//     opt-in by adding a single `app.use(...)` line.

import { db, schema } from "../../db.mjs";
import { eq, desc, gte, and } from "drizzle-orm";
import { openai } from "../../ai/openaiClient.mjs";
import { logEvent } from "../../ai/aiTelemetry.mjs";
import { AWARENESS_RULES, RULE_COUNT, ruleById } from "../rules.mjs";

const { contentScores } = schema;

const MIN_LAYER1_CONFIDENCE = 0.40;
const ENSEMBLE_FLAG_THRESHOLD = 0.65;
const LAYER_WEIGHTS = Object.freeze({ layer1: 0.3, layer2: 0.4, layer3: 0.3 });

/* =====================================================================
 * LAYER 1 — RuleMatcher
 * ===================================================================== */
export class RuleMatcher {
  /** @param {import('../rules.mjs').AwarenessRule[]} rules */
  constructor(rules = AWARENESS_RULES) {
    this.rules = rules;
  }

  /**
   * Scan input text against the seeded rule library.
   * @param {string} text
   * @returns {Array<{tactic: string, category: string, ruleId: string, confidence: number, severity: string, matchedText: string}>}
   */
  scan(text) {
    if (typeof text !== "string" || text.length === 0) return [];
    const out = [];
    for (const rule of this.rules) {
      const match = matchRule(rule, text);
      if (!match) continue;
      const confidence = match.boost ? Math.min(1, rule.baseConfidence + match.boost) : rule.baseConfidence;
      if (confidence < MIN_LAYER1_CONFIDENCE) continue;
      // matchedText is intentionally OMITTED from the public hit shape so it
      // can never leak into API responses or be persisted into content_scores.
      // The redacted snippet remains available internally for debug logs only.
      out.push({
        ruleId: rule.id,
        tactic: rule.tactic,
        category: rule.category,
        confidence: Number(confidence.toFixed(2)),
        severity: rule.severity,
      });
    }
    return out;
  }
}

function matchRule(rule, text) {
  switch (rule.patternType) {
    case "regex": {
      const m = rule.pattern.exec(text);
      return m ? { matchedText: redact(m[0]) } : null;
    }
    case "keyword": {
      const needle = String(rule.pattern).toLowerCase();
      const idx = text.toLowerCase().indexOf(needle);
      return idx >= 0 ? { matchedText: text.slice(idx, idx + needle.length) } : null;
    }
    case "composite": {
      const all = rule.pattern?.all || [];
      const hits = [];
      for (const p of all) {
        if (p instanceof RegExp) {
          const m = p.exec(text);
          if (!m) return null;
          hits.push(redact(m[0]));
        } else {
          const k = String(p).toLowerCase();
          if (!text.toLowerCase().includes(k)) return null;
          hits.push(k);
        }
      }
      // Composite matches earn a small confidence boost for multi-signal evidence.
      return { matchedText: hits.join(" + "), boost: 0.05 };
    }
    default:
      return null;
  }
}

// Trim matched substring to <= 60 chars and strip newlines so logs stay clean.
// We keep enough context for the user to recognize the pattern, but never store
// the entire input.
function redact(s) {
  const cleaned = String(s).replace(/\s+/g, " ").trim();
  return cleaned.length > 60 ? cleaned.slice(0, 57) + "..." : cleaned;
}

/* =====================================================================
 * LAYER 2 — MLClassifier (stub)
 * ===================================================================== */
export class MLClassifier {
  constructor() {
    // TODO (v2.0 Phase 4): load fine-tuned BERT / RoBERTa from
    //   ./models/manipulation-classifier.onnx
    // via onnxruntime-node. Until then, this layer is a transparent
    // pass-through that reports zero confidence so the ensemble math
    // stays well-defined.
    this.modelLoaded = false;
  }

  /**
   * @param {string} _text
   * @param {ReturnType<RuleMatcher['scan']>} layer1Hits
   * @returns {Promise<Array<{tactic: string, category: string, confidence: number, source: 'ml-stub'}>>}
   */
  async classify(_text, layer1Hits = []) {
    if (!this.modelLoaded) {
      // Stub behavior: echo Layer 1 hits with neutral 0.0 confidence so
      // the ensemble scorer sees an explicit "no opinion" signal.
      return layer1Hits.map((h) => ({
        tactic: h.tactic,
        category: h.category,
        confidence: 0,
        source: "ml-stub",
      }));
    }
    // Placeholder for the real model invocation when wired up.
    return [];
  }
}

/* =====================================================================
 * LAYER 3 — LLMReasoner (async, opt-in)
 * ===================================================================== */
const LLM_SYSTEM_PROMPT = [
  "You are an awareness analyst trained in trauma-informed communication literacy.",
  "Your sole job: detect manipulation tactics, cognitive distortions, and logical fallacies in the user's TEXT.",
  "You are EDUCATIONAL ONLY. You never diagnose, never give clinical advice, never address the user directly.",
  "Output STRICT JSON only with this schema:",
  '  {"tactics":[{"tactic":string,"category":"manipulation|distortion|fallacy","confidence":number}],',
  '   "confidence":number, "explanation":string}',
  "Confidence is 0.0-1.0. Explanation is <= 240 chars and describes the rhetorical pattern, not the person.",
].join(" ");

const LLM_FEW_SHOT = [
  {
    role: "user",
    content: 'TEXT: "That never happened. You are imagining things again."',
  },
  {
    role: "assistant",
    content: JSON.stringify({
      tactics: [{ tactic: "gaslighting", category: "manipulation", confidence: 0.92 }],
      confidence: 0.92,
      explanation: "Denies the listener's experience to make them doubt their perception of reality.",
    }),
  },
  {
    role: "user",
    content: 'TEXT: "If we let people work from home, soon nobody will come to the office and society will collapse."',
  },
  {
    role: "assistant",
    content: JSON.stringify({
      tactics: [{ tactic: "slippery_slope", category: "fallacy", confidence: 0.78 }],
      confidence: 0.78,
      explanation: "Assumes one small change triggers an inevitable catastrophic chain without evidence.",
    }),
  },
];

export class LLMReasoner {
  constructor({ model = "gpt-4o-mini", timeoutMs = 8000 } = {}) {
    this.model = model;
    this.timeoutMs = timeoutMs;
  }

  /**
   * @param {string} text
   * @returns {Promise<{tactics: Array, confidence: number, explanation: string} | null>}
   */
  async reason(text) {
    if (!process.env.OPENAI_API_KEY) return null;
    if (!text || text.length === 0) return null;

    const safe = text.length > 1500 ? text.slice(0, 1500) : text;
    try {
      const ac = new AbortController();
      const timer = setTimeout(() => ac.abort(), this.timeoutMs);
      const completion = await openai.chat.completions.create(
        {
          model: this.model,
          temperature: 0,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: LLM_SYSTEM_PROMPT },
            ...LLM_FEW_SHOT,
            { role: "user", content: `TEXT: "${safe.replace(/"/g, '\\"')}"` },
          ],
        },
        { signal: ac.signal }
      );
      clearTimeout(timer);
      const raw = completion?.choices?.[0]?.message?.content || "{}";
      const parsed = safeParse(raw);
      if (!parsed || !Array.isArray(parsed.tactics)) return null;
      return {
        tactics: parsed.tactics
          .filter((t) => t && typeof t.tactic === "string")
          .slice(0, 6)
          .map((t) => ({
            tactic: String(t.tactic).slice(0, 40),
            category: ["manipulation", "distortion", "fallacy"].includes(t.category) ? t.category : "manipulation",
            confidence: clamp01(Number(t.confidence)),
          })),
        confidence: clamp01(Number(parsed.confidence)),
        explanation: typeof parsed.explanation === "string" ? parsed.explanation.slice(0, 240) : "",
      };
    } catch (err) {
      logEvent({ type: "ai_call_completed", metadata: { route: "awareness.layer3", error: err?.message?.slice(0, 80) || "llm_failed" } });
      return null;
    }
  }
}

function safeParse(s) {
  try { return JSON.parse(s); } catch { return null; }
}
function clamp01(n) {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

/* =====================================================================
 * EnsembleScorer
 * ===================================================================== */
export class EnsembleScorer {
  constructor({ weights = LAYER_WEIGHTS, flagThreshold = ENSEMBLE_FLAG_THRESHOLD } = {}) {
    this.weights = weights;
    this.flagThreshold = flagThreshold;
  }

  /**
   * Combine three layer outputs into a single per-tactic ensemble score.
   * @param {ReturnType<RuleMatcher['scan']>} layer1
   * @param {Awaited<ReturnType<MLClassifier['classify']>>} layer2
   * @param {Awaited<ReturnType<LLMReasoner['reason']>>} layer3
   * @returns {{ensemble: Array<{tactic: string, category: string, confidence: number}>, topConfidence: number, flagged: boolean}}
   */
  combine(layer1 = [], layer2 = [], layer3 = null) {
    // Spec-faithful weighted sum: missing layers contribute 0 confidence.
    // This means Layer-1-only matches are intentionally capped at 0.30, so
    // a "high" severity flag REQUIRES corroboration from Layer 2 or Layer 3.
    // We do NOT renormalize by participating-layer weight sum, which would
    // silently boost Layer-1-only signals once Layer 2/3 come online.
    const tacticMap = new Map();

    const blend = (tactic, category, conf, weightKey) => {
      const key = `${category}:${tactic}`;
      const prev = tacticMap.get(key) || { tactic, category, weighted: 0 };
      prev.weighted += conf * this.weights[weightKey];
      tacticMap.set(key, prev);
    };

    for (const h of layer1) blend(h.tactic, h.category, h.confidence, "layer1");
    for (const h of layer2) blend(h.tactic, h.category, h.confidence, "layer2");
    if (layer3 && Array.isArray(layer3.tactics)) {
      for (const t of layer3.tactics) blend(t.tactic, t.category, t.confidence, "layer3");
    }

    const ensemble = [];
    let top = 0;
    for (const v of tacticMap.values()) {
      const conf = Math.max(0, Math.min(1, v.weighted));
      const rounded = Number(conf.toFixed(2));
      if (rounded > top) top = rounded;
      ensemble.push({ tactic: v.tactic, category: v.category, confidence: rounded });
    }
    ensemble.sort((a, b) => b.confidence - a.confidence);
    return { ensemble, topConfidence: top, flagged: top >= this.flagThreshold };
  }
}

/* =====================================================================
 * AwarenessPipeline (composer)
 * ===================================================================== */
export class AwarenessPipeline {
  constructor() {
    this.ruleMatcher = new RuleMatcher();
    this.mlClassifier = new MLClassifier();
    this.llmReasoner = new LLMReasoner();
    this.scorer = new EnsembleScorer();
  }

  /**
   * Run Layers 1+2 synchronously and (optionally) Layer 3 asynchronously.
   * Persists an ensemble row to content_scores when flagged or when
   * caller explicitly requests persistence.
   *
   * @param {object} opts
   * @param {string} opts.text
   * @param {'journal'|'chat'|'import'|'community_post'} opts.contentSource
   * @param {string} [opts.contentRef]
   * @param {string|null} [opts.userId]
   * @param {boolean} [opts.runLayer3] - default false (async opt-in)
   * @param {boolean} [opts.persist]   - default true if flagged
   */
  async detect({ text, contentSource = "chat", contentRef = null, userId = null, runLayer3 = false, persist = undefined } = {}) {
    const startedAt = Date.now();
    if (typeof text !== "string" || text.length === 0) {
      return { ok: false, reason: "empty_text" };
    }
    if (text.length > 4000) {
      return { ok: false, reason: "text_too_long", maxChars: 4000 };
    }

    const layer1 = this.ruleMatcher.scan(text);
    const layer1Ms = Date.now() - startedAt;

    let layer2 = [];
    let layer2Ms = 0;
    try {
      const t2 = Date.now();
      layer2 = await this.mlClassifier.classify(text, layer1);
      layer2Ms = Date.now() - t2;
    } catch (err) {
      logEvent({ type: "ai_call_completed", metadata: { route: "awareness.layer2", error: err?.message?.slice(0, 80) || "ml_failed" } });
    }

    let layer3 = null;
    let layer3Ms = 0;
    if (runLayer3) {
      const t3 = Date.now();
      layer3 = await this.llmReasoner.reason(text);
      layer3Ms = Date.now() - t3;
    }

    const { ensemble, topConfidence, flagged } = this.scorer.combine(layer1, layer2, layer3);
    const severity = severityFor(topConfidence);

    const shouldPersist = persist !== undefined ? !!persist : flagged;
    let scoreId = null;
    if (shouldPersist) {
      try {
        // PII hygiene: never persist the user's matched substring. We keep
        // only ruleId + confidence so analytics can roll up patterns without
        // ever echoing the original text back from the database.
        const signals = {
          manipulation: ensemble.filter((e) => e.category === "manipulation"),
          distortions: ensemble.filter((e) => e.category === "distortion"),
          fallacies: ensemble.filter((e) => e.category === "fallacy"),
          ruleHits: layer1.map((h) => ({ ruleId: h.ruleId, confidence: h.confidence })),
          llm: layer3 ? { confidence: layer3.confidence, explanation: layer3.explanation } : null,
        };
        const epistemic = epistemicScoreFromEnsemble(ensemble);
        // Detector-layer provenance (CAD-4 transparency): only claim "stat"
        // once a real ML model is loaded. The current Layer 2 is a transparent
        // stub (modelLoaded === false), so we attribute as "rule" or "ensemble".
        const layer2Real = this.mlClassifier.modelLoaded && layer2.length > 0;
        const detectorLayer = layer3
          ? (layer2Real ? "ensemble" : "ensemble")
          : (layer2Real ? "stat" : "rule");
        const [row] = await db
          .insert(contentScores)
          .values({
            contentSource,
            contentRef: contentRef || `inline-${Date.now()}`,
            userId: userId || null,
            epistemicScore: epistemic,
            signals,
            detectorLayer,
            severity,
          })
          .returning({ id: contentScores.id });
        scoreId = row?.id || null;
      } catch (err) {
        logEvent({ type: "ai_call_completed", metadata: { route: "awareness.persist", error: err?.message?.slice(0, 80) || "persist_failed" } });
      }
    }

    return {
      ok: true,
      flagged,
      topConfidence,
      severity,
      ensemble,
      layers: {
        layer1: { hits: layer1, latencyMs: layer1Ms },
        layer2: { hits: layer2, latencyMs: layer2Ms, modelLoaded: this.mlClassifier.modelLoaded },
        layer3: { result: layer3, latencyMs: layer3Ms, ran: runLayer3 },
      },
      scoreId,
      totalLatencyMs: Date.now() - startedAt,
    };
  }

  /**
   * Async fire-and-forget Layer 3 enrichment for an existing score.
   * Useful when callers want sub-50ms responses but still want LLM
   * reasoning eventually attached.
   * @param {object} opts - same shape as detect()
   * @returns {Promise<void>}
   */
  enrichAsync(opts = {}) {
    setImmediate(() => {
      this.detect({ ...opts, runLayer3: true, persist: true }).catch(() => { /* swallow */ });
    });
  }
}

function severityFor(conf) {
  if (conf >= 0.80) return "high";
  if (conf >= 0.65) return "medium";
  if (conf >= 0.40) return "low";
  return "info";
}

// Epistemic score = 100 - (weighted manipulation + fallacy presence).
// Distortions don't subtract because they are self-directed, not deceptive.
function epistemicScoreFromEnsemble(ensemble) {
  let penalty = 0;
  for (const e of ensemble) {
    if (e.category === "manipulation") penalty += e.confidence * 30;
    else if (e.category === "fallacy") penalty += e.confidence * 20;
  }
  return Math.max(0, Math.min(100, Math.round(100 - penalty)));
}

/* ---------- module-level singleton for cheap re-use ---------- */
let _singleton = null;
export function getPipeline() {
  if (!_singleton) _singleton = new AwarenessPipeline();
  return _singleton;
}

/**
 * Express-compatible middleware that runs Layer 1 only on a configurable
 * field of req.body and attaches results to req.awareness.
 *
 * NOT auto-mounted. To wire into the chat path (which lives in the
 * locked server/routes/ai.mjs), an operator must explicitly add:
 *   app.use("/api/ai/chat", scanLayer1Middleware({ field: "message" }));
 *
 * This indirection keeps locked files untouched while making the
 * integration trivially one-line.
 *
 * @param {{field?: string, attach?: string}} options
 * @returns {import('express').RequestHandler}
 */
export function scanLayer1Middleware({ field = "message", attach = "awareness" } = {}) {
  const matcher = new RuleMatcher();
  return function (req, _res, next) {
    try {
      const text = req?.body && typeof req.body[field] === "string" ? req.body[field] : "";
      if (text) {
        const hits = matcher.scan(text);
        req[attach] = { hits, scannedAt: Date.now() };
      }
    } catch {
      /* never block the chat path */
    }
    next();
  };
}

export const PIPELINE_META = Object.freeze({
  ruleCount: RULE_COUNT,
  weights: LAYER_WEIGHTS,
  ensembleFlagThreshold: ENSEMBLE_FLAG_THRESHOLD,
  layer1MinConfidence: MIN_LAYER1_CONFIDENCE,
});

export { ruleById };
