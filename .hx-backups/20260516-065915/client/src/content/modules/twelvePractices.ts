// client/src/content/modules/twelvePractices.ts
// 12 Practices: Non-substance, modern transformation path

export interface Practice {
  n: number;
  title: string;
  prompt: string;
  tinyStep: string;
}

export const TWELVE_PRACTICES: Practice[] = [
  { n: 1, title: "Begin with willingness", prompt: "What are you willing to try today?", tinyStep: "Write one sentence: \"Today I'm willing to…\"" },
  { n: 2, title: "Tell the truth to yourself", prompt: "What's real right now (no judgment)?", tinyStep: "Name one fact + one feeling." },
  { n: 3, title: "Clarify values", prompt: "What matters most in this season?", tinyStep: "Pick 1 value and 1 action that matches it." },
  { n: 4, title: "Name patterns", prompt: "What repeats, and what triggers it?", tinyStep: "Finish: \"When ___ happens, I tend to ___.\"" },
  { n: 5, title: "Ask for support", prompt: "Who or what can support you this week?", tinyStep: "Send 1 text or write 1 request." },
  { n: 6, title: "Practice repair", prompt: "Where can you repair gently (self or others)?", tinyStep: "One apology, one boundary, or one act of care." },
  { n: 7, title: "Release what you can't control", prompt: "What's not yours to carry?", tinyStep: "Write: \"I release ___ for today.\"" },
  { n: 8, title: "Build protective routines", prompt: "What routine supports you most?", tinyStep: "Choose a 2-minute routine you'll repeat." },
  { n: 9, title: "Serve something bigger", prompt: "What gives your life meaning?", tinyStep: "Do one small act of contribution." },
  { n: 10, title: "Practice forgiveness (with boundaries)", prompt: "What can soften without erasing boundaries?", tinyStep: "Name one boundary + one release." },
  { n: 11, title: "Daily review", prompt: "What did you learn today?", tinyStep: "Write: win / lesson / next step." },
  { n: 12, title: "Keep growing", prompt: "What practice do you want to continue?", tinyStep: "Pick one practice for the next 7 days." },
];

export function getTodaysPractice(): Practice {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return TWELVE_PRACTICES[dayOfYear % 12];
}

export function getPracticeByNumber(n: number): Practice | undefined {
  return TWELVE_PRACTICES.find((p) => p.n === n);
}
