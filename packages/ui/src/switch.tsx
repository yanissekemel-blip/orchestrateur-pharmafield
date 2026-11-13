'use client';

import { Switch as SwitchPrimitive } from 'radix-ui';
import type * as React from 'react';

import { cn } from './utils';

function Switch({
  className,
  size = 'default',
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: 'sm' | 'default';
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        'peer group/switch inline-flex shrink-0 cursor-pointer items-center rounded-[var(--radius-control)] border-0 bg-[var(--charcoal-a15)] shadow-none transition-[background-color,box-shadow,transform] duration-150 ease-[var(--ease-out)] outline-none active:scale-[0.98] motion-reduce:transition-none motion-reduce:transform-none data-[state=checked]:bg-[var(--accent)] focus-visible:shadow-[var(--focus-ring)] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-[20px] data-[size=default]:w-[34px] data-[size=sm]:h-[16px] data-[size=sm]:w-[28px]',
        className,
      )}
      {...props}
    >
      {/* The thumb sits 2px inside the track; its smaller radius keeps the edges concentric. */}
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          'pointer-events-none block rounded-[calc(var(--radius-control)-1.2px)] bg-white shadow-[var(--shadow-raised)] ring-0 transition-[translate,scale] duration-[var(--motion-spring)] ease-[var(--ease-spring)] group-data-[size=default]/switch:size-[16px] group-data-[size=sm]/switch:size-[12px] data-[state=unchecked]:translate-x-[2px] group-data-[size=default]/switch:data-[state=checked]:translate-x-[16px] group-data-[size=sm]/switch:data-[state=checked]:translate-x-[14px]',
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
