import crypto from "crypto";

export function generateRefreshToken() {
  return crypto.randomBytes(64).toString("hex");
}

export function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}
router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;
  const hashed = hashToken(refreshToken);

  const record = await db.query.refreshTokens.findFirst({
    where: eq(refreshTokens.tokenHash, hashed)
  });

  if (!record || record.expiresAt < new Date()) {
    return res.status(401).json({ error: "Invalid refresh token" });
  }

  await db.delete(refreshTokens).where(eq(refreshTokens.id, record.id));

  const newRefresh = generateRefreshToken();
  const newHash = hashToken(newRefresh);

  await db.insert(refreshTokens).values({
    userId: record.userId,
    tokenHash: newHash,
    expiresAt: addDays(new Date(), 30)
  });

  const accessToken = signJwt({ id: record.userId });

  res.json({ accessToken, refreshToken: newRefresh });
});