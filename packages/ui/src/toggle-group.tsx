'use client';

import type { VariantProps } from 'class-variance-authority';
import { ToggleGroup as ToggleGroupPrimitive } from 'radix-ui';
import * as React from 'react';
import { toggleVariants } from './toggle';
import { useActiveIndicator } from './use-active-indicator';
import { cn } from './utils';

const ToggleGroupContext =
  React.createContext<VariantProps<typeof toggleVariants>['size']>('default');

function ToggleGroup({
  className,
  size,
  children,
  ref,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  // Only a single choice has one pill to slide between items.
  const indicatorRef = useActiveIndicator<HTMLDivElement>(
    props.type === 'single' ? ':scope > [data-state="on"]' : null,
    ref,
  );
  return (
    <ToggleGroupPrimitive.Root
      ref={indicatorRef}
      data-slot="toggle-group"
      className={cn(
        'inline-flex w-fit items-center gap-0.5 rounded-[var(--radius-panel)] border-0 bg-[var(--charcoal-a06)] p-[3px]',
        className,
      )}
      {...props}
    >
      <ToggleGroupContext.Provider value={size}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  );
}

function ToggleGroupItem({
  className,
  size,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item> &
  VariantProps<typeof toggleVariants>) {
  const groupSize = React.useContext(ToggleGroupContext);
  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      className={cn(
        toggleVariants({ size: size ?? groupSize }),
        'h-[30px] min-w-0 shrink-0 rounded-[var(--radius-control)] border-0 bg-transparent px-3.5 py-0 text-[12px] font-bold text-[var(--ink-2)] shadow-none hover:bg-transparent hover:text-[var(--ink)] data-[state=on]:bg-white data-[state=on]:text-[var(--ink)] data-[state=on]:shadow-[var(--shadow-raised)] data-[state=on]:hover:bg-white focus-visible:shadow-[var(--focus-ring)]',
        className,
      )}
      {...props}
    />
  );
}

export { ToggleGroup, ToggleGroupItem };
