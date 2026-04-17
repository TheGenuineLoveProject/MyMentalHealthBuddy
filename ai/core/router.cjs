const { trackPromptUsage } = require("./telemetry.cjs");

function routePrompt(engine, text) {
  const t = String(text || "").toLowerCase();
  let promptId = "b10_ops_sops";

  if (engine === "healing") {
    if (/(suicide|self harm|kill myself|hurt myself)/.test(t)) {
      promptId = "h08_safety_check";
    } else if (/(journal|reflect|write about)/.test(t)) {
      promptId = "h02_journal_reflect";
    } else if (/(anxiety|anxious|thought|spiral)/.test(t)) {
      promptId = "h03_cbt_reframe";
    } else {
      promptId = "h02_journal_reflect";
    }
  } else if (engine === "business") {
    if (/(offer|value|position)/.test(t)) {
      promptId = "b01_offer_design";
    } else if (/(content|blog|social|newsletter|instagram|tiktok|youtube)/.test(t)) {
      promptId = "b03_content_factory";
    } else if (/(competitor|market|pricing)/.test(t)) {
      promptId = "b06_competitive_scan";
    } else {
      promptId = "b10_ops_sops";
    }
  }

  trackPromptUsage(engine, promptId, text);
  return promptId;
}

module.exports = { routePrompt };