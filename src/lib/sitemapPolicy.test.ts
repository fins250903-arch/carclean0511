import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  collectRedirectSources,
  contentLastmod,
  followExactRedirect,
  isIncludedInSitemap,
  isRedirectedSitemapUrl,
  loadBlogLastmods,
  loadExactRedirectMap,
  loadRedirectSources,
} from './sitemapPolicy.ts';

test('redirect sources are the old URLs, not the national top or a live prefecture LP', () => {
  const sources = loadRedirectSources();
  assert.equal(sources.size, 81);
  for (const osakaAlias of [
    '/regions/osaka/gero-cleaning/',
    '/regions/osaka/pet-hair-odor/',
    '/regions/osaka/pet-waste/',
    '/regions/osaka/seat-washing/',
    '/regions/osaka/tobacco-odor/',
  ]) {
    assert.equal(sources.has(osakaAlias), true, osakaAlias);
  }
  assert.equal(
    isRedirectedSitemapUrl('https://carinteriorcleaning.jp/regions/osaka/vomit-cleaning/', sources),
    false,
  );
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
  assert.equal(sources.has('/regions/osaka/'), false);
  assert.equal(
    isRedirectedSitemapUrl('https://carinteriorcleaning.jp/aio/', sources),
    false,
  );
  assert.equal(
    isRedirectedSitemapUrl('https://carinteriorcleaning.jp/regions/osaka/', sources),
    false,
  );
});

test('the site root 301 target is /aio/ in Cloudflare redirects and the Astro fallback', () => {
  const redirects = readFileSync(new URL('../../public/_redirects', import.meta.url), 'utf8');
  const rootRule = redirects
    .split('\n')
    .map((line) => line.trim())
    .find((line) => line.startsWith('/ '));
  assert.equal(rootRule, '/ /aio/ 301');

  const index = readFileSync(new URL('../pages/index.astro', import.meta.url), 'utf8');
  assert.equal(index.includes('/regions/osaka/'), false);
  assert.equal(index.includes("Astro.redirect('/aio/', 301)"), true);
  assert.equal(index.includes('content="0;url=/aio/"'), true);
  assert.equal(index.includes('https://carinteriorcleaning.jp/aio/'), true);
});

test('new Osaka concern redirects stay above the pattern rules', () => {
  const redirects = readFileSync(new URL('../../public/_redirects', import.meta.url), 'utf8');
  const lines = redirects
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'));
  const firstPattern = lines.findIndex((line) => (line.split(/\s+/)[0] ?? '').includes(':'));
  for (const source of [
    '/regions/osaka/gero-cleaning/',
    '/regions/osaka/pet-hair-odor/',
    '/regions/osaka/pet-waste/',
    '/regions/osaka/seat-washing/',
    '/regions/osaka/tobacco-odor/',
  ]) {
    const index = lines.findIndex((line) => line.startsWith(`${source} `));
    assert.equal(index >= 0 && index < firstPattern, true, source);
  }
});

test('sitemap inclusion matches indexable, non-redirect, self-canonical URLs', () => {
  const sources = loadRedirectSources();
  assert.equal(isIncludedInSitemap('https://carinteriorcleaning.jp/regions/osaka/', sources), true);
  assert.equal(
    isIncludedInSitemap('https://carinteriorcleaning.jp/regions/osaka/osaka-city/', sources),
    true,
  );
  assert.equal(
    isIncludedInSitemap('https://carinteriorcleaning.jp/regions/fukuoka/area/chikugo/', sources),
    true,
  );
  assert.equal(
    isIncludedInSitemap('https://carinteriorcleaning.jp/regions/osaka/ase/', sources),
    false,
  );
  assert.equal(
    isIncludedInSitemap('https://carinteriorcleaning.jp/regions/osaka/kitakawachi/', sources),
    false,
  );
  assert.equal(
    isIncludedInSitemap('https://carinteriorcleaning.jp/regions/kumamoto/', sources),
    false,
  );
  assert.equal(isIncludedInSitemap('https://carinteriorcleaning.jp/reserve/', sources), false);
  assert.equal(isIncludedInSitemap('https://carinteriorcleaning.jp/', sources), false);
});

test('exact redirects resolve to the live page', () => {
  const map = loadExactRedirectMap();
  assert.equal(
    followExactRedirect('/regions/osaka/kyuto-cleaning/', map),
    '/regions/osaka/vomit-cleaning/',
  );
  assert.equal(
    followExactRedirect('/regions/osaka/gero-cleaning/', map),
    '/regions/osaka/vomit-cleaning/',
  );
  assert.equal(
    followExactRedirect('/regions/osaka/seat-washing/', map),
    '/regions/osaka/seat-senjo/',
  );
  assert.equal(followExactRedirect('/regions/osaka/', map), '/regions/osaka/');
  assert.equal(followExactRedirect('/', map), '/aio/');
});

test('pattern rules are not treated as pages', () => {
  const sources = collectRedirectSources(
    '/regions/:region https://carinteriorcleaning.jp/regions/:region/ 301\n/ /aio/ 301\n',
  );
  assert.deepEqual([...sources], ['/']);
});

test('/aio without a slash is a static 301 and does not drop /aio/ from the sitemap', () => {
  const redirects = readFileSync(new URL('../../public/_redirects', import.meta.url), 'utf8');
  const lines = redirects
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'));
  const aioRule = lines.findIndex((line) => line.startsWith('/aio '));
  const firstPattern = lines.findIndex((line) => {
    const source = line.split(/\s+/)[0] ?? '';
    return source.includes(':') || source.includes('*');
  });
  assert.equal(lines[aioRule], '/aio https://carinteriorcleaning.jp/aio/ 301');
  assert.equal(aioRule < firstPattern, true);

  const sources = loadRedirectSources();
  assert.equal(sources.has('/aio/'), false);
  assert.equal(
    isRedirectedSitemapUrl('https://carinteriorcleaning.jp/aio/', sources),
    false,
  );
  assert.equal(
    collectRedirectSources(
      '/aio https://carinteriorcleaning.jp/aio/ 301\n/ /aio/ 301\n/coating/fukuoka/ /regions/fukuoka/ 301\n',
    ).size,
    2,
  );
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
