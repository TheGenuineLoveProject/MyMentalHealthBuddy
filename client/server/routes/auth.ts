import { Router } from "express";
import { z } from "zod";

const Register = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});
const Login = Register.pick({ email: true, password: true });

export const auth = Router();

auth.post("/register", (req, res) => {
  const parsed = Register.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const users: Map<string, any> = (req as any).users;
  const exists = users.get(parsed.data.email);
  if (exists) return res.status(409).json({ error: "email_exists" });

  users.set(parsed.data.email, {
    id: crypto.randomUUID(),
    ...parsed.data,
  });

  (res as any).setSession(parsed.data.email);
  res.json({ ok: true, user: { name: parsed.data.name, email: parsed.data.email } });
});

auth.post("/login", (req, res) => {
  const parsed = Login.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const users: Map<string, any> = (req as any).users;
  const u = users.get(parsed.data.email);
  if (!u || u.password !== parsed.data.password) {
    return res.status(401).json({ error: "invalid_credentials" });
  }
  (res as any).setSession(u.email);
  res.json({ ok: true, user: { name: u.name, email: u.email } });
});

auth.post("/logout", (_req, res) => {
  (res as any).setSession(null);
  res.json({ ok: true });
});

auth.get("/me", (req, res) => {
  const users: Map<string, any> = (req as any).users;
  const email = (req as any).session?.email;
  const u = email ? users.get(email) : null;
  res.json({ user: u ? { name: u.name, email: u.email } : null });
});
