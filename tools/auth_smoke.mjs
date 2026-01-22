#!/usr/bin/env node

/**
 * Auth smoke tests: validates auth endpoints and guards.
 */

const BASE_URL = process.env.SMOKE_BASE_URL || 'http://localhost:5000';

async function test(name, fn) {
  try {
    await fn();
    console.log(`✓ ${name}`);
    return true;
  } catch (err) {
    console.log(`✗ ${name}: ${err.message}`);
    return false;
  }
}

async function fetchJson(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  return { status: res.status, data: await res.json().catch(() => null) };
}

async function runTests() {
  console.log('== AUTH SMOKE TESTS ==\n');
  console.log(`Base URL: ${BASE_URL}\n`);
  
  let passed = 0;
  let failed = 0;

  if (await test('Health endpoint returns 200', async () => {
    const { status } = await fetchJson(`${BASE_URL}/healthz`);
    if (status !== 200) throw new Error(`Expected 200, got ${status}`);
  })) passed++; else failed++;

  if (await test('Login endpoint exists', async () => {
    const { status } = await fetchJson(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email: 'test@test.com', password: 'wrong' }),
    });
    if (status === 404) throw new Error('Login endpoint not found');
  })) passed++; else failed++;

  if (await test('Register endpoint exists', async () => {
    const { status } = await fetchJson(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      body: JSON.stringify({ email: '', password: '' }),
    });
    if (status === 404) throw new Error('Register endpoint not found');
  })) passed++; else failed++;

  if (await test('Protected route returns 401 when unauthenticated', async () => {
    const { status } = await fetchJson(`${BASE_URL}/api/auth/me`);
    if (status !== 401) throw new Error(`Expected 401, got ${status}`);
  })) passed++; else failed++;

  if (await test('Chat endpoint protected', async () => {
    const { status } = await fetchJson(`${BASE_URL}/api/chat`, {
      method: 'POST',
      body: JSON.stringify({ message: 'test' }),
    });
    if (status !== 401) throw new Error(`Expected 401, got ${status}`);
  })) passed++; else failed++;

  if (await test('Journal endpoint protected', async () => {
    const { status } = await fetchJson(`${BASE_URL}/api/journal`);
    if (status !== 401) throw new Error(`Expected 401, got ${status}`);
  })) passed++; else failed++;

  if (await test('Mood endpoint protected', async () => {
    const { status } = await fetchJson(`${BASE_URL}/api/moods`);
    if (status !== 401) throw new Error(`Expected 401, got ${status}`);
  })) passed++; else failed++;

  if (await test('Admin health endpoint exists', async () => {
    const { status } = await fetchJson(`${BASE_URL}/api/admin/health`);
    if (status === 404) throw new Error('Admin health endpoint not found');
  })) passed++; else failed++;

  console.log(`\n== Summary ==`);
  console.log(`Passed: ${passed}/${passed + failed}`);
  console.log(`Failed: ${failed}/${passed + failed}`);
  
  if (failed > 0) {
    console.log('\n⚠ Some auth smoke tests failed');
    process.exit(1);
  }
  
  console.log('\n✓ AUTH SMOKE PASS');
}

runTests().catch(err => {
  console.error('Auth smoke test error:', err);
  process.exit(1);
});
