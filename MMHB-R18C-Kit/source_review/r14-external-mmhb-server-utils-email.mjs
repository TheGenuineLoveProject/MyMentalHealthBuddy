// server/utils/email.mjs
import { Resend } from "resend";
import { logger } from "./logger.mjs";

const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "no-reply@example.com";

let resend = null;

if (RESEND_API_KEY) {
  resend = new Resend(RESEND_API_KEY);
} else {
  logger.warn("RESEND_API_KEY not set. Emails will be logged but not sent");
}

export async function sendTransactionalEmail({ to, subject, html }) {
  if (!to || !subject) {
    throw new Error("Missing 'to' or 'subject' for email");
  }

  if (!resend) {
    logger.info("Skipping email send (no RESEND_API_KEY)", { to, subject });
    return { ok: false, skipped: true };
  }

  const result = await resend.emails.send({
    from: RESEND_FROM_EMAIL,
    to,
    subject,
    html
  });

  return { ok: true, result };
}
