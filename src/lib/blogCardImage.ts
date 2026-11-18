import manifestJson from '../data/blogCardImageManifest.json';
import { resolveLpImage, type ResolvedLpImage } from './lpImage';
import type { LpImageEntry } from './lpImage';
import { buildSrcSet, defaultVariant } from './lpImagePick';

const blogManifest = manifestJson as Record<string, LpImageEntry>;

/**
 * Card image for a region LP blog tile.
 * Blog covers live in a server-only manifest so the browser bundle stays small.
 * Shared `/images/` files fall through to the public-image manifest.
 */
export function resolveBlogCardImage(src: string): ResolvedLpImage {
  const entry = blogManifest[src];
  if (entry?.variants?.length) {
    const fallback = defaultVariant(entry.variants);
    return {
      src: fallback.src,
      srcSet: buildSrcSet(entry.variants),
      width: entry.width,
      height: entry.height,
      optimized: true,
    };
  }
  return resolveLpImage(src);
}
