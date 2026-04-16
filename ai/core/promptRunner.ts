import OpenAI from 'openai';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { logEvent, Events } from './telemetry.js';

const __dir = dirname(fileURLToPath(import.meta.url));
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface RegistryEntry { id: string; intent?: string[]; risk?: string }
interface Registry { engine: string; version: string; prompts: RegistryEntry[] }

const registries: Record<'healing' | 'business', Set<string>> = {
  healing:  loadRegistryIds('healing'),
  business: loadRegistryIds('business'),
};

function loadRegistryIds(engine: 'healing' | 'business'): Set<string> {
  try {
    const path = join(__dir, '..', engine, 'registry.json');
    const reg = JSON.parse(readFileSync(path, 'utf-8')) as Registry;
    return new Set(reg.prompts.map((p) => p.id));
  } catch {
    return new Set();
  }
}

const VALID_PROMPT_ID = /^[a-z]\d{2}_[a-z0-9_]+$/;

export async function runPrompt(
  engine: 'healing' | 'business',
  promptId: string,
  userText: string
): Promise<string> {
  if (!VALID_PROMPT_ID.test(promptId) || promptId.includes('/') || promptId.includes('\\') || promptId.includes('..')) {
    throw new Error(`Invalid promptId format: '${promptId}'.`);
  }
  if (!registries[engine].has(promptId)) {
    throw new Error(`Prompt '${promptId}' not registered in '${engine}' engine.`);
  }

  const folder  = engine === 'healing' ? 'healing' : 'business';
  const sysPath = join(__dir, '..', folder, 'system.md');
  const prmPath = join(__dir, '..', folder, 'prompts', `${promptId}.md`);
  const system  = readFileSync(sysPath, 'utf-8');
  const prompt  = readFileSync(prmPath, 'utf-8');
  const t0 = Date.now();

  const res = await openai.chat.completions.create({
    model:    process.env.OPENAI_MODEL ?? 'gpt-4o-mini',
    messages: [
      { role: 'system', content: `${system}\n\n## Active Prompt Module\n${prompt}` },
      { role: 'user',   content: userText },
    ],
    max_tokens:  800,
    temperature: engine === 'healing' ? 0.5 : 0.7,
  });

  logEvent(Events.PROMPT_EXECUTED, {
    engine,
    promptId,
    audience:  'n/a',
    latencyMs: Date.now() - t0,
    meta:      { tokens: res.usage?.total_tokens },
  });

  return res.choices[0]?.message?.content ?? '';
}
