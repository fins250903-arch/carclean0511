import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { regionalExplainerArticles } from '../data/regionalExplainerArticles.ts';
import {
  resolveRegionalExplainerLinks,
  type ExplainerSourcePost,
} from './regionalExplainerArticles.ts';

const BLOG_ROOT = path.resolve(process.cwd(), 'src/content/blog');

const FUKUOKA_LABELS = [
  '布シートの黒ずみ',
  'ペットの毛が取れない',
  'シエンタの嘔吐',
  'エスクワイアの嘔吐',
  'フィットのニオイ',
  '魚の汁こぼしのニオイ',
  'タンクの食べこぼし',
  '牛乳こぼしの腐敗臭',
];

function walkIndexFiles(dir: string): string[] {
  const found: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      found.push(...walkIndexFiles(full));
    } else if (entry.name === 'index.md' || entry.name === 'index.mdx') {
      found.push(full);
    }
  }
  return found;
}

function parseFrontmatter(file: string): {
  title: string;
  shortSlug?: string;
  categories?: string[];
  areaName?: string;
  noindex: boolean;
} {
  const text = readFileSync(file, 'utf8');
  const raw = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
  const data: Record<string, string | string[]> = {};
  let listKey: string | null = null;

  for (const line of raw.split('\n')) {
    if (/^\s+-\s+/.test(line) && listKey) {
      const list = data[listKey];
      if (Array.isArray(list)) list.push(line.replace(/^\s+-\s+/, '').trim().replace(/^['"]|['"]$/g, ''));
      continue;
    }
    listKey = null;
    const match = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!match) continue;
    const key = match[1]!;
    const value = match[2]!.trim();
    if (value === '' || value === '>' || value === '|' || value === '>-' || value === '|-') {
      data[key] = [];
      listKey = key;
      continue;
    }
    data[key] = value.replace(/^['"]|['"]$/g, '');
  }

  const title = data.title;
  const shortSlug = data.shortSlug;
  const areaName = data.areaName;
  const categories = data.categories;
  const noindex = /^\s*noindex:\s*true\s*$/m.test(raw);

  return {
    title: typeof title === 'string' ? title : '',
    shortSlug: typeof shortSlug === 'string' ? shortSlug : undefined,
    areaName: typeof areaName === 'string' ? areaName : undefined,
    categories: Array.isArray(categories) ? categories : undefined,
    noindex,
  };
}

function loadBlogPosts(): ExplainerSourcePost[] {
  return walkIndexFiles(BLOG_ROOT).map((file) => {
    const meta = parseFrontmatter(file);
    const id = path.relative(BLOG_ROOT, file).replace(/\\/g, '/').replace(/\/index\.mdx?$/, '');
    return {
      id,
      data: {
        title: meta.title,
        shortSlug: meta.shortSlug,
        categories: meta.categories,
        areaName: meta.areaName,
        seo: { noindex: meta.noindex },
      },
    };
  });
}

const posts = loadBlogPosts();

test('Fukuoka LP links resolve to real posts in the blog region list', () => {
  const section = resolveRegionalExplainerLinks(posts, 'fukuoka');
  assert.ok(section);
  assert.equal(section.heading, '福岡の解説記事');
  assert.equal(section.listLabel, '福岡県の記事一覧を見る');
  assert.equal(section.listHref, `/blog/?region=${encodeURIComponent('福岡県')}`);
  assert.deepEqual(
    section.links.map((link) => link.label),
    FUKUOKA_LABELS,
  );
  assert.equal(section.links.length >= 5 && section.links.length <= 8, true);

  for (const link of section.links) {
    assert.match(link.href, /^\/blog\/2026\/\d{2}\/[^/]+\/$/);
    assert.equal(link.title.length > 0, true);
    const file = path.join(BLOG_ROOT, link.href.replace(/^\/blog\//, ''), 'index.md');
    assert.equal(existsSync(file), true, link.href);
    const meta = parseFrontmatter(file);
    assert.equal(meta.categories?.includes('fukuoka'), true, link.href);
    assert.equal(meta.noindex, false, link.href);
  }
});

test('regions without a curated list render nothing', () => {
  assert.equal(regionalExplainerArticles.osaka, undefined);
  assert.equal(resolveRegionalExplainerLinks(posts, 'osaka'), null);
  assert.equal(resolveRegionalExplainerLinks(posts, 'hyogo'), null);
  assert.equal(resolveRegionalExplainerLinks(posts, undefined), null);
});

test('a missing, noindex, or other-region pick is dropped and does not invent a URL', () => {
  const fukuoka = posts.filter((post) => post.data.categories?.includes('fukuoka'));
  assert.ok(fukuoka.length >= 8);

  const withoutSeat = fukuoka.filter((post) => post.data.shortSlug !== 'fukuokaseatkurozumi');
  const dropped = resolveRegionalExplainerLinks(withoutSeat, 'fukuoka');
  assert.ok(dropped);
  assert.equal(
    dropped.links.some((link) => link.label === '布シートの黒ずみ'),
    false,
  );
  assert.equal(dropped.links.length, FUKUOKA_LABELS.length - 1);

  const hidden: ExplainerSourcePost = {
    id: '2026/11/2026-11-05-fukuokaseatkurozumi',
    data: {
      title: 'hidden',
      shortSlug: 'fukuokaseatkurozumi',
      categories: ['fukuoka'],
      seo: { noindex: true },
    },
  };
  const noindex = resolveRegionalExplainerLinks(
    [...withoutSeat, hidden],
    'fukuoka',
  );
  assert.ok(noindex);
  assert.equal(
    noindex.links.some((link) => link.href.includes('fukuokaseatkurozumi')),
    false,
  );

  const elsewhere: ExplainerSourcePost = {
    id: '2026/01/made-up-fukuoka',
    data: {
      title: 'not fukuoka',
      shortSlug: 'fukuokaseatkurozumi',
      categories: ['aichi'],
    },
  };
  const wrongRegion = resolveRegionalExplainerLinks(
    [...withoutSeat, elsewhere],
    'fukuoka',
  );
  assert.ok(wrongRegion);
  assert.equal(
    wrongRegion.links.some((link) => link.href.includes('made-up')),
    false,
  );
});
