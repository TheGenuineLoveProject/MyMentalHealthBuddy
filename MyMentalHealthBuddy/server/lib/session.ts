import type { Request, Response, NextFunction } from "express";
import crypto from "crypto";

type User = { id: string; name: string; email: string; password: string };
const users = new Map<string, User>();         // email -> user
const sessions = new Map<string, { email: string }>(); // sid -> data

const COOKIE = "mmhb.sid";
const SECRET = process.env.SESSION_SECRET ?? "dev-secret-change-me";

function sign(val: string) {
  const h = crypto.createHmac("sha256", SECRET).update(val).digest("base64url");
  return `${val}.${h}`;
}
function unsign(signed: string | undefined) {
  if (!signed) return null;
  const i = signed.lastIndexOf(".");
  if (i < 0) return null;
  const raw = signed.slice(0, i);
  return sign(raw) === signed ? raw : null;
}

export function session(req: Request, res: Response, next: NextFunction) {
  const raw = unsign(req.cookies?.[COOKIE]);
  if (raw && sessions.has(raw)) {
    (req as any).session = sessions.get(raw);
  } else {
    (req as any).session = null;
  }
  (res as any).setSession = (email: string | null) => {
    if (email) {
      const sid = crypto.randomUUID();
      sessions.set(sid, { email });
      res.cookie(COOKIE, sign(sid), { httpOnly: true, sameSite: "lax", path: "/" });
    } else {
      const signed = req.cookies?.[COOKIE];
      const sid = unsign(signed);
      if (sid) sessions.delete(sid);
      res.clearCookie(COOKIE, { path: "/" });
    }
  };
  (req as any).users = users;
  next();
}

export type { User };
