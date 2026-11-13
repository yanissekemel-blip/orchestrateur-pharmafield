import { CalendarIcon, type LucideIcon } from 'lucide-react';
import type { HTMLAttributes, ReactNode } from 'react';
import { Button } from './button';
import { Panel } from './panel';
import { cn } from './utils';

/** Equal-width lanes that fill the available height and scroll sideways when narrow. */
export function KanbanBoard({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="kanban-board"
      className={cn(
        'relative grid min-h-[min(36rem,70dvh)] min-w-0 flex-1 auto-cols-[minmax(min(85vw,17rem),1fr)] grid-flow-col gap-4 overflow-x-auto pb-1',
        className,
      )}
      {...props}
    />
  );
}

type KanbanLaneProps = Omit<HTMLAttributes<HTMLElement>, 'title'> & {
  /** Accessible lane name; shown as text when no `badge` is given. */
  title: string;
  /** Visible lane heading, typically the status pill used in tables. */
  badge?: ReactNode;
  count?: number;
  state?: 'loading' | 'empty' | 'error' | 'ready';
  emptyMessage?: string;
  onRetry?: () => void;
  hasMore?: boolean;
  /** Items not loaded yet; labels the load-more control. */
  remaining?: number;
  loadingMore?: boolean;
  onLoadMore?: () => void;
  children?: ReactNode;
};

export function KanbanLane({
  title,
  badge,
  count,
  state = 'ready',
  emptyMessage = 'Aucun élément',
  onRetry,
  hasMore,
  remaining,
  loadingMore,
  onLoadMore,
  children,
  className,
  ...props
}: KanbanLaneProps) {
  return (
    <Panel
      asChild
      variant="column"
      padding="none"
      className={cn('flex min-h-0 min-w-0 flex-col', className)}
    >
      <section aria-label={title} {...props}>
        <div className="flex min-h-[54px] items-center gap-2.5 px-[18px] pt-2">
          {badge ?? (
            <h2 className="truncate text-[13.5px] font-heading text-[var(--ink)]">
              {title}
            </h2>
          )}
          {count !== undefined ? (
            <span className="text-[13px] font-bold tabular-nums text-[var(--ink-3)]">
              {count}
              <span className="sr-only"> éléments</span>
            </span>
          ) : null}
        </div>
        <div
          data-slot="kanban-lane-body"
          className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-3.5 pt-1 pb-3.5"
        >
          {state === 'loading' ? (
            <p role="status" className="px-1 text-[12.5px] text-[var(--ink-3)]">
              Chargement…
            </p>
          ) : null}
          {state === 'empty' ? (
            <p className="px-1 py-2 text-[12.5px] text-[var(--ink-3)]">
              {emptyMessage}
            </p>
          ) : null}
          {state === 'error' ? (
            <div className="space-y-2 px-1 text-[12.5px] text-[var(--ink-2)]">
              <p>Impossible de charger les éléments.</p>
              {onRetry ? (
                <Button variant="outline" size="sm" onClick={onRetry}>
                  Réessayer
                </Button>
              ) : null}
            </div>
          ) : null}
          {state === 'ready' ? children : null}
          {state === 'ready' && hasMore && onLoadMore ? (
            <Button
              variant="ghost"
              disabled={loadingMore}
              onClick={onLoadMore}
              className="h-11 w-full shrink-0 rounded-[var(--radius-card)] border border-dashed border-[var(--charcoal-a15)] font-bold text-[var(--ink-2)] hover:text-[var(--ink)]"
            >
              {loadingMore
                ? 'Chargement…'
                : remaining
                  ? `Charger ${remaining} de plus`
                  : 'Charger plus'}
            </Button>
          ) : null}
        </div>
      </section>
    </Panel>
  );
}

export function KanbanCard({
  className,
  muted,
  ...props
}: HTMLAttributes<HTMLElement> & {
  /** Dims the title for settled items such as done or cancelled. */
  muted?: boolean;
}) {
  return (
    <Panel
      asChild
      variant="raised"
      padding="none"
      className={cn(
        'group/kanban-card relative shrink-0 rounded-[var(--radius-card)] px-[17px] pt-4 pb-3.5 text-[12.5px] text-[var(--ink)] transition-[box-shadow,transform] duration-150 ease-out focus-within:shadow-[var(--focus-ring)] hover:shadow-[0_14px_34px_rgba(36, 36, 36,.12)] data-[dragging=true]:rotate-[1deg] data-[dragging=true]:shadow-[var(--shadow-float)] motion-reduce:transition-none',
        className,
      )}
    >
      <article
        data-slot="kanban-card"
        data-muted={muted || undefined}
        {...props}
      />
    </Panel>
  );
}

/** Card heading. Wrap a link inside it; the link's hit area covers the card. */
export function KanbanCardTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        'truncate text-[14px] leading-snug font-extrabold tracking-[-0.01em] text-[var(--ink)] group-data-[muted=true]/kanban-card:text-[var(--ink-3)] [&_a]:outline-none [&_a]:after:absolute [&_a]:after:inset-0 [&_a]:after:rounded-[var(--radius-card)] [&_a]:after:content-[""]',
        className,
      )}
      {...props}
    />
  );
}

export function KanbanCardMeta({
  icon: Icon,
  muted,
  className,
  children,
  ...props
}: HTMLAttributes<HTMLParagraphElement> & {
  icon?: LucideIcon;
  /** Placeholder styling for missing values. */
  muted?: boolean;
}) {
  return (
    <p
      className={cn(
        'mt-2 flex min-w-0 items-center gap-2 text-[12.5px] font-medium text-[var(--ink-2)]',
        muted && 'text-[var(--ink-3)]',
        className,
      )}
      {...props}
    >
      {Icon ? <Icon className="size-3.5 shrink-0" aria-hidden="true" /> : null}
      <span className="truncate">{children}</span>
    </p>
  );
}

export function KanbanCardFooter({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'mt-3.5 flex min-h-6 items-center justify-between gap-3 border-t border-[var(--line)] pt-3',
        className,
      )}
      {...props}
    />
  );
}

export function KanbanCardDate({
  overdue,
  className,
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { overdue?: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 text-[12.5px] font-semibold tabular-nums text-[var(--ink-2)]',
        overdue && 'text-[var(--warn)]',
        className,
      )}
      {...props}
    >
      <CalendarIcon className="size-3.5" aria-hidden="true" />
      {children}
      {overdue ? <span className="sr-only"> (en retard)</span> : null}
    </span>
  );
}
