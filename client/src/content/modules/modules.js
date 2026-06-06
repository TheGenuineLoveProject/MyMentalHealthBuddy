// client/src/content/modules/moduleRegistry.js
import { MI_CARD_SET } from "./miContent";
import { NLP_REFRAMES } from "./nlpContent";
import { TWELVE_PRACTICES } from "./twelvePracticesContent";

export const MODULES = {
  mi: {
    key: "mi",
    title: "Motivational Interviewing Prompts",
    description: "OARS prompts, change-talk questions, and tiny commitments (educational, not therapy).",
    payload: MI_CARD_SET,
  },
  nlp: {
    key: "nlp",
    title: "Reframe Language Toolkit",
    description: "Safe self-talk templates and gentle reframes (no manipulation language, no is designed to support).",
    payload: NLP_REFRAMES,
  },
  "12practices": {
    key: "12practices",
    title: "12 Practices Path",
    description: "Daily practices for mind–body–soul growth (non-substance framing).",
    payload: TWELVE_PRACTICES,
  },
};

export function getModules(keys = []) {
  return (keys || [])
    .map((k) => MODULES[k])
    .filter(Boolean);
}