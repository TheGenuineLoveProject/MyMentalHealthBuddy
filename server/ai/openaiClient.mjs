import OpenAI from "openai";

// Awareness analysis is optional; importing the application must also work
// without a model credential. Its caller already skips this layer when absent.
export const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;
