/**
 * Publishes blog post images that Decap CMS commits next to the Markdown file.
 *
 * Older posts have their assets under `public/posts/<slug>/images/` (git-committed),
 * but the current CMS workflow stores them in `src/content/blog/<slug>/`, which Astro
 * does not serve. This copies them to `public/blog-media/<slug>/` (git-ignored, and
 * regenerated on every dev/build) so cover images, OGP images and schema.org
 * `image` values resolve.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentDir = path.resolve(__dirname, '../src/content/blog');
const destRoot = path.resolve(__dirname, '../public/blog-media');

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif']);

function collectImages(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectImages(full, files);
    } else if (IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      files.push(full);
    }
  }
  return files;
}

if (!fs.existsSync(contentDir)) {
  console.warn('[sync-blog-images] Content not found:', contentDir, '(skip)');
  process.exit(0);
}

let copied = 0;
let skipped = 0;

for (const from of collectImages(contentDir)) {
  const relative = path.relative(contentDir, from);
  const to = path.join(destRoot, relative);

  const source = fs.statSync(from);
  const existing = fs.existsSync(to) ? fs.statSync(to) : null;
  if (existing && existing.size === source.size && existing.mtimeMs >= source.mtimeMs) {
    skipped++;
    continue;
  }

  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
  copied++;
}

console.log(
  `[sync-blog-images] Published ${copied} image(s) (${skipped} up to date) → public/blog-media`,
);
