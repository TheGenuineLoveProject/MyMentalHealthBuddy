export async function classifyCrisis(openai, message) {
  const prompt = `
You are a safety classifier.
Respond ONLY with "CRISIS" or "NO_CRISIS".

CRISIS = user expresses suicidal ideation, desire to die, self-harm intent, or hopelessness indicating risk.
NO_CRISIS = everything else.

User message:
"${message}"
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "system", content: prompt }],
    temperature: 0,
    max_tokens: 3
  });

  return response.choices[0].message.content.trim();
}