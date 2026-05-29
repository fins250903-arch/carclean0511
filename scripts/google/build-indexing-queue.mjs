/**
 * Indexing API 送信用 URL キュー（重点地域キーワードLP → その他 → メイン等 → ブログ）
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../..');
const SITE = (process.env.SITE_URL ?? 'https://carinteriorcleaning.jp').replace(/\/$/, '');

/** adKeywordPages.ts と同期 */
const PRIORITY_REGION_IDS = ['chiba', 'aichi', 'osaka', 'hyogo', 'fukuoka'];

function parseRegions(ts) {
  const re = /\{\s*id:\s*'([^']+)',\s*name:\s*'([^']+)'\s*\}/g;
  const out = [];
  let m;
  while ((m = re.exec(ts))) out.push({ id: m[1], name: m[2] });
  return out;
}

function parseKeywordSlugs(ts) {
  return [...ts.matchAll(/^\s+slug: '([^']+)',/gm)].map((m) => m[1]);
}

function url(pathname) {
  const p = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${SITE}${p.endsWith('/') ? p : `${p}/`}`;
}

function collectBlogPaths(blogDir) {
  const blogPaths = [];
  
  function walkDir(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    for (const file of files) {
      const fullPath = path.join(dir, file.name);
      if (file.isDirectory()) {
        walkDir(fullPath);
      } else if (file.name === 'index.md' || file.name === 'index.mdx') {
        const relative = path.relative(blogDir, fullPath);
        const slug = path.dirname(relative).replace(/\\/g, '/');
        blogPaths.push(slug);
      }
    }
  }
  
  walkDir(blogDir);
  return blogPaths.sort();
}

export function buildIndexingQueue() {
  const regionsTs = fs.readFileSync(path.join(root, 'src/data/regions.ts'), 'utf8');
  const kwTs = fs.readFileSync(path.join(root, 'src/data/adKeywordPages.ts'), 'utf8');
  const regions = parseRegions(regionsTs);
  const slugs = parseKeywordSlugs(kwTs);

  const priority = regions.filter((r) => PRIORITY_REGION_IDS.includes(r.id));
  const other = regions.filter((r) => !PRIORITY_REGION_IDS.includes(r.id));

  const ordered = [];
  const phases = [];

  // Phase 1: 重点5地域 × キーワードLP
  for (const r of priority) {
    for (const slug of slugs) {
      ordered.push(url(`/regions/${r.id}/${slug}/`));
    }
  }
  phases.push({
    id: 'priority-keyword-lp',
    label: '重点地域キーワードLP（千葉・愛知・大阪・兵庫・福岡）',
    count: priority.length * slugs.length,
  });

  // Phase 2: その他地域 × キーワードLP
  for (const r of other) {
    for (const slug of slugs) {
      ordered.push(url(`/regions/${r.id}/${slug}/`));
    }
  }
  phases.push({
    id: 'other-keyword-lp',
    label: 'その他地域キーワードLP',
    count: other.length * slugs.length,
  });

  // Phase 3: 重点地域メイン + トラック
  for (const r of priority) {
    ordered.push(url(`/regions/${r.id}/`));
    ordered.push(url(`/regions/${r.id}-truck/`));
  }
  phases.push({
    id: 'priority-regional',
    label: '重点地域メイン・トラックLP',
    count: priority.length * 2,
  });

  // Phase 4: その他地域メイン + トラック
  for (const r of other) {
    ordered.push(url(`/regions/${r.id}/`));
    ordered.push(url(`/regions/${r.id}-truck/`));
  }
  phases.push({
    id: 'other-regional',
    label: 'その他地域メイン・トラックLP',
    count: other.length * 2,
  });

  // Phase 5: コーティング
  ordered.push(url('/coating/fukuoka/'));
  phases.push({ id: 'coating', label: 'コーティングLP', count: 1 });

  // Phase 6: ブログ記事（すべて）
  const blogDir = path.join(root, 'src/content/blog');
  const blogSlugs = collectBlogPaths(blogDir);
  for (const slug of blogSlugs) {
    ordered.push(url(`/blog/${slug}/`));
  }
  phases.push({
    id: 'blog',
    label: 'ブログ記事',
    count: blogSlugs.length,
  });

  return { ordered, phases, slugs, regions: regions.length, blogSlugs };
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const q = buildIndexingQueue();
  console.log(JSON.stringify({ total: q.ordered.length, phases: q.phases }, null, 2));
}
