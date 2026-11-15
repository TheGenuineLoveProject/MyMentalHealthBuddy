// Run: node --experimental-vm-modules --test server/tests/social-publication-status.test.mjs
// Actual route/service/registry/response/status helper; synthetic schema-checked
// DAO, auth, Express dispatch and fetch. No real network, DB, AI or sends.
// Mount assertions are source-only; this does not start the application.
import assert from 'node:assert/strict';
import test from 'node:test';
import { calendarFixture, createPublicationHarness, draftFixture } from './fixtures/social-publication-harness.mjs';

const cases = [
  { name: 'manual YouTube upload', targets: ['youtube'], status: 'manual_required', completed: 0, requests: 0 },
  { name: 'TikTok acceptance still processing', targets: ['tiktok'], status: 'processing', completed: 0, requests: 1 },
  { name: 'confirmed Facebook publication', targets: ['facebook'], status: 'published', completed: 1, requests: 1 },
  { name: 'confirmed and manual outcomes', targets: ['facebook', 'youtube'], status: 'partial', completed: 1, requests: 1 },
  { name: 'mixed incomplete outcomes', targets: ['youtube', 'tiktok'], status: 'pending', completed: 0, requests: 1 },
  { name: 'definitive provider rejection', targets: ['facebook'], providerModes: { facebook: 'rejected' }, status: 'failed', completed: 0, requests: 1 },
  { name: 'HTTP success without publication receipt', targets: ['facebook'], providerModes: { facebook: 'no-receipt' }, status: 'unknown', completed: 0, requests: 1 },
  { name: 'ambiguous transport outcome', targets: ['facebook'], providerModes: { facebook: 'throws' }, status: 'unknown', completed: 0, requests: 1 },
];

function assertCanonicalWrites(fixture) {
  for (const write of fixture.writes) {
    for (const values of Array.isArray(write.values) ? write.values : [write.values]) {
      for (const key of Object.keys(values)) assert.ok(fixture.columns[write.table].includes(key));
      assert.equal(Object.hasOwn(values, 'publishedAt'), false);
      if (write.table === 'calendarEntries') assert.equal(Object.hasOwn(values, 'updatedAt'), false);
    }
  }
}

function assertResults(results, scenario) {
  assert.equal(results.length, scenario.targets.length);
  assert.deepEqual(results.map(result => result.platform), scenario.targets);
  assert.equal(results.filter(result => result.success).length, scenario.completed);
  for (const result of results) {
    if (result.platform === 'youtube') {
      assert.equal(result.status, 'manual_required');
      assert.equal(result.postId, null);
      assert.equal(result.success, false);
    }
    if (result.platform === 'tiktok') {
      assert.equal(result.status, 'processing');
      assert.equal(result.postId, null);
      assert.equal(result.operationId, 'synthetic-operation-id');
      assert.equal(result.success, false);
    }
    if (result.success) {
      assert.equal(result.status, 'published');
      assert.equal(result.postId, 'synthetic-confirmed-provider-post');
    }
  }
}

async function immediateCall(fixture, route, targets) {
  return fixture.call(route, {
    params: { id: draftFixture().id },
    body: route === '/post' ? {
      draftId: draftFixture().id,
      platforms: targets,
      content: { caption: draftFixture().caption, type: 'text', mediaUrl: 'https://fixture.invalid/video.mp4' },
    } : { platforms: targets },
  });
}

