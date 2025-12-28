/**
 * AI Guardrails - The Genuine Love Project
 * 
 * MANDATORY RULES:
 * - Never instruct - No directives, only observations and questions
 * - Never diagnose - No labeling or pathologizing experiences
 * - Never promise healing - We offer reflection space, not cures
 * - Never imply deficiency - Every state is observed neutrally
 * - Always allow disagreement - Users can reject any content
 */

export const AI_CONSTRAINTS = {
  maxResponseLength: 500,
  minQuestionsRatio: 0.8,
  requiredDisclaimer: "You know yourself best.",
  forbiddenPatterns: [
    /you should/gi,
    /you must/gi,
    /you need to/gi,
    /you have to/gi,
    /i recommend/gi,
    /my advice/gi,
    /the best way/gi,
    /you will feel/gi,
    /this will help/gi,
    /trust me/gi,
    /i know exactly/gi,
    /you're definitely/gi,
    /normal people/gi,
    /you're broken/gi,
    /what's wrong with you/gi,
  ],
};

export function countQuestions(text) {
  const questions = (text.match(/\?/g) || []).length;
  const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length || 1;
  return { questions, sentences, ratio: questions / sentences };
}

export function validateAIResponse(response) {
  const issues = [];

  if (response.length > AI_CONSTRAINTS.maxResponseLength) {
    issues.push({
      type: "length",
      message: `Response too long (${response.length} > ${AI_CONSTRAINTS.maxResponseLength})`,
    });
  }

  for (const pattern of AI_CONSTRAINTS.forbiddenPatterns) {
    if (pattern.test(response)) {
      issues.push({
        type: "forbidden_pattern",
        message: `Contains forbidden pattern: ${pattern.source}`,
        pattern: pattern.source,
      });
    }
  }

  if (!response.toLowerCase().includes(AI_CONSTRAINTS.requiredDisclaimer.toLowerCase())) {
    issues.push({
      type: "missing_disclaimer",
      message: "Missing required disclaimer",
    });
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

export function enforceQuestionRatio(response, targetRatio = 0.8) {
  const { questions, sentences, ratio } = countQuestions(response);

  if (ratio >= targetRatio) {
    return { modified: false, response, ratio };
  }

  const neededQuestions = Math.ceil(sentences * targetRatio) - questions;

  const gentleQuestions = [
    "What feels most true in what you wrote?",
    "What would you want to feel more of?",
    "What small step might feel respectful to you?",
    "What do you notice in your body right now?",
    "What would kindness look like here?",
  ];

  const additionalQuestions = gentleQuestions
    .slice(0, Math.min(neededQuestions, 2))
    .join("\n");

  const enhancedResponse = `${response}\n\n${additionalQuestions}`;
  const newStats = countQuestions(enhancedResponse);

  return {
    modified: true,
    response: enhancedResponse,
    originalRatio: ratio,
    newRatio: newStats.ratio,
  };
}

export function sanitizeForSafety(text) {
  let result = text;

  const replacements = [
    [/you should/gi, "you might consider"],
    [/you must/gi, "you may choose to"],
    [/you need to/gi, "one option is to"],
    [/you have to/gi, "you could"],
    [/i recommend/gi, "one possibility is"],
    [/my advice is/gi, "something to consider might be"],
    [/the best way/gi, "one approach"],
    [/you will feel/gi, "you may notice"],
    [/this will help/gi, "this might offer"],
    [/trust me/gi, "if it resonates with you"],
    [/normal people/gi, "many people"],
    [/you're broken/gi, "you're experiencing something difficult"],
  ];

  for (const [pattern, replacement] of replacements) {
    result = result.replace(pattern, replacement);
  }

  return result;
}

export function buildSafeResponse(text) {
  let response = sanitizeForSafety(text);

  if (!response.toLowerCase().includes(AI_CONSTRAINTS.requiredDisclaimer.toLowerCase())) {
    response = `${response}\n\nPlease ignore anything that doesn't feel accurate or helpful. ${AI_CONSTRAINTS.requiredDisclaimer}`;
  }

  const { modified, response: enhancedResponse } = enforceQuestionRatio(response, 0.5);
  if (modified) {
    response = enhancedResponse;
  }

  return response;
}

export const SAFE_SYSTEM_PROMPT = `You are a gentle companion for The Genuine Love Project, a mental wellness journaling platform.

CORE IDENTITY:
You are a mirror, not an authority. You reflect, you don't direct.

MANDATORY RULES:
1. NEVER give advice, recommendations, or "should" statements
2. NEVER diagnose, label, or pathologize
3. NEVER promise outcomes or healing
4. NEVER create urgency or pressure
5. ALWAYS use tentative language: "It sounds like...", "You might notice...", "One possibility is..."
6. ALWAYS prioritize questions over statements (aim for 80% questions)
7. ALWAYS end with: "Please ignore anything that doesn't feel accurate or helpful. You know yourself best."

LANGUAGE STYLE:
- Use the user's own vocabulary when possible
- Speak gently, without authority
- Reflect what you hear without interpretation
- Ask questions that invite self-discovery
- Never introduce concepts the user hasn't mentioned

RESPONSE STRUCTURE:
1. Acknowledge what you heard (1-2 sentences)
2. Reflect it back neutrally (1-2 sentences)
3. Offer 1-2 gentle questions for self-inquiry
4. Close with the mandatory disclaimer

Remember: The user knows themselves better than you ever could.`;
