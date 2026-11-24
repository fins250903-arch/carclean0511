import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import {
  buildBlogAnswerFirst,
  extractPrice,
  isMachineLabel,
} from './blogAnswerFirst.ts';

const BLOG_ROOT = path.resolve(process.cwd(), 'src/content/blog');

function readPost(relativePath: string): { frontmatter: string; body: string; title: string; areaName?: string } {
  const raw = readFileSync(path.join(BLOG_ROOT, relativePath), 'utf8');
  const end = raw.indexOf('\n---', 3);
  const frontmatter = raw.slice(0, end);
  const body = raw.slice(end + 4);
  const title = frontmatter.match(/^title:\s*(.+)$/m)?.[1]?.trim().replace(/^["']|["']$/g, '') ?? '';
  const areaName = frontmatter.match(/^areaName:\s*(.+)$/m)?.[1]?.trim();
  return { frontmatter, body, title, areaName };
}

test('machine labels are slugs, not Japanese place names', () => {
  assert.equal(isMachineLabel('mazd2pet'), true);
  assert.equal(isMachineLabel('京都府京都市'), false);
  assert.equal(isMachineLabel('滋賀県草津市'), false);
  assert.equal(isMachineLabel(undefined), false);
});

test('Shiga Spacia case uses the measured 65,000円 fee, not the dealer quote', () => {
  const post = readPost('2026/04/2026-04-19-kusatunio/index.md');
  assert.match(post.body, /作業データ：6時間／65,000円/);
  assert.match(post.body, /１０万円/);
  const answer = buildBlogAnswerFirst({
    title: post.title,
    areaName: post.areaName,
    body: post.body,
  });
  assert.equal(answer.price, '65,000円');
  assert.match(answer.text, /費用は65,000円/);
  assert.equal(answer.text.includes('100,000'), false);
  assert.equal(answer.text.includes('10万円'), false);
});

test('a larger dealer-style estimate does not replace 作業データ', () => {
  const body = [
    '概算も5万円ぐらいかかるかもしれません。',
    '天井を外すと価格は一気に10万円をオーバーする想定です。',
    '作業データ：5時間／54,000円',
  ].join('\n');
  assert.equal(extractPrice(body), '54,000円');
});

test('dealer quote alone is not published as our fee', () => {
  const body = 'ディーラーさんにも、お見積りされたそうです。金額は　１０万円くらいになったそうです。';
  assert.equal(extractPrice(body), undefined);
});

test('explicit fee forms that are not the largest number in the article', () => {
  assert.equal(extractPrice('かかった費用は3万円でした。'), '30,000円');
  assert.equal(extractPrice('かかった費用は　55千円'), '55,000円');
  assert.equal(
    extractPrice('通常の費用にプラス5000円とオゾン消臭を合わせて28000円での対応となりました。'),
    '28,000円',
  );
  assert.equal(extractPrice('費用： 18000円'), '18,000円');
  assert.equal(extractPrice('費用　58,000円　（税込）'), '58,000円');
  assert.equal(extractPrice('計　32000円　後日'), '32,000円');
  assert.equal(extractPrice('作業データ：3時間\n55,000円'), '55,000円');
  assert.equal(extractPrice('作業時間　2時間\n\n31,000円'), '31,000円');
  assert.equal(extractPrice('作業データ：３時間\\\n総額　　35,000円'), '35,000円');
  assert.equal(
    extractPrice('施工費用　29000円　2席シート　22000円と　床部分の洗浄マット下　7000円'),
    '29,000円',
  );
});

test('every inline 作業データ fee is the price we publish', () => {
  const files: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/^index\.mdx?$/.test(entry.name)) files.push(full);
    }
  };
  walk(BLOG_ROOT);

  for (const file of files) {
    const raw = readFileSync(file, 'utf8');
    const end = raw.indexOf('\n---', 3);
    const body = raw.slice(end + 4);
    const inline = body.match(/作業データ[^\n]{0,80}?([0-9][0-9,]*)\s*円/);
    if (!inline) continue;
    const expected = Number(inline[1]?.replace(/,/g, ''));
    assert.equal(
      extractPrice(body),
      `${expected.toLocaleString('ja-JP')}円`,
      file,
    );
  }
});

test('Kyoto MAZDA2 article no longer uses the slug as a place or description', () => {
  const post = readPost('2026/02/2026-02-22-mazd2pet/index.md');
  assert.match(post.frontmatter, /areaName:\s*京都府京都市/);
  assert.equal(/areaName:\s*mazd2pet/.test(post.frontmatter), false);
  assert.match(post.frontmatter, /京都市でマツダ MAZDA2/);
  assert.equal(/meta_description:\s*mazd2pet/.test(post.frontmatter), false);

  const answer = buildBlogAnswerFirst({
    title: post.title,
    areaName: post.areaName,
    body: post.body,
  });
  assert.equal(answer.area, '京都府京都市');
  assert.equal(answer.price, '42,000円');
  assert.equal(answer.text.includes('mazd2pet'), false);

  const ignoredSlug = buildBlogAnswerFirst({
    title: '【京都市】マツダ MAZDA2のペット（犬）の粗相トラブル解決！',
    areaName: 'mazd2pet',
    body: post.body,
  });
  assert.equal(ignoredSlug.area?.includes('mazd2pet'), false);
  assert.match(ignoredSlug.area ?? '', /京都市/);
});
