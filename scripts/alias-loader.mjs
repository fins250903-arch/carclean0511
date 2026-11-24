import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

function withExtension(url) {
  const asPath = fileURLToPath(url);
  if (existsSync(asPath)) return url;
  for (const ext of ['.ts', '.tsx', '.mjs', '.js']) {
    const candidate = new URL(url.href + ext);
    if (existsSync(fileURLToPath(candidate))) return candidate;
  }
  const index = new URL('./index.ts', url.href.endsWith('/') ? url : new URL(`${url.href}/`));
  if (existsSync(fileURLToPath(index))) return index;
  return url;
}

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith('@/')) {
    const url = withExtension(new URL(`../src/${specifier.slice(2)}`, import.meta.url));
    return nextResolve(url.href, context);
  }
  if (specifier.startsWith('./') || specifier.startsWith('../')) {
    const parent = context.parentURL ? new URL(specifier, context.parentURL) : null;
    if (parent) {
      const url = withExtension(parent);
      if (url.href !== parent.href) return nextResolve(url.href, context);
    }
  }
  return nextResolve(specifier, context);
}
