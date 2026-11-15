/**
 * Social Media Posting API Routes
 * Handles automated posting to all configured platforms
 */

import express from 'express';
import { db } from '../db/connection.mjs';
import { postDrafts, calendarEntries } from '../../shared/schema.mjs';
import { eq, and, lte } from 'drizzle-orm';
import { requireAdmin } from '../middleware/auth.mjs';
import { success, badRequest } from '../utils/response.mjs';
import { logger } from '../utils/logger.mjs';
import { PLATFORMS, getConfiguredPlatforms, checkPlatformCredentials, getAllRequiredEnvKeys, VERIFIED_CHANNELS, getActivePlatforms } from '../services/social-platforms.mjs';
import { postToMultiplePlatforms } from '../services/social-posting.mjs';
import { summarizePublication } from '../../shared/socialPublicationStatus.mjs';

const router = express.Router();
const PUBLISHABLE_DRAFT_STATUSES = new Set([
  'draft', 'review', 'approved', 'scheduled', 'exported', 'manual_required', 'failed',
]);
const UUID = /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i;
const TEXT_SCHEDULE_PLATFORMS = new Set(['facebook', 'x', 'threads', 'linkedin']);

function futureScheduleDate(value) {
  if (typeof value !== 'string') return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})$/.exec(value);
  if (!match) return null;
  const [, yearText, monthText, dayText, hourText, minuteText, secondText = '0', zone] = match;
  const [year, month, day, hour, minute, second] =
    [yearText, monthText, dayText, hourText, minuteText, secondText].map(Number);
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (month < 1 || month > 12 || day < 1 || day > days[month - 1] ||
      hour > 23 || minute > 59 || second > 59) return null;
  if (zone !== 'Z' && (Number(zone.slice(1, 3)) > 23 || Number(zone.slice(4)) > 59)) return null;
  const date = new Date(value);
  return Number.isFinite(date.getTime()) && date.getTime() > Date.now() ? date : null;
}

function targetError(platformIds) {
  if (!Array.isArray(platformIds) || platformIds.length === 0) {
    return 'At least one platform must be specified';
  }
  if (platformIds.some(id => typeof id !== 'string' || !Object.hasOwn(PLATFORMS, id))) {
    return 'Only supported platforms may be selected';
  }
  if (new Set(platformIds).size !== platformIds.length) {
    return 'Each platform may only be selected once';
  }
  return null;
}

function draftTargetError(platformIds, draft) {
  return platformIds.length === 1 && platformIds[0] === draft.platform
    ? null
    : 'A saved draft can be published or scheduled only to its single saved platform';
}

function hasCaption(content) {
  return content && typeof content === 'object' && !Array.isArray(content) &&
    ((typeof content.caption === 'string' && content.caption.trim().length > 0) ||
     (typeof content.text === 'string' && content.text.trim().length > 0));
}

function draftContent(draft) {
  return typeof draft?.caption === 'string' && draft.caption.trim().length > 0
    ? { caption: draft.caption, type: 'text' }
    : null;
}

async function loadDraft(id) {
  const [draft] = await db.select().from(postDrafts).where(eq(postDrafts.id, id)).limit(1);
  return draft;
}

function publicationReviewRequired(res, id, status = 'unknown') {
  const knownStatus = typeof status === 'string' ? status : 'unknown';
  return res.status(409).json({
    ok: false,
    code: 'PUBLICATION_REVIEW_REQUIRED',
    message: 'Review this draft\'s publication status before sending it again.',
    data: {
      status: knownStatus,
      reviewRequired: true,
      retryable: false,
      draft: { id, status: knownStatus },
    },
  });
}

async function claimDraft(draft) {
  const [claimed] = await db.update(postDrafts)
    .set({ status: 'publishing', updatedAt: new Date() })
    .where(and(eq(postDrafts.id, draft.id), eq(postDrafts.status, draft.status)))
    .returning();
  return claimed;
}

