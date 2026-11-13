'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { Toggle as TogglePrimitive } from 'radix-ui';
import type * as React from 'react';

import { cn } from './utils';

const toggleVariants = cva(
  "inline-flex items-center justify-center gap-1.5 rounded-[var(--radius-control)] border border-transparent text-[12px] font-bold whitespace-nowrap text-[var(--ink-2)] outline-none hover:bg-[var(--charcoal-a06)] hover:text-[var(--ink)] disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-[var(--accent)] data-[state=on]:text-white data-[state=on]:shadow-none data-[state=on]:hover:bg-[var(--accent-strong)] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:stroke-[1.75] [&_svg:not([class*='size-'])]:size-3.5 focus-visible:shadow-[var(--focus-ring)] aria-invalid:border-[var(--bad)]",
  {
    variants: {
      size: {
        default: 'h-9 px-3 min-w-9',
        sm: 'h-[30px] px-2.5 min-w-[30px]',
        lg: 'h-11 px-3.5 min-w-11',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
);

function Toggle({
  className,
  size,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ size, className }))}
      {...props}
    />
  );
}

export { Toggle, toggleVariants };
