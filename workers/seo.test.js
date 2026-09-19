import assert from 'node:assert/strict';
import { test } from 'node:test';
import worker from './github-oauth.js';
import { canonicalRedirect } from './seo.js';

const env = {
  GITHUB_CLIENT_ID: 'client-id-test',
  GITHUB_CLIENT_SECRET: 'client-secret-test',
  FORCE_HTTPS: 'true',
  ASSETS: {
    fetch: async (request) => {
      const url = new URL(request.url);
      return new Response(`asset:${url.pathname}`, {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    },
  },
};

test('www HTTP 301s to apex HTTPS and keeps path + query (one hop)', async () => {
  const res = await worker.fetch(
    new Request('http://www.carinteriorcleaning.jp/regions/osaka/?utm=gsc'),
    env,
  );
  assert.equal(res.status, 301);
  assert.equal(
    res.headers.get('location'),
    'https://carinteriorcleaning.jp/regions/osaka/?utm=gsc',
  );
});

test('www + old LPO path 301s to apex HTTPS + new path in one hop', async () => {
  const res = await worker.fetch(
    new Request('http://www.carinteriorcleaning.jp/regions/tokyo/kyuto-cleaning/?gad=1'),
    env,
  );
  assert.equal(res.status, 301);
  assert.equal(
    res.headers.get('location'),
    'https://carinteriorcleaning.jp/regions/tokyo/vomit-cleaning/?gad=1',
  );
});

test('www HTTPS 301s to apex HTTPS', async () => {
  const res = await worker.fetch(
    new Request('https://www.carinteriorcleaning.jp/regions/tokyo/kyuto-cleaning/'),
    env,
  );
  assert.equal(res.status, 301);
  assert.equal(
    res.headers.get('location'),
    'https://carinteriorcleaning.jp/regions/tokyo/vomit-cleaning/',
  );
});

test('apex HTTP 301s to HTTPS while FORCE_HTTPS is on', async () => {
  const res = await worker.fetch(
    new Request('http://carinteriorcleaning.jp/regions/osaka/?ref=1'),
    env,
  );
  assert.equal(res.status, 301);
  assert.equal(
    res.headers.get('location'),
    'https://carinteriorcleaning.jp/regions/osaka/?ref=1',
  );
});

test('apex HTTP + old path 301s to HTTPS new path in one hop', async () => {
  const res = await worker.fetch(
    new Request('http://carinteriorcleaning.jp/regions/osaka/kyuto-cleaning'),
    env,
  );
  assert.equal(res.status, 301);
  assert.equal(
    res.headers.get('location'),
    'https://carinteriorcleaning.jp/regions/osaka/vomit-cleaning/',
  );
});

test('FORCE_HTTPS off leaves apex HTTP on the same path', async () => {
  const res = await worker.fetch(
    new Request('http://carinteriorcleaning.jp/regions/osaka/'),
    { ...env, FORCE_HTTPS: 'false' },
  );
  assert.equal(res.status, 200);
  assert.equal(await res.text(), 'asset:/regions/osaka/');
});

test('www HTTP still 301s to apex HTTP when FORCE_HTTPS is off', async () => {
  const res = await worker.fetch(
    new Request('http://www.carinteriorcleaning.jp/'),
    { ...env, FORCE_HTTPS: 'false' },
  );
  assert.equal(res.status, 301);
  assert.equal(res.headers.get('location'), 'http://carinteriorcleaning.jp/regions/osaka/');
});

test('localhost is not host-redirected but still applies path 301s', async () => {
  const res = await worker.fetch(new Request('http://127.0.0.1:8787/regions/osaka/'), env);
  assert.equal(res.status, 200);
  assert.equal(await res.text(), 'asset:/regions/osaka/');

  const slash = await worker.fetch(new Request('http://127.0.0.1:8787/'), env);
  assert.equal(slash.status, 301);
  assert.equal(slash.headers.get('location'), 'http://127.0.0.1:8787/regions/osaka/');
});

test('workers.dev is not redirected to apex', async () => {
  const res = await worker.fetch(
    new Request('https://carclean0511.fins250903.workers.dev/regions/osaka/'),
    env,
  );
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('location'), null);
});

test('workers.dev old path stays on workers.dev (preview, noindex)', async () => {
  const res = await worker.fetch(
    new Request('https://carclean0511.fins250903.workers.dev/regions/osaka/kyuto-cleaning/'),
    env,
  );
  assert.equal(res.status, 301);
  assert.equal(
    res.headers.get('location'),
    'https://carclean0511.fins250903.workers.dev/regions/osaka/vomit-cleaning/',
  );
  assert.equal(res.headers.get('x-robots-tag'), 'noindex, nofollow');
});

test('workers.dev robots.txt disallows crawlers', async () => {
  const res = await worker.fetch(
    new Request('https://carclean0511.fins250903.workers.dev/robots.txt'),
    env,
  );
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('x-robots-tag'), 'noindex, nofollow');
  assert.equal(await res.text(), 'User-agent: *\nDisallow: /\n');
});

test('workers.dev pages send X-Robots-Tag noindex', async () => {
  const res = await worker.fetch(
    new Request('https://carclean0511.fins250903.workers.dev/regions/osaka/'),
    env,
  );
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('x-robots-tag'), 'noindex, nofollow');
  assert.equal(await res.text(), 'asset:/regions/osaka/');
});

test('apex HTTPS static pages pass through to assets', async () => {
  const res = await worker.fetch(
    new Request('https://carinteriorcleaning.jp/regions/osaka/'),
    env,
  );
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('x-robots-tag'), null);
  assert.equal(await res.text(), 'asset:/regions/osaka/');
});

test('www OAuth is redirected to apex before GitHub', async () => {
  const res = await worker.fetch(
    new Request('https://www.carinteriorcleaning.jp/api/auth'),
    env,
  );
  assert.equal(res.status, 301);
  assert.equal(res.headers.get('location'), 'https://carinteriorcleaning.jp/api/auth');
});

test('vercel.app hosts 301 to the apex (same path)', async () => {
  const res = await worker.fetch(
    new Request('https://carclean2026.vercel.app/regions/osaka/'),
    env,
  );
  assert.equal(res.status, 301);
  assert.equal(res.headers.get('location'), 'https://carinteriorcleaning.jp/regions/osaka/');
});

test('canonicalRedirect ignores unknown hosts without a path rule', () => {
  const res = canonicalRedirect(new Request('https://example.com/blog/'), env);
  assert.equal(res, null);
});

test('root path 301s to the Osaka LP', async () => {
  const res = await worker.fetch(new Request('https://carinteriorcleaning.jp/'), env);
  assert.equal(res.status, 301);
  assert.equal(res.headers.get('location'), 'https://carinteriorcleaning.jp/regions/osaka/');
});
