import assert from 'node:assert/strict';
import { test } from 'node:test';
import worker from './github-oauth.js';
import { canonicalHostRedirect } from './seo.js';

const env = {
  GITHUB_CLIENT_ID: 'client-id-test',
  GITHUB_CLIENT_SECRET: 'client-secret-test',
  FORCE_HTTPS: 'false',
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

test('www HTTP 301s to apex HTTP and keeps path + query', async () => {
  const res = await worker.fetch(
    new Request('http://www.carinteriorcleaning.jp/regions/osaka/?utm=gsc'),
    env,
  );
  assert.equal(res.status, 301);
  assert.equal(
    res.headers.get('location'),
    'http://carinteriorcleaning.jp/regions/osaka/?utm=gsc',
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
    'https://carinteriorcleaning.jp/regions/tokyo/kyuto-cleaning/',
  );
});

test('apex HTTP is not redirected while FORCE_HTTPS is off', async () => {
  const res = await worker.fetch(
    new Request('http://carinteriorcleaning.jp/regions/osaka/'),
    env,
  );
  assert.equal(res.status, 200);
  assert.equal(await res.text(), 'asset:/regions/osaka/');
});

test('FORCE_HTTPS 301s apex HTTP to HTTPS', async () => {
  const res = await worker.fetch(
    new Request('http://carinteriorcleaning.jp/regions/osaka/?ref=1'),
    { ...env, FORCE_HTTPS: 'true' },
  );
  assert.equal(res.status, 301);
  assert.equal(
    res.headers.get('location'),
    'https://carinteriorcleaning.jp/regions/osaka/?ref=1',
  );
});

test('FORCE_HTTPS 301s www HTTP to HTTPS apex in one hop', async () => {
  const res = await worker.fetch(
    new Request('http://www.carinteriorcleaning.jp/'),
    { ...env, FORCE_HTTPS: 'true' },
  );
  assert.equal(res.status, 301);
  assert.equal(res.headers.get('location'), 'https://carinteriorcleaning.jp/');
});

test('localhost is not host-redirected', async () => {
  const res = await worker.fetch(new Request('http://127.0.0.1:8787/regions/osaka/'), env);
  assert.equal(res.status, 200);
  assert.equal(await res.text(), 'asset:/regions/osaka/');
});

test('workers.dev is not redirected to apex', async () => {
  const res = await worker.fetch(
    new Request('https://carclean0511.fins250903.workers.dev/regions/osaka/'),
    env,
  );
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('location'), null);
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

test('canonicalHostRedirect ignores unknown hosts', () => {
  const res = canonicalHostRedirect(new Request('https://example.com/'), env);
  assert.equal(res, null);
});
