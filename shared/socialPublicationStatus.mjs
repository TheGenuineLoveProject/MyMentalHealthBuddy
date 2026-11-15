// Provider delivery outcomes are separate from preparing copy or accepting an upload.
export const PUBLICATION_STATUS_LABELS = Object.freeze({
  published: 'Published',
  partial: 'Partially published',
  processing: 'Processing',
  manual_required: 'Manual upload required',
  failed: 'Failed',
  unknown: 'Needs review',
  pending: 'Action pending',
  publishing: 'Publishing',
  idle: 'No publication requested',
});

function hasPublicationReceipt(value) {
  return (typeof value === 'string' && value.trim().length > 0) ||
    (typeof value === 'number' && Number.isSafeInteger(value) && value > 0);
}

function publicationState(result) {
  if (!result || typeof result !== 'object') return 'unknown';
  if (result.status === 'unknown') return 'unknown';
  if (result.error || result.status === 'failed') return 'failed';
  if (result.status === 'manual_required' || result.status === 'processing') return result.status;
  if (result.success === false) return 'failed';
  if (result.status && !['published', 'delivered'].includes(result.status)) return 'unknown';
  return hasPublicationReceipt(result.postId) ? 'published' : 'unknown';
}

export function normalizePublicationResult(platform, result) {
  const status = publicationState(result);
  return {
    ...(result && typeof result === 'object' ? result : {}),
    platform,
    status,
    success: status === 'published',
  };
}

export function summarizePublication(results) {
  const counts = { published: 0, failed: 0, processing: 0, manual_required: 0, unknown: 0 };
  for (const result of results) counts[publicationState(result)] += 1;
  const total = results.length;
  let status = total ? 'failed' : 'idle';
  if (total && counts.published === total) status = 'published';
  else if (counts.published) status = 'partial';
  else if (counts.unknown) status = 'unknown';
  else if (counts.processing === total && total) status = 'processing';
  else if (counts.manual_required === total && total) status = 'manual_required';
  else if (counts.processing || counts.manual_required) status = 'pending';
  return {
    status,
    total,
    successful: counts.published,
    failed: counts.failed,
    processing: counts.processing,
    manualRequired: counts.manual_required,
    unknown: counts.unknown,
  };
}