async function saveDraftStatus(id, status, executor = db) {
  const saved = await executor.update(postDrafts)
    .set({ status, updatedAt: new Date() })
    .where(and(eq(postDrafts.id, id), eq(postDrafts.status, 'publishing')))
    .returning({ id: postDrafts.id });
  if (saved.length !== 1) throw new Error('Draft publication status was not confirmed');
}

async function saveCalendarStatus(id, status, executor = db) {
  const saved = await executor.update(calendarEntries)
    .set({ status })
    .where(and(eq(calendarEntries.id, id), eq(calendarEntries.status, 'publishing')))
    .returning({ id: calendarEntries.id });
  if (saved.length !== 1) throw new Error('Scheduled publication status was not confirmed');
}

async function scheduledReviewOutcome(entry, draftStatus, message) {
  const details = [{
    platform: entry.platform,
    success: false,
    status: 'unknown',
    providerAttempted: false,
    reviewRequired: true,
    code: 'PUBLICATION_REVIEW_REQUIRED',
    message,
    draftStatus,
  }];
  const summary = summarizePublication(details);
  await saveCalendarStatus(entry.id, 'unknown');
  return {
    id: entry.id,
    status: 'unknown',
    code: 'PUBLICATION_REVIEW_REQUIRED',
    reviewRequired: true,
    retryable: false,
    providerAttempted: false,
    details,
    summary,
  };
}

function publicationUnconfirmed(res, { results = [], summary, draftId, providerAttempted = false }) {
  const knownSummary = summary || summarizePublication(results);
  return res.status(503).json({
    ok: false,
    code: 'PUBLICATION_STATUS_UNCONFIRMED',
    message: 'Publication status could not be saved or confirmed. Review the results before sending again.',
    data: {
      status: 'unknown',
      providerStatus: results.length ? knownSummary.status : 'unknown',
      persistenceStatus: 'unconfirmed',
      retryable: false,
      providerAttempted,
      results,
      summary: knownSummary,
      ...(draftId ? { draft: { id: draftId, status: 'unknown' } } : {}),
    },
  });
}

/**
 * Get verified channel information (public endpoint)
 * Returns official social media handles and profile URLs
 */
router.get('/channels', async (req, res) => {
  try {
    const activePlatforms = getActivePlatforms();
    return success(res, {
      channels: VERIFIED_CHANNELS,
      platforms: activePlatforms.map(p => ({
        id: p.id,
        name: p.name,
        handle: p.handle,
        profileUrl: p.profileUrl,
        color: p.color,
      })),
    });
  } catch (error) {
    logger.error('Failed to get channels:', error);
    return badRequest(res, 'Failed to get channel information');
  }
});

/**
 * Get platform connection status (public, for dashboard display)
 */
router.get('/platforms/status', async (req, res) => {
  try {
    const platforms = Object.values(PLATFORMS).map(p => ({
      id: p.id,
      name: p.name,
      handle: p.handle || null,
      profileUrl: p.profileUrl || null,
      connected: p.envKeys.every(key => !!process.env[key]),
    }));
    
    return success(res, { platforms });
  } catch (error) {
    logger.error('Failed to get platform status:', error);
    return badRequest(res, 'Failed to get platform status');
  }
});

/**
 * Get all platform configurations and their status (admin only)
 */
router.get('/platforms', requireAdmin, async (req, res) => {
  try {
    const platforms = getConfiguredPlatforms();
    return success(res, {
      platforms,
      requiredEnvKeys: getAllRequiredEnvKeys(),
    });
  } catch (error) {
    logger.error('Failed to get platforms:', error);
    return badRequest(res, 'Failed to get platform configurations');
  }
});

/**
 * Check platform connection status
 */
