const { trackPromptUsage } = require("./telemetry");

function routePrompt(engine, text) {
  const t = text.toLowerCase();
  let promptId = "b10_ops_sops";

  if (engine === "healing") {
    if (/(suicide|self harm)/.test(t)) promptId = "h08_safety_check";
    else if (/(journal|reflect)/.test(t)) promptId = "h02_journal_reflect";
    else if (/(anxiety|thought)/.test(t)) promptId = "h03_cbt_reframe";
    else promptId = "h02_journal_reflect";
  } else {
    if (/(offer|value)/.test(t)) promptId = "b01_offer_design";
    else if (/(content|blog|social)/.test(t)) promptId = "b03_content_factory";
    else if (/(competitor|market)/.test(t)) promptId = "b06_competitive_scan";
  }

  trackPromptUsage(engine, promptId, text);

  return promptId;
}

module.exports = { routePrompt };
