import express from "express";
import speakeasy from "speakeasy";
import QRCode from "qrcode";
import bcrypt from "bcrypt";
import db from "../db/client.mjs";
import { requireAuth } from "../middleware/auth.mjs";
import { writeAudit } from "../security/audit.mjs";
import { authMiddleware } from "../security/authMiddleware.mjs";
import { audit } from "../security/audit.mjs";
import { sha256, signAccessToken } from "../security/tokens.mjs";

const router = express.Router();

function makeBackupCodes() {
  return Array.from({ length: 8 }).map(() =>
    Math.random().toString(36).slice(2, 10).toUpperCase()
  );
}

router.post("/setup", requireAuth, async (req, res) => {
  const secret = speakeasy.generateSecret({ name: "TheGenuineLoveProject" });
  const otpauth_url = secret.otpauth_url;

  const qr = await QRCode.toDataURL(otpauth_url);

  // store secret but not enabled until verified
  await db.execute(
    `UPDATE users SET mfa_secret=$1, mfa_enabled=FALSE WHERE id=$2`,
    [secret.base32, req.user.id]
  );

  await audit(req, "mfa.setup");
  res.json({ qr, secret: secret.base32 });
});

router.post("/verify", requireAuth, async (req, res) => {
  const { code } = req.body || {};
  if (!code) return res.status(400).json({ message: "Missing code" });

  const r = await db.execute(`SELECT * FROM users WHERE id=$1 LIMIT 1`, [req.user.id]);
  const user = r.rows?.[0] || r[0]?.[0];
  if (!user?.mfa_secret) return res.status(400).json({ message: "MFA not setup" });

  const ok = speakeasy.totp.verify({
    secret: user.mfa_secret,
    encoding: "base32",
    token: code,
    window: 1,
  });

  if (!ok) {
    await audit(req, "mfa.verify.fail");
    return res.status(401).json({ message: "Invalid code" });
  }

  const backups = makeBackupCodes();
  await db.execute(
    `UPDATE users SET mfa_enabled=TRUE, mfa_backup_codes=$1 WHERE id=$2`,
    [JSON.stringify(backups.map(sha256)), req.user.id]
  );

  await audit(req, "mfa.enabled");

  // issue fresh access token including latest role/subscription
  const accessToken = signAccessToken({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role || "user",
    subscription_status: user.subscription_status || "free",
  });

  res.json({ ok: true, backupCodes: backups, accessToken });
});

router.post("/disable", requireAuth, async (req, res) => {
  await db.execute(
    `UPDATE users SET mfa_enabled=FALSE, mfa_secret=NULL, mfa_backup_codes=NULL WHERE id=$1`,
    [req.user.id]
  );
  await audit(req, "mfa.disabled");
  res.json({ ok: true });
});

export default router;