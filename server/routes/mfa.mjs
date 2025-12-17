import express from "express";
import speakeasy from "speakeasy";
import QRCode from "qrcode";
import { sql } from "drizzle-orm";
import db from "../db/client.mjs";
import { requireAuth } from "../middleware/auth.mjs";
import { audit } from "../security/audit.mjs";
import { sha256 } from "../utils/hash.mjs";
import { signAccessToken } from "../utils/jwt.mjs";

const router = express.Router();

function makeBackupCodes() {
  return Array.from({ length: 8 }).map(() =>
    Math.random().toString(36).slice(2, 10).toUpperCase()
  );
}

router.post("/setup", requireAuth, async (req, res) => {
  try {
    const secret = speakeasy.generateSecret({ name: "TheGenuineLoveProject" });
    const otpauth_url = secret.otpauth_url;

    const qr = await QRCode.toDataURL(otpauth_url);

    await db.execute(sql`UPDATE users SET mfa_secret=${secret.base32}, mfa_enabled=FALSE WHERE id=${req.user.id}`);

    await audit(req, "mfa.setup");
    res.json({ qr, secret: secret.base32 });
  } catch (err) {
    console.error("MFA setup error:", err);
    res.status(500).json({ message: "MFA setup failed" });
  }
});

router.post("/verify", requireAuth, async (req, res) => {
  try {
    const { code } = req.body || {};
    if (!code) return res.status(400).json({ message: "Missing code" });

    const r = await db.execute(sql`SELECT * FROM users WHERE id=${req.user.id} LIMIT 1`);
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
    const hashedBackups = JSON.stringify(backups.map(c => sha256(c)));
    
    await db.execute(sql`UPDATE users SET mfa_enabled=TRUE, mfa_backup_codes=${hashedBackups} WHERE id=${req.user.id}`);

    await audit(req, "mfa.enabled");

    const accessToken = signAccessToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role || "user",
      subscription_status: user.subscription_status || "free",
    });

    res.json({ ok: true, backupCodes: backups, accessToken });
  } catch (err) {
    console.error("MFA verify error:", err);
    res.status(500).json({ message: "MFA verification failed" });
  }
});

router.post("/disable", requireAuth, async (req, res) => {
  try {
    await db.execute(sql`UPDATE users SET mfa_enabled=FALSE, mfa_secret=NULL, mfa_backup_codes=NULL WHERE id=${req.user.id}`);
    await audit(req, "mfa.disabled");
    res.json({ ok: true });
  } catch (err) {
    console.error("MFA disable error:", err);
    res.status(500).json({ message: "Failed to disable MFA" });
  }
});

export default router;
