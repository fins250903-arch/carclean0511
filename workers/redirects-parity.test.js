import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { PATH_REDIRECTS } from './path-redirects.js';
import { LEGACY_HOSTS } from './seo.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const vercel = JSON.parse(readFileSync(join(root, 'vercel.json'), 'utf8'));
const redirectsTxt = readFileSync(join(root, 'public/_redirects'), 'utf8');

function parseCloudflareRedirects(text) {
  const map = new Map();
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const [from, to, status] = line.split(/\s+/);
    map.set(from, { to, status });
  }
  return map;
}

test('public/_redirects covers every vercel.json path redirect', () => {
  const cf = parseCloudflareRedirects(redirectsTxt);
  const pathRules = vercel.redirects.filter((rule) => !rule.has);

  assert.equal(pathRules.length, cf.size);

  for (const rule of pathRules) {
    const row = cf.get(rule.source);
    assert.ok(row, `missing Cloudflare redirect for ${rule.source}`);
    assert.equal(row.to, rule.destination);
    assert.equal(row.status, '301');
    assert.equal(rule.permanent, true);
  }
});

test('Worker PATH_REDIRECTS matches vercel.json and public/_redirects', () => {
  const cf = parseCloudflareRedirects(redirectsTxt);
  const pathRules = vercel.redirects.filter((rule) => !rule.has);
  const worker = new Map(PATH_REDIRECTS);

  assert.equal(pathRules.length, worker.size);
  assert.equal(cf.size, worker.size);

  for (const rule of pathRules) {
    assert.equal(worker.get(rule.source), rule.destination);
    assert.equal(cf.get(rule.source)?.to, rule.destination);
  }
});

test('Worker and vercel.json share the same legacy hosts', () => {
  const hosts = vercel.redirects
    .filter((rule) => rule.has)
    .map((rule) => rule.has[0].value);

  assert.ok(hosts.includes('www.carinteriorcleaning.jp'));
  assert.ok(hosts.includes('carclean2026.vercel.app'));
  assert.ok(hosts.includes('carclean2026blog.vercel.app'));
  for (const host of hosts) {
    assert.ok(LEGACY_HOSTS.has(host), `missing Worker legacy host ${host}`);
  }
});
