import assert from 'node:assert/strict';
import test from 'node:test';
import { needsPowerBringIn, rewriteFaqForRegion } from './powerPolicy.ts';

test('every region uses the same paid external-power rule', () => {
  for (const region of ['大阪府', '福岡県', '沖縄県', '群馬県', 'fukuoka', 'gunma']) {
    assert.equal(needsPowerBringIn(region), true);
  }

  const rewritten = rewriteFaqForRegion(
    {
      q: '水道や電源は用意する必要がありますか？',
      a: '自社車両に高性能発電機を搭載しておりますので、現場での電源確保は不要です。',
    },
    '福岡県',
  );

  assert.equal(
    rewritten.a,
    '現場にコンセントがある場合はそちらを使えます。無い場合は外部電源の持込が可能です（別途費用）。コンセントの無いところでも作業可能です。',
  );
  assert.equal(rewritten.a.includes('発電機'), false);
  assert.equal(rewritten.a.includes('電源不要'), false);
  assert.equal(rewritten.a.includes('お借り'), false);
});
