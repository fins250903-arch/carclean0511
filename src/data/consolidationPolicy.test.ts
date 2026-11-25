import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  areaRedirectTarget,
  canonicalAliasPaths,
  consolidationRedirects,
  isCanonicalAliasUrl,
  isKeptArea,
  isKeptConcernSlug,
  keywordCanonicalPath,
  keywordRedirectTarget,
  skippedCanonicalPages,
} from './consolidationPolicy.ts';

const redirects = consolidationRedirects();

test('new redirects cover the approved area and concern URLs only', () => {
  assert.equal(redirects.length, 42);
  const froms = redirects.map((rule) => rule.from);
  assert.equal(new Set(froms).size, froms.length);

  assert.deepEqual(keywordRedirectTarget('osaka', 'ac-kusai'), '/regions/osaka/ac-nioi/');
  assert.deepEqual(keywordRedirectTarget('miyagi', 'ac-kusai'), '/regions/miyagi/ac-nioi/');
  assert.deepEqual(
    keywordRedirectTarget('osaka', 'spray-kouka-nai'),
    '/regions/osaka/odor-removal/',
  );
  assert.deepEqual(
    keywordRedirectTarget('hyogo', 'spray-kouka-nai'),
    '/regions/hyogo/kuruma-nioi-keshi/',
  );
  assert.equal(keywordRedirectTarget('osaka', 'oshikko'), null);
  assert.equal(keywordRedirectTarget('hyogo', 'oshikko'), null);

  assert.equal(areaRedirectTarget('osaka', 'osaka-city', 'car'), null);
  assert.equal(areaRedirectTarget('osaka', 'kitakawachi', 'car'), '/regions/osaka/');
  assert.equal(areaRedirectTarget('osaka', 'osaka-city', 'truck'), '/regions/osaka-truck/');
  assert.equal(areaRedirectTarget('osaka', 'senshu', 'bus'), '/regions/osaka-bus/');
  assert.equal(areaRedirectTarget('hyogo', 'kobe', 'car'), null);
  assert.equal(areaRedirectTarget('hyogo', 'himeji', 'car'), '/regions/hyogo/');
  assert.equal(areaRedirectTarget('hyogo', 'kobe', 'bus'), '/regions/hyogo-bus/');
  assert.equal(areaRedirectTarget('fukuoka', 'chikugo', 'car'), null);
  assert.equal(areaRedirectTarget('fukuoka', 'chikuho', 'car'), '/regions/fukuoka/');
  assert.equal(
    areaRedirectTarget('fukuoka', 'kitakyushu', 'truck'),
    '/regions/fukuoka-truck/',
  );
  assert.equal(areaRedirectTarget('miyagi', 'sendai', 'car'), null);
  assert.equal(areaRedirectTarget('aichi', 'nagoya', 'car'), null);
});

test('public/_redirects lists every new rule above the pattern rules', () => {
  const file = readFileSync(new URL('../../public/_redirects', import.meta.url), 'utf8');
  const patternAt = file.indexOf('/regions/:region ');
  assert.ok(patternAt > 0);
  const head = file.slice(0, patternAt);
  for (const rule of redirects) {
    const slashed = `${rule.from} ${rule.to} 301`;
    const slashless = `${rule.from.replace(/\/$/, '')} https://carinteriorcleaning.jp${rule.to} 301`;
    assert.ok(head.includes(slashed), slashed);
    assert.ok(head.includes(slashless), slashless);
  }
  assert.ok(head.includes('/regions/hyogo/oshikko/ /regions/hyogo/pet-hair-odor/ 301'));
  assert.equal(
    redirects.some((rule) => rule.from.includes('/oshikko')),
    false,
  );
});

