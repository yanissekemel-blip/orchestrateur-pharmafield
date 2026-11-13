'use client';

import { Slider as SliderPrimitive } from 'radix-ui';
import * as React from 'react';

import { cn } from './utils';

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max],
  );

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        'relative flex w-full cursor-pointer touch-none items-center select-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col',
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          'relative grow overflow-hidden rounded-[var(--radius-control)] bg-[var(--charcoal-a10)] data-[orientation=horizontal]:h-1 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1',
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            'absolute rounded-[var(--radius-control)] bg-[var(--accent)] data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full',
          )}
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          // biome-ignore lint/suspicious/noArrayIndexKey: Thumbs are positional slots without stable IDs, not reorderable items.
          key={index}
          className="block size-4 shrink-0 cursor-grab rounded-[var(--radius-control)] border-0 bg-white shadow-[var(--shadow-raised)] outline-none transition-[box-shadow,transform] duration-150 ease-[var(--ease-out)] hover:scale-110 active:cursor-grabbing focus-visible:shadow-[var(--focus-ring)] disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none motion-reduce:transform-none"
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
