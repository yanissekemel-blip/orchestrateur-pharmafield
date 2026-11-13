import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';
import type * as React from 'react';

import { cn } from './utils';

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-[7px] whitespace-nowrap rounded-[var(--radius-control)] border border-transparent text-[13px] font-semibold text-[var(--ink)] outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg.mr-2]:mr-0.5 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:stroke-[2] [&_svg:not([class*='size-'])]:size-4 focus-visible:shadow-[var(--focus-ring)] aria-invalid:shadow-[0_0_0_2px_var(--bad)]",
  {
    variants: {
      variant: {
        default:
          'bg-[var(--action)] text-[var(--action-ink)] shadow-[var(--shadow-accent)] hover:bg-[var(--action-hover)] hover:shadow-[var(--shadow-accent-hover)]',
        destructive:
          'bg-[var(--bad)] text-white shadow-none hover:bg-[var(--bad-strong)]',
        outline:
          'border-[var(--charcoal-a10)] bg-white text-[var(--ink)] shadow-[var(--shadow-input)] hover:bg-[var(--grey-50)] focus-visible:border-transparent',
        discrete:
          'bg-transparent text-[var(--ink)] shadow-none hover:bg-[var(--charcoal-a06)]',
        header:
          'bg-[var(--charcoal-a06)] text-[var(--ink)] shadow-none hover:bg-[var(--charcoal-a10)]',
        secondary:
          'border-[var(--charcoal-900)] border-[1.5px] bg-white text-[var(--charcoal-900)] shadow-none hover:bg-[var(--grey-50)]',
        ghost:
          'bg-transparent text-[var(--ink)] shadow-none hover:bg-[var(--charcoal-a06)]',
        link: 'rounded-none px-0 text-[var(--ink)] no-underline hover:text-[var(--teal-700)] hover:underline underline-offset-4',
      },
      size: {
        default: 'h-9 px-4 has-[>svg]:px-3.5',
        xs: "h-7 px-2.5 text-[12px] has-[>svg]:px-2 [&_svg:not([class*='size-'])]:size-3",
        sm: 'h-[30px] px-3 text-[12px] has-[>svg]:px-2.5',
        md: 'h-9 px-4 has-[>svg]:px-3.5',
        lg: 'h-11 px-[22px] text-[14px] has-[>svg]:px-5',
        icon: 'size-9 rounded-[var(--radius-control)]',
        'icon-xs':
          "size-7 rounded-[var(--radius-control)] [&_svg:not([class*='size-'])]:size-3",
        'icon-sm': 'size-[30px] rounded-[var(--radius-control)]',
        'icon-lg': 'size-11 rounded-[var(--radius-control)]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : 'button';

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
