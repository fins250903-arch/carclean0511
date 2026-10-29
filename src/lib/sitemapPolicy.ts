import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

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
 * Pattern rules (`:region`) are not real pages. `/` is included only when
 * a rule still redirects it. The national top has no such rule.
 */
export function collectRedirectSources(redirectsText: string): Set<string> {
  const sources = new Set<string>();

  for (const rawLine of redirectsText.split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    const source = line.split(/\s+/)[0];
    if (!source || source.includes(':') || source.includes('*')) continue;

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
