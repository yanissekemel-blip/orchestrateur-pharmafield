'use client';

import {
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
  GripVertical,
  type LucideIcon,
} from 'lucide-react';
import type * as React from 'react';
import { createContext, useContext, useRef, useState } from 'react';
import {
  draggedId,
  endDrag,
  setDragPreview,
  startDrag,
} from './lib/drag-preview';
import { cn } from './utils';

const TableHoveredColumnContext = createContext<number | null>(null);
/** The table's container, from which virtualized bodies find their scroller. */
export const TableContainerContext =
  createContext<React.RefObject<HTMLDivElement | null> | null>(null);

function Table({
  className,
  fill = false,
  phoneLayout = 'cards',
  onMouseOver,
  onMouseLeave,
  ...props
}: React.ComponentProps<'table'> & {
  fill?: boolean;
  /**
   * Below 40rem, rows render as cards (each cell labelled by `TableCell
   * label`), or keep the table and scroll sideways.
   */
  phoneLayout?: 'cards' | 'scroll';
}) {
  const [hoveredColumn, setHoveredColumn] = useState<number | null>(null);
  const container = useRef<HTMLDivElement>(null);
  return (
    <TableHoveredColumnContext value={hoveredColumn}>
      <TableContainerContext value={container}>
        <div
          ref={container}
          data-slot="table-container"
          data-fill={fill || undefined}
          tabIndex={fill ? 0 : undefined}
          className={cn(
            // Rows run edge to edge so hover, selection and dividers reach the
            // card; the outer cells carry the 24px inset instead of a gutter.
            'w-full max-w-full overflow-x-auto',
            fill &&
              'min-h-0 flex-1 overflow-y-auto overscroll-contain outline-none focus-visible:shadow-[inset_0_0_0_2px_var(--charcoal-900)]',
          )}
        >
          <table
            data-slot="table"
            data-phone-layout={phoneLayout}
            className={cn(
              'w-full min-w-max border-separate border-spacing-0 caption-bottom text-[13px] text-[var(--ink)] [&:has([data-state-row])]:h-full [&_tbody_tr:last-child>td]:border-b-0',
              fill &&
                '[&_thead]:sticky [&_thead]:top-0 [&_thead]:z-10 [&_thead_th]:bg-[var(--panel)]',
              className,
            )}
            onMouseOver={(event) => {
              const target = event.target;
              const cell =
                target instanceof Element ? target.closest('th, td') : null;
              setHoveredColumn(
                cell instanceof HTMLTableCellElement ? cell.cellIndex : null,
              );
              onMouseOver?.(event);
            }}
            onMouseLeave={(event) => {
              setHoveredColumn(null);
              onMouseLeave?.(event);
            }}
            {...props}
          />
        </div>
      </TableContainerContext>
    </TableHoveredColumnContext>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<'thead'>) {
  return (
    <thead data-slot="table-header" className={cn(className)} {...props} />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<'tbody'>) {
  return <tbody data-slot="table-body" className={cn(className)} {...props} />;
}

function TableFooter({ className, ...props }: React.ComponentProps<'tfoot'>) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        'font-bold [&_td]:border-t [&_td]:border-b-0 [&_td]:border-[var(--line)]',
        className,
      )}
      {...props}
    />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<'tr'>) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        'hover:[&>td]:bg-[var(--charcoal-a03)] data-[state=selected]:[&>td]:bg-[var(--charcoal-a06)] data-[state=selected]:hover:[&>td]:bg-[var(--charcoal-a07)]',
        className,
      )}
      {...props}
    />
  );
}

function TableHead({
  className,
  icon: ColumnIcon,
  children,
  ...props
}: React.ComponentProps<'th'> & { icon?: LucideIcon }) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        'h-10 border-b border-[var(--line-2)] bg-transparent px-4 first:pl-6 last:pr-6 text-left align-middle text-[12px] font-label whitespace-nowrap text-[var(--ink-3)] [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
        className,
      )}
      {...props}
    >
      {ColumnIcon ? (
        <span className="inline-flex items-center gap-1.5">
          <ColumnIcon className="size-3.5 shrink-0" aria-hidden="true" />
          {children}
        </span>
      ) : (
        children
      )}
    </th>
  );
}

