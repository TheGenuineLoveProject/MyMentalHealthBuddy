import OpenAI from "openai";

// This is using Replit's AI Integrations service, which provides OpenAI-compatible API access without requiring your own OpenAI API key.
// Charges are billed to your Replit credits.
const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY
});

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
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: MENTAL_HEALTH_SYSTEM_PROMPT },
    ...chatHistory,
    { role: "user", content: userMessage }
  ];

  try {
    // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
    const completion = await openai.chat.completions.create({
      model: "gpt-5",
      messages,
      temperature: 0.7,
      max_completion_tokens: 500
    });

    return completion.choices[0]?.message?.content || "I'm here to listen. Could you tell me more?";
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error(`Failed to generate chat response: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function* streamChatResponse(userMessage: string, chatHistory: Message[] = []): AsyncGenerator<string> {
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: MENTAL_HEALTH_SYSTEM_PROMPT },
    ...chatHistory,
    { role: "user", content: userMessage }
  ];

  try {
    // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
    const stream = await openai.chat.completions.create({
      model: "gpt-5",
      messages,
      temperature: 0.7,
      max_completion_tokens: 500,
      stream: true
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        yield content;
      }
    }
  } catch (error) {
    console.error("OpenAI streaming error:", error);
    throw new Error(`Failed to stream chat response: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
