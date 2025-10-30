#!/usr/bin/env node
/**
 * generateCovers.mjs — v13.5 safe edition
 * ✅ Works even if org not verified (uses fallback)
 * ✅ Uses valid DALL·E sizes only (1024x1024)
 * ✅ Logs and skips gracefully instead of crashing
 */

import fs from "fs";
import OpenAI from "openai";

const ai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const reportsDir = "public/analytics/reports";
const coversDir = "public/analytics/covers";

fs.mkdirSync(coversDir, { recursive: true });

// list all PDFs
const reports = fs.readdirSync(reportsDir).filter(f => f.endsWith(".pdf"));

for (const file of reports) {
  const name = file.replace(".pdf", "");
  const out = `${coversDir}/${name}.png`;

  if (fs.existsSync(out)) {
    console.log("🖼️  Already has cover:", out);
    continue;
  }

  // description prompt
  const prompt = `Create a serene, abstract image representing healing, growth, and reflection for report: ${name}`;

  // === fallback path ===
  if (process.env.DISABLE_AI_IMAGES === "true") {
    fs.writeFileSync(out, "");
    console.log("⚪ Skipped (AI images disabled):", out);
    continue;
  }

  try {
    const img = await ai.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024"
    });

    const b64 = img.data[0].b64_json;
    fs.writeFileSync(out, Buffer.from(b64, "base64"));
    console.log("✅ Cover generated:", out);

  } catch (err) {
    // graceful fallback
    if (String(err).includes("organization must be verified")) {
      console.warn("⚠️ OpenAI org not verified yet. Skipping image generation.");
      fs.writeFileSync(out, "");
    } else {
      console.error("❌ Error generating cover:", err.message || err);
    }
  }
}

console.log("🎯 Cover generation complete.");