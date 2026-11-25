import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { regions } from '../data/regions.ts';
import { regionalPosts } from '../data/regionalPosts.ts';
import { REGIONAL_FV_MAIN_TITLES } from '../data/fvAdGroupCopy.ts';
import { buildBlogAnswerFirst } from './blogAnswerFirst.ts';
import { buildBlogInternalLinks } from './blogInternalLinks.ts';
import { resolvePostRegionIds } from './blogRegion.ts';
import { classifyAnchorHref } from './internalLinkCheck.ts';
import {
  listKeywordMutualLinks,
  resolveConcernSlug,
} from './keywordMutualLinks.ts';
import { regionPath } from './niche.ts';
import { loadRedirectSources, normalizePathname } from './sitemapPolicy.ts';

const redirects = loadRedirectSources();
const OSAKA_ALIASES: Record<string, string> = {
  'gero-cleaning': 'vomit-cleaning',
  'pet-hair-odor': 'pet-ke',
  'pet-waste': 'pet-unko',
  'seat-washing': 'seat-senjo',
  'tobacco-odor': 'tabako-yani',
};

test('concern links only target a live page for that prefecture', () => {
  for (const region of regions) {
    const links = listKeywordMutualLinks(region.id, region.name, redirects);
    const hrefs = new Set<string>();
    for (const link of links) {
      assert.equal(link.href.endsWith('/'), true, link.href);
      assert.equal(hrefs.has(link.href), false, link.href);
      hrefs.add(link.href);
      assert.equal(redirects.has(link.href), false, `${region.id} ${link.href}`);
      assert.match(link.href, new RegExp(`^/regions/${region.id}/[^/]+/$`));
    }
  }
});

test('Osaka missing concern slugs use the approved substitutes', () => {
  for (const [source, target] of Object.entries(OSAKA_ALIASES)) {
    assert.equal(resolveConcernSlug('osaka', source, redirects), target, source);
  }
  const hrefs = listKeywordMutualLinks('osaka', '大阪府', redirects).map((link) => link.href);
  for (const source of Object.keys(OSAKA_ALIASES)) {
    assert.equal(hrefs.includes(`/regions/osaka/${source}/`), false, source);
  }
  assert.equal(hrefs.includes('/regions/osaka/vomit-cleaning/'), true);
  assert.equal(hrefs.includes('/regions/osaka/pet-ke/'), true);
  assert.equal(hrefs.includes('/regions/osaka/pet-unko/'), true);
  assert.equal(hrefs.includes('/regions/osaka/seat-senjo/'), true);
  assert.equal(hrefs.includes('/regions/osaka/tabako-yani/'), true);
});

test('prefectures without the English vomit slug link to kyuto-cleaning', () => {
  assert.equal(resolveConcernSlug('miyagi', 'vomit-cleaning', redirects), 'kyuto-cleaning');
  assert.equal(resolveConcernSlug('miyagi', 'gero-cleaning', redirects), 'kyuto-cleaning');
});

test('redirected legacy slugs are not used when the new slug exists', () => {
  assert.equal(resolveConcernSlug('hyogo', 'seat-washing', redirects), 'seat-washing');
  assert.equal(resolveConcernSlug('aichi', 'tobacco-odor', redirects), 'tobacco-odor');
  assert.equal(resolveConcernSlug('osaka', 'vomit-cleaning', redirects), 'vomit-cleaning');
});

test('region paths and the four hero titles keep a trailing slash and the keyword', () => {
  for (const region of regions) {
    for (const niche of ['car', 'truck', 'bus'] as const) {
      assert.equal(regionPath(region.id, niche).endsWith('/'), true);
    }
  }
  assert.equal(REGIONAL_FV_MAIN_TITLES['大阪府'], '大阪の出張車内清掃｜最短即日・プロ洗浄');
  assert.equal(REGIONAL_FV_MAIN_TITLES['兵庫県'], '兵庫の出張車内清掃｜神戸・阪神へ即日対応');
  assert.equal(REGIONAL_FV_MAIN_TITLES['福岡県'], '福岡の出張車内清掃｜プロが新車の輝きを復活');
  assert.equal(REGIONAL_FV_MAIN_TITLES['宮城県'], '宮城の出張車内清掃｜仙台へ即日対応');
  for (const title of Object.values(REGIONAL_FV_MAIN_TITLES)) {
    if (title.startsWith('大阪の') || title.startsWith('兵庫の') || title.startsWith('福岡の') || title.startsWith('宮城の')) {
      assert.equal(title.startsWith(title.slice(0, 2) + 'の出張車内清掃') || title.startsWith(title.slice(0, 3) + 'の出張車内清掃'), true, title);
    }
  }
});

