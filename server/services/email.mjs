/**
 * Email Service - Resend Integration
 * Integration: connection:conn_resend_01KFQ9GTXKV3PY89K1GDEQGNGF
 * 
 * Handles transactional emails for The Genuine Love Project:
 * - Welcome emails
 * - Password reset
 * - Challenge reminders
 * - Journey milestones
 */

import { Resend } from 'resend';
import { logger } from '../utils/logger.mjs';

let connectionSettings = null;

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=resend',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  if (!connectionSettings || (!connectionSettings.settings.api_key)) {
    throw new Error('Resend not connected');
  }
  return {
    apiKey: connectionSettings.settings.api_key, 
    fromEmail: connectionSettings.settings.from_email
  };
}

async function getResendClient() {
  const { apiKey } = await getCredentials();
  return {
    client: new Resend(apiKey),
    fromEmail: connectionSettings.settings.from_email
  };
}

export async function sendWelcomeEmail(toEmail, userName) {
  try {
    const { client, fromEmail } = await getResendClient();
    
    const result = await client.emails.send({
      from: fromEmail || 'The Genuine Love Project <hello@genuineloveproject.com>',
      to: toEmail,
      subject: 'Welcome to The Genuine Love Project',
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="color: #2d5a4a; font-size: 28px; margin-bottom: 20px;">Welcome, ${userName || 'friend'}</h1>
          
          <p style="color: #555; font-size: 16px; line-height: 1.7;">
            You've taken a brave step by joining us. This is a quiet corner of the internet 
            built for people who carry more than they show.
          </p>
          
          <p style="color: #555; font-size: 16px; line-height: 1.7;">
            Here, you can process grief, calm your nervous system, reconnect with your inner child, 
            and learn to hold yourself with compassion—all in complete privacy.
          </p>
          
          <div style="background: #f8f5f0; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <p style="color: #2d5a4a; font-size: 16px; margin: 0;">
              <strong>Remember:</strong> You're in control. Pause or stop anytime. 
              There's no deadline—come back whenever you're ready.
            </p>
          </div>
          
          <p style="color: #555; font-size: 16px; line-height: 1.7;">
            Small steps count. You're allowed to go slowly.
          </p>
          
          <p style="color: #888; font-size: 14px; margin-top: 40px;">
            With warmth,<br>
            The Genuine Love Project
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px;">
            This is educational support—not therapy or medical advice.<br>
            If you're in crisis, call 988 or text HOME to 741741.
          </p>
        </div>
      `
    });
    
    logger.info("[Email] Welcome email sent", { toEmail });
    return { success: true, id: result.id };
  } catch (error) {
    logger.error("[Email] Failed to send welcome email", { error: error?.message || error });
    return { success: false, error: error.message };
  }
}

export async function sendChallengeReminder(toEmail, userName, dayNumber) {
  try {
    const { client, fromEmail } = await getResendClient();
    
    const result = await client.emails.send({
      from: fromEmail || 'The Genuine Love Project <hello@genuineloveproject.com>',
      to: toEmail,
      subject: `Day ${dayNumber}: Your Gentle Challenge Awaits`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="color: #2d5a4a; font-size: 24px; margin-bottom: 20px;">
            Day ${dayNumber} of Your 7-Day Gentle Challenge
          </h1>
          
          <p style="color: #555; font-size: 16px; line-height: 1.7;">
            Hi ${userName || 'friend'},
          </p>
          
          <p style="color: #555; font-size: 16px; line-height: 1.7;">
            Your next reflection is ready whenever you are. No pressure—just a gentle invitation.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://genuineloveproject.com/challenge/day/${dayNumber}" 
               style="background: #2d5a4a; color: white; padding: 14px 28px; 
                      text-decoration: none; border-radius: 8px; font-size: 16px;">
              Continue Your Journey
            </a>
          </div>
          
          <p style="color: #888; font-size: 14px; text-align: center;">
            Skip today. You're still welcome here.
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px;">
            Educational support only—not therapy.<br>
            Crisis support: 988 | Text HOME to 741741
          </p>
        </div>
      `
    });
    
    logger.info("[Email] Challenge reminder sent", { toEmail });
    return { success: true, id: result.id };
  } catch (error) {
    logger.error("[Email] Failed to send challenge reminder", { error: error?.message || error });
    return { success: false, error: error.message };
  }
}

