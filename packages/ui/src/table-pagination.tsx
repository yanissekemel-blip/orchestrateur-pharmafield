'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';

function TablePagination({
  page,
  lastPage,
  from,
  to,
  total,
  onPageChange,
  perPage,
  perPageOptions = [15, 25, 50, 100],
  onPerPageChange,
  locale = 'fr',
  note,
}: {
  page: number;
  lastPage: number;
  from: number;
  to: number;
  total: number;
  onPageChange: (page: number) => void;
  perPage?: number;
  perPageOptions?: number[];
  onPerPageChange?: (perPage: number) => void;
  locale?: 'fr' | 'en';
  /** Short context after the range, such as rows left out of totals. */
  note?: string;
}) {
  const english = locale === 'en';
  const go = (next: number) =>
    onPageChange(Math.min(Math.max(next, 1), lastPage));
  return (
    <footer
      data-slot="table-pagination"
      className="flex shrink-0 flex-wrap items-center gap-3 border-t border-[var(--line-2)] bg-transparent px-6 py-3"
    >
      <p className="mr-auto text-[12.5px] font-semibold tabular-nums text-[var(--ink-3)]">
        {from}–{to} {english ? 'of' : 'sur'} {total}
        {note ? <span className="font-normal"> · {note}</span> : null}
      </p>
      {perPage !== undefined && onPerPageChange && (
        <div className="flex items-center gap-2">
          <span className="text-[12.5px] font-semibold text-[var(--ink-3)]">
            {english ? 'Rows' : 'Lignes'}
          </span>
          <Select
            value={String(perPage)}
            onValueChange={(value) => onPerPageChange(Number(value))}
          >
            <SelectTrigger
              variant="quiet"
              size="sm"
              className="h-[30px] data-[size=sm]:h-[30px] w-auto gap-1.5 rounded-[var(--radius-control)] border-0 shadow-none bg-[var(--charcoal-a06)] px-3 text-[12.5px] font-bold hover:bg-[var(--charcoal-a10)]"
              aria-label={english ? 'Rows per page' : 'Lignes par page'}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {perPageOptions.map((option) => (
                <SelectItem key={option} value={String(option)}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <nav
        className="flex items-center gap-1.5"
        aria-label={english ? 'Table pagination' : 'Pagination du tableau'}
      >
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          disabled={page <= 1}
          onClick={() => go(page - 1)}
          aria-label={english ? 'Previous page' : 'Page précédente'}
          className="disabled:bg-[var(--charcoal-a03)] disabled:opacity-60 disabled:shadow-none"
        >
          <ChevronLeft className="size-3.5" />
        </Button>
        <span className="sr-only" aria-live="polite">
          {english ? 'Page' : 'Page'} {page} {english ? 'of' : 'sur'} {lastPage}
        </span>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          disabled={page >= lastPage}
          onClick={() => go(page + 1)}
          aria-label={english ? 'Next page' : 'Page suivante'}
          className="disabled:bg-[var(--charcoal-a03)] disabled:opacity-60 disabled:shadow-none"
        >
          <ChevronRight className="size-3.5" />
        </Button>
      </nav>
    </footer>
  );
}

export { TablePagination };
