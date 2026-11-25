import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { loadRedirectSources, normalizePathname } from './sitemapPolicy.ts';

const SITE_HOSTS = new Set(['carinteriorcleaning.jp', 'www.carinteriorcleaning.jp']);

const ASSET_EXT =
  /\.(?:png|jpe?g|webp|gif|svg|ico|css|js|mjs|map|woff2?|ttf|xml|txt|pdf|json|webmanifest)$/i;

export type LinkFailureKind = 'no-slash' | 'redirect' | 'missing';

export type LinkFailure = {
  kind: LinkFailureKind;
  href: string;
  page: string;
  detail: string;
};

export function extractAnchorHrefs(html: string): string[] {
  const hrefs: string[] = [];
  const tags = html.match(/<a\b[^>]*>/gi) ?? [];
  for (const tag of tags) {
    const match = tag.match(/\shref\s*=\s*(?:"([^"]*)"|'([^']*)')/i);
    const href = match?.[1] ?? match?.[2];
    if (href) hrefs.push(href.replace(/&amp;/g, '&'));
  }
  return hrefs;
}

function isAssetPath(pathname: string): boolean {
  return ASSET_EXT.test(pathname);
}

/**
 * Classify one anchor href.
 * `pageExists` receives a pathname that already ends with `/` (or is `/`).
 */
export function classifyAnchorHref(
  rawHref: string,
  pagePath: string,
  redirectSources: Set<string>,
  pageExists: (pathname: string) => boolean,
): LinkFailureKind | 'ok' | 'skip' {
  const href = rawHref.trim();
  if (!href || href.startsWith('#')) return 'skip';
  if (/^(?:mailto:|tel:|sms:|javascript:|data:)/i.test(href)) return 'skip';

  let url: URL;
  try {
    if (href.startsWith('//')) return 'skip';
    if (/^https?:\/\//i.test(href)) {
      url = new URL(href);
      if (!SITE_HOSTS.has(url.hostname)) return 'skip';
    } else {
      url = new URL(href, `https://carinteriorcleaning.jp${pagePath}`);
    }
  } catch {
    return 'missing';
  }

  const pathname = decodeURIComponent(url.pathname);
  if (isAssetPath(pathname)) return 'skip';
  if (pathname !== '/' && !pathname.endsWith('/')) return 'no-slash';

  const normalized = normalizePathname(pathname);
  if (redirectSources.has(normalized)) return 'redirect';
  if (!pageExists(normalized)) return 'missing';
  return 'ok';
}

export function pageFileExists(distDir: string, pathname: string): boolean {
  if (pathname === '/') return existsSync(path.join(distDir, 'index.html'));
  const relative = pathname.replace(/^\//, '').replace(/\/$/, '');
  return (
    existsSync(path.join(distDir, relative, 'index.html')) ||
    existsSync(path.join(distDir, `${relative}.html`))
  );
}

function walkHtml(dir: string, files: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) walkHtml(full, files);
    else if (name.endsWith('.html')) files.push(full);
  }
  return files;
}

export function pagePathFromDistFile(distDir: string, file: string): string {
  const rel = path.relative(distDir, file).replace(/\\/g, '/');
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return `/${rel.slice(0, -'index.html'.length)}`;
  if (rel.endsWith('.html')) return `/${rel.slice(0, -'.html'.length)}/`;
  return `/${rel}`;
}

export function checkBuiltHtml(distDir: string, redirectsFile: string): LinkFailure[] {
  const redirectSources = loadRedirectSources(redirectsFile);
  const failures: LinkFailure[] = [];

  for (const file of walkHtml(distDir)) {
    const page = pagePathFromDistFile(distDir, file);
    const html = readFileSync(file, 'utf8');
    for (const href of extractAnchorHrefs(html)) {
      const kind = classifyAnchorHref(href, page, redirectSources, (pathname) =>
        pageFileExists(distDir, pathname),
      );
      if (kind === 'ok' || kind === 'skip') continue;
      failures.push({
        kind,
        href,
        page,
        detail: kind,
      });
    }
  }

  return failures;
}
