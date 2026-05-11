#!/usr/bin/env node
/**
 * SEO Content Generator
 * Uses OpenAI to generate blog posts targeting specific keywords
 * Human review required before publishing
 */

import { openai } from '../server/services/openai.mjs';
import { db } from '../server/db/index.mjs';
import { blogPosts } from '../shared/schema.mjs';

const KEYWORD_TEMPLATES = [
  {
    keyword: "gaslighting signs",
    title: "13 Signs You're Being Gaslighted (+ How to Reclaim Your Reality)",
    outline: [
      "What is gaslighting (clinical definition)",
      "13 signs with real-world examples",
      "The neuroscience: why gaslighting works",
      "Self-assessment: are you experiencing gaslighting?",
      "Evidence-based recovery approaches",
      "When to seek professional help"
    ]
  },
  {
    keyword: "cognitive distortions",
    title: "The 14 Cognitive Distortions Making You Miserable (And How to Fix Them)",
    outline: [
      "What are cognitive distortions (Beck's framework)",
      "All 14 distortions explained with examples",
      "Interactive: identify your top 3 distortions",
      "CBT techniques to challenge each one",
      "Daily practice: thought record template"
    ]
  }
  // Add more templates
];

async function generatePost(template) {
  const prompt = `Write a comprehensive, evidence-based blog post titled "${template.title}".
  
  Target keyword: ${template.keyword}
  
  Outline: ${template.outline.join('\n')}
  
  Requirements:
  - 2000-3000 words
  - APA citations where referencing research
  - Trauma-informed language throughout
  - Include a self-assessment tool or worksheet
  - End with CTA to MMHB platform
  - Format in Markdown
  - Meta description: 155 characters max
  `;
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 4000
  });
  
  return {
    title: template.title,
    slug: template.keyword.replace(/\s+/g, '-'),
    content: response.choices[0].message.content,
    keyword: template.keyword,
    status: 'DRAFT',
    createdAt: new Date()
  };
}

async function main() {
  for (const template of KEYWORD_TEMPLATES) {
    console.log(`Generating: ${template.title}`);
    const post = await generatePost(template);
    await db.insert(blogPosts).values(post);
    console.log(`✅ Saved draft: ${post.slug}`);
  }
}

main().catch(console.error);
