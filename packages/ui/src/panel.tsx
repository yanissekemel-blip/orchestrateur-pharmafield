import { Slot } from 'radix-ui';
import type * as React from 'react';
import { cn } from './utils';

type PanelProps = React.HTMLAttributes<HTMLDivElement> & {
  asChild?: boolean;
  elevation?: 'default' | 'none';
  padding?: 'none' | 'xs' | 'default' | 'sm' | 'lg';
  /**
   * `default` is a frosted glass surface for shell-level panels. Nested default
   * panels automatically fall back to the `card` treatment without blur.
   * `card` is a solid white card with a hairline border and a cut corner,
   * `raised` is the same card lifted with a shadow, `sunken` is a recessed
   * grey well, and `column` is a tinted Kanban lane.
   */
  variant?: 'default' | 'bare' | 'card' | 'raised' | 'sunken' | 'column';
};

export function Panel({
  asChild = false,
  className,
  elevation = 'default',
  padding = 'default',
  variant = 'default',
  ...props
}: PanelProps) {
  const Comp = asChild ? Slot.Root : 'div';
  const elevated = elevation === 'default';
  return (
    <Comp
      data-slot="panel"
      data-variant={variant}
      className={cn(
        variant !== 'bare' &&
          'transition-[border-color,box-shadow,translate] duration-200 ease-[var(--ease-out)]',
        variant === 'default' && 'panel-glass border',
        variant === 'default' && !elevated && 'panel-flat',
        (variant === 'card' || variant === 'raised') && 'panel-card',
        variant === 'card' && elevated && 'shadow-card',
        variant === 'raised' && elevated && 'shadow-[var(--shadow-raised)]',
        variant === 'sunken' &&
          'rounded-[var(--radius-card)] bg-[var(--panel2)] shadow-[inset_0_0_0_1px_var(--line)]',
        variant === 'column' &&
          'rounded-[var(--radius-panel)] bg-[var(--surface-column)] shadow-[inset_0_0_0_1px_var(--line-2)]',
        padding === 'default' && 'p-panel',
        padding === 'xs' && 'p-2',
        padding === 'sm' && 'p-3',
        padding === 'lg' && 'p-6',
        padding === 'none' && 'p-0',
        className,
      )}
      {...props}
    />
  );
}
