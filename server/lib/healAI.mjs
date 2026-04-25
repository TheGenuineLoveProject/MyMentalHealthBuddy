// server/lib/healAI.mjs
// Admin-only observability helper that asks Perplexity to diagnose a
// health probe report and return a prioritized remediation plan as
// structured JSON.
//
// IMPORTANT: This module is part of the *admin observability* surface only.
// It is NOT the user-facing AI chat (/api/ai/chat) and does NOT touch any
// of the locked surfaces (server/ai/*, BuddyAvatar.tsx, /start).

const PERPLEXITY_URL = "https://api.perplexity.ai/chat/completions";
const DEFAULT_MODEL = "sonar-pro";
const DEFAULT_TIMEOUT_MS = 30_000;

// Bump when the system prompt, response schema, or destructive-language
// filter changes meaningfully.  Persisted with each AI history entry so we
// can detect regressions and audit which version produced a given diagnosis.
export const PROMPT_VERSION = "1.0.0";

const SYSTEM_PROMPT = `You are an expert site-reliability engineer diagnosing a health-probe report from a Node.js + React mental-wellness platform (MMHB).

Rules — follow strictly:
- Return ONLY a JSON object that matches the requested schema. No prose, no markdown fences.
- Be concrete, conservative, and actionable. Reference the failing checks by name.
- NEVER suggest deleting data, dropping tables, removing files, or destructive shell operations.
- Prefer additive fixes (env-var configuration, schema additions, dependency installs) over rewrites.
- Mark risk_level honestly: "safe" = read-only / pure config, "moderate" = single file edit, "risky" = anything reversible only via backup.
- This is a mental-wellness platform: never recommend weakening trauma-informed safeguards, crisis routing, or PII redaction.`;

const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    summary: { type: "string" },
    overall_severity: { type: "string", enum: ["low", "medium", "high", "critical"] },
    remediation_steps: {
      type: "array",
      items: {
        type: "object",
        properties: {
          issue: { type: "string" },
          severity: { type: "string", enum: ["low", "medium", "high", "critical"] },
          root_cause_hypothesis: { type: "string" },
          suggested_fix: { type: "string" },
          risk_level: { type: "string", enum: ["safe", "moderate", "risky"] },
          estimated_effort: { type: "string" },
        },
        required: ["issue", "severity", "root_cause_hypothesis", "suggested_fix", "risk_level"],
        additionalProperties: false,
      },
    },
    next_action: { type: "string" },
  },
  required: ["summary", "overall_severity", "remediation_steps", "next_action"],
  additionalProperties: false,
};

// Verbs / patterns we never want to surface as recommended actions.  Matched
// case-insensitively as whole words / phrases.  This is defense-in-depth on
// top of the system-prompt constraint — if the model returns destructive
// language anyway, we downgrade the step's risk_level and prepend a warning.
const DESTRUCTIVE_PATTERNS = [
  /\bdrop\s+(?:table|database|schema|column|index|view)\b/i,
  /\btruncate\s+(?:table|database)\b/i,
  /\bdelete\s+(?:from|all|user|users|data|rows|records)\b/i,
  /\brm\s+-rf\b/i,
  /\brm\s+-r\s+-f\b/i,
  /\bgit\s+(?:reset\s+--hard|push\s+--force|push\s+-f|filter-branch)\b/i,
  /\bmkfs\b/i,
  /\bdd\s+if=/i,
  /\bformat\s+(?:disk|drive|partition)\b/i,
  /\bwipe\b/i,
];

function filterDestructiveRecommendations(diagnosis) {
  if (!diagnosis || !Array.isArray(diagnosis.remediation_steps)) {
    return { diagnosis, flagged: false };
  }
  let flagged = false;
  const cleaned = diagnosis.remediation_steps.map((step) => {
    if (!step || typeof step !== "object") return step;
    const haystack = `${step.suggested_fix || ""}\n${step.root_cause_hypothesis || ""}`;
    const matched = DESTRUCTIVE_PATTERNS.some((pat) => pat.test(haystack));
    if (!matched) return step;
    flagged = true;
    return {
      ...step,
      risk_level: "risky",
      safety_warning: "Auto-flagged: contains destructive language. Review carefully before acting.",
      suggested_fix: `[FILTER: contains destructive language] ${step.suggested_fix || ""}`,
    };
  });
  return {
    diagnosis: { ...diagnosis, remediation_steps: cleaned, ...(flagged ? { safety_filtered: true } : {}) },
    flagged,
  };
}

/**
 * Diagnose a health-probe report via Perplexity.
 * Returns { ok: true, diagnosis, safetyFiltered, model, usage, citations } or { ok: false, error }.
 */
export async function diagnoseHealthReport(report, { timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
  const apiKey = process.env.PERPLEXITY_API_KEY;
  if (!apiKey) {
    return { ok: false, error: "PERPLEXITY_API_KEY not configured" };
  }

  // Slim the report down so we only send actionable bits to the model.
  // Truncate nonPass to 20 entries to bound prompt size.
  const slim = {
    verdict: report?.verdict || null,
    totals: report?.totals || null,
    timestamp: report?.timestamp || null,
    nonPass: Array.isArray(report?.nonPass) ? report.nonPass.slice(0, 20).map((item) => ({
      check: item?.check || item?.name || null,
      category: item?.category || null,
      status: item?.status || null,
      message: typeof item?.message === "string" ? item.message.slice(0, 400) : null,
      hint: typeof item?.hint === "string" ? item.hint.slice(0, 400) : null,
    })) : [],
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(PERPLEXITY_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Diagnose this health-probe report and return a remediation plan as JSON.\n\n${JSON.stringify(slim, null, 2)}` },
        ],
        response_format: {
          type: "json_schema",
          json_schema: { schema: RESPONSE_SCHEMA },
        },
        max_tokens: 1500,
        temperature: 0.2,
      }),
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (!response.ok) {
      const errBody = await response.text().catch(() => "");
      return { ok: false, error: `Perplexity ${response.status}: ${errBody.slice(0, 200)}` };
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content || typeof content !== "string") {
      return { ok: false, error: "Empty AI response" };
    }

    let parsed = null;
    try {
      parsed = JSON.parse(content);
    } catch {
      // Some models occasionally wrap the JSON in markdown fences; try to recover.
      const fenced = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (fenced) {
        try { parsed = JSON.parse(fenced[1]); } catch { /* fall through */ }
      }
      if (!parsed) return { ok: false, error: "AI response was not valid JSON" };
    }

    // Defense-in-depth: even though the system prompt forbids destructive
    // recommendations, scan the structured output for destructive verbs in
    // free-text fields and downgrade any matching step to risk_level="risky"
    // with a safety_warning prefix.  Architect-recommended hardening.
    const filtered = filterDestructiveRecommendations(parsed);

    return {
      ok: true,
      diagnosis: filtered.diagnosis,
      safetyFiltered: filtered.flagged,
      model: data?.model || DEFAULT_MODEL,
      usage: data?.usage || null,
      citations: Array.isArray(data?.citations) ? data.citations.slice(0, 10) : [],
    };
  } catch (err) {
    clearTimeout(timer);
    if (err?.name === "AbortError") return { ok: false, error: "AI diagnosis timed out" };
    return { ok: false, error: err?.message || "AI diagnosis failed" };
  }
}