test('four prefecture intros name 出張車内清掃 and shared copy uses the approved sentences', () => {
  for (const name of ['大阪府', '兵庫県', '福岡県', '宮城県']) {
    assert.equal(regionalPosts[name].aiSummary?.includes('出張車内清掃（車内クリーニング・消臭洗浄）'), true, name);
  }
  const regionAi = readFileSync(new URL('../components/sections/RegionAIContent.astro', import.meta.url), 'utf8');
  const solution = readFileSync(new URL('../components/sections/Solution.astro', import.meta.url), 'utf8');
  const operator = readFileSync(new URL('../components/sections/OperatorInfo.astro', import.meta.url), 'utf8');
  const regionPage = readFileSync(new URL('../pages/regions/[region].astro', import.meta.url), 'utf8');
  const hero = readFileSync(new URL('../components/sections/Hero.astro', import.meta.url), 'utf8');
  const closing = readFileSync(new URL('../components/sections/Closing.astro', import.meta.url), 'utf8');
  assert.equal(regionAi.includes('の出張車内清掃・消臭洗浄'), true);
  assert.equal(solution.includes('専門機材による出張車内清掃（シート洗浄・消臭）を行います'), true);
  assert.equal(solution.includes('キャビンクリーニング・シート洗浄を行います'), true);
  assert.equal(operator.includes('の出張車内清掃は、現地の専門プロのスタッフがご指定の駐車場で承ります。'), true);
  assert.equal(operator.includes('本部は岡山、各地域へは現地の専門プロのスタッフが出張対応'), false);
  assert.equal(regionPage.includes("isBus ? '出張バス車内清掃' : '出張車内清掃'"), true);
  assert.equal(hero.includes('の出張車内クリーニング'), true);
  assert.equal(closing.includes("r.id === 'osaka' ? '/'"), false);
  assert.equal(closing.includes('href: `/regions/${r.id}/`'), true);
});

function walkBlog(dir: string, files: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) walkBlog(full, files);
    else if (name === 'index.md' || name === 'index.mdx') files.push(full);
  }
  return files;
}

function frontmatter(raw: string) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const text = match?.[1] ?? '';
  const body = match ? raw.slice(match[0].length) : raw;
  const pick = (key: string) => text.match(new RegExp(`^${key}:\\s*['"]?(.+?)['"]?\\s*$`, 'm'))?.[1];
  const categories: string[] = [];
  const catBlock = text.match(/^categories:\s*\n((?:\s+-\s+.+\n?)+)/m);
  if (catBlock) {
    for (const line of catBlock[1].split('\n')) {
      const item = line.match(/^\s+-\s+['"]?(.+?)['"]?\s*$/);
      if (item) categories.push(item[1]);
    }
  }
  const summary: Record<string, string> = {};
  for (const key of ['answer_first', 'trouble', 'method', 'work_time', 'price', 'car_model']) {
    const value = text.match(new RegExp(`^\\s+${key}:\\s*['"]?(.+?)['"]?\\s*$`, 'm'))?.[1];
    if (value) summary[key] = value;
  }
  return {
    title: pick('title') ?? '',
    areaName: pick('areaName'),
    categories,
    summary: Object.keys(summary).length ? summary : undefined,
    body,
  };
}

test('blog internal links do not point at a known 301', () => {
  const blogRoot = path.resolve(process.cwd(), 'src/content/blog');
  let checked = 0;
  for (const file of walkBlog(blogRoot)) {
    const parsed = frontmatter(readFileSync(file, 'utf8'));
    const post = {
      data: {
        title: parsed.title,
        areaName: parsed.areaName,
        categories: parsed.categories,
      },
    };
    const answer = buildBlogAnswerFirst({
      title: parsed.title,
      areaName: parsed.areaName,
      body: parsed.body,
      summary: parsed.summary,
    });
    const links = buildBlogInternalLinks({
      regionIds: resolvePostRegionIds(post),
      trouble: answer.trouble,
      area: answer.area,
      title: parsed.title,
    });
    for (const link of links) {
      checked += 1;
      const pathname = new URL(link.href).pathname;
      assert.equal(pathname.endsWith('/'), true, link.href);
      assert.equal(redirects.has(normalizePathname(pathname)), false, `${file} ${link.href}`);
    }
  }
  assert.ok(checked > 100);
});

test('anchor classifier rejects missing slashes, 301s, and unknown paths', () => {
  const exists = (pathname: string) => pathname === '/regions/osaka/vomit-cleaning/' || pathname === '/aio/';
  assert.equal(classifyAnchorHref('/regions/osaka', '/regions/osaka/', redirects, exists), 'no-slash');
  assert.equal(classifyAnchorHref('/', '/blog/x/', redirects, exists), 'redirect');
  assert.equal(
    classifyAnchorHref('/regions/osaka/gero-cleaning/', '/regions/osaka/', redirects, exists),
    'redirect',
  );
  assert.equal(
    classifyAnchorHref('/regions/osaka/vomit-cleaning/', '/regions/osaka/', redirects, exists),
    'ok',
  );
  assert.equal(
    classifyAnchorHref('/regions/osaka/not-a-page/', '/regions/osaka/', redirects, exists),
    'missing',
  );
  assert.equal(classifyAnchorHref('https://lin.ee/Xs8Orp2', '/aio/', redirects, exists), 'skip');
  assert.equal(classifyAnchorHref('/aio/', '/blog/x/', redirects, exists), 'ok');
});
