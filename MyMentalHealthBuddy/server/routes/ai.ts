import type { Router } from 'express';
import { zChatRequest } from '../../shared/validation.js';
import { HealerBot } from '../ai/employee.js';

const bot = new HealerBot();

export default function mountAI(r: Router) {
  r.get('/ai/health', (_req, res) => res.json({ ok: true, bot: bot.name }));
  r.post('/ai/chat', async (req, res) => {
    const parsed = zChatRequest.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const last = parsed.data.messages.at(-1)!;
    const out = await bot.respond(last.content);
    res.json({ id: 'chat_' + Date.now(), reply: out.reply, usedTools: out.used, meta: out.meta });
  });
}