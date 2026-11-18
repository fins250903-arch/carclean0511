/**
 * Prebuild responsive WebP for landing-page <img> tags.
 *
 * Original files stay in place so og:image, JSON-LD, and old browsers keep a
 * real JPEG/PNG/WebP URL. Modern browsers receive the srcset written into
 * src/data/lpImageManifest.json and src/data/blogCardImageManifest.json.
 *
 * AVIF is not emitted: a partial AVIF srcset would make desktop pick a small
 * AVIF over a sharper WebP, and a full AVIF set multiplies build time.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const publicDir = path.join(root, 'public');
const optDir = path.join(publicDir, 'images', 'opt');
const contentDir = path.join(root, 'src/content/blog');
const publicManifestPath = path.join(root, 'src/data/lpImageManifest.json');
const blogManifestPath = path.join(root, 'src/data/blogCardImageManifest.json');

const RASTER = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif']);
const SOURCE_EXT = new Set(['.astro', '.tsx', '.ts', '.jsx', '.js', '.mjs']);
const POOL = 4;

const IMAGE_URL = /\/(?:images|posts|blog-media)\/[A-Za-z0-9_./-]+\.(?:png|jpe?g|webp|avif)/g;

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === 'opt') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

function publicUrlForFile(file) {
  const rel = path.relative(publicDir, file).split(path.sep).join('/');
  return `/${rel}`;
}

function fileForPublicUrl(url) {
  const rel = url.replace(/^\//, '');
  const inPublic = path.join(publicDir, rel);
  if (fs.existsSync(inPublic)) return inPublic;
  if (rel.startsWith('blog-media/')) {
    const inContent = path.join(contentDir, rel.slice('blog-media/'.length));
    if (fs.existsSync(inContent)) return inContent;
  }
  return null;
}

function outputPublicPath(srcUrl, width) {
  const clean = srcUrl.replace(/^\//, '');
  const parsed = path.posix.parse(clean);
  let outDir;
  if (parsed.dir === 'images') outDir = 'images/opt';
  else if (parsed.dir.startsWith('images/')) outDir = `images/opt/${parsed.dir.slice('images/'.length)}`;
  else outDir = `images/opt/${parsed.dir}`;
  return `/${outDir}/${parsed.name}-${width}.webp`;
}

function chooseWidths(pixelWidth, documentImage) {
  const steps = documentImage ? [640, 1100, 1600] : [480, 800, 1280, 1600];
  const widths = steps.filter((width) => width < pixelWidth - 24);
  if (pixelWidth <= 1600) widths.push(pixelWidth);
  else if (!widths.includes(1600)) widths.push(1600);
  return [...new Set(widths)].sort((a, b) => a - b);
}

function collectStaticUrls() {
  const urls = new Set();
  const srcDir = path.join(root, 'src');
  for (const file of walk(srcDir)) {
    if (!SOURCE_EXT.has(path.extname(file))) continue;
    const text = fs.readFileSync(file, 'utf8');
    for (const match of text.matchAll(IMAGE_URL)) urls.add(match[0]);
    // `kw('pet-nioi.png')` builds `/images/kw/pet-nioi.png` with no literal path.
    for (const match of text.matchAll(/\bkw\(\s*['"]([^'"]+)['"]\s*\)/g)) {
      urls.add(`/images/kw/${match[1]}`);
    }
  }
  return urls;
}

function frontmatter(file) {
  const text = fs.readFileSync(file, 'utf8');
  const match = text.match(/^---\n([\s\S]*?)\n---/);
  return match ? match[1] : '';
}

function field(fm, key) {
  const match = fm.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
  if (!match) return undefined;
  return match[1].trim().replace(/^['"]|['"]$/g, '');
}

/** Cover / OGP files shown on region LP blog cards. */
function collectBlogUrls() {
  const urls = new Set();
  if (!fs.existsSync(contentDir)) return urls;
  for (const file of walk(contentDir)) {
    if (path.basename(file) !== 'index.md' && path.basename(file) !== 'index.mdx') continue;
    const slug = path.relative(contentDir, path.dirname(file)).split(path.sep).join('/');
    const fm = frontmatter(file);
    for (const name of [field(fm, 'coverImage'), field(fm, 'og_image')]) {
      if (!name || name.startsWith('http')) continue;
      if (name.startsWith('/')) {
        urls.add(name);
        continue;
      }
      const candidates = [
        path.join(contentDir, slug, name),
        path.join(contentDir, slug, 'images', name),
        path.join(publicDir, 'posts', slug, 'images', name),
        path.join(publicDir, 'posts', slug, name),
      ];
      const found = candidates.find((candidate) => fs.existsSync(candidate));
      if (!found) continue;
      if (found.startsWith(contentDir)) {
        const rel = path.relative(contentDir, found).split(path.sep).join('/');
        urls.add(`/blog-media/${rel}`);
      } else {
        urls.add(publicUrlForFile(found));
      }
    }
  }
  return urls;
}