for (const route of ['/post', '/drafts/:id/publish']) {
  for (const scenario of cases.filter(value => value.targets.length === 1)) {
    test(`${route}: ${scenario.name} preserves the actual provider outcome`, async () => {
      const fixture = await createPublicationHarness({ drafts: [draftFixture({ platform: scenario.targets[0] })], providerModes: scenario.providerModes });
      const response = await immediateCall(fixture, route, scenario.targets);
      assert.equal(response.status, 200);
      assert.equal(response.body.ok, true);
      assert.equal(response.body.data.status, scenario.status);
      assert.equal(response.body.data.summary.status, scenario.status);
      assert.equal(response.body.data.summary.successful, scenario.completed);
      assert.equal(fixture.rows.postDrafts[0].status, scenario.status);
      assertResults(response.body.data.results, scenario);
      assert.equal(fixture.providerRequests.length, scenario.requests);
      assert.equal(fixture.adminMiddlewareCalls(), 1);
      const claimIndex = fixture.events.findIndex(event => event.type === 'write' && event.table === 'postDrafts' && event.status === 'publishing');
      assert.ok(claimIndex >= 0);
      const providerIndex = fixture.events.findIndex(event => event.type === 'provider');
      if (providerIndex >= 0) assert.ok(claimIndex < providerIndex);
      assertCanonicalWrites(fixture);
    });
  }

  test(`${route}: missing configuration rejects before any provider request`, async () => {
    const fixture = await createPublicationHarness({ configured: false });
    const response = await immediateCall(fixture, route, ['facebook']);
    assert.equal(response.status, 200);
    assert.equal(response.body.data.status, 'failed');
    assert.equal(response.body.data.summary.successful, 0);
    assert.equal(fixture.rows.postDrafts[0].status, 'failed');
    assert.equal(fixture.providerRequests.length, 0);
    assertCanonicalWrites(fixture);
  });

  test(`${route}: empty, duplicate and inherited-name target sets never dispatch`, async () => {
    for (const targets of [[], ['facebook', 'facebook'], ['toString']]) {
      const fixture = await createPublicationHarness();
      const response = await immediateCall(fixture, route, targets);
      assert.equal(response.status, 400);
      assert.equal(fixture.providerRequests.length, 0);
      assert.equal(fixture.writes.length, 0);
    }
  });

  test(`${route}: a missing saved draft cannot cause a provider send`, async () => {
    const fixture = await createPublicationHarness({ drafts: [] });
    const response = await immediateCall(fixture, route, ['facebook']);
    assert.equal(response.status, 404);
    assert.equal(fixture.providerRequests.length, 0);
    assert.equal(fixture.writes.length, 0);
  });

  test(`${route}: failure to persist a provider confirmation reports uncertainty and forbids blind retry`, async () => {
    const fixture = await createPublicationHarness({ failAfterProviderWrite: 'postDrafts' });
    const response = await immediateCall(fixture, route, ['facebook']);
    assert.equal(fixture.providerRequests.length, 1);
    assert.equal(response.status, 503);
    assert.equal(response.body.ok, false);
    assert.equal(response.body.code, 'PUBLICATION_STATUS_UNCONFIRMED');
    assert.equal(response.body.data.status, 'unknown');
    assert.equal(response.body.data.providerStatus, 'published');
    assert.equal(response.body.data.persistenceStatus, 'unconfirmed');
    assert.equal(response.body.data.retryable, false);
    assert.equal(response.body.data.results[0].postId, 'synthetic-confirmed-provider-post');
    assert.notEqual(fixture.rows.postDrafts[0].status, 'published');
    assert.equal(fixture.rows.postDrafts[0].status, 'publishing');
    const retried = await immediateCall(fixture, route, ['facebook']);
    assert.equal(retried.status, 409);
    assert.equal(retried.body.data.retryable, false);
    assert.equal(fixture.providerRequests.length, 1);
    assertCanonicalWrites(fixture);
  });

  test(`${route}: protected draft states and mismatched targets cannot bypass the shared claim`, async () => {
    for (const status of ['publishing', 'processing', 'unknown', 'pending', 'partial', 'published']) {
      const fixture = await createPublicationHarness({ drafts: [draftFixture({ status })] });
      const response = await immediateCall(fixture, route, ['facebook']);
      assert.equal(response.status, 409);
      assert.equal(response.body.code, 'PUBLICATION_REVIEW_REQUIRED');
      assert.equal(response.body.data.retryable, false);
      assert.equal(fixture.providerRequests.length, 0);
      assert.equal(fixture.writes.length, 0);
    }
    for (const targets of [['youtube'], ['facebook', 'youtube']]) {
      const fixture = await createPublicationHarness();
      assert.equal((await immediateCall(fixture, route, targets)).status, 400);
      assert.equal(fixture.providerRequests.length, 0);
      assert.equal(fixture.writes.length, 0);
    }
  });

  test(`${route}: losing the conditional draft claim prevents any provider request`, async () => {
    const fixture = await createPublicationHarness({ loseDraftClaim: true });
    const response = await immediateCall(fixture, route, ['facebook']);
    assert.equal(response.status, 409);
    assert.equal(response.body.data.retryable, false);
    assert.equal(fixture.rows.postDrafts[0].status, 'publishing');
    assert.equal(fixture.providerRequests.length, 0);
  });
}

