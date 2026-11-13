import type * as React from 'react';

import { cn } from './utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'h-9 w-full min-w-0 rounded-[var(--radius-input)] border border-[var(--charcoal-a10)] bg-[var(--field)] focus-visible:bg-white px-3 py-1.5 text-[12.5px] text-[var(--ink)] shadow-[var(--shadow-input)] transition-[color,box-shadow,border-color,background-color] outline-none selection:bg-[var(--accent-soft)] selection:text-[var(--ink)] file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-xs file:font-medium file:text-[var(--ink)] placeholder:text-[var(--ink-3)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        'focus-visible:border-transparent focus-visible:shadow-[var(--focus-ring)]',
        'aria-invalid:border-[var(--bad)] aria-invalid:focus-visible:border-[var(--bad)]',
        className,
      )}
      {...props}
    />
  );
}

export { Input };
