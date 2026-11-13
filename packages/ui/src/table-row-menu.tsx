'use client';

import { MoreHorizontal } from 'lucide-react';
import type * as React from 'react';
import { Button } from './button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from './dropdown-menu';
import { cn } from './utils';

/**
 * The overflow menu of a record: an icon-only « … » button opening the
 * record's actions. Pass `DropdownMenuItem`s as children, each led by an
 * icon, with destructive items last after a separator. In a data table, put
 * it in a trailing `<TableCell phone="actions">`.
 */
function TableRowMenu({
  label,
  children,
  className,
  align = 'end',
  ...props
}: Omit<React.ComponentProps<typeof Button>, 'children'> & {
  /** Accessible name, naming the record: « Actions pour Marie Curie ». */
  label: string;
  children: React.ReactNode;
  align?: 'start' | 'center' | 'end';
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={label}
          data-slot="table-row-menu"
          className={cn(
            'text-[var(--ink-2)] data-[state=open]:bg-[var(--charcoal-a06)] data-[state=open]:text-[var(--ink)]',
            className,
          )}
          {...props}
        >
          <MoreHorizontal aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="min-w-44">
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { TableRowMenu };