for (const scenario of cases.filter(value => value.targets.length > 1)) {
  test(`standalone /post: ${scenario.name} preserves each result without a draft aggregate claim`, async () => {
    const fixture = await createPublicationHarness();
    const response = await fixture.call('/post', { body: {
      platforms: scenario.targets, content: { caption: draftFixture().caption, type: 'text' },
    } });
    assert.equal(response.status, 200);
    assert.equal(response.body.data.status, scenario.status);
    assertResults(response.body.data.results, scenario);
    assert.equal(response.body.data.summary.successful, scenario.completed);
    assert.equal(fixture.writes.length, 0);
  });
}

for (const mode of ['body-typeerror', 'body-abort', 'http-error-with-id', 'null-ack', 'array-ack']) {
  test(`standalone /post: ${mode} cannot count an ambiguous acknowledgement as publication`, async () => {
    const fixture = await createPublicationHarness({ providerModes: { facebook: mode } });
    const response = await fixture.call('/post', { body: {
      platforms: ['facebook'], content: { caption: draftFixture().caption, type: 'text' },
    } });
    assert.equal(response.status, 200);
    assert.equal(response.body.data.status, 'unknown');
    assert.equal(response.body.data.summary.successful, 0);
    assert.equal(response.body.data.results[0].success, false);
    assert.equal(fixture.providerRequests.length, 1);
    assert.equal(fixture.writes.length, 0);
  });
}

for (const scenario of cases.filter(value => value.targets.length === 1)) {
  test(`/process-scheduled: ${scenario.name} claims the due row before provider dispatch`, async () => {
    const fixture = await createPublicationHarness({
      drafts: [draftFixture({ platform: scenario.targets[0] })],
      calendar: [calendarFixture({ platform: scenario.targets[0] })],
      providerModes: scenario.providerModes,
    });
    const response = await fixture.call('/process-scheduled');
    assert.equal(response.status, 200);
    assert.equal(response.body.ok, true);
    const [outcome] = response.body.data.results;
    assert.equal(outcome.status, scenario.status);
    assertResults(outcome.details, scenario);
    assert.equal(fixture.rows.calendarEntries[0].status, scenario.status);
    assert.equal(fixture.rows.postDrafts[0].status, scenario.status);
    assert.ok(fixture.events.some(event => event.type === 'transaction-commit'));
    assert.equal(fixture.providerRequests.length, scenario.requests);
    const claimIndex = fixture.events.findIndex(event => event.type === 'write' && event.status === 'publishing' && event.matched === 1);
    assert.ok(claimIndex >= 0, 'A returned conditional claim is required');
    const firstProviderIndex = fixture.events.findIndex(event => event.type === 'provider');
    if (firstProviderIndex >= 0) assert.ok(claimIndex < firstProviderIndex);
    assertCanonicalWrites(fixture);
  });
}

test('/process-scheduled: a lost conditional claim cannot call a provider or overwrite the winning worker', async () => {
  const fixture = await createPublicationHarness({ calendar: [calendarFixture()], loseScheduledClaim: true });
  await fixture.call('/process-scheduled');
  assert.equal(fixture.providerRequests.length, 0);
  assert.equal(fixture.rows.calendarEntries[0].status, 'publishing');
  assert.equal(fixture.writes.filter(write => write.committed && write.matched > 0).length, 0);
  assertCanonicalWrites(fixture);
});

for (const scenario of cases.filter(value => ['manual_required', 'processing', 'unknown'].includes(value.status) && value.name !== 'ambiguous transport outcome')) {
  test(`/process-scheduled: ${scenario.status} rows are not automatically dispatched again`, async () => {
    const fixture = await createPublicationHarness({
      drafts: [draftFixture({ platform: scenario.targets[0] })],
      calendar: [calendarFixture({ platform: scenario.targets[0] })],
      providerModes: scenario.providerModes,
    });
    await fixture.call('/process-scheduled');
    assert.equal(fixture.rows.calendarEntries[0].status, scenario.status);
    const attempts = fixture.providerRequests.length;
    const writes = fixture.writes.length;
    const second = await fixture.call('/process-scheduled');
    assert.equal(second.status, 200);
    assert.deepEqual(second.body.data.results, []);
    assert.equal(fixture.providerRequests.length, attempts);
    assert.equal(fixture.writes.length, writes);
    assertCanonicalWrites(fixture);
  });
}

