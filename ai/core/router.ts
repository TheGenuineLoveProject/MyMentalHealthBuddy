export function routePrompt(engine: string, text: string) {
  const t = text.toLowerCase();

  if (engine === "healing") {
    if (/(suicide|self harm)/.test(t)) return "h08_safety_check";
    if (/(journal|reflect)/.test(t)) return "h02_journal_reflect";
    if (/(anxiety|thought)/.test(t)) return "h03_cbt_reframe";
    return "h02_journal_reflect";
  }

  if (/(offer|value)/.test(t)) return "b01_offer_design";
  if (/(content|blog|social)/.test(t)) return "b03_content_factory";
  if (/(competitor|market)/.test(t)) return "b06_competitive_scan";

  return "b10_ops_sops";
}
