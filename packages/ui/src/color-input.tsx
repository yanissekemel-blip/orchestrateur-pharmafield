'use client';

import type * as React from 'react';
import { Input } from './input';
import { cn } from './utils';

const HEX = /^#[0-9a-fA-F]{6}$/;

/** A small square of a record's colour; an invalid colour shows an empty well. */
function ColorSwatch({
  color,
  className,
  ...props
}: React.ComponentProps<'span'> & { color: string | null | undefined }) {
  const valid = typeof color === 'string' && HEX.test(color);
  return (
    <span
      data-slot="color-swatch"
      aria-hidden="true"
      className={cn(
        'inline-block size-4 shrink-0 rounded-[5px] bg-[var(--field)] shadow-[inset_0_0_0_1px_var(--charcoal-a15)]',
        className,
      )}
      style={valid ? { backgroundColor: color } : undefined}
      {...props}
    />
  );
}

/**
 * A `#RRGGBB` colour field: the swatch opens the system colour picker and the
 * text beside it accepts a typed or pasted value. Emits the text as typed, so
 * the form's schema validates and normalises it.
 */
function ColorInput({
  value,
  onChange,
  className,
  pickerLabel = 'Choisir une couleur',
  disabled,
  ...props
}: Omit<React.ComponentProps<'input'>, 'value' | 'onChange' | 'type'> & {
  value: string;
  onChange: (value: string) => void;
  /** Accessible name of the swatch that opens the system picker. */
  pickerLabel?: string;
}) {
  const valid = HEX.test(value);
  return (
    <div
      data-slot="color-input"
      className={cn('relative flex w-full min-w-0 items-center', className)}
    >
      <span className="absolute left-2 grid size-6 place-items-center">
        <ColorSwatch color={value} className="size-5 rounded-[6px]" />
        <input
          type="color"
          aria-label={pickerLabel}
          disabled={disabled}
          value={valid ? value : '#000000'}
          onChange={(event) => onChange(event.target.value.toUpperCase())}
          className="absolute inset-0 size-full cursor-pointer rounded-[6px] opacity-0 outline-none disabled:cursor-not-allowed"
        />
      </span>
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        placeholder="#213F75"
        maxLength={7}
        spellCheck={false}
        autoCapitalize="characters"
        className="pl-10 font-mono uppercase placeholder:normal-case"
        {...props}
      />
    </div>
  );
}

export { ColorInput, ColorSwatch };
