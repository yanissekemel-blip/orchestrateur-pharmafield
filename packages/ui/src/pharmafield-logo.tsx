import logoUrl from './assets/brand/pharmafield-logo.png';
import logoWhiteUrl from './assets/brand/pharmafield-logo-white.png';
import markUrl from './assets/brand/pharmafield-mark.png';
import markWhiteUrl from './assets/brand/pharmafield-mark-white.png';
import { cn } from './utils';

/** Intrinsic pixel sizes of the brand images, so layout never shifts. */
const sources = {
  logo: {
    color: { src: logoUrl, width: 354, height: 80 },
    white: { src: logoWhiteUrl, width: 400, height: 90 },
  },
  mark: {
    color: { src: markUrl, width: 110, height: 78 },
    white: { src: markWhiteUrl, width: 124, height: 88 },
  },
} as const;

/**
 * The Pharmafield logo, from the artwork of pharmafield.fr: the emblem with
 * the « PharmaField Groupe » wordmark, or the emblem alone when `compact`
 * (the collapsed rail). `tone="white"` is the version for dark surfaces.
 * `height` is the rendered height in pixels. Decorative unless `title` is
 * given: wrap it in a link or heading that carries the accessible name.
 */
export function PharmafieldLogo({
  compact = false,
  tone = 'color',
  height = 36,
  title,
  className,
}: {
  compact?: boolean;
  tone?: 'color' | 'white';
  /** Rendered height in pixels. */
  height?: number;
  title?: string;
  className?: string;
}) {
  const image = sources[compact ? 'mark' : 'logo'][tone];
  return (
    <img
      data-slot="pharmafield-logo"
      src={image.src}
      width={Math.round((image.width / image.height) * height)}
      height={height}
      alt={title ?? ''}
      aria-hidden={title ? undefined : true}
      draggable={false}
      className={cn('shrink-0 select-none', className)}
    />
  );
}
