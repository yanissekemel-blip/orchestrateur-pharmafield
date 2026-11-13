import type * as React from 'react';

import { cn } from './utils';

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'flex field-sizing-content min-h-24 w-full rounded-[var(--radius-input)] border border-[var(--charcoal-a10)] bg-[var(--field)] focus-visible:bg-white px-3 py-2 text-[12.5px] text-[var(--ink)] shadow-[var(--shadow-input)] transition-[color,box-shadow,border-color,background-color] outline-none placeholder:text-[var(--ink-3)] focus-visible:border-transparent focus-visible:shadow-[var(--focus-ring)] aria-invalid:border-[var(--bad)] aria-invalid:focus-visible:border-[var(--bad)] disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