export async function sendMilestoneEmail(toEmail, userName, milestone) {
  try {
    const { client, fromEmail } = await getResendClient();
    
    const milestoneMessages = {
      'first-reflection': {
        title: 'You Took Your First Step',
        message: 'Your first reflection is complete. That took courage.'
      },
      'week-complete': {
        title: 'One Week of Growth',
        message: 'Seven days of showing up for yourself. That\'s meaningful.'
      },
      'challenge-complete': {
        title: 'Challenge Complete',
        message: 'You finished the 7-Day Gentle Challenge. Look how far you\'ve come.'
      }
    };
    
    const content = milestoneMessages[milestone] || {
      title: 'A Moment to Celebrate',
      message: 'You\'ve reached a milestone on your journey.'
    };
    
    const result = await client.emails.send({
      from: fromEmail || 'The Genuine Love Project <hello@genuineloveproject.com>',
      to: toEmail,
      subject: content.title,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="color: #2d5a4a; font-size: 28px; margin-bottom: 20px;">
            ${content.title}
          </h1>
          
          <p style="color: #555; font-size: 16px; line-height: 1.7;">
            ${userName || 'Friend'},
          </p>
          
          <p style="color: #555; font-size: 18px; line-height: 1.7;">
            ${content.message}
          </p>
          
          <div style="background: linear-gradient(135deg, #f8f5f0 0%, #fff 100%); 
                      padding: 30px; border-radius: 12px; margin: 30px 0; text-align: center;">
            <p style="color: #2d5a4a; font-size: 20px; font-style: italic; margin: 0;">
              "Small steps count. Consistency over intensity."
            </p>
          </div>
          
          <p style="color: #888; font-size: 14px;">
            With warmth,<br>
            The Genuine Love Project
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px;">
            Educational support—not therapy or medical advice.<br>
            Crisis: 988 | Text HOME to 741741
          </p>
        </div>
      `
    });
    
    logger.info("[Email] Milestone email sent", { toEmail });
    return { success: true, id: result.id };
  } catch (error) {
    logger.error("[Email] Failed to send milestone email", { error: error?.message || error });
    return { success: false, error: error.message };
  }
}

export async function sendAccountDeletionEmail(toEmail, userName, scheduledDate) {
  try {
    const { client, fromEmail } = await getResendClient();
    
    const formattedDate = new Date(scheduledDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const result = await client.emails.send({
      from: fromEmail || 'The Genuine Love Project <hello@genuineloveproject.com>',
      to: toEmail,
      subject: 'Account Deletion Request Received',
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="color: #2d5a4a; font-size: 28px; margin-bottom: 20px;">Account Deletion Request</h1>
          
          <p style="color: #555; font-size: 16px; line-height: 1.7;">
            Dear ${userName || 'friend'},
          </p>
          
          <p style="color: #555; font-size: 16px; line-height: 1.7;">
            We've received your request to delete your account. We respect your decision and want to make sure you're aware of what happens next.
          </p>
          
          <div style="background: #fff5f5; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #e53e3e;">
            <p style="color: #c53030; font-size: 16px; margin: 0;">
              <strong>Scheduled Deletion Date:</strong><br>
              ${formattedDate}
            </p>
          </div>
          
          <p style="color: #555; font-size: 16px; line-height: 1.7;">
            <strong>What happens during the 7-day waiting period:</strong>
          </p>
          
          <ul style="color: #555; font-size: 16px; line-height: 1.7;">
            <li>Your account remains active</li>
            <li>You can cancel the deletion request at any time</li>
            <li>After 7 days, your data will be permanently removed</li>
          </ul>
          
          <p style="color: #555; font-size: 16px; line-height: 1.7;">
            If you change your mind, you can cancel this request by logging into your account and visiting the Account Settings page.
          </p>
          
          <div style="background: #f8f5f0; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <p style="color: #2d5a4a; font-size: 16px; margin: 0;">
              <strong>Didn't request this?</strong><br>
              If you didn't make this request, please log in immediately and change your password, then contact our support team.
            </p>
          </div>
          
          <p style="color: #888; font-size: 14px; margin-top: 40px;">
            Take care of yourself,<br>
            The Genuine Love Project
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px;">
            This is an automated email regarding your account.<br>
            Crisis support: 988 | Text HOME to 741741
          </p>
        </div>
      `
    });
    
    logger.info("[Email] Account deletion email sent", { toEmail });
    return { success: true, id: result.id };
  } catch (error) {
    logger.error("[Email] Failed to send account deletion email", { error: error?.message || error });
    return { success: false, error: error.message };
  }
}

