import assert from 'node:assert/strict';
import test from 'node:test';
import { buildSrcSet, defaultVariant, pickVariant, slotWidth } from './lpImagePick.ts';

const variants = [
  { src: '/images/opt/hero-480.webp', width: 480 },
  { src: '/images/opt/hero-800.webp', width: 800 },
  { src: '/images/opt/hero-1024.webp', width: 1024 },
];

test('phone DPR 2 picks the 800w candidate for a full-bleed image', () => {
  const slot = slotWidth('100vw', 390);
  assert.equal(slot, 390);
  assert.equal(pickVariant(variants, slot, 2).width, 800);
});

test('desktop full-bleed picks the largest candidate that covers the slot', () => {
  const slot = slotWidth('100vw', 1280);
  assert.equal(pickVariant(variants, slot, 1).width, 1024);
});

test('min-width sizes fall through on a phone and match on desktop', () => {
  const sizes = '(min-width: 768px) 50vw, 100vw';
  assert.equal(slotWidth(sizes, 390), 390);
  assert.equal(slotWidth(sizes, 1280), 640);
  assert.equal(pickVariant(variants, slotWidth(sizes, 1280), 1).width, 800);
});

test('fixed px sizes ignore the viewport', () => {
  assert.equal(slotWidth('256px', 390), 256);
  assert.equal(pickVariant(variants, 256, 2).width, 800);
});

test('srcset lists candidates from small to large and defaults near 800w', () => {
  assert.equal(
    buildSrcSet(variants),
    '/images/opt/hero-480.webp 480w, /images/opt/hero-800.webp 800w, /images/opt/hero-1024.webp 1024w',
  );
  assert.equal(defaultVariant(variants).width, 800);
});
