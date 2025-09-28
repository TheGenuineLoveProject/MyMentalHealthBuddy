export const CRISIS_NOTE = `— — —
This is educational support, not medical advice. 
If you are in danger or considering self-harm, call your local emergency number now.
In the U.S., dial or text 988 (Suicide & Crisis Lifeline).`;

export function withSafety(text: string) {
  return `${text.trim()}\n\n${CRISIS_NOTE}`;
}