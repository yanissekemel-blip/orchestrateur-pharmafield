import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';
import type * as React from 'react';

import { cn } from './utils';

const badgeVariants = cva(
  'inline-flex h-[22px] w-fit max-w-full shrink-0 items-center justify-center gap-1.5 rounded-full px-2.5 text-[11.5px] leading-none font-semibold whitespace-nowrap outline-none before:size-1.5 before:shrink-0 before:rounded-full before:bg-current [&>svg]:pointer-events-none [&>svg]:size-3 focus-visible:shadow-[var(--focus-ring)] aria-invalid:shadow-[0_0_0_2px_var(--bad-soft)] transition-[background-color,box-shadow] duration-150 ease-out',
  {
    variants: {
      variant: {
        default: 'bg-[rgba(36, 36, 36,0.09)] text-[var(--brand-ink)]',
        // In-flight states: neutral surface with an accent dot instead of a tinted fill.
        signal:
          'bg-white text-[var(--ink)] shadow-[inset_0_0_0_1px_var(--charcoal-a10)] before:bg-[var(--signal)]',
        secondary: 'bg-[var(--charcoal-a06)] text-[var(--ink-2)]',
        destructive: 'bg-[var(--bad-soft)] text-[var(--bad-strong)]',
        success: 'bg-[var(--ok-soft)] text-[var(--ok)]',
        warning: 'bg-[var(--warn-soft)] text-[var(--warn-strong)]',
        info: 'bg-[var(--charcoal-a06)] text-[var(--ink)]',
        outline:
          'bg-transparent text-[var(--ink-2)] shadow-[inset_0_0_0_1px_var(--charcoal-a15)]',
        solid: 'bg-[var(--charcoal-900)] text-white',
        ghost: 'bg-transparent text-[var(--ink-2)]',
        link: 'bg-transparent px-0 text-[var(--brand-ink)] before:hidden underline-offset-4 [a&]:hover:underline',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

function Badge({
  className,
  variant = 'default',
  asChild = false,
  children,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : 'span';

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    >
      {/* Plain text ends with an ellipsis rather than overflowing the pill. */}
      {!asChild &&
      (typeof children === 'string' || typeof children === 'number') ? (
        <span className="min-w-0 truncate leading-[1.4]">{children}</span>
      ) : (
        children
      )}
    </Comp>
  );
}

export { Badge, badgeVariants };
