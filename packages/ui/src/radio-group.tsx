'use client';

import { CircleIcon } from 'lucide-react';
import { RadioGroup as RadioGroupPrimitive } from 'radix-ui';
import type * as React from 'react';

import { cn } from './utils';

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn('grid gap-2', className)}
      {...props}
    />
  );
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        'aspect-square size-4 shrink-0 rounded-full border border-[var(--charcoal-a25)] bg-white text-white shadow-none outline-none hover:border-[var(--charcoal-a45)] data-[state=checked]:border-[var(--accent)] data-[state=checked]:bg-[var(--accent)] focus-visible:shadow-[var(--focus-ring)] aria-invalid:border-[var(--bad)] disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="relative flex items-center justify-center"
      >
        <CircleIcon className="absolute top-1/2 left-1/2 size-[5px] -translate-x-1/2 -translate-y-1/2 fill-current stroke-none" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

/**
 * A selectable card with radio semantics: a bold label, a muted description
 * line, and a radio dot. Use inside `RadioGroup` for a few rich choices.
 */
function RadioGroupCard({
  className,
  label,
  description,
  ...props
}: Omit<React.ComponentProps<typeof RadioGroupPrimitive.Item>, 'children'> & {
  label: React.ReactNode;
  description?: React.ReactNode;
}) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-card"
      className={cn(
        'group/radio-card flex w-full min-w-0 items-center gap-3 rounded-[var(--radius-input)] bg-white px-3.5 py-2.5 text-left shadow-[inset_0_0_0_1px_var(--charcoal-a10)] outline-none hover:shadow-[inset_0_0_0_1px_var(--charcoal-a25)] data-[state=checked]:shadow-[inset_0_0_0_1.5px_var(--accent)] focus-visible:shadow-[var(--focus-ring)] disabled:cursor-not-allowed disabled:bg-[var(--charcoal-a03)] disabled:shadow-[inset_0_0_0_1px_var(--charcoal-a07)]',
        className,
      )}
      {...props}
    >
      <span className="grid min-w-0 flex-1 gap-0.5">
        <span className="truncate text-[12.5px] font-bold text-[var(--ink)] group-disabled/radio-card:text-[var(--ink-3)]">
          {label}
        </span>
        {description ? (
          <span className="truncate text-[12px] text-[var(--ink-2)] group-disabled/radio-card:text-[var(--ink-3)]">
            {description}
          </span>
        ) : null}
      </span>
      <span
        aria-hidden="true"
        className="grid size-4 shrink-0 place-items-center rounded-full border border-[var(--charcoal-a25)] bg-white group-data-[state=checked]/radio-card:border-[var(--accent)] group-data-[state=checked]/radio-card:bg-[var(--accent)]"
      >
        <RadioGroupPrimitive.Indicator data-slot="radio-group-indicator">
          <CircleIcon className="size-[5px] fill-white stroke-none" />
        </RadioGroupPrimitive.Indicator>
      </span>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupCard, RadioGroupItem };