export async function sendUpgradeConfirmation(toEmail, userName) {
  try {
    const { client, fromEmail } = await getResendClient();
    
    const result = await client.emails.send({
      from: fromEmail || 'The Genuine Love Project <hello@genuineloveproject.com>',
      to: toEmail,
      subject: 'Welcome to Pro — Your Healing Tools Are Unlocked',
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="color: #2d5a4a; font-size: 28px; margin-bottom: 20px;">Welcome to Pro, ${userName || 'friend'}</h1>
          
          <p style="color: #555; font-size: 16px; line-height: 1.7;">
            Thank you for choosing to invest in yourself. Your Pro membership is now active, 
            and all premium tools are unlocked.
          </p>
          
          <div style="background: #f8f5f0; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <p style="color: #2d5a4a; font-size: 16px; margin: 0 0 10px 0; font-weight: bold;">
              What's now available to you:
            </p>
            <ul style="color: #555; font-size: 15px; line-height: 1.8; margin: 0; padding-left: 20px;">
              <li>Unlimited AI wellness conversations</li>
              <li>Advanced insights and analytics</li>
              <li>Full healing journey access</li>
              <li>All premium wellness tools</li>
            </ul>
          </div>
          
          <p style="color: #555; font-size: 16px; line-height: 1.7;">
            There's no rush to explore everything at once. 
            Take your time — your tools will be here whenever you're ready.
          </p>
          
          <p style="color: #555; font-size: 16px; line-height: 1.7;">
            You can manage your subscription anytime from your 
            <a href="https://genuineloveproject.com/account/billing" style="color: #2d5a4a; text-decoration: underline;">billing page</a>.
          </p>
          
          <p style="color: #888; font-size: 14px; margin-top: 40px;">
            With gratitude,<br>
            The Genuine Love Project
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px;">
            This is educational support—not therapy or medical advice.<br>
            If you're in crisis, call 988 or text HOME to 741741.
          </p>
        </div>
      `
    });
    
    logger.info("[Email] Upgrade confirmation sent", { toEmail });
    return { success: true, id: result.id };
  } catch (error) {
    logger.error("[Email] Failed to send upgrade confirmation", { error: error?.message || error });
    return { success: false, error: error.message };
  }
}

export async function sendCancellationAcknowledgment(toEmail, userName, periodEnd) {
  try {
    const { client, fromEmail } = await getResendClient();
    
    const endDate = periodEnd 
      ? new Date(periodEnd * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      : 'the end of your current billing period';
    
    const result = await client.emails.send({
      from: fromEmail || 'The Genuine Love Project <hello@genuineloveproject.com>',
      to: toEmail,
      subject: 'Your Subscription Update',
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="color: #2d5a4a; font-size: 28px; margin-bottom: 20px;">We hear you, ${userName || 'friend'}</h1>
          
          <p style="color: #555; font-size: 16px; line-height: 1.7;">
            Your Pro subscription has been canceled. You'll continue to have access to all Pro features 
            until <strong>${endDate}</strong>.
          </p>
          
          <p style="color: #555; font-size: 16px; line-height: 1.7;">
            After that, your account will return to the free plan. 
            Your journal entries, mood history, and all your data will still be here — nothing gets deleted.
          </p>
          
          <div style="background: #f8f5f0; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <p style="color: #2d5a4a; font-size: 16px; margin: 0;">
              <strong>Changed your mind?</strong><br>
              You can resubscribe anytime from your 
              <a href="https://genuineloveproject.com/account/billing" style="color: #2d5a4a; text-decoration: underline;">billing page</a>. 
              No pressure — come back whenever feels right.
            </p>
          </div>
          
          <p style="color: #555; font-size: 16px; line-height: 1.7;">
            Core wellness tools like journaling, mood tracking, and daily reflection 
            will always be free. You're welcome here no matter what.
          </p>
          
          <p style="color: #888; font-size: 14px; margin-top: 40px;">
            With care,<br>
            The Genuine Love Project
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px;">
            This is educational support—not therapy or medical advice.<br>
            If you're in crisis, call 988 or text HOME to 741741.
          </p>
        </div>
      `
    });
    
    logger.info("[Email] Cancellation acknowledgment sent", { toEmail });
    return { success: true, id: result.id };
  } catch (error) {
    logger.error("[Email] Failed to send cancellation acknowledgment", { error: error?.message || error });
    return { success: false, error: error.message };
  }
}

export async function testEmailConnection() {
  try {
    await getCredentials();
    return { connected: true, fromEmail: connectionSettings?.settings?.from_email };
  } catch (error) {
    return { connected: false, error: error.message };
  }
}