test('/process-scheduled: pending, partial, unknown and in-flight rows plus future jobs are excluded', async () => {
  const statuses = ['processing', 'manual_required', 'pending', 'partial', 'unknown', 'publishing'];
  const calendar = statuses.map((status, index) => calendarFixture({ id: `00000000-0000-4000-8000-${String(index + 10).padStart(12, '0')}`, status }));
  calendar.push(calendarFixture({ id: '00000000-0000-4000-8000-000000000099', scheduledDate: '2999-01-01T00:00:00.000Z' }));
  const fixture = await createPublicationHarness({ calendar });
  const response = await fixture.call('/process-scheduled');
  assert.equal(response.status, 200);
  assert.deepEqual(response.body.data.results, []);
  assert.equal(fixture.providerRequests.length, 0);
  assert.equal(fixture.writes.length, 0);
});

test('/process-scheduled: a claim-storage failure occurs before any provider dispatch', async () => {
  const fixture = await createPublicationHarness({ calendar: [calendarFixture()], failScheduledClaim: true });
  const response = await fixture.call('/process-scheduled');
  assert.equal(fixture.providerRequests.length, 0);
  assert.notEqual(fixture.rows.calendarEntries[0].status, 'published');
  assert.equal(fixture.rows.calendarEntries[0].status, 'scheduled');
  assert.equal(fixture.writes.filter(write => write.committed).length, 0);
  assert.equal(response.body.data?.results?.some(result => result.status === 'published') || false, false);
});

test('/process-scheduled: a missing saved draft is recorded as a preparation failure without dispatch', async () => {
  const fixture = await createPublicationHarness({ drafts: [], calendar: [calendarFixture()] });
  const response = await fixture.call('/process-scheduled');
  assert.equal(response.status, 200);
  const [outcome] = response.body.data.results;
  assert.equal(outcome.status, 'failed');
  assert.equal(outcome.providerAttempted, false);
  assert.equal(outcome.details[0].code, 'SCHEDULE_PREPARATION_FAILED');
  assert.equal(fixture.rows.calendarEntries[0].status, 'failed');
  assert.equal(fixture.providerRequests.length, 0);
  assertCanonicalWrites(fixture);
});

test('/process-scheduled: final persistence failure preserves the claim and must not resend automatically', async () => {
  const fixture = await createPublicationHarness({ calendar: [calendarFixture()], failAfterProviderWrite: 'calendarEntries' });
  const response = await fixture.call('/process-scheduled');
  assert.equal(response.status, 503);
  assert.equal(response.body.ok, false);
  assert.equal(response.body.data.retryable, false);
  assert.equal(response.body.data.persistenceStatus, 'unconfirmed');
  const [outcome] = response.body.data.results;
  assert.equal(outcome.status, 'unknown');
  assert.equal(outcome.retryable, false);
  assert.equal(outcome.details[0].postId, 'synthetic-confirmed-provider-post');
  assert.equal(fixture.rows.calendarEntries[0].status, 'publishing');
  assert.equal(fixture.rows.postDrafts[0].status, 'publishing');
  assert.ok(fixture.events.some(event => event.type === 'transaction-rollback'));
  assert.equal(fixture.providerRequests.length, 1);
  const second = await fixture.call('/process-scheduled');
  assert.deepEqual(second.body.data.results, []);
  assert.equal(fixture.providerRequests.length, 1);
  assertCanonicalWrites(fixture);
});

test('/process-scheduled: losing final status ownership after provider acceptance returns uncertainty', async () => {
  const fixture = await createPublicationHarness({ calendar: [calendarFixture()], loseScheduledFinalization: true });
  const response = await fixture.call('/process-scheduled');
  assert.equal(response.status, 503);
  assert.equal(response.body.data.retryable, false);
  assert.equal(response.body.data.results[0].status, 'unknown');
  assert.equal(response.body.data.results[0].details[0].postId, 'synthetic-confirmed-provider-post');
  assert.equal(fixture.rows.calendarEntries[0].status, 'cancelled');
  assert.equal(fixture.rows.postDrafts[0].status, 'publishing');
  assert.equal(fixture.providerRequests.length, 1);
  await fixture.call('/process-scheduled');
  assert.equal(fixture.providerRequests.length, 1);
  assertCanonicalWrites(fixture);
});

