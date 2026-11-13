import type * as React from 'react';
import { cn } from './utils';

type FilterBarProps = React.HTMLAttributes<HTMLElement> & {
  left?: React.ReactNode;
  right?: React.ReactNode;
};

export function FilterBar({
  left,
  right,
  children,
  className,
  ...props
}: FilterBarProps) {
  return (
    <section
      data-slot="filter-bar"
      aria-label="Contrôles de la page"
      className={cn(
        'flex min-h-14 shrink-0 flex-wrap items-center justify-between gap-2 bg-transparent px-[22px] py-2.5 lg:gap-3',
        className,
      )}
      {...props}
    >
      {children ?? (
        <>
          {left ? (
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2 max-sm:contents">
              {left}
            </div>
          ) : null}
          {right ? (
            <div className="ml-auto flex shrink-0 flex-wrap items-center gap-2">
              {right}
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}
