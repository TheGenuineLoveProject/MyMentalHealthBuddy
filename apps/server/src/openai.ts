const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

const MENTAL_HEALTH_SYSTEM_PROMPT = `You are a compassionate mental health support assistant. Your role is to:

1. Listen actively and validate the user's feelings
2. Provide supportive, non-judgmental responses
3. Offer coping strategies and mental health techniques when appropriate
4. Encourage professional help when needed
5. Never diagnose or prescribe medical treatments
6. Maintain a warm, empathetic tone

Remember:
- You are NOT a replacement for professional therapy
- Always prioritize the user's safety and well-being
- If someone expresses thoughts of self-harm or suicide, encourage them to contact crisis resources immediately
- Use trauma-informed language and be sensitive to triggers`;

export async function generateChatResponse(userMessage: string, chatHistory: Message[] = []): Promise<string> {
  if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY not configured");
  }

  const messages: Message[] = [
    { role: "system", content: MENTAL_HEALTH_SYSTEM_PROMPT },
    ...chatHistory,
    { role: "user", content: userMessage }
  ];

  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages,
      temperature: 0.7,
      max_tokens: 500
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || "I'm here to listen. Could you tell me more?";
}

export async function* streamChatResponse(userMessage: string, chatHistory: Message[] = []): AsyncGenerator<string> {
  if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY not configured");
  }

  const messages: Message[] = [
    { role: "system", content: MENTAL_HEALTH_SYSTEM_PROMPT },
    ...chatHistory,
    { role: "user", content: userMessage }
  ];

  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages,
      temperature: 0.7,
      max_tokens: 500,
      stream: true
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${error}`);
  }

  if (!response.body) {
    throw new Error("No response body");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n").filter(line => line.trim().startsWith("data: "));

      for (const line of lines) {
        const data = line.replace("data: ", "").trim();
        if (data === "[DONE]") continue;
        
        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices[0]?.delta?.content;
          if (content) {
            yield content;
          }
        } catch (e) {
          console.error("Error parsing SSE data:", e);
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
