import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import worker from './github-oauth.js';

const env = {
  GITHUB_CLIENT_ID: 'client-id-test',
  GITHUB_CLIENT_SECRET: 'client-secret-test',
};

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

test('GET /api/auth redirects to GitHub OAuth', async () => {
  const res = await worker.fetch(new Request('https://carinteriorcleaning.jp/api/auth'), env);
  assert.equal(res.status, 302);
  const location = res.headers.get('location');
  assert.match(location, /^https:\/\/github.com\/login\/oauth\/authorize\?/);
  assert.match(location, /client_id=client-id-test/);
  assert.match(
    location,
    /redirect_uri=https%3A%2F%2Fcarinteriorcleaning.jp%2Fapi%2Fcallback/,
  );
});

test('GET /api/auth/ (trailing slash) also redirects', async () => {
  const res = await worker.fetch(new Request('https://example.com/api/auth/'), env);
  assert.equal(res.status, 302);
});

test('GET /api/auth without client id returns 500', async () => {
  const res = await worker.fetch(new Request('https://example.com/api/auth'), {});
  assert.equal(res.status, 500);
  assert.equal(await res.text(), 'Missing GITHUB_CLIENT_ID');
});

test('GET /api/callback exchanges code for a token page', async () => {
  globalThis.fetch = async (url, init) => {
    assert.equal(url, 'https://github.com/login/oauth/access_token');
    const body = JSON.parse(init.body);
    assert.equal(body.client_id, 'client-id-test');
    assert.equal(body.code, 'oauth-code');
    return new Response(JSON.stringify({ access_token: 'tok_123' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  };

  const res = await worker.fetch(
    new Request('https://carinteriorcleaning.jp/api/callback?code=oauth-code'),
    env,
  );
  assert.equal(res.status, 200);
  assert.match(res.headers.get('content-type'), /text\/html/);
  const html = await res.text();
  assert.match(html, /authorization:github:success:/);
  assert.match(html, /tok_123/);
});

test('GET /api/callback without code returns 400', async () => {
  const res = await worker.fetch(
    new Request('https://example.com/api/callback'),
    env,
  );
  assert.equal(res.status, 400);
});

test('unknown /api path returns 404', async () => {
  const res = await worker.fetch(new Request('https://example.com/api/other'), env);
  assert.equal(res.status, 404);
});