function TableSortHead({
  children,
  direction,
  onSort,
  align = 'left',
  icon: ColumnIcon,
  buttonClassName,
  className,
  ...props
}: Omit<React.ComponentProps<'th'>, 'onClick'> & {
  direction?: 'asc' | 'desc' | null;
  onSort: () => void;
  align?: 'left' | 'right';
  icon?: LucideIcon;
  buttonClassName?: string;
}) {
  const Icon =
    direction === 'asc'
      ? ArrowUp
      : direction === 'desc'
        ? ArrowDown
        : ChevronsUpDown;
  return (
    <TableHead
      aria-sort={
        direction === 'asc'
          ? 'ascending'
          : direction === 'desc'
            ? 'descending'
            : 'none'
      }
      // The button pads 16px; the outer edge adds 8px to match other cells.
      className={cn('p-0 first:pl-2 last:pr-2', className)}
      {...props}
    >
      <button
        type="button"
        onClick={onSort}
        className={cn(
          'group/sort flex h-10 w-full items-center gap-1 px-4 text-left font-label outline-none transition-colors duration-150 hover:text-[var(--ink)] focus-visible:shadow-[inset_0_0_0_2px_var(--charcoal-900)] motion-reduce:transition-none',
          direction && 'text-[var(--ink-2)]',
          align === 'right' && 'justify-end text-right',
          buttonClassName,
        )}
      >
        {ColumnIcon ? (
          <ColumnIcon className="mr-0.5 size-3.5 shrink-0" aria-hidden="true" />
        ) : null}
        {children}
        <Icon
          className={cn(
            'size-3 transition-opacity duration-150 motion-reduce:transition-none',
            direction
              ? 'text-[var(--ink)] opacity-100'
              : 'text-[var(--ink-3)] opacity-0 group-hover/sort:opacity-100 group-focus-visible/sort:opacity-100',
          )}
          aria-hidden="true"
        />
      </button>
    </TableHead>
  );
}

function TableDraggableHead({
  columnId,
  order,
  onOrderChange,
  onSort,
  direction,
  icon,
  children,
  className,
}: {
  columnId: string;
  order: readonly string[];
  onOrderChange: (order: string[]) => void;
  onSort?: () => void;
  direction?: 'asc' | 'desc' | null;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
}) {
  const [dropSide, setDropSide] = useState<'before' | 'after' | null>(null);
  const [dragging, setDragging] = useState(false);
  const hoveredColumn = useContext(TableHoveredColumnContext);
  const headRef = useRef<HTMLTableHeaderCellElement>(null);
  const columnHovered = hoveredColumn === headRef.current?.cellIndex;
  const grip = (
    <GripVertical
      data-slot="table-drag-handle"
      className={cn(
        'pointer-events-none absolute right-2 top-1/2 size-3.5 -translate-y-1/2 text-[var(--ink-3)] transition-opacity duration-150 motion-reduce:transition-none',
        columnHovered || dragging
          ? 'opacity-100'
          : 'opacity-0 group-focus-within:opacity-100',
      )}
      aria-hidden="true"
    />
  );
  const dragProps = {
    ref: headRef,
    draggable: true,
    'data-column-id': columnId,
    'data-column-hovered': columnHovered || undefined,
    'data-drop-side': dropSide ?? undefined,
    'data-dragging': dragging || undefined,
    onDragStart: (event: React.DragEvent<HTMLTableHeaderCellElement>) => {
      event.dataTransfer.setData(
        'application/x-pharmafield-table-column',
        columnId,
      );
      event.dataTransfer.effectAllowed = 'move';
      setDragPreview(
        event.nativeEvent,
        event.currentTarget.textContent?.trim() || columnId,
      );
      startDrag('table-column', columnId);
      setDragging(true);
    },
    onDragEnd: () => {
      endDrag();
      setDragging(false);
    },
    onDragOver: (event: React.DragEvent<HTMLTableHeaderCellElement>) => {
      if (
        event.dataTransfer.types.includes(
          'application/x-pharmafield-table-column',
        )
      ) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        const source = draggedId('table-column');
        const from = source ? order.indexOf(source) : -1;
        const to = order.indexOf(columnId);
        // The insertion line marks where the column will land.
        setDropSide(
          from < 0 || from === to ? null : from < to ? 'after' : 'before',
        );
      }
    },
    onDragLeave: () => setDropSide(null),
    onDrop: (event: React.DragEvent<HTMLTableHeaderCellElement>) => {
      event.preventDefault();
      setDropSide(null);
      const source = event.dataTransfer.getData(
        'application/x-pharmafield-table-column',
      );
      const from = order.indexOf(source);
      const to = order.indexOf(columnId);
      if (from < 0 || to < 0 || from === to) return;
      const next = [...order];
      const [moved] = next.splice(from, 1);
      if (!moved) return;
      next.splice(to, 0, moved);
      onOrderChange(next);
    },
  };
  const styles = cn(
    'group relative cursor-grab data-[dragging=true]:opacity-40 data-[drop-side=before]:shadow-[inset_2px_0_0_var(--accent)] data-[drop-side=after]:shadow-[inset_-2px_0_0_var(--accent)] active:cursor-grabbing',
    className,
  );
  return onSort ? (
    <TableSortHead
      {...dragProps}
      className={styles}
      direction={direction}
      onSort={onSort}
      icon={icon}
      buttonClassName="relative pr-8"
    >
      {children}
      {grip}
    </TableSortHead>
  ) : (
    <TableHead {...dragProps} icon={icon} className={cn(styles, 'pr-8')}>
      <span className="flex items-center gap-1.5">{children}</span>
      {grip}
    </TableHead>
  );
}

function TableGroupRow({
  colSpan,
  label,
  count,
  className,
}: {
  colSpan: number;
  label: React.ReactNode;
  count?: number;
  className?: string;
}) {
  return (
    <TableRow>
      <TableCell
        colSpan={colSpan}
        className={cn(
          'h-auto bg-[var(--charcoal-a03)] py-1.5 text-[11.5px] font-bold text-[var(--ink-2)]',
          className,
        )}
      >
        {label}
        {typeof count === 'number' && (
          <span className="ml-1 text-[var(--ink-3)]">({count})</span>
        )}
      </TableCell>
    </TableRow>
  );
}

function TableCell({
  className,
  label,
  phone,
  ...props
}: React.ComponentProps<'td'> & {
  /** Column name shown before the value when rows render as phone cards. */
  label?: string;
  /**
   * Phone card role: `title` leads the card, `hidden` drops the cell, and
   * `actions` pins the row's overflow menu to the card's top-right corner.
   */
  phone?: 'title' | 'hidden' | 'actions';
}) {
  return (
    <td
      data-slot="table-cell"
      data-label={label}
      data-phone-role={phone}
      className={cn(
        'h-12 max-w-80 overflow-hidden border-b border-[var(--line-2)] bg-transparent px-4 first:pl-6 last:pr-6 py-1.5 align-middle text-ellipsis whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
        className,
      )}
      {...props}
    />
  );
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<'caption'>) {
  return (
    <caption
      data-slot="table-caption"
      className={cn('mt-3 text-[11.5px] text-[var(--ink-3)]', className)}
      {...props}
    />
  );
}

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableDraggableHead,
  TableFooter,
  TableGroupRow,
  TableHead,
  TableHeader,
  TableRow,
  TableSortHead,
};