router.get('/platforms/:platformId/status', requireAdmin, async (req, res) => {
  try {
    const { platformId } = req.params;
    const status = checkPlatformCredentials(platformId);
    
    if (!PLATFORMS[platformId]) {
      return badRequest(res, `Unknown platform: ${platformId}`, 404);
    }

    return success(res, {
      platform: platformId,
      name: PLATFORMS[platformId].name,
      ...status,
    });
  } catch (error) {
    logger.error('Failed to check platform status:', error);
    return badRequest(res, 'Failed to check platform status');
  }
});

/**
 * Post content immediately to specified platforms
 */
router.post('/post', requireAdmin, async (req, res) => {
  let publicationStarted = false;
  let claimAttempted = false;
  let results = [];
  let summary;
  let draftId;
  try {
    const { platforms: platformIds, content } = req.body || {};
    draftId = req.body?.draftId;
    const invalidTargets = targetError(platformIds);
    if (invalidTargets) return badRequest(res, invalidTargets);
    if (!hasCaption(content)) {
      return badRequest(res, 'Content caption or text is required');
    }
    if (draftId) {
      const draft = await loadDraft(draftId);
      if (!draft) return res.status(404).json({ ok: false, message: 'Draft not found' });
      const invalidDraftTarget = draftTargetError(platformIds, draft);
      if (invalidDraftTarget) return badRequest(res, invalidDraftTarget);
      if (!PUBLISHABLE_DRAFT_STATUSES.has(draft.status)) {
        return publicationReviewRequired(res, draftId, draft.status);
      }
      claimAttempted = true;
      const claimed = await claimDraft(draft);
      if (!claimed) return publicationReviewRequired(res, draftId);
      draftId = claimed.id;
      if (draftTargetError(platformIds, claimed)) throw new Error('Claimed draft target changed');
    }

    // /post content is the administrator's current explicit input. A draft ID
    // associates its durable status; it does not replace requested text/media.
    publicationStarted = true;
    results = await postToMultiplePlatforms(platformIds, content);
    summary = summarizePublication(results);
    if (draftId) await saveDraftStatus(draftId, summary.status);
    return success(res, {
      status: summary.status,
      results,
      summary,
      ...(draftId ? { draft: { id: draftId, status: summary.status } } : {}),
    });
  } catch {
    logger.error('Social publication could not be confirmed', { code: 'PUBLICATION_STATUS_UNCONFIRMED' });
    if (claimAttempted || publicationStarted) return publicationUnconfirmed(res, {
      results, summary, draftId, providerAttempted: publicationStarted,
    });
    return badRequest(res, 'Failed to prepare content for posting');
  }
});

/**
 * Schedule a post for later
 */
