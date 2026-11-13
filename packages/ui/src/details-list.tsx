import type { LucideIcon } from 'lucide-react';
import type * as React from 'react';
import { cn } from './utils';

/** Label/value pairs of a record, one per line (stacked on phones). */
function DetailsList({ className, ...props }: React.ComponentProps<'dl'>) {
  return (
    <dl
      data-slot="details-list"
      className={cn('grid min-w-0 grid-cols-1 gap-y-3.5', className)}
      {...props}
    />
  );
}

/**
 * One fact of a record. Without a value it shows a muted dash, so a missing
 * optional value never leaves a blank line.
 */
function DetailsItem({
  label,
  icon: Icon,
  children,
  className,
  ...props
}: Omit<React.ComponentProps<'div'>, 'children'> & {
  label: string;
  icon?: LucideIcon;
  children?: React.ReactNode;
}) {
  const empty = children === null || children === undefined || children === '';
  return (
    <div
      data-slot="details-item"
      className={cn(
        'grid min-w-0 grid-cols-1 gap-x-4 gap-y-0.5 sm:grid-cols-[9.5rem_minmax(0,1fr)]',
        className,
      )}
      {...props}
    >
      <dt className="flex min-w-0 items-center gap-2 self-start text-[12px] leading-5 font-label text-[var(--ink-3)]">
        {Icon ? (
          <Icon aria-hidden="true" className="size-3.5 shrink-0" />
        ) : null}
        <span className="min-w-0 truncate">{label}</span>
      </dt>
      <dd
        className={cn(
          'min-w-0 text-[13px] leading-5 break-words whitespace-pre-line text-[var(--ink)]',
          empty && 'text-[var(--ink-3)]',
        )}
      >
        {empty ? '—' : children}
      </dd>
    </div>
  );
}

export { DetailsItem, DetailsList };