test('actual admin /publish/batch prepares copy without publishing, status writes, AI or provider calls', async () => {
  const draft = draftFixture({ caption: 'x'.repeat(400), hashtags: '#one #two #three #four', hook: 'Synthetic hook', cta: 'Optional next step' });
  const fixture = await createPublicationHarness({ drafts: [draft], routeModule: 'admin-social-studio' });
  const response = await fixture.call('/publish/batch', { body: { draftId: draft.id, platforms: ['x', 'youtube'] } });
  assert.equal(response.status, 200);
  const data = response.body.data;
  assert.equal(data.mode, 'manual_preparation');
  assert.equal(data.status, 'manual_required');
  assert.equal(data.published, false);
  assert.equal(data.prepared, 2);
  assert.equal(data.successful, 0);
  assert.equal(data.totalPlatforms, 2);
  assert.equal(data.results[0].content.caption.length, 280);
  assert.equal(data.results[1].content.caption, draft.caption);
  for (const result of data.results) {
    assert.equal(result.prepared, true);
    assert.equal(result.success, false);
    assert.equal(result.status, 'manual_required');
  }
  assert.equal(Object.hasOwn(data, 'publishedAt'), false);
  assert.equal(fixture.rows.postDrafts[0].status, 'approved');
  assert.equal(fixture.writes.length, 0);
  assert.equal(fixture.providerRequests.length, 0);
  assert.equal(fixture.aiRequests.length, 0);
  assert.equal(fixture.aiConstructors(), 0);
});

test('direct and scheduled delivery contend for the same canonical draft in either order', async () => {
  for (const scheduledFirst of [false, true]) {
    const fixture = await createPublicationHarness({ calendar: [calendarFixture()] });
    if (scheduledFirst) {
      assert.equal((await fixture.call('/process-scheduled')).body.data.results[0].status, 'published');
      assert.equal((await immediateCall(fixture, '/drafts/:id/publish', ['facebook'])).status, 409);
    } else {
      assert.equal((await immediateCall(fixture, '/post', ['facebook'])).status, 200);
      const scheduled = await fixture.call('/process-scheduled');
      assert.equal(scheduled.body.data.results[0].status, 'unknown');
      assert.equal(scheduled.body.data.results[0].reviewRequired, true);
    }
    assert.equal(fixture.providerRequests.length, 1);
    assert.equal(fixture.rows.postDrafts[0].status, 'published');
  }
});

test('/schedule saves one canonical future entry without changing the draft or calling providers', async () => {
  const fixture = await createPublicationHarness();
  const response = await fixture.call('/schedule', { body: {
    draftId: draftFixture().id, platforms: ['facebook'], scheduledAt: '2099-01-01T12:00:00Z',
  } });
  assert.equal(response.status, 201);
  assert.equal(response.body.data.entries.length, 1);
  assert.equal(fixture.rows.calendarEntries[0].draftId, draftFixture().id);
  assert.equal(fixture.rows.calendarEntries[0].platform, 'facebook');
  assert.equal(fixture.rows.calendarEntries[0].status, 'scheduled');
  assert.equal(fixture.rows.postDrafts[0].status, 'approved');
  assert.equal(fixture.providerRequests.length, 0);
  assertCanonicalWrites(fixture);
});

test('/schedule rejects legacy content, ambiguous dates, multiple targets and media/manual channels', async () => {
  const valid = { draftId: draftFixture().id, platforms: ['facebook'], scheduledAt: '2099-01-01T12:00:00Z' };
  for (const body of [
    { ...valid, content: { caption: 'unsaved' } },
    { ...valid, scheduledAt: '2099-02-30T12:00:00Z' },
    { ...valid, scheduledAt: '2099-01-01T12:00:00' },
    { ...valid, platforms: ['facebook', 'x'] },
    { ...valid, platforms: ['youtube'] },
  ]) {
    const fixture = await createPublicationHarness();
    assert.equal((await fixture.call('/schedule', { body })).status, 400);
    assert.equal(fixture.writes.length, 0);
    assert.equal(fixture.providerRequests.length, 0);
  }
});