router.post('/schedule', requireAdmin, async (req, res) => {
  let insertionStarted = false;
  try {
    const body = req.body;
    const fields = ['draftId', 'platforms', 'scheduledAt'];
    if (!body || typeof body !== 'object' || Array.isArray(body) ||
        Object.keys(body).some(key => !fields.includes(key)) ||
        fields.some(key => !Object.hasOwn(body, key))) {
      return badRequest(res, 'Save a draft, then provide only draftId, platforms, and scheduledAt');
    }
    const { draftId, platforms, scheduledAt } = body;
    if (typeof draftId !== 'string' || !UUID.test(draftId)) {
      return badRequest(res, 'A valid saved draft ID is required');
    }
    const invalidTargets = targetError(platforms);
    if (invalidTargets) return badRequest(res, invalidTargets);
    if (platforms.length !== 1) return badRequest(res, 'Schedule exactly one platform matching the saved draft platform');
    if (platforms.some(platform => !TEXT_SCHEDULE_PLATFORMS.has(platform))) {
      return badRequest(res, 'Saved text drafts can be scheduled only to Facebook, X, Threads, or LinkedIn. Other platforms need a separate manual or media workflow.');
    }
    const scheduledDate = futureScheduleDate(scheduledAt);
    if (!scheduledDate) return badRequest(res, 'Use a valid future ISO date and time with an explicit timezone');
    const draft = await loadDraft(draftId);
    if (!draft) return res.status(404).json({ ok: false, code: 'DRAFT_NOT_FOUND', message: 'Draft not found' });
    const invalidDraftTarget = draftTargetError(platforms, draft);
    if (invalidDraftTarget) return badRequest(res, invalidDraftTarget);
    if (!draftContent(draft)) return badRequest(res, 'A saved draft caption is required');
    if (!PUBLISHABLE_DRAFT_STATUSES.has(draft.status)) return publicationReviewRequired(res, draft.id, draft.status);
    if (scheduledDate.getTime() <= Date.now()) return badRequest(res, 'Scheduled time must still be in the future');

    // The single canonical platform is saved in one statement; the draft's
    // editorial state and caption remain unchanged. No provider is contacted.
    insertionStarted = true;
    const entries = await db
      .insert(calendarEntries)
      .values(platforms.map(platform => ({
        draftId: draft.id,
        scheduledDate,
        platform,
        status: 'scheduled',
      })))
      .returning();
    if (entries.length !== platforms.length) throw new Error('Schedule creation was not confirmed');
    return success(res, { entries }, null, 201);
  } catch {
    logger.error('Schedule creation could not be confirmed', { code: 'SCHEDULE_CREATION_UNCONFIRMED' });
    return res.status(503).json({
      ok: false,
      code: insertionStarted ? 'SCHEDULE_CREATION_UNCONFIRMED' : 'SCHEDULE_UNAVAILABLE',
      message: insertionStarted
        ? 'Schedule creation could not be confirmed. Review scheduled entries before trying again.'
        : 'The schedule could not be prepared. Please try again.',
      data: {
        status: 'unknown',
        retryable: !insertionStarted,
        reviewRequired: insertionStarted,
      },
    });
  }
});

/**
 * Get scheduled posts
 */
router.get('/scheduled', requireAdmin, async (req, res) => {
  try {
    const scheduled = await db
      .select()
      .from(calendarEntries)
      .where(eq(calendarEntries.status, 'scheduled'))
      .orderBy(calendarEntries.scheduledDate)
      .limit(50);

    return success(res, scheduled);
  } catch (error) {
    logger.error('Failed to get scheduled posts:', error);
    return badRequest(res, 'Failed to get scheduled posts');
  }
});

/**
 * Cancel a scheduled post
 */
router.delete('/scheduled/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  if (!UUID.test(id)) return res.status(404).json({ ok: false, code: 'SCHEDULE_NOT_FOUND', message: 'Scheduled entry not found' });
  try {
    const cancelled = await db
      .update(calendarEntries)
      .set({ status: 'cancelled' })
      .where(and(eq(calendarEntries.id, id), eq(calendarEntries.status, 'scheduled')))
      .returning();
    if (cancelled.length > 1) throw new Error('Cancellation was not confirmed');
    if (cancelled.length === 1) {
      return success(res, {
        entry: cancelled[0], cancelled: true, alreadyCancelled: false,
        publicationRecalled: false,
        message: 'Scheduled entry cancelled. This does not recall any publication already sent.',
      });
    }
    const [entry] = await db.select().from(calendarEntries)
      .where(eq(calendarEntries.id, id)).limit(1);
    if (!entry) return res.status(404).json({ ok: false, code: 'SCHEDULE_NOT_FOUND', message: 'Scheduled entry not found' });
    if (entry.status === 'cancelled') {
      return success(res, {
        entry, cancelled: true, alreadyCancelled: true,
        publicationRecalled: false,
        message: 'The entry is already marked cancelled. This does not recall any earlier publication.',
      });
    }
    return res.status(409).json({
      ok: false,
      code: 'SCHEDULE_CANCELLATION_NOT_CONFIRMED',
      message: 'This entry has left the scheduled queue. Cancellation is not confirmed; review its publication status.',
      data: {
        status: entry.status,
        entry,
        cancellationConfirmed: false,
        publicationRecalled: false,
        reviewRequired: true,
        retryable: false,
      },
    });
  } catch {
    logger.error('Schedule cancellation could not be confirmed', { code: 'SCHEDULE_CANCELLATION_UNCONFIRMED' });
    return res.status(503).json({
      ok: false,
      code: 'SCHEDULE_CANCELLATION_UNCONFIRMED',
      message: 'Cancellation could not be confirmed. Review the entry status before continuing.',
      data: { status: 'unknown', cancellationConfirmed: false, publicationRecalled: false, reviewRequired: true, retryable: false },
    });
  }
});

