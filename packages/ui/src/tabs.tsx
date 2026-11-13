'use client';

import { Tabs as TabsPrimitive } from 'radix-ui';
import * as React from 'react';
import { useActiveIndicator } from './use-active-indicator';

import { cn } from './utils';

function Tabs({
  className,
  orientation = 'horizontal',
  onValueChange,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  // Content animates only after a switch, never when the page first renders.
  const [switched, setSwitched] = React.useState(false);
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      data-switched={switched || undefined}
      orientation={orientation}
      onValueChange={(value) => {
        setSwitched(true);
        onValueChange?.(value);
      }}
      className={cn(
        'group/tabs flex gap-1.5 data-[orientation=horizontal]:flex-col',
        className,
      )}
      {...props}
    />
  );
}

const tabsListClassName =
  'group/tabs-list inline-flex w-fit items-center justify-center gap-0.5 rounded-[var(--radius-panel)] bg-[var(--charcoal-a06)] p-[3px] text-[var(--ink-2)] group-data-[orientation=horizontal]/tabs:h-[36px] group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col';

function TabsList({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  const indicatorRef = useActiveIndicator<HTMLDivElement>(
    ':scope > [role="tab"][data-state="active"]',
    ref,
  );
  return (
    <TabsPrimitive.List
      ref={indicatorRef}
      data-slot="tabs-list"
      className={cn(tabsListClassName, className)}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex h-[30px] flex-1 items-center justify-center gap-1.5 rounded-[var(--radius-control)] border-0 px-3.5 py-0 text-[12px] font-bold whitespace-nowrap text-[var(--ink-2)] outline-none group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start focus-visible:shadow-[var(--focus-ring)] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:stroke-[1.75] [&_svg:not([class*='size-'])]:size-3.5",
        'hover:text-[var(--ink)]',
        'data-[state=active]:bg-white data-[state=active]:text-[var(--ink)] data-[state=active]:shadow-[var(--shadow-raised)]',
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn('flex-1 outline-none', className)}
      {...props}
    />
  );
}

export { Tabs, TabsContent, TabsList, TabsTrigger };
