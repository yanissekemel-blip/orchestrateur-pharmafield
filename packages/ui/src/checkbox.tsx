'use client';

import { CheckIcon, MinusIcon } from 'lucide-react';
import { Checkbox as CheckboxPrimitive } from 'radix-ui';
import type * as React from 'react';

import { cn } from './utils';

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        'peer size-4 shrink-0 rounded-[var(--radius-sm)] border border-[var(--charcoal-a25)] bg-white text-[var(--charcoal-900)] shadow-none outline-none hover:border-[var(--charcoal-a45)] data-[state=checked]:border-[var(--charcoal-900)] data-[state=checked]:bg-[var(--charcoal-900)] data-[state=checked]:text-white data-[state=indeterminate]:border-[var(--charcoal-900)] data-[state=indeterminate]:bg-[var(--charcoal-900)] data-[state=indeterminate]:text-white focus-visible:shadow-[var(--focus-ring)] aria-invalid:border-[var(--bad)] disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="group grid place-content-center text-current data-[state=checked]:scale-100"
      >
        {/* A partial selection (some rows of a table) shows a dash. */}
        <CheckIcon
          className="size-3 group-data-[state=indeterminate]:hidden"
          strokeWidth={3}
        />
        <MinusIcon
          className="hidden size-3 group-data-[state=indeterminate]:block"
          strokeWidth={3}
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