test('/schedule rejects a missing or protected saved draft without inserting an entry', async () => {
  for (const drafts of [[], [draftFixture({ status: 'processing' })]]) {
    const fixture = await createPublicationHarness({ drafts });
    const response = await fixture.call('/schedule', { body: {
      draftId: draftFixture().id, platforms: ['facebook'], scheduledAt: '2099-01-01T12:00:00Z',
    } });
    assert.equal(response.status, drafts.length ? 409 : 404);
    assert.equal(fixture.writes.length, 0);
  }
});

test('scheduled cancellation is conditional and idempotent without claiming to recall a publication', async () => {
  const fixture = await createPublicationHarness({ calendar: [calendarFixture()] });
  const options = { method: 'DELETE', params: { id: calendarFixture().id } };
  const first = await fixture.call('/scheduled/:id', options);
  const second = await fixture.call('/scheduled/:id', options);
  assert.equal(first.status, 200);
  assert.equal(second.status, 200);
  assert.equal(first.body.data.publicationRecalled, false);
  assert.equal(second.body.data.alreadyCancelled, true);
  assert.equal(fixture.rows.calendarEntries[0].status, 'cancelled');
  assert.equal(fixture.providerRequests.length, 0);
  assertCanonicalWrites(fixture);
});

test('cancellation cannot overwrite in-flight delivery and a missing entry remains missing', async () => {
  for (const status of ['publishing', 'processing', 'published']) {
    const fixture = await createPublicationHarness({ calendar: [calendarFixture({ status })] });
    const response = await fixture.call('/scheduled/:id', { method: 'DELETE', params: { id: calendarFixture().id } });
    assert.equal(response.status, 409);
    assert.equal(response.body.data.cancellationConfirmed, false);
    assert.equal(response.body.data.publicationRecalled, false);
    assert.equal(fixture.rows.calendarEntries[0].status, status);
  }
  const missing = await createPublicationHarness();
  assert.equal((await missing.call('/scheduled/:id', { method: 'DELETE', params: { id: calendarFixture().id } })).status, 404);
});

test('named manual wrapper blocks AI routes without even constructing an SDK client', async () => {
  const fixture = await createPublicationHarness({ routeModule: 'admin-social-studio' });
  assert.equal((await fixture.call('/generate')).status, 404);
  assert.equal(fixture.reads.length, 0);
  assert.equal(fixture.writes.length, 0);
  assert.equal(fixture.providerRequests.length, 0);
  assert.equal(fixture.aiRequests.length, 0);
  assert.equal(fixture.aiConstructors(), 0);
});

test('hashtag-only Threads preparation is empty after platform formatting and cannot report readiness', async () => {
  const fixture = await createPublicationHarness({ routeModule: 'admin-social-studio', drafts: [draftFixture({ caption: ' ', hook: null, cta: null, disclaimer: null, hashtags: '#only' })] });
  const response = await fixture.call('/publish/batch', { body: { draftId: draftFixture().id, platforms: ['threads'] } });
  assert.equal(response.status, 400);
  assert.equal(response.body.data.prepared, 0);
  assert.equal(response.body.data.published, false);
  assert.equal(response.body.data.results[0].prepared, false);
  assert.equal(response.body.data.results[0].status, 'failed');
  assert.equal(fixture.writes.length, 0);
  assert.equal(fixture.aiConstructors(), 0);
  assert.equal(fixture.providerRequests.length, 0);
});

test('editorial changes cannot reset protected publication states or forge status through PATCH', async () => {
  const fixture = await createPublicationHarness({ routeModule: 'admin-social-studio', drafts: [draftFixture({ status: 'published' })] });
  const options = { method: 'PATCH', params: { id: draftFixture().id }, body: { caption: 'Changed copy' } };
  assert.equal((await fixture.call('/drafts/:id', options)).status, 409);
  assert.equal((await fixture.call('/drafts/:id', { ...options, body: { status: 'draft' } })).status, 400);
  assert.equal(fixture.rows.postDrafts[0].status, 'published');
  assert.equal(fixture.writes.length, 0);
  assert.equal(fixture.aiConstructors(), 0);
});
