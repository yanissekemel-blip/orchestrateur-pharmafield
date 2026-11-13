import type * as React from 'react';
import { cn } from './utils';

/** Up to two uppercase initials from a display name or email-like label. */
function tableInitials(label: string): string {
  const words = label
    .replace(/@.*/, '')
    .split(/[\s._-]+/)
    .filter(Boolean);
  const letters =
    words.length > 1
      ? `${words[0]?.[0] ?? ''}${words.at(-1)?.[0] ?? ''}`
      : (words[0]?.slice(0, 2) ?? '');
  return letters.toUpperCase() || '?';
}

/** Identifying cell content: an initials disc beside the record name in bold. */
function TableIdentity({
  name,
  initials,
  className,
  ...props
}: React.ComponentProps<'span'> & { name: string; initials?: string }) {
  return (
    <span
      data-slot="table-identity"
      className={cn('flex min-w-0 items-center gap-3', className)}
      {...props}
    >
      <span
        aria-hidden="true"
        className="grid size-8 shrink-0 place-items-center rounded-[var(--radius-control)] bg-white text-[10.5px] font-extrabold tracking-[0.02em] text-[var(--ink)] shadow-[var(--shadow-raised)]"
      >
        {initials ?? tableInitials(name)}
      </span>
      <span className="min-w-0 truncate font-bold text-[var(--ink)]">
        {name}
      </span>
    </span>
  );
}

/** Compact solid avatar for people referenced in a row, such as an owner. */
function TableAvatar({
  name,
  initials,
  className,
  ...props
}: React.ComponentProps<'span'> & { name: string; initials?: string }) {
  return (
    <span
      data-slot="table-avatar"
      role="img"
      aria-label={name}
      title={name}
      className={cn(
        'grid size-7 shrink-0 place-items-center rounded-[var(--radius-control)] bg-[var(--charcoal-900)] text-[9.5px] font-extrabold tracking-[0.02em] text-white',
        className,
      )}
      {...props}
    >
      {initials ?? tableInitials(name)}
    </span>
  );
}

export { TableAvatar, TableIdentity, tableInitials };
