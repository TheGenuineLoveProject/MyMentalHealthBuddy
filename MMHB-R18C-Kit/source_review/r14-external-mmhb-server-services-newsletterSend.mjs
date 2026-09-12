/**
 * server/services/newsletterSend.mjs
 * Manual-first newsletter sending via Resend
 * No auto-sending. Admin must explicitly trigger.
 */

import { logger } from '../utils/logger.mjs';

const BATCH_SIZE = 50;

export async function sendNewsletter({ subject, htmlBody, textBody, recipients, dryRun = false, adminEmail = null }) {
  if (!subject || (!htmlBody && !textBody)) {
    return { ok: false, error: 'Subject and body are required' };
  }

  if (!recipients || recipients.length === 0) {
    return { ok: false, error: 'No recipients provided' };
  }

  let getResendClient;
  try {
    const emailService = await import('./email.mjs');
    getResendClient = emailService.getResendClient || null;
  } catch {
    return { ok: false, error: 'Resend service not available' };
  }

  if (dryRun) {
    const target = adminEmail || 'admin@genuineloveproject.com';
    logger.info('[Newsletter] Dry run — would send to admin only', { subject, recipientCount: 1 });
    try {
      const { client, fromEmail } = await getResendClient();
      await client.emails.send({
        from: fromEmail || 'The Genuine Love Project <hello@genuineloveproject.com>',
        to: target,
        subject: `[DRY RUN] ${subject}`,
        html: htmlBody || undefined,
        text: textBody || undefined,
      });
      return { ok: true, sent: 1, dryRun: true, target };
    } catch (err) {
      logger.error('[Newsletter] Dry run failed', { error: err.message });
      return { ok: false, error: err.message, dryRun: true };
    }
  }

  let sentCount = 0;
  let failCount = 0;
  const batches = [];

  for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
    batches.push(recipients.slice(i, i + BATCH_SIZE));
  }

  logger.info('[Newsletter] Starting send', { subject, totalRecipients: recipients.length, batches: batches.length });

  for (const batch of batches) {
    try {
      const { client, fromEmail } = await getResendClient();
      for (const email of batch) {
        try {
          await client.emails.send({
            from: fromEmail || 'The Genuine Love Project <hello@genuineloveproject.com>',
            to: email,
            subject,
            html: htmlBody || undefined,
            text: textBody || undefined,
          });
          sentCount++;
        } catch (err) {
          failCount++;
          logger.error('[Newsletter] Individual send failed', { error: err.message });
        }
      }
    } catch (err) {
      failCount += batch.length;
      logger.error('[Newsletter] Batch send failed', { error: err.message });
    }
  }

  logger.info('[Newsletter] Send complete', { sent: sentCount, failed: failCount });
  return { ok: true, sent: sentCount, failed: failCount, total: recipients.length };
}
