/** Pure helpers for responsive landing-page images. No filesystem access. */

export type LpVariant = {
  src: string;
  width: number;
};

export function buildSrcSet(variants: LpVariant[]): string {
  return [...variants]
    .sort((a, b) => a.width - b.width)
    .map((variant) => `${variant.src} ${variant.width}w`)
    .join(', ');
}

/** Default `src`: a mid-size candidate so browsers without srcset still skip the original. */
export function defaultVariant(variants: LpVariant[]): LpVariant {
  const sorted = [...variants].sort((a, b) => a.width - b.width);
  return sorted.find((variant) => variant.width >= 800) ?? sorted[sorted.length - 1];
}

/**
 * Resolve the slot width (CSS pixels) from a `sizes` attribute.
 * Supports the `min-width` media conditions and `vw` / `px` lengths this site emits.
 */
export function slotWidth(sizes: string, viewport: number): number {
  const parts = sizes.split(',').map((part) => part.trim()).filter(Boolean);
  for (const part of parts) {
    const media = part.match(/^\(min-width:\s*([\d.]+)px\)\s+(.+)$/);
    if (media) {
      if (viewport >= Number(media[1])) return lengthToPx(media[2], viewport);
      continue;
    }
    return lengthToPx(part, viewport);
  }
  return viewport;
}

function lengthToPx(token: string, viewport: number): number {
  const value = token.trim();
  if (value.endsWith('vw')) return (viewport * Number(value.slice(0, -2))) / 100;
  if (value.endsWith('px')) return Number(value.slice(0, -2));
  return viewport;
}

/** Smallest candidate that covers `slotCssPx * dpr`, else the largest. */
export function pickVariant<T extends { width: number }>(
  variants: T[],
  slotCssPx: number,
  dpr = 1,
): T {
  const need = slotCssPx * dpr;
  const sorted = [...variants].sort((a, b) => a.width - b.width);
  return sorted.find((variant) => variant.width >= need) ?? sorted[sorted.length - 1];
}
