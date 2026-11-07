/**
 * Compare visible FAQ copy with FAQPage JSON-LD in built prefecture HTML.
 * Run after `npm run build`: node scripts/verify-region-faq-html.mjs
 */
import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { regions } from '../src/data/regions.ts';

const DIST = new URL('../dist/', import.meta.url);
const FORBIDDEN = ['首都圏', '関西主要部', '数時間以内', '翌日午前', '地方や繁忙時'];
const REQUIRED = [
  '今日（または明日）すぐに来てほしいのですが、可能ですか？',
  '水道や電源は用意する必要がありますか？',
  '市販の消臭スプレーと何が違うのですか？',
];

function decode(text) {
  return text
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function visibleFaqs(html) {
  const section = html.match(/<section[^>]*\bid="faq"[\s\S]*?<\/section>/);
  if (!section) return null;
  const pairs = [];
  const pattern = /<h3\b[^>]*>([\s\S]*?)<\/h3>[\s\S]*?<p\b[^>]*>([\s\S]*?)<\/p>/g;
  for (const match of section[0].matchAll(pattern)) {
    pairs.push({ q: decode(match[1]), a: decode(match[2]) });
  }
  return pairs;
}

function schemaFaqs(html) {
  const pages = [];
  const scripts = html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g);
  for (const match of scripts) {
    const data = JSON.parse(match[1]);
    const nodes = Array.isArray(data['@graph']) ? data['@graph'] : [data];
    for (const node of nodes) {
      if (node['@type'] === 'FAQPage') pages.push(node);
    }
  }
  return pages;
}

async function walk(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else if (entry.name.endsWith('.html')) files.push(path);
  }
  return files;
}

const failures = [];
const regionRootHits = [];

function fail(path, message) {
  failures.push(`${relative(fileURLToPath(DIST), path)}: ${message}`);
}

const regionRoots = new Set(regions.map((region) => region.id));
const files = await walk(fileURLToPath(DIST) + '/regions');

for (const file of files) {
  const html = await readFile(file, 'utf8');
  const rel = relative(join(fileURLToPath(DIST), 'regions'), file);
  const top = rel.split('/')[0];
  const isPrefectureCar = regionRoots.has(top) && rel === `${top}/index.html`;

  for (const phrase of FORBIDDEN) {
    if (html.includes(phrase)) fail(file, `contains ${phrase}`);
  }

  const visible = visibleFaqs(html);
  if (!visible) continue;
  // bus-senmon renders bus FAQ copy but car FAQPage JSON-LD. That split predates this change.
  if (rel.includes('/bus-senmon/')) continue;
  const pages = schemaFaqs(html);
  if (pages.length !== 1) {
    fail(file, `FAQPage count ${pages.length}`);
    continue;
  }
  const schema = pages[0].mainEntity.map((item) => ({
    q: String(item.name).replace(/\s+/g, ' ').trim(),
    a: String(item.acceptedAnswer.text).replace(/\s+/g, ' ').trim(),
  }));
  if (visible.length !== schema.length) {
    fail(file, `visible ${visible.length} vs JSON-LD ${schema.length}`);
  }
  const limit = Math.max(visible.length, schema.length);
  for (let i = 0; i < limit; i += 1) {
    const left = visible[i];
    const right = schema[i];
    if (!left || !right || left.q !== right.q || left.a !== right.a) {
      fail(file, `mismatch at ${i + 1}: ${left?.q ?? '(none)'} / ${right?.q ?? '(none)'}`);
      break;
    }
  }

  if (!isPrefectureCar) continue;
  for (const question of REQUIRED) {
    if (!visible.some((faq) => faq.q === question)) fail(file, `missing visible ${question}`);
  }
  regionRootHits.push({ file: rel, count: visible.length, faqs: visible });
}

if (regionRootHits.length !== regions.length) {
  failures.push(`expected ${regions.length} prefecture car pages, found ${regionRootHits.length}`);
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`OK ${regionRootHits.length} prefecture car pages. FAQ counts:`);
for (const hit of regionRootHits) console.log(`${hit.count}\t${hit.file}`);
console.log(`Scanned ${files.length} region HTML files for other-region arrival phrases.`);

for (const id of ['osaka', 'fukuoka', 'tokyo']) {
  const hit = regionRootHits.find((item) => item.file === `${id}/index.html`);
  console.log(`\n# ${id} sample`);
  for (const faq of hit.faqs.filter((faq) => REQUIRED.includes(faq.q) || faq.q.includes('到着') || faq.q.startsWith('今すぐ来て'))) {
    console.log(`Q ${faq.q}`);
    console.log(`A ${faq.a}`);
  }
}
