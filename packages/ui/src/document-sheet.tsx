import type * as React from 'react';
import { useLayoutEffect, useRef } from 'react';
import { cn } from './utils';

/** Text the writer still has to fill in, as generated documents mark it. */
const TO_COMPLETE = '[à compléter]';

function incomplete(value: string): boolean {
  return value.trim() === '' || value.includes(TO_COMPLETE);
}

/**
 * A printed page on screen: an A4 sheet (it shrinks to the screen on
 * phones) set in the same font as the exported document, so what is edited
 * is what prints.
 */
export function DocumentSheet({
  className,
  ...props
}: React.ComponentProps<'article'>) {
  return (
    <article
      data-slot="document-sheet"
      className={cn('document-sheet', className)}
      {...props}
    />
  );
}

/**
 * Text written straight on the sheet: it looks like the page's own text,
 * shows a soft tint on hover and focus, grows with its content, and is
 * tinted amber while empty or still « [à compléter] ».
 */
export function SheetText({
  value,
  onChange,
  label,
  placeholder = TO_COMPLETE,
  className,
  ...props
}: Omit<React.ComponentProps<'textarea'>, 'value' | 'onChange'> & {
  value: string;
  onChange: (value: string) => void;
  /** Accessible name; the visible label is the surrounding page text. */
  label: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  // biome-ignore lint/correctness/useExhaustiveDependencies: the height follows the text.
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const fit = () => {
      element.style.height = 'auto';
      element.style.height = `${element.scrollHeight}px`;
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [value]);
  return (
    <textarea
      ref={ref}
      data-slot="sheet-text"
      data-incomplete={incomplete(value) || undefined}
      aria-label={label}
      rows={1}
      spellCheck
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      className={cn(className)}
      {...props}
    />
  );
}

/** A short value inside a line of page text, as wide as what it holds. */
export function SheetInlineText({
  value,
  onChange,
  label,
  placeholder = TO_COMPLETE,
  className,
  ...props
}: Omit<React.ComponentProps<'input'>, 'value' | 'onChange' | 'size'> & {
  value: string;
  onChange: (value: string) => void;
  label: string;
}) {
  return (
    <input
      data-slot="sheet-inline-text"
      data-incomplete={incomplete(value) || undefined}
      aria-label={label}
      value={value}
      placeholder={placeholder}
      size={Math.max((value || placeholder).length + 2, 6)}
      onChange={(event) => onChange(event.target.value)}
      className={cn(className)}
      {...props}
    />
  );
}

/** How many fields of a sheet are still empty or « [à compléter] ». */
export function countIncomplete(values: readonly string[]): number {
  return values.filter(incomplete).length;
}
