'use client';

import type { ComponentType, ReactNode } from 'react';
import { ToggleGroup, ToggleGroupItem } from './toggle-group';
import { cn } from './utils';

type Item<T extends string> = {
  value: T;
  label: ReactNode;
  icon?: ComponentType<{ className?: string }>;
  disabled?: boolean;
};

export function SegmentedControl<T extends string>({
  value,
  items,
  onValueChange,
  className,
  itemClassName,
  disabled,
  'aria-label': ariaLabel,
}: {
  value: T;
  items: ReadonlyArray<Item<T>>;
  onValueChange: (value: T) => void;
  className?: string;
  itemClassName?: string;
  disabled?: boolean;
  'aria-label'?: string;
}) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(next) => {
        if (next) onValueChange(next as T);
      }}
      aria-label={ariaLabel}
      className={cn('flex-wrap gap-0.5', className)}
      disabled={disabled}
    >
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <ToggleGroupItem
            key={item.value}
            value={item.value}
            disabled={item.disabled}
            className={cn('gap-1.5 font-bold', itemClassName)}
          >
            {Icon ? <Icon className="size-3.5 shrink-0" /> : null}
            {item.label}
          </ToggleGroupItem>
        );
      })}
    </ToggleGroup>
  );
}
