import assert from 'node:assert/strict';
import test from 'node:test';
import {
  collectRedirectSources,
  contentLastmod,
  isRedirectedSitemapUrl,
  loadBlogLastmods,
  loadRedirectSources,
} from './sitemapPolicy.ts';

test('redirect sources are the old URLs, not the national top or a live prefecture LP', () => {
  const sources = loadRedirectSources();
  assert.equal(sources.size, 34);
  assert.equal(
    isRedirectedSitemapUrl('https://carinteriorcleaning.jp/coating/fukuoka/', sources),
    true,
  );
  assert.equal(
    isRedirectedSitemapUrl(
      'https://carinteriorcleaning.jp/regions/chiba/shutchou-senmon/',
      sources,
    ),
    true,
  );
  assert.equal(
    isRedirectedSitemapUrl('https://carinteriorcleaning.jp/blog/seisou/', sources),
    true,
  );
  assert.equal(
    isRedirectedSitemapUrl(
      'https://carinteriorcleaning.jp/blog/2026/02/2026-02-22-fukuoknioi-copy/',
      sources,
    ),
    true,
  );
  assert.equal(
    isRedirectedSitemapUrl('https://carinteriorcleaning.jp/regions/chiba/', sources),
    false,
  );
  assert.equal(isRedirectedSitemapUrl('https://carinteriorcleaning.jp/', sources), true);
  assert.equal(sources.has('/'), true);
  assert.equal(
    isRedirectedSitemapUrl('https://carinteriorcleaning.jp/aio/', sources),
    false,
  );
});

test('pattern rules are not treated as pages', () => {
  const sources = collectRedirectSources(
    '/regions/:region https://carinteriorcleaning.jp/regions/:region/ 301\n/ /regions/osaka/ 301\n',
  );
  assert.deepEqual([...sources], ['/']);
});

test('blog lastmod uses the later of date and updatedDate', () => {
  assert.equal(
    contentLastmod('date: 2026-02-22\nupdatedDate: 2026-10-26\n'),
    '2026-10-26',
  );
  const lastmods = loadBlogLastmods();
  assert.equal(
    lastmods.get('/blog/2026/10/2026-10-26-neyagawa-stepwgn/'),
    '2026-10-26',
  );
  assert.equal(lastmods.has('/blog/2026/02/2026-02-22-fukuoknioi-copy/'), false);
  assert.ok(lastmods.get('/blog/'));
});