test('canonical aliases stay live and point at the representative', () => {
  const aliases = canonicalAliasPaths();
  assert.equal(aliases.length, 69);
  assert.equal(keywordCanonicalPath('osaka', 'ase'), '/regions/osaka/kareisyu/');
  assert.equal(keywordCanonicalPath('hyogo', 'omorashi'), null);
  assert.equal(keywordCanonicalPath('osaka', 'omorashi'), '/regions/osaka/oshikko/');
  assert.equal(keywordCanonicalPath('fukuoka', 'omorashi'), '/regions/fukuoka/oshikko/');
  assert.equal(keywordCanonicalPath('hyogo', 'pet-hair-odor'), '/regions/hyogo/pet-nioi/');
  assert.equal(keywordCanonicalPath('osaka', 'pet-hair-odor'), null);
  assert.equal(keywordCanonicalPath('osaka', 'specialist-cleaning'), '/regions/osaka/');
  assert.equal(keywordCanonicalPath('hyogo', 'specialist-cleaning'), null);
  assert.equal(keywordCanonicalPath('miyagi', 'hoken-kyuto'), '/regions/miyagi/kyuto-cleaning/');
  assert.equal(keywordCanonicalPath('osaka', 'hoken-kyuto'), '/regions/osaka/vomit-cleaning/');
  assert.equal(keywordCanonicalPath('osaka', 'bus-senmon'), '/regions/osaka-bus/');
  assert.equal(keywordCanonicalPath('osaka', 'interior-cleaning'), '/regions/osaka/');
  assert.equal(keywordCanonicalPath('hyogo', 'seat-cleaning'), '/regions/hyogo/seat-washing/');
  assert.equal(keywordCanonicalPath('osaka', 'seat-cleaning'), '/regions/osaka/seat-senjo/');
  assert.equal(keywordCanonicalPath('osaka', 'vomit-cleaning'), null);
  assert.equal(keywordCanonicalPath('osaka', 'kyuto-cleaning'), null);
  assert.equal(keywordCanonicalPath('aichi', 'ase'), null);

  assert.equal(
    isCanonicalAliasUrl('https://carinteriorcleaning.jp/regions/osaka/ase/'),
    true,
  );
  assert.equal(
    isCanonicalAliasUrl('https://carinteriorcleaning.jp/regions/osaka/kareisyu/'),
    false,
  );
  assert.equal(isCanonicalAliasUrl('https://carinteriorcleaning.jp/regions/osaka/'), false);
});

test('pages the repo does not generate are skipped, not invented', () => {
  const skipped = skippedCanonicalPages().map((row) => `${row.regionId}/${row.slug}`);
  assert.deepEqual(skipped.sort(), [
    'fukuoka/pet-hair-odor',
    'fukuoka/specialist-cleaning',
    'hyogo/specialist-cleaning',
    'miyagi/pet-hair-odor',
    'miyagi/specialist-cleaning',
    'osaka/pet-hair-odor',
  ]);
});

test('kept representatives are not redirected', () => {
  for (const regionId of ['osaka', 'hyogo', 'fukuoka', 'miyagi']) {
    assert.equal(isKeptConcernSlug(regionId, 'ac-nioi'), true);
    assert.equal(isKeptConcernSlug(regionId, 'kareisyu'), true);
    assert.equal(isKeptConcernSlug(regionId, 'tabako-yani'), true);
    assert.equal(isKeptConcernSlug(regionId, 'pet-nioi'), true);
    assert.equal(isKeptConcernSlug(regionId, 'pet-unko'), true);
    assert.equal(isKeptConcernSlug(regionId, 'touyu-kobosi'), true);
    assert.equal(keywordRedirectTarget(regionId, 'ac-nioi'), null);
  }
  assert.equal(isKeptConcernSlug('miyagi', 'kyuto-cleaning'), true);
  assert.equal(isKeptConcernSlug('osaka', 'vomit-cleaning'), true);
  assert.equal(isKeptConcernSlug('osaka', 'kyuto-cleaning'), false);
  assert.equal(isKeptConcernSlug('hyogo', 'omorashi'), true);
  assert.equal(isKeptConcernSlug('hyogo', 'seat-washing'), true);
  assert.equal(isKeptConcernSlug('osaka', 'seat-senjo'), true);
  assert.equal(isKeptConcernSlug('osaka', 'odor-removal'), true);
  assert.equal(isKeptConcernSlug('hyogo', 'kuruma-nioi-keshi'), true);
  assert.equal(isKeptConcernSlug('osaka', 'mold-odor'), true);
  assert.equal(isKeptConcernSlug('hyogo', 'shanai-nioi'), true);
  assert.equal(isKeptArea('osaka', 'osaka-city'), true);
  assert.equal(isKeptArea('osaka', 'kitakawachi'), false);
  assert.equal(isKeptArea('hyogo', 'himeji'), false);
  assert.equal(isKeptArea('fukuoka', 'chikuho'), false);
  assert.equal(isKeptArea('miyagi', 'sendai'), false);
});
