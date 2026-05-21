import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const blogRoot = path.join(__dirname, '../src/content/blog');
const regionIds = [
  'aichi', 'okinawa', 'fukuoka', 'hyogo', 'ibaraki', 'chiba', 'saitama',
  'kanagawa', 'siga', 'kumamoto', 'miyagi', 'tochigi', 'kyoto', 'tokyo',
  'osaka', 'gunma', 'shizuoka', 'nara', 'wakayama', 'saga', 'fukui',
];

const posts = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name === 'index.md') {
      const raw = fs.readFileSync(full, 'utf8');
      const fm = raw.split('---')[1] || '';
      const titleMatch = fm.match(/title:\s*["']?([^"'\n]+)["']?/);
      const dateMatch = fm.match(/date:\s*([^\n]+)/);
      const catBlock = fm.match(/categories:\s*([\s\S]*?)(?:\n[a-z]|$)/);
      const cats = catBlock
        ? [...catBlock[1].matchAll(/-\s*["']?([^"'\n]+)["']?/g)].map((m) => m[1].trim())
        : [];
      const coverMatch = fm.match(/coverImage:\s*["']?([^"'\n]+)["']?/);
      const regionCat = cats.find((c) => regionIds.includes(c));
      if (!regionCat || !titleMatch) continue;
      const rel = path.relative(blogRoot, full).replace(/\\/g, '/');
      const slug = rel.replace(/\/index\.md$/, '');
      posts.push({
        regionId: regionCat,
        title: titleMatch[1].trim(),
        date: dateMatch ? dateMatch[1].trim() : '',
        slug,
        coverImage: coverMatch ? coverMatch[1].trim() : null,
        sortKey: dateMatch ? dateMatch[1].trim() : slug,
      });
    }
  }
}

walk(blogRoot);
posts.sort((a, b) => (a.sortKey < b.sortKey ? 1 : -1));

const byRegion = {};
for (const p of posts) {
  if (!byRegion[p.regionId]) byRegion[p.regionId] = [];
  if (byRegion[p.regionId].length < 2) byRegion[p.regionId].push(p);
}

console.log(JSON.stringify(byRegion, null, 2));
