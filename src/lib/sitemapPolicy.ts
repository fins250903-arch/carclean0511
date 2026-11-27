import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { isCanonicalAliasUrl } from '../data/consolidationPolicy.ts';
import { isNoindexRegionPathname } from '../data/noindexRegions.ts';

const REDIRECTS_PATH = path.resolve(process.cwd(), 'public/_redirects');
const BLOG_ROOT = path.resolve(process.cwd(), 'src/content/blog');

/** Pathname with a trailing slash, except for `/`. */
export function normalizePathname(input: string): string {
  let pathname = input.trim();
  if (!pathname) return '/';

  if (pathname.startsWith('http://') || pathname.startsWith('https://')) {
    try {
      pathname = new URL(pathname).pathname;
    } catch {
      return '/';
    }
  }

  const query = pathname.indexOf('?');
  if (query >= 0) pathname = pathname.slice(0, query);
  const hash = pathname.indexOf('#');
  if (hash >= 0) pathname = pathname.slice(0, hash);
  if (!pathname.startsWith('/')) pathname = `/${pathname}`;
  if (pathname !== '/' && !pathname.endsWith('/')) pathname = `${pathname}/`;
  return pathname;
}

/**
 * Source paths in `public/_redirects` that send visitors somewhere else.
 * Pattern rules (`:region`) are not real pages. A rule whose destination is
 * the same path (`/aio` → `/aio/`) only adds a trailing slash, so the page
 * stays in the sitemap. `/` is included because it redirects to `/aio/`.
 * `/aio/` and live prefecture LPs such as `/regions/osaka/` stay in the sitemap.
 */
export function collectRedirectSources(redirectsText: string): Set<string> {
  const sources = new Set<string>();

  for (const rawLine of redirectsText.split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    const [source, destination] = line.split(/\s+/);
    if (!source || source.includes(':') || source.includes('*')) continue;
    if (destination && normalizePathname(source) === normalizePathname(destination)) continue;

    sources.add(normalizePathname(source));
  }

  return sources;
}

export function loadRedirectSources(
  filePath: string = REDIRECTS_PATH,
): Set<string> {
  return collectRedirectSources(readFileSync(filePath, 'utf8'));
}

export function isRedirectedSitemapUrl(
  pageUrl: string,
  sources: Set<string>,
): boolean {
  return sources.has(normalizePathname(pageUrl));
}

/**
 * Pages the sitemap keeps. Same rules as the `@astrojs/sitemap` filter
 * in `astro.config.mjs`: indexable, not `/reserve/`, not a redirect
 * source, and not a live page whose canonical points elsewhere.
 */
export function isIncludedInSitemap(pageUrl: string, sources: Set<string>): boolean {
  return (
    !isNoindexRegionPathname(pageUrl) &&
    !pageUrl.includes('/reserve/') &&
    !isRedirectedSitemapUrl(pageUrl, sources) &&
    !isCanonicalAliasUrl(pageUrl)
  );
}

/** Exact (non-pattern) redirects. Slash-only rules such as `/aio` → `/aio/` are omitted. */
export function collectExactRedirectMap(redirectsText: string): Map<string, string> {
  const map = new Map<string, string>();

  for (const rawLine of redirectsText.split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    const [source, destination] = line.split(/\s+/);
    if (!source || !destination || source.includes(':') || source.includes('*')) continue;

    const from = normalizePathname(source);
    const to = normalizePathname(destination);
    if (from === to) continue;
    map.set(from, to);
  }

  return map;
}

export function loadExactRedirectMap(
  filePath: string = REDIRECTS_PATH,
): Map<string, string> {
  return collectExactRedirectMap(readFileSync(filePath, 'utf8'));
}

/** Follow exact 301s. Pattern rules that only add a slash are not in the map. */
export function followExactRedirect(
  pathname: string,
  map: Map<string, string>,
): string {
  let current = normalizePathname(pathname);
  const seen = new Set<string>();
  while (map.has(current) && !seen.has(current)) {
    seen.add(current);
    current = map.get(current)!;
  }
  return current;
}

function walkMarkdown(dir: string, files: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) walkMarkdown(full, files);
    else if (name === 'index.md' || name === 'index.mdx') files.push(full);
  }
  return files;
}

function frontmatterDate(yaml: string, key: string): string | undefined {
  const match = yaml.match(
    new RegExp(`^${key}:\\s*['"]?(\\d{4}-\\d{2}-\\d{2})`, 'm'),
  );
  return match?.[1];
}

/** Later of publish and updated dates, as `YYYY-MM-DD`. */
export function contentLastmod(yaml: string): string | undefined {
  const published = frontmatterDate(yaml, 'date');
  const updated = frontmatterDate(yaml, 'updatedDate');
  if (published && updated) return published > updated ? published : updated;
  return updated ?? published;
}

/**
 * Blog URL pathname → lastmod. `/blog/` uses the newest post date.
 * Other pages have no per-page content date, so they are omitted.
 */
export function loadBlogLastmods(blogRoot: string = BLOG_ROOT): Map<string, string> {
  const lastmods = new Map<string, string>();
  let newest = '';

  for (const filePath of walkMarkdown(blogRoot)) {
    const raw = readFileSync(filePath, 'utf8');
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!match) continue;
    const lastmod = contentLastmod(match[1]);
    if (!lastmod) continue;

    const slug = path
      .relative(blogRoot, filePath)
      .replace(/\\/g, '/')
      .replace(/\/index\.mdx?$/, '');
    lastmods.set(`/blog/${slug}/`, lastmod);
    if (lastmod > newest) newest = lastmod;
  }

  if (newest) lastmods.set('/blog/', newest);
  return lastmods;
}

export function withBlogLastmod<T extends { url: string; lastmod?: string | Date }>(
  item: T,
  lastmods: Map<string, string>,
): T {
  const lastmod = lastmods.get(normalizePathname(item.url));
  if (!lastmod) return item;
  return { ...item, lastmod };
}
