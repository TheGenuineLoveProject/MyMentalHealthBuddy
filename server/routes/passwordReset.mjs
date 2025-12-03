// [MMB] Password reset stubs; connect to schema + email util
import { Router } from "express";
import { ok, fail } from "../utils/apiResponse.mjs";
import { sendPasswordResetEmail } from "../utils/email.mjs";

export const passwordResetRouter = Router();

passwordResetRouter.post("/password-reset/request", async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) return fail(res, 400, "Email required", "VALIDATION");
    // TODO: create token, hash, store, expiry
    const resetUrl = `https://app.example/reset?token=TODO`;
    await sendPasswordResetEmail({ to: email, resetUrl });
    return ok(res, null, "If that email exists, a reset link has been sent.");
  } catch {
    return fail(res, 500, "Internal error", "PASSWORD_RESET_REQUEST_FAIL");
  }
});

passwordResetRouter.post("/password-reset/confirm", async (req, res) => {
  try {
    const { token, newPassword } = req.body || {};
    if (!token || !newPassword) return fail(res, 400, "Missing fields", "VALIDATION");
    // TODO: verify token hash, expiry, mark consumed, set new password
    return ok(res, null, "Password has been reset.");
  } catch {
    return fail(res, 500, "Internal error", "PASSWORD_RESET_CONFIRM_FAIL");
  }
});