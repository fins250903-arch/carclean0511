import assert from 'node:assert/strict';
import test from 'node:test';
import worker, { handleAuth, handleCallback } from './cms-auth.js';

const env = {
  GITHUB_CLIENT_ID: 'Iv1.test-client',
  GITHUB_CLIENT_SECRET: 'secret-value',
};

test('auth redirects to GitHub with the site callback', () => {
  const response = handleAuth(new Request('https://carinteriorcleaning.jp/api/auth'), env);
  assert.equal(response.status, 302);
  const location = new URL(response.headers.get('location'));
  assert.equal(location.origin, 'https://github.com');
  assert.equal(location.pathname, '/login/oauth/authorize');
  assert.equal(location.searchParams.get('client_id'), 'Iv1.test-client');
  assert.equal(location.searchParams.get('redirect_uri'), 'https://carinteriorcleaning.jp/api/callback');
  assert.equal(location.searchParams.get('scope'), 'repo,user');
  assert.equal(response.headers.get('cache-control'), 'no-store');
});

test('auth explains a missing client id', async () => {
  const response = handleAuth(new Request('https://carinteriorcleaning.jp/api/auth/'), {});
  assert.equal(response.status, 500);
  const body = await response.text();
  assert.match(body, /GITHUB_CLIENT_ID/);
  assert.match(body, /GITHUB_CLIENT_SECRET/);
});

test('callback posts the Decap CMS success payload', async () => {
  const response = await handleCallback(
    new Request('https://carinteriorcleaning.jp/api/callback?code=abc'),
    env,
    async (url, init) => {
      assert.equal(url, 'https://github.com/login/oauth/access_token');
      const sent = JSON.parse(init.body);
      assert.equal(sent.client_secret, 'secret-value');
      assert.equal(sent.code, 'abc');
      assert.equal(sent.redirect_uri, 'https://carinteriorcleaning.jp/api/callback');
      return new Response(JSON.stringify({ access_token: 'gho_test</script>' }), {
        headers: { 'content-type': 'application/json' },
      });
    },
  );
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /authorization:github:success:/);
  assert.equal(html.includes('gho_test</script>'), false);
  assert.equal(html.includes('secret-value'), false);
  const embedded = html.match(/var payload = (".*");/);
  assert.ok(embedded);
  const payload = JSON.parse(JSON.parse(embedded[1]));
  assert.equal(payload.token, 'gho_test</script>');
  assert.equal(payload.provider, 'github');
});

test('callback rejects a missing code and a failed token exchange', async () => {
  const missing = await handleCallback(new Request('https://carinteriorcleaning.jp/api/callback'), env, async () => {
    throw new Error('should not fetch');
  });
  assert.equal(missing.status, 400);

  const failed = await handleCallback(
    new Request('https://carinteriorcleaning.jp/api/callback?code=nope'),
    env,
    async () => new Response(JSON.stringify({ error: 'bad_verification_code' })),
  );
  assert.equal(failed.status, 401);
});

test('worker serves auth and leaves other paths to static assets', async () => {
  const seen = [];
  const assets = {
    fetch(request) {
      seen.push(request.url);
      return new Response('asset', { status: 200 });
    },
  };
  const auth = await worker.fetch(new Request('https://carinteriorcleaning.jp/api/auth'), env);
  assert.equal(auth.status, 302);
  const page = await worker.fetch(new Request('https://carinteriorcleaning.jp/admin/'), {
    ASSETS: assets,
  });
  assert.equal(page.status, 200);
  assert.equal(await page.text(), 'asset');
  assert.deepEqual(seen, ['https://carinteriorcleaning.jp/admin/']);
});
