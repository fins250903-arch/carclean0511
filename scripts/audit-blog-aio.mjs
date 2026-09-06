/**
 * Mechanical AIO audit for every 施工ブログ post.
 * Run: node --experimental-strip-types scripts/audit-blog-aio.mjs
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  buildBlogAnswerFirst,
  extractAreaFromTitle,
  extractCarModel,
  extractPlaceFromTitle,
  extractPrice,
  extractWorkTime,
  isGuideArticle,
} from '../src/lib/blogAnswerFirst.ts';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BLOG_DIR = join(ROOT, 'src/content/blog');

const KEYWORD_LP = {
  '嘔吐（ゲロ）汚れとニオイ': 'kyuto-cleaning',
  '下痢による汚れとニオイ': 'unko',
  'おもらし・尿の染み込み': 'omorashi',
  'ペットの粗相・獣臭': 'pet-nioi',
  '灯油こぼし': 'touyu-kobosi',
  'タバコ・ヤニのニオイ': 'tabako-yani',
  'カビ臭': 'shanai-shoshu',
  '芳香剤・香水のニオイ移り': 'spray-kouka-nai',
  '飲み物・食べこぼしのシミ': 'seat-senjo',
  '食べこぼしのシミ': 'seat-senjo',
  '腐敗臭': 'shanai-shoshu',
  '加齢臭・体臭': 'kareisyu',
  '泥・砂汚れ': 'seat-cleaning',
  'エアコンの吹き出し臭': 'ac-nioi',
  '車内全体の汚れとニオイ': 'shanai-nioi',
  '浸水・水没後の洗浄': 'shanai-shoshu',
};

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.name === 'index.md' || entry.name === 'index.mdx') out.push(full);
  }
  return out;
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { data: {}, body: raw };
  const block = match[1];
  const data = {};
  const title = block.match(/^title:\s*(?:"([^"]+)"|'([^']+)'|(.+))$/m);
  if (title) data.title = (title[1] ?? title[2] ?? title[3]).trim();
  const area = block.match(/^areaName:\s*(.+)$/m);
  if (area) data.areaName = area[1].trim();
  const noindex = /noindex:\s*true/.test(block);
  data.seo = { noindex };
  const summary = {};
  for (const key of ['answer_first', 'car_model', 'trouble', 'method', 'work_time', 'price']) {
    const row = block.match(new RegExp(`^\\s+${key}:\\s*(.+)$`, 'm'));
    if (row) summary[key] = row[1].replace(/^["']|["']$/g, '').trim();
  }
  if (Object.keys(summary).length) data.summary = summary;
  return { data, body: match[2] };
}

function loadPosts() {
  return walk(BLOG_DIR).map((file) => {
    const raw = readFileSync(file, 'utf8');
    const { data, body } = parseFrontmatter(raw);
    const slug = file.replace(`${BLOG_DIR}/`, '').replace(/\/index\.mdx?$/, '');
    return { file, slug, data, body };
  });
}

const FIXTURES = [
  {
    slug: '2026/09/2026-09-03-merusedesucseisou',
    expect: { kind: 'case', notTrouble: 'タバコ・ヤニのニオイ', hasPrice: true },
  },
  {
    slug: '2026/08/2026-08-08-fitsosou',
    expect: { kind: 'case', trouble: 'おもらし・尿の染み込み' },
  },
  {
    slug: '2026/07/2026-07-31-osakakaigobaisyo',
    expect: { kind: 'guide', trouble: 'おもらし・尿の染み込み' },
  },
  {
    slug: '2026/04/2026-04-30-hakatasakana',
    expect: { kind: 'case', trouble: '腐敗臭' },
  },
  {
    slug: '2026/06/2026-06-01-4ttorakkusaitama',
    expect: { kind: 'case', trouble: '車内全体の汚れとニオイ' },
  },
  {
    slug: '2026/09/2026-09-02-taftauto',
    expect: { kind: 'case', trouble: '嘔吐（ゲロ）汚れとニオイ', price: '28,000円', workTime: '約3時間' },
  },
  {
    slug: '2026/09/2026-09-04-estimaomorasi',
    expect: { kind: 'case', trouble: 'おもらし・尿の染み込み', price: '28,000円' },
  },
  {
    slug: '2026/08/2026-08-11-konnsoruouto',
    expect: { kind: 'case', price: '32,000円' },
  },
  {
    slug: '2026/04/2026-04-29-nahadogpee',
    expect: { kind: 'case', trouble: 'ペットの粗相・獣臭', workTime: '約2時間30分' },
  },
  {
    slug: '2026/04/2026-04-29-lactiscoffee',
    expect: { kind: 'case', areaIncludes: '豊田' },
  },
  {
    slug: '2026/04/2026-04-05-dogunti',
    expect: { kind: 'guide' },
  },
  {
    slug: '2026/04/2026-04-19-childouto',
    expect: { kind: 'guide' },
  },
  {
    slug: '2026/04/2026-04-16-hariadeo',
    expect: { kind: 'guide' },
  },
  {
    slug: '2026/06/2026-06-12-baisyohokennouto',
    expect: { kind: 'guide', noPrice: true },
  },
  {
    slug: '2026/06/2026-06-13-velfiretabaccoo',
    expect: { kind: 'case', trouble: 'タバコ・ヤニのニオイ', price: '58,000円', areaIncludes: '横浜' },
  },
  {
    slug: '2026/04/2026-04-23-harrierouto1',
    expect: { kind: 'guide' },
  },
  {
    slug: '2026/04/2026-04-04-kasiwaspcia',
    expect: { kind: 'case', trouble: 'カビ臭' },
  },
  {
    slug: '2026/03/2026-03-31-kawagoecx30',
    expect: { kind: 'case', price: '55,000円', workTime: '約3時間' },
  },
  {
    slug: '2026/08/2026-08-25-hiluxtobacco',
    expect: { kind: 'case', workTime: '約5時間', price: '48,000円' },
  },
  {
    slug: '2026/08/2026-08-31-hustlergeri',
    expect: { kind: 'case', workTime: '約2時間', price: '27,000円' },
  },
];

function analyze(post) {
  const answer = buildBlogAnswerFirst({
    title: post.data.title ?? '',
    areaName: post.data.areaName,
    body: post.body,
    summary: post.data.summary,
  });
  const issues = [];
  if (!answer.text) issues.push('empty-answer');
  if (answer.kind === 'case' && !answer.area) issues.push('case-without-area');
  if (answer.kind === 'case' && !answer.trouble) issues.push('case-without-trouble');
  if (answer.kind === 'case' && !answer.carModel && extractCarModel(post.data.title ?? '')) {
    issues.push('car-missed');
  }
  if (answer.trouble && !KEYWORD_LP[answer.trouble]) issues.push('unmapped-trouble');
  if (answer.kind === 'case' && !answer.price && extractPrice(post.body)) {
    issues.push('price-missed');
  }
  return { post, answer, issues };
}

function runFixtures(posts) {
  const bySlug = new Map(posts.map((p) => [p.slug, p]));
  const failures = [];
  for (const fixture of FIXTURES) {
    const post = bySlug.get(fixture.slug);
    if (!post) {
      failures.push(`${fixture.slug}: missing file`);
      continue;
    }
    const answer = buildBlogAnswerFirst({
      title: post.data.title ?? '',
      areaName: post.data.areaName,
      body: post.body,
      summary: post.data.summary,
    });
    const { expect } = fixture;
    if (expect.kind && answer.kind !== expect.kind) {
      failures.push(`${fixture.slug}: kind ${answer.kind} != ${expect.kind}`);
    }
    if (expect.trouble && answer.trouble !== expect.trouble) {
      failures.push(`${fixture.slug}: trouble ${answer.trouble} != ${expect.trouble}`);
    }
    if (expect.notTrouble && answer.trouble === expect.notTrouble) {
      failures.push(`${fixture.slug}: false-positive ${expect.notTrouble}`);
    }
    if (expect.price && answer.price !== expect.price) {
      failures.push(`${fixture.slug}: price ${answer.price} != ${expect.price}`);
    }
    if (expect.workTime && answer.workTime !== expect.workTime) {
      failures.push(`${fixture.slug}: time ${answer.workTime} != ${expect.workTime}`);
    }
    if (expect.areaIncludes && !answer.area?.includes(expect.areaIncludes)) {
      failures.push(`${fixture.slug}: area ${answer.area} missing ${expect.areaIncludes}`);
    }
    if (expect.hasPrice && !answer.price) {
      failures.push(`${fixture.slug}: expected price`);
    }
    if (expect.noPrice && answer.price) {
      failures.push(`${fixture.slug}: unexpected price ${answer.price}`);
    }
  }
  return failures;
}

function scoreAll(rows) {
  const cases = rows.filter((r) => r.answer.kind === 'case');
  const guides = rows.filter((r) => r.answer.kind === 'guide');
  const withPrice = cases.filter((r) => r.answer.price).length;
  const withTime = cases.filter((r) => r.answer.workTime).length;
  const withCar = cases.filter((r) => r.answer.carModel).length;
  const withMethod = cases.filter((r) => r.answer.method).length;
  const withTrouble = rows.filter((r) => r.answer.trouble).length;
  const mapped = rows.filter((r) => r.answer.trouble && KEYWORD_LP[r.answer.trouble]).length;
  const issueCount = rows.reduce((n, r) => n + r.issues.length, 0);
  return {
    total: rows.length,
    cases: cases.length,
    guides: guides.length,
    withPrice,
    withTime,
    withCar,
    withMethod,
    withTrouble,
    mapped,
    issueCount,
    priceRate: cases.length ? withPrice / cases.length : 0,
    timeRate: cases.length ? withTime / cases.length : 0,
    carRate: cases.length ? withCar / cases.length : 0,
    methodRate: cases.length ? withMethod / cases.length : 0,
  };
}

const LOOPS = Number(process.env.AIO_AUDIT_LOOPS ?? 20);

function main() {
  const posts = loadPosts();
  let failed = false;
  let lastScore;

  for (let i = 1; i <= LOOPS; i += 1) {
    const fixtureFails = runFixtures(posts);
    const rows = posts.map(analyze);
    lastScore = scoreAll(rows);
    if (fixtureFails.length) {
      failed = true;
      if (i === 1 || i === LOOPS) {
        console.error(`LOOP ${i} fixture failures:`);
        for (const line of fixtureFails) console.error(`  - ${line}`);
      }
    }
    if (i === 1 || i === LOOPS) {
      const worst = rows.filter((r) => r.issues.length).slice(0, 20);
      console.log(
        `LOOP ${i}/${LOOPS} posts=${lastScore.total} case=${lastScore.cases} guide=${lastScore.guides} ` +
          `price=${(lastScore.priceRate * 100).toFixed(0)}% time=${(lastScore.timeRate * 100).toFixed(0)}% ` +
          `car=${(lastScore.carRate * 100).toFixed(0)}% method=${(lastScore.methodRate * 100).toFixed(0)}% ` +
          `mapped=${lastScore.mapped}/${lastScore.total} issues=${lastScore.issueCount}`,
      );
      if (i === 1 && worst.length) {
        console.log('Issues:');
        for (const row of worst) {
          console.log(`  ${row.post.slug} [${row.answer.kind}] ${row.answer.trouble ?? '-'} :: ${row.issues.join(', ')}`);
        }
      }
    }
  }

  console.log('\nSample extracts:');
  for (const slug of [
    '2026/09/2026-09-04-estimaomorasi',
    '2026/08/2026-08-08-fitsosou',
    '2026/04/2026-04-30-hakatasakana',
    '2026/06/2026-06-13-velfiretabaccoo',
    '2026/04/2026-04-29-lactiscoffee',
  ]) {
    const post = posts.find((p) => p.slug === slug);
    if (!post) continue;
    const a = buildBlogAnswerFirst({
      title: post.data.title ?? '',
      areaName: post.data.areaName,
      body: post.body,
      summary: post.data.summary,
    });
    console.log(
      `  ${slug}: kind=${a.kind} area=${a.area} car=${a.carModel} trouble=${a.trouble} time=${a.workTime} price=${a.price}`,
    );
  }

  console.log(
    `\nSanity: areaFromTitle(愛知県【豊田市】)=${extractAreaFromTitle('愛知県【豊田市】トヨタ')} place(横浜のヴェル)=${extractPlaceFromTitle('横浜のヴェルファイア')} time=${extractWorkTime('作業時間：2時間30分 費用：34,000円')} price=${extractPrice('計　32000円　後日')} guide=${isGuideArticle('やってはいけないこととは')}`,
  );

  if (failed) {
    process.exitCode = 1;
  }
}

main();
