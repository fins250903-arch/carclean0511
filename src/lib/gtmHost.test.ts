import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { GTM_PRODUCTION_HOSTS, shouldLoadGtm } from './gtmHost.mjs';

test('GTM loads only on the production hosts', () => {
  assert.equal(shouldLoadGtm('carinteriorcleaning.jp'), true);
  assert.equal(shouldLoadGtm('WWW.CarInteriorCleaning.jp.'), true);
  assert.equal(shouldLoadGtm('www.carinteriorcleaning.jp'), true);

  for (const host of [
    'localhost',
    '127.0.0.1',
    '0.0.0.0',
    '::1',
    '[::1]',
    'carclean0511.example.workers.dev',
    'preview.workers.dev',
    '192.168.1.20',
    'carinteriorcleaning.jp.workers.dev',
    '',
  ]) {
    assert.equal(shouldLoadGtm(host), false, host);
  }
});

test('the blog admin page does not load GTM', () => {
  const admin = readFileSync(new URL('../../public/admin/index.html', import.meta.url), 'utf8');
  assert.equal(/googletagmanager|GTM-/i.test(admin), false);
});

test('the layout host check matches the production host list and has no noscript iframe', () => {
  const layout = readFileSync(new URL('../layouts/MainLayout.astro', import.meta.url), 'utf8');
  assert.match(layout, /shouldLoadGtm\(location\.hostname\)/);
  assert.equal(layout.includes('googletagmanager.com/ns.html'), false);
  for (const host of GTM_PRODUCTION_HOSTS) {
    assert.equal(layout.includes(host), true, host);
  }
});
