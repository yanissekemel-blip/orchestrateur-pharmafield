'use client';

import { Search, X } from 'lucide-react';
import { type ComponentProps, useEffect, useRef } from 'react';
import { Input } from './input';
import { SEARCH_DEBOUNCE_MS, useDebouncedValue } from './use-debounced-value';
import { cn } from './utils';

type DebouncedSearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  onDebouncedChange?: (value: string) => void;
  debounceMs?: number;
  placeholder?: string;
  ariaLabel?: string;
  className?: string;
  inputClassName?: ComponentProps<typeof Input>['className'];
};

export function DebouncedSearchInput({
  value,
  onChange,
  onDebouncedChange,
  debounceMs = SEARCH_DEBOUNCE_MS,
  placeholder = 'Rechercher…',
  ariaLabel,
  className,
  inputClassName,
}: DebouncedSearchInputProps) {
  const debouncedValue = useDebouncedValue(value, debounceMs);
  const onDebouncedChangeRef = useRef(onDebouncedChange);
  // The value the caller already has: mounting with it (or typing back to it)
  // is not a change. Emitting it on mount made list pages navigate a second
  // time during their entrance, which replayed the page transition.
  const emittedRef = useRef(debouncedValue);

  useEffect(() => {
    onDebouncedChangeRef.current = onDebouncedChange;
  }, [onDebouncedChange]);

  useEffect(() => {
    if (debouncedValue === emittedRef.current) return;
    emittedRef.current = debouncedValue;
    onDebouncedChangeRef.current?.(debouncedValue);
  }, [debouncedValue]);

  return (
    <div
      className={cn(
        'relative w-full min-w-0 sm:w-[360px] sm:max-w-full sm:flex-none',
        className,
      )}
    >
      <Search className="pointer-events-none absolute left-3 top-1/2 size-[15px] -translate-y-1/2 text-[var(--ink-3)]" />
      <Input
        aria-label={ariaLabel ?? placeholder}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'rounded-[var(--radius-control)] pl-9 pr-8',
          inputClassName,
        )}
      />
      {value && (
        <button
          type="button"
          aria-label="Effacer la recherche"
          onClick={() => onChange('')}
          className="absolute right-2 top-1/2 flex size-5 -translate-y-1/2 items-center justify-center rounded-[var(--radius-control)] text-[var(--ink-3)] outline-none transition-colors hover:bg-[var(--charcoal-a06)] hover:text-[var(--ink)] focus-visible:shadow-[var(--focus-ring)]"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  );
}
