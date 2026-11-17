import manifestJson from '../data/lpImageManifest.json';
import { buildSrcSet, defaultVariant, type LpVariant } from './lpImagePick';

export type LpImageEntry = {
  width: number;
  height: number;
  /** WebP URL used as `src` when variants exist. Original URL when they do not. */
  src: string;
  variants?: LpVariant[];
};

const manifest = manifestJson as Record<string, LpImageEntry>;

export type ResolvedLpImage = {
  /** URL the `<img>` should request. WebP when a variant exists. */
  src: string;
  srcSet?: string;
  width?: number;
  height?: number;
  optimized: boolean;
};

/**
 * Map a public image path to its pre-built WebP srcset.
 * Unknown paths (and OG originals) stay unchanged.
 */
export function resolveLpImage(src: string): ResolvedLpImage {
  const entry = manifest[src];
  if (!entry) return { src, optimized: false };
  if (!entry.variants?.length) {
    return {
      src: entry.src || src,
      width: entry.width,
      height: entry.height,
      optimized: false,
    };
  }
  const fallback = defaultVariant(entry.variants);
  return {
    src: fallback.src,
    srcSet: buildSrcSet(entry.variants),
    width: entry.width,
    height: entry.height,
    optimized: true,
  };
}
