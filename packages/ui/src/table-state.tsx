import { CircleAlert, Inbox, type LucideIcon, SearchX } from 'lucide-react';
import type { ReactNode } from 'react';
import { Skeleton } from './skeleton';
import { TableCell, TableRow } from './table';

function TableLoadingRows({
  columns,
  rows = 5,
}: {
  columns: number;
  rows?: number;
}) {
  return (
    <>
      {Array.from({ length: rows }, (_, row) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: Loading rows are positional placeholders with no stable data IDs.
        <TableRow key={row} aria-hidden="true">
          {Array.from({ length: columns }, (_, column) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: Loading cells are positional placeholders with no stable data IDs.
            <TableCell key={column}>
              <Skeleton
                className={
                  column === 0
                    ? 'h-3 w-3'
                    : column === 1
                      ? 'h-3 w-3/4'
                      : 'h-3 w-1/2'
                }
              />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}
function TableStateRow({
  colSpan,
  variant,
  title,
  description,
  action,
  icon,
}: {
  colSpan: number;
  variant: 'empty' | 'filtered' | 'error';
  title: string;
  description?: string;
  action?: ReactNode;
  /** Overrides the icon chosen from the variant. */
  icon?: LucideIcon;
}) {
  const Icon =
    icon ??
    (variant === 'error'
      ? CircleAlert
      : variant === 'filtered'
        ? SearchX
        : Inbox);
  return (
    <TableRow data-state-row className="hover:[&>td]:bg-transparent">
      <TableCell colSpan={colSpan} className="border-b-0 py-8 text-center">
        {/* Sticky-centred so the state stays in view when a wide table scrolls sideways. */}
        <div className="sticky left-1/2 flex w-[280px] max-w-[calc(100vw-64px)] -translate-x-1/2 flex-col items-center gap-2 whitespace-normal">
          <Icon
            aria-hidden="true"
            className="mb-1 size-8 stroke-[1.5] text-[var(--ink-3)]"
          />
          <strong className="text-[13.5px] font-heading text-[var(--ink)]">
            {title}
          </strong>
          {description && (
            <p className="text-[12.5px] text-[var(--ink-2)]">{description}</p>
          )}
          {action && <div className="mt-2">{action}</div>}
        </div>
      </TableCell>
    </TableRow>
  );
}

export { TableLoadingRows, TableStateRow };