/**
 * Process due scheduled posts (called by cron/scheduler)
 */
router.post('/process-scheduled', requireAdmin, async (req, res) => {
  try {
    const now = new Date();
    const duePosts = await db
      .select()
      .from(calendarEntries)
      .where(
        and(
          eq(calendarEntries.status, 'scheduled'),
          lte(calendarEntries.scheduledDate, now)
        )
      )
      .orderBy(calendarEntries.scheduledDate)
      .limit(10);

    const results = [];
    let claimedCount = 0;
    let skippedCount = 0;

    for (const post of duePosts) {
      let claimed;
      let details = [];
      let summary;
      let providerAttempted = false;
      try {
        // The claim commits before any provider call. A crash or lost status
        // acknowledgement must not put a possibly sent job back in the queue.
        [claimed] = await db.update(calendarEntries)
          .set({ status: 'publishing' })
          .where(and(
            eq(calendarEntries.id, post.id),
            eq(calendarEntries.status, 'scheduled'),
            lte(calendarEntries.scheduledDate, now),
          ))
          .returning();
        if (!claimed) {
          skippedCount++;
          continue;
        }
        claimedCount++;

        const platforms = [claimed.platform];
        let preparationError = targetError(platforms);
        let draft;
        if (!preparationError) {
          draft = typeof claimed.draftId === 'string'
            ? await loadDraft(claimed.draftId)
            : null;
          if (draft && (!PUBLISHABLE_DRAFT_STATUSES.has(draft.status) || draftTargetError(platforms, draft))) {
            results.push(await scheduledReviewOutcome(claimed, draft.status,
              'Review the saved draft publication and platform before sending it again'));
            continue;
          }
          if (!draftContent(draft)) preparationError = 'The saved draft or its caption is unavailable';
        }

        if (preparationError) {
          details = [{
            platform: claimed.platform,
            success: false,
            status: 'failed',
            providerAttempted: false,
            code: 'SCHEDULE_PREPARATION_FAILED',
            error: preparationError,
          }];
          summary = summarizePublication(details);
          await saveCalendarStatus(claimed.id, summary.status);
          results.push({ id: claimed.id, status: summary.status, details, summary, providerAttempted: false });
          continue;
        }

        // All draft-bound delivery paths contend for the same row. Separate
        // calendar rows cannot bypass a direct publication's draft claim.
        const claimedDraft = await claimDraft(draft);
        if (!claimedDraft) {
          results.push(await scheduledReviewOutcome(claimed, 'unknown',
            'The saved draft publication changed. Review its status before sending again'));
          continue;
        }
        if (targetError([claimedDraft.platform]) || draftTargetError(platforms, claimedDraft)) {
          throw new Error('Claimed draft target changed');
        }
        const content = draftContent(claimedDraft);
        if (!content) throw new Error('Claimed draft caption changed');

        providerAttempted = true;
        details = await postToMultiplePlatforms([claimedDraft.platform], content);
        summary = summarizePublication(details);
        // Provider HTTP runs outside a transaction. Both durable statuses are
        // finalized together, or their publishing markers remain for review.
        await db.transaction(async transaction => {
          await saveDraftStatus(claimedDraft.id, summary.status, transaction);
          await saveCalendarStatus(claimed.id, summary.status, transaction);
        });
        results.push({ id: claimed.id, status: summary.status, details, summary, providerAttempted: true });
      } catch {
        logger.error('Scheduled publication could not be confirmed', { code: 'PUBLICATION_STATUS_UNCONFIRMED' });
        const knownSummary = summary || summarizePublication(details);
        results.push({
          id: claimed?.id || post.id,
          status: 'unknown',
          providerStatus: details.length ? knownSummary.status : 'unknown',
          persistenceStatus: 'unconfirmed',
          retryable: false,
          providerAttempted,
          details,
          summary: knownSummary,
        });
      }
    }

    const summary = summarizePublication(results.flatMap(result => result.details));
    const unconfirmed = results.some(result => result.persistenceStatus === 'unconfirmed');
    const data = {
      status: unconfirmed ? 'unknown' : summary.status,
      considered: duePosts.length,
      processed: claimedCount,
      skipped: skippedCount,
      results,
      summary,
      ...(results.some(result => result.reviewRequired) ? { reviewRequired: true, retryable: false } : {}),
    };
    if (unconfirmed) {
      return res.status(503).json({
        ok: false,
        code: 'PUBLICATION_STATUS_UNCONFIRMED',
        message: 'Some publication statuses could not be confirmed. Review the results before sending again.',
        data: {
          ...data,
          providerStatus: results.some(result => result.providerAttempted && !result.details.length)
            ? 'unknown' : summary.status,
          persistenceStatus: 'unconfirmed',
          retryable: false,
        },
      });
    }
    return success(res, data);
  } catch {
    logger.error('Failed to load scheduled publications', { code: 'SCHEDULE_LOAD_FAILED' });
    return badRequest(res, 'Failed to process scheduled posts');
  }
});

