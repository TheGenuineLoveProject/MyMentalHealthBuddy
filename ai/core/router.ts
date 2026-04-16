import { assertEngineAccess, assertDataBoundary, type Engine, type Audience } from './policy.js';
import { assessRisk } from './risk.js';

interface RouteInput {
  engine:      Engine;
  audience:    Audience;
  userText:    string;
  intentHint?: string;
}

export function routePrompt(input: RouteInput): string {
  assertEngineAccess(input.engine, input.audience);
  assertDataBoundary(input.engine, input.userText);

  // CRISIS-FIRST: always evaluate raw userText for crisis signals BEFORE
  // any intent routing. intentHint must never suppress safety routing.
  if (input.engine === 'healing') {
    const risk = assessRisk(input.userText);
    if (risk.crisis) return 'h08_safety_check';
  }

  const t = (input.intentHint ?? input.userText).toLowerCase();

  if (input.engine === 'healing') {
    if (/(intake|new here|first time|getting started)/i.test(t))           return 'h01_intake';
    if (/(journal|reflect|write|diary|today i feel)/i.test(t))             return 'h02_journal_reflect';
    if (/(reframe|cbt|thought|anxious|spiral|overthink)/i.test(t))         return 'h03_cbt_reframe';
    if (/(values|meaning|purpose|what matters|act therapy)/i.test(t))      return 'h04_act_values';
    if (/(breath|ground|calm|panic|overwhelm|5-4-3)/i.test(t))             return 'h05_breathing_grounding';
    if (/(sleep|insomnia|tired|rest|can.t sleep)/i.test(t))                return 'h06_sleep_reset';
    if (/(conflict|relationship|argument|communicate|partner)/i.test(t))   return 'h07_conflict_script';
    return 'h02_journal_reflect';
  }

  if (/(offer|value prop|position|product design)/i.test(t))   return 'b01_offer_design';
  if (/(funnel|conversion|landing|sales page)/i.test(t))       return 'b02_funnel_map';
  if (/(content|blog|social|tiktok|reel|newsletter)/i.test(t)) return 'b03_content_factory';
  if (/(email|drip|sequence|nurture|autorespond)/i.test(t))    return 'b04_email_sequences';
  if (/(seo|keyword|search rank|organic traffic)/i.test(t))    return 'b05_seo_briefs';
  if (/(competitor|market intel|competitive)/i.test(t))        return 'b06_competitive_scan';
  if (/(price|tier|packaging|subscription plan)/i.test(t))     return 'b07_pricing_packaging';
  if (/(retain|churn|loyalty|re-engage|win.back)/i.test(t))    return 'b08_retention_loyalty';
  if (/(partner|affiliate|sponsor|collab)/i.test(t))           return 'b09_partnerships';
  return 'b10_ops_sops';
}
