'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import type * as React from 'react';
import { Button } from './button';
import { Input } from './input';
import { Textarea } from './textarea';
import { cn } from './utils';

function InputGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: This div wraps an input and must not change form semantics to a fieldset.
    <div
      data-slot="input-group"
      role="group"
      className={cn(
        'group/input-group relative flex w-full items-center rounded-[var(--radius-input)] border border-[var(--charcoal-a10)] bg-[var(--field)] has-[[data-slot=input-group-control]:focus-visible]:bg-white shadow-[var(--shadow-input)] transition-[color,box-shadow,border-color,background-color] outline-none',
        'h-9 min-w-0 has-[>textarea]:h-auto',

        // Variants based on alignment.
        'has-[>[data-align=inline-start]]:[&>input]:pl-2',
        'has-[>[data-align=inline-end]]:[&>input]:pr-2',
        'has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-start]]:[&>input]:pb-3',
        'has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-end]]:[&>input]:pt-3',

        // Focus state.
        'has-[[data-slot=input-group-control]:focus-visible]:border-transparent has-[[data-slot=input-group-control]:focus-visible]:shadow-[var(--focus-ring)]',

        // Error state.
        'has-[[data-slot][aria-invalid=true]]:border-[var(--bad)]',

        className,
      )}
      {...props}
    />
  );
}

const inputGroupAddonVariants = cva(
  "text-[var(--ink-3)] flex h-auto cursor-text items-center justify-center gap-1.5 py-1 text-xs font-semibold select-none [&>svg:not([class*='size-'])]:size-[15px] [&>kbd]:rounded-[var(--radius-md)] group-data-[disabled=true]/input-group:opacity-50",
  {
    variants: {
      align: {
        'inline-start':
          'order-first pl-2.5 has-[>button]:ml-[-0.45rem] has-[>kbd]:ml-[-0.35rem]',
        'inline-end':
          'order-last pr-2.5 has-[>button]:mr-[-0.45rem] has-[>kbd]:mr-[-0.35rem]',
        'block-start':
          'order-first w-full justify-start px-2.5 pt-2.5 [.border-b]:pb-2.5 group-has-[>input]/input-group:pt-2.5',
        'block-end':
          'order-last w-full justify-start px-2.5 pb-2.5 [.border-t]:pt-2.5 group-has-[>input]/input-group:pb-2.5',
      },
    },
    defaultVariants: {
      align: 'inline-start',
    },
  },
);

function InputGroupAddon({
  className,
  align = 'inline-start',
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents lint/a11y/useSemanticElements: Pointer clicks only focus the input, which keyboard users can focus directly; the addon must remain a div.
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('button')) {
          return;
        }
        e.currentTarget.parentElement?.querySelector('input')?.focus();
      }}
      {...props}
    />
  );
}

const inputGroupButtonVariants = cva(
  'text-xs shadow-none flex gap-1.5 items-center',
  {
    variants: {
      size: {
        xs: "h-6 gap-1 px-2 rounded-[var(--radius-control)] [&>svg:not([class*='size-'])]:size-3.5 has-[>svg]:px-2",
        sm: 'h-7 px-2 gap-1 rounded-[var(--radius-control)] has-[>svg]:px-2.5',
        'icon-xs': 'size-6 rounded-[var(--radius-control)] p-0 has-[>svg]:p-0',
        'icon-sm': 'size-7 rounded-[var(--radius-control)] p-0 has-[>svg]:p-0',
      },
    },
    defaultVariants: {
      size: 'xs',
    },
  },
);

function InputGroupButton({
  className,
  type = 'button',
  variant = 'ghost',
  size = 'xs',
  ...props
}: Omit<React.ComponentProps<typeof Button>, 'size'> &
  VariantProps<typeof inputGroupButtonVariants>) {
  return (
    <Button
      type={type}
      data-size={size}
      variant={variant}
      className={cn(inputGroupButtonVariants({ size }), className)}
      {...props}
    />
  );
}

function InputGroupText({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        "text-[var(--ink-3)] flex items-center gap-1.5 text-xs [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-[15px]",
        className,
      )}
      {...props}
    />
  );
}

function InputGroupInput({
  className,
  ...props
}: React.ComponentProps<'input'>) {
  return (
    <Input
      data-slot="input-group-control"
      className={cn(
        'flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:border-0 focus-visible:shadow-none',
        className,
      )}
      {...props}
    />
  );
}

function InputGroupTextarea({
  className,
  ...props
}: React.ComponentProps<'textarea'>) {
  return (
    <Textarea
      data-slot="input-group-control"
      className={cn(
        'flex-1 resize-none rounded-none border-0 bg-transparent py-2 shadow-none focus-visible:border-0 focus-visible:shadow-none',
        className,
      )}
      {...props}
    />
  );
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
};
