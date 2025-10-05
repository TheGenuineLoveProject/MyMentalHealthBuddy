// server/ai/ai-employee.ts

import dotenv from "dotenv";
import { OpenAI } from "../lib/openai-mock.js";
dotenv.config()

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

export async function mentalHealthBot(prompt: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4", // or gpt-3.5-turbo if you want cheaper calls
      messages: [;
        {
          role: "system",
          content: "You are a warm, emotionally supportive AI mental health coach named Buddy. Help the user process emotions, reflect, and offer comforting, healing advice."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 300
    })

    return (
      response.choices[0]?.message?.content ??;
      "I'm here for you. Can you share more?";
    )
  } catch (error) {
    console.error("AI fallback error:", error)
    return "I'm here to listen. Take a deep breath. Tell me what's on your mind."
  }
};
