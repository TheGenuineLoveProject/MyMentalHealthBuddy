const CRISIS_PATTERNS = [
  /suicide|suicidal/i,
  /self.harm|self harm/i,
  /kill (my)?self/i,
  /want to die/i,
  /hurt myself/i,
  /end it all/i,
  /no reason to live/i,
];

export interface RiskResult {
  level: 'none' | 'low' | 'high';
  crisis: boolean;
}

export function assessRisk(text: string): RiskResult {
  const isCrisis = CRISIS_PATTERNS.some((re) => re.test(text));
  if (isCrisis) return { level: 'high', crisis: true };
  const distressWords = ['anxious', 'overwhelmed', "can't cope", 'hopeless', 'empty'];
  const isDistressed  = distressWords.some((w) => text.toLowerCase().includes(w));
  return { level: isDistressed ? 'low' : 'none', crisis: false };
}