async function mapPool(items, fn) {
  const results = new Array(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await fn(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(POOL, items.length) }, () => worker()));
  return results;
}

async function optimizeOne(url) {
  if (path.posix.basename(url).startsWith('logo')) return null;
  const source = fileForPublicUrl(url);
  if (!source) {
    console.warn('[optimize-lp-images] missing file for', url);
    return null;
  }
  const ext = path.extname(source).toLowerCase();
  if (!RASTER.has(ext)) return null;

  let meta;
  try {
    meta = await sharp(source).metadata();
  } catch (error) {
    console.warn('[optimize-lp-images] unreadable', url, error.message);
    return null;
  }
  if (!meta.width || !meta.height) return null;
  // sharp metadata is pre-rotation; the pipeline below applies EXIF orientation.
  let pixelWidth = meta.width;
  let pixelHeight = meta.height;
  if ((meta.orientation ?? 1) >= 5) {
    pixelWidth = meta.height;
    pixelHeight = meta.width;
  }

  const bytes = fs.statSync(source).size;
  const documentImage = url.includes('/questionnaires/');
  const entry = { width: pixelWidth, height: pixelHeight, src: url };

  // Already small enough that another encode will not move the phone budget.
  if (bytes <= 40 * 1024 && meta.width <= 800) return [url, entry];

  const widths = chooseWidths(pixelWidth, documentImage);
  const quality = documentImage ? 84 : 78;
  const sourceMtime = fs.statSync(source).mtimeMs;
  const variants = [];

  for (const width of widths) {
    const destUrl = outputPublicPath(url, width);
    const destFile = path.join(publicDir, destUrl.replace(/^\//, ''));
    fs.mkdirSync(path.dirname(destFile), { recursive: true });
    const existing = fs.existsSync(destFile) ? fs.statSync(destFile) : null;
    if (!existing || existing.size === 0 || existing.mtimeMs < sourceMtime) {
      await sharp(source)
        .rotate()
        .resize({ width, withoutEnlargement: true })
        .webp({ quality, effort: 4, smartSubsample: true })
        .toFile(destFile);
    }
    const produced = fs.statSync(destFile).size;
    // Never ship a WebP that is heavier than the file it replaces. The original
    // stays available as the full-size candidate when the same-width encode loses.
    if (produced >= bytes * 0.95) {
      fs.rmSync(destFile, { force: true });
      if (width === pixelWidth) variants.push({ src: url, width, bytes });
      continue;
    }
    variants.push({ src: destUrl, width, bytes: produced });
  }

  const webps = variants.filter((variant) => variant.src.endsWith('.webp'));
  if (webps.length === 0) return [url, entry];
  const preferred = webps.find((variant) => variant.width >= 800) ?? webps[webps.length - 1];
  entry.src = preferred.src;
  entry.variants = variants.map(({ src, width }) => ({ src, width }));
  return [url, entry];
}

function writeManifest(file, entries) {
  const sorted = Object.fromEntries(entries.sort((a, b) => a[0].localeCompare(b[0])));
  fs.writeFileSync(file, `${JSON.stringify(sorted, null, 2)}\n`);
}

fs.rmSync(optDir, { recursive: true, force: true });

const staticUrls = [...collectStaticUrls()].filter((url) => !url.includes('/images/opt/'));
const blogUrls = [...collectBlogUrls()].filter((url) => !url.startsWith('/images/'));
const staticEntries = (await mapPool(staticUrls, optimizeOne)).filter(Boolean);
const blogEntries = (await mapPool(blogUrls, optimizeOne)).filter(Boolean);

writeManifest(publicManifestPath, staticEntries);
writeManifest(blogManifestPath, blogEntries);

const publicManifest = Object.fromEntries(staticEntries);
const blogManifest = Object.fromEntries(blogEntries);

function lookup(url) {
  return publicManifest[url] ?? blogManifest[url] ?? null;
}

const fukuoka = [
  ['/images/fv-passenger-hero.png', '100vw', 'hero'],
  ['/images/kw/pet-nioi.png', '(min-width: 768px) 50vw, 100vw', 'problem'],
  ['/images/questionnaires/kodomo.jpg', '(min-width: 768px) 360px, 100vw', 'questionnaire'],
  ['/images/questionnaires/touyu.jpg', '(min-width: 768px) 360px, 100vw', 'questionnaire'],
  ['/images/questionnaires/used2.jpg', '(min-width: 768px) 360px, 100vw', 'questionnaire'],
  ['/images/questionnaires/dogsit.jpg', '(min-width: 768px) 360px, 100vw', 'questionnaire'],
  ['/images/aio-promo.png', '(min-width: 896px) 896px, 100vw', 'promo'],
  ['/images/steam.webp', '(min-width: 768px) 400px, 100vw', 'reasons'],
  ['/images/kw/sienta3retumeafter.jpg', '100vw', 'benefits'],
  ['/images/representative_new.webp', '256px', 'profile'],
  ['/images/prosiyou.jpg', '(min-width: 1024px) 480px, 100vw', 'expertise'],
  ['/images/rinser.webp', '(min-width: 768px) 50vw, 100vw', 'blog'],
  ['/blog-media/2026/02/2026-02-17-fukuokabanouto/sienta3retume-before.jpg', '(min-width: 768px) 50vw, 100vw', 'blog'],
  ['/images/truck-fv.png', '(min-width: 768px) 50vw, 100vw', 'mutual-link'],
  ['/images/kw/bus-fv.png', '(min-width: 768px) 50vw, 100vw', 'mutual-link'],
];

function lengthToPx(token, viewport) {
  const value = token.trim();
  if (value.endsWith('vw')) return (viewport * Number(value.slice(0, -2))) / 100;
  if (value.endsWith('px')) return Number(value.slice(0, -2));
  return viewport;
}

function slotWidth(sizes, viewport) {
  for (const part of sizes.split(',').map((item) => item.trim())) {
    const media = part.match(/^\(min-width:\s*([\d.]+)px\)\s+(.+)$/);
    if (media) {
      if (viewport >= Number(media[1])) return lengthToPx(media[2], viewport);
      continue;
    }
    return lengthToPx(part, viewport);
  }
  return viewport;
}

function variantBytes(url, sizes, viewport, dpr) {
  const entry = lookup(url);
  const original = fileForPublicUrl(url);
  const originalBytes = original ? fs.statSync(original).size : 0;
  if (!entry?.variants?.length) return originalBytes;
  const need = slotWidth(sizes, viewport) * dpr;
  const sorted = [...entry.variants].sort((a, b) => a.width - b.width);
  const chosen = sorted.find((variant) => variant.width >= need) ?? sorted[sorted.length - 1];
  const dest = path.join(publicDir, chosen.src.replace(/^\//, ''));
  if (fs.existsSync(dest)) return fs.statSync(dest).size;
  return originalBytes;
}

let before = 0;
let phone2 = 0;
let phone3 = 0;
let desktop = 0;
console.log('\n[optimize-lp-images] /regions/fukuoka/ image bytes');
console.log('label\tbefore\tphone390@2\tphone390@3\tdesktop1280@1\tfile');
for (const [url, sizes, label] of fukuoka) {
  const original = fileForPublicUrl(url);
  const originalBytes = original ? fs.statSync(original).size : 0;
  const at2 = variantBytes(url, sizes, 390, 2);
  const at3 = variantBytes(url, sizes, 390, 3);
  const desktopBytes = variantBytes(url, sizes, 1280, 1);
  before += originalBytes;
  phone2 += at2;
  phone3 += at3;
  desktop += desktopBytes;
  console.log(`${label}\t${originalBytes}\t${at2}\t${at3}\t${desktopBytes}\t${url}`);
}
console.log(`TOTAL\t${before}\t${phone2}\t${phone3}\t${desktop}`);
console.log(
  `[optimize-lp-images] public entries ${staticEntries.length}, blog card entries ${blogEntries.length}`,
);