/**
 * Publish a draft to platforms
 */
router.post('/drafts/:id/publish', requireAdmin, async (req, res) => {
  let publicationStarted = false;
  let claimAttempted = false;
  let results = [];
  let summary;
  let draftId;
  try {
    const { id } = req.params;
    draftId = id;
    const { platforms: platformIds } = req.body || {};
    const draft = await loadDraft(id);
    if (!draft) {
      return res.status(404).json({ ok: false, message: 'Draft not found' });
    }

    const targetPlatforms = platformIds === undefined ? [draft.platform] : platformIds;
    const invalidTargets = targetError(targetPlatforms);
    if (invalidTargets) return badRequest(res, invalidTargets);
    const invalidDraftTarget = draftTargetError(targetPlatforms, draft);
    if (invalidDraftTarget) return badRequest(res, invalidDraftTarget);
    if (!draftContent(draft)) return badRequest(res, 'A saved draft caption is required');
    if (!PUBLISHABLE_DRAFT_STATUSES.has(draft.status)) {
      return publicationReviewRequired(res, id, draft.status);
    }

    // Claim before provider I/O; only the returned row is the content snapshot.
    claimAttempted = true;
    const claimed = await claimDraft(draft);
    if (!claimed) return publicationReviewRequired(res, id);
    const currentTargets = platformIds === undefined ? [claimed.platform] : platformIds;
    if (targetError(currentTargets) || draftTargetError(currentTargets, claimed)) throw new Error('Claimed draft targets changed');
    const content = draftContent(claimed);
    if (!content) throw new Error('Claimed draft caption changed');

    publicationStarted = true;
    results = await postToMultiplePlatforms(currentTargets, content);
    summary = summarizePublication(results);
    await saveDraftStatus(id, summary.status);
    return success(res, {
      status: summary.status,
      draft: { id, status: summary.status },
      results,
      summary,
    });
  } catch {
    logger.error('Draft publication could not be confirmed', { code: 'PUBLICATION_STATUS_UNCONFIRMED' });
    if (claimAttempted || publicationStarted) return publicationUnconfirmed(res, {
      results, summary, draftId, providerAttempted: publicationStarted,
    });
    return badRequest(res, 'Failed to prepare the saved draft for publication');
  }
});


// Health check endpoint for admin daily tools monitoring
router.get("/", (req, res) => {
  res.json({ ok: true, module: "social-posting", status: "operational", timestamp: new Date().toISOString() });
});

export default router;
