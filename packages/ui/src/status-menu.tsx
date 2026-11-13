'use client';

import { ChevronDown } from 'lucide-react';
import type * as React from 'react';
import { Badge } from './badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from './dropdown-menu';
import { Spinner } from './spinner';
import { cn } from './utils';

type BadgeVariant = NonNullable<React.ComponentProps<typeof Badge>['variant']>;

export type StatusMenuOption<Value extends string> = {
  value: Value;
  label: string;
  variant: BadgeVariant;
};

/**
 * A record status shown as a pill. When `onChange` is given the pill opens a
 * menu of the possible statuses and saves on selection; without it (viewers)
 * it is the plain pill.
 */
function StatusMenu<Value extends string>({
  value,
  options,
  onChange,
  pending = false,
  label = 'Statut',
  className,
}: {
  value: Value;
  options: readonly StatusMenuOption<Value>[];
  /** Omit for a read-only pill. */
  onChange?: (value: Value) => void;
  /** A change is being saved. */
  pending?: boolean;
  /** Accessible name prefix: « Statut : Actif ». */
  label?: string;
  className?: string;
}) {
  const current = options.find((option) => option.value === value);
  if (!current) return null;
  if (!onChange)
    return (
      <Badge variant={current.variant} className={className}>
        {current.label}
      </Badge>
    );
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={pending}>
        <Badge asChild variant={current.variant}>
          <button
            type="button"
            data-slot="status-menu"
            aria-label={`${label} : ${current.label}. Modifier`}
            aria-busy={pending || undefined}
            className={cn(
              'cursor-pointer pr-1.5 hover:brightness-[0.97] disabled:cursor-default',
              className,
            )}
          >
            <span className="min-w-0 truncate leading-[1.4]">
              {current.label}
            </span>
            {pending ? (
              <Spinner className="size-3" />
            ) : (
              <ChevronDown aria-hidden="true" className="opacity-60" />
            )}
          </button>
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-40">
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(next) => {
            if (next !== value) onChange(next as Value);
          }}
        >
          {options.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { StatusMenu };
