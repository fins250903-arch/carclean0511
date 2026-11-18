import type { ImgHTMLAttributes } from 'react';
import { resolveLpImage } from '@/lib/lpImage';

type Props = {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
  width?: number;
  height?: number;
} & Pick<ImgHTMLAttributes<HTMLImageElement>, 'onError'>;

/** Same responsive WebP markup as LpImage.astro, for React islands. */
export default function LpImage({
  src,
  alt,
  sizes,
  className,
  priority = false,
  width,
  height,
  onError,
}: Props) {
  const image = resolveLpImage(src);
  return (
    <img
      src={image.src}
      srcSet={image.srcSet}
      sizes={image.srcSet ? sizes : undefined}
      width={width ?? image.width}
      height={height ?? image.height}
      alt={alt}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'low'}
      decoding={priority ? 'auto' : 'async'}
      onError={onError}
    />
  );
}
