'use client';

import { X } from 'lucide-react';
import { type ReactNode, useRef } from 'react';
import { Button } from './button';
import { Checkbox } from './checkbox';
import { Presence } from './presence';
import { TableCell, TableHead } from './table';

function TableSelectHead({
  checked,
  onCheckedChange,
  label = 'Sélectionner les lignes visibles',
  disabled,
}: {
  checked: boolean | 'indeterminate';
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}) {
  return (
    <TableHead className="w-[40px] !pr-0 !pl-6">
      <div className="flex items-center">
        <Checkbox
          checked={checked}
          disabled={disabled}
          onCheckedChange={(value) => onCheckedChange(value === true)}
          aria-label={label}
        />
      </div>
    </TableHead>
  );
}
function TableSelectCell({
  checked,
  onCheckedChange,
  label,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <TableCell className="w-[40px] !pr-0 !pl-6">
      <div className="flex items-center">
        <Checkbox
          checked={checked}
          onCheckedChange={(value) => onCheckedChange(value === true)}
          aria-label={label}
        />
      </div>
    </TableCell>
  );
}
function TableBulkActions({
  count,
  onClear,
  children,
  label,
  clearLabel = 'Effacer la sélection',
}: {
  count: number;
  onClear: () => void;
  children?: ReactNode;
  label?: ReactNode;
  clearLabel?: string;
}) {
  // Keeps the last label while the bar animates out after the selection clears.
  const shown = useRef({ count, label });
  if (count > 0) shown.current = { count, label };
  const visible = shown.current;
  return (
    <Presence show={count > 0}>
      {/* Solid charcoal ink, like the default toast: it reads as a mode, not a row. */}
      <div
        data-slot="table-bulk-actions"
        className="flex min-h-12 flex-wrap items-center gap-2 bg-[var(--ink)] px-6 py-2 text-white"
      >
        <span className="mr-auto text-[12.5px] font-bold">
          {visible.label ?? (
            <>
              {visible.count} élément{visible.count === 1 ? '' : 's'}{' '}
              sélectionné{visible.count === 1 ? '' : 's'}
            </>
          )}
        </span>
        {children}
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onClear}
          aria-label={clearLabel}
          className="text-white hover:bg-white/10 hover:text-white"
        >
          <X className="size-3.5" />
        </Button>
      </div>
    </Presence>
  );
}

export { TableBulkActions, TableSelectCell, TableSelectHead };
