/**
 * CONTENT_AUTOMATION_GLP_v1.0_8888^
 * © Maria Landa / The Genuine Love Project / MyMentalHealthBuddy
 * Safe, human-triggered content pack generator (dev-only)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";

if (process.env.NODE_ENV === "production") {
  console.log("⚠️ Content automation disabled in production. Run this in development only.");
  process.exit(0);
}

if (!process.env.OPENAI_API_KEY) {
  console.log("❌ Missing OPENAI_API_KEY in .env");
  process.exit(1);
}

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure output directory exists
const rootDir = path.resolve(__dirname, "..");
const outputDir = path.join(rootDir, "content_output");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// COMMAND LINE ARGS
const topic = process.argv[2] || "self-love and emotional healing";
const audience =
  process.argv[3] || "sensitive, overwhelmed adults seeking gentle healing";

const iso = new Date().toISOString().replace(/:/g, "-");
const safeTopic = topic.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "topic";

const fileName = `${iso}-${safeTopic}.md`;
const filePath = path.join(outputDir, fileName);

// OpenAI init
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// System Prompt
const systemPrompt = `
You are the content-generation partner for "The Genuine Love Project".
Tagline: "Live in Genuine Love."

Tone:
- Warm, compassionate, hopeful
- Trauma-aware
- No toxic positivity
- Validating and gentle

Safety:
- Not therapy
- Not medical advice
- Encourage professional/urgent support when needed
`;

// User Prompt
const userPrompt = `
Create a complete multi-platform content pack.

Brand: The Genuine Love Project  
Topic: ${topic}  
Audience: ${audience}  

Required sections (Markdown):

# Master Concept

## Instagram Post + Caption
- Short post idea
- 1 caption (max 180 words)
- 3–5 hashtags

## TikTok/Reel Hooks
- 5 hooks under 15 words
- 3 on-screen text ideas

## YouTube Title & Description
- 3 title options
- 1 description (150–250 words)

## Email Subject & Body
- 3 subject options
- 1 email body (250–400 words)

## Blog Outline
- H2/H3 headings
- 3–5 bullets per section

## Disclaimers & Safety
- Not therapy
- Not crisis advice
- Encourage seeking help
`;

async function main() {
  try {
    console.log("🧠 Generating content pack...");
    console.log("📌 Topic:", topic);

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7
    });

    const result = completion.choices?.[0]?.message?.content || "";

    if (!result.trim()) {
      console.log("❌ Empty response from OpenAI");
      process.exit(1);
    }

    fs.writeFileSync(filePath, result, "utf8");

    console.log("✅ Content pack created!");
    console.log("📄 Saved to:", filePath);
    console.log("✨ Open the file inside content_output/");
  } catch (err) {
    console.error("❌ Error:", err.message || err);
    process.exit(1);
  }
}

main();