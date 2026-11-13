import type * as React from 'react';
import { useLayoutEffect, useRef, useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip';
import { cn } from './utils';

type Stat = {
  label: string;
  value: React.ReactNode;
  sub?: string;
  accent?: 'ink' | 'gold' | 'sage' | 'success' | 'warning' | 'danger' | 'info';
};

type PageHeaderProps = {
  title: React.ReactNode;
  /** Breadcrumb link rendered before the title, such as a back link to the list. */
  back?: React.ReactNode;
  count?: number;
  /** Inline content after the title, such as a status pill or a rename button. */
  meta?: React.ReactNode;
  actions?: React.ReactNode;
  stats?: Stat[];
  className?: string;
};

const accentClass: Record<NonNullable<Stat['accent']>, string> = {
  ink: 'text-[var(--ink)]',
  gold: 'text-[var(--brand-ink)]',
  sage: 'text-pharmafield-sage',
  success: 'text-pharmafield-success',
  warning: 'text-[var(--warn-strong)]',
  danger: 'text-pharmafield-danger',
  info: 'text-pharmafield-info',
};

/**
 * One-line title that truncates; when cut off, it becomes focusable and shows
 * the full text in a tooltip on hover and focus.
 */
function PageTitle({ title }: { title: React.ReactNode }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [truncated, setTruncated] = useState(false);
  useLayoutEffect(() => {
    const node = ref.current;
    if (!node || typeof ResizeObserver === 'undefined') return;
    const measure = () => setTruncated(node.scrollWidth > node.clientWidth + 1);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  const heading = (
    <h1
      ref={ref}
      tabIndex={truncated ? 0 : undefined}
      className="min-w-0 truncate rounded-[var(--radius-md)] text-[24px] font-display leading-tight text-[var(--ink)] outline-none focus-visible:shadow-[var(--focus-ring)]"
    >
      {title}
    </h1>
  );
  // One stable tree: swapping wrappers would remount the observed heading.
  const tip = truncated && typeof title === 'string';
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip open={tip ? undefined : false}>
        <TooltipTrigger asChild>{heading}</TooltipTrigger>
        <TooltipContent
          side="bottom"
          align="start"
          className="max-w-[min(32rem,90vw)]"
        >
          {title}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function PageHeader({
  title,
  back,
  count,
  meta,
  actions,
  stats,
  className,
}: PageHeaderProps) {
  return (
    <header
      data-slot="page-header"
      className={cn('shrink-0 bg-transparent', className)}
    >
      {/* From 768px the breadcrumb, title and meta stay on one row and the
          title shrinks first. Actions share that row while the title group
          keeps at least 30rem, and wrap below otherwise. Phones put the title
          on its own line. */}
      <div className="flex min-h-[68px] flex-wrap items-center gap-3 px-[22px] pt-5 pb-3">
        <div className="flex min-w-[min(100%,30rem)] max-w-full grow basis-0 flex-wrap items-center gap-x-3 gap-y-1 md:flex-nowrap">
          {back ? (
            <span className="flex max-w-full min-w-0 shrink-0 items-center gap-2 whitespace-nowrap text-[14px] font-bold text-[var(--ink-3)]">
              <span className="min-w-0 truncate">{back}</span>
              <span aria-hidden="true">/</span>
            </span>
          ) : null}
          <PageTitle title={title} />
          {count !== undefined ? (
            <span className="relative top-[0.09em] shrink-0 text-[14px] leading-none font-bold tabular-nums text-[var(--ink-3)]">
              <span className="sr-only">Total : </span>
              {count.toLocaleString('fr-FR')}
            </span>
          ) : null}
          {meta ? (
            <div className="flex min-w-0 flex-wrap items-center gap-2 md:shrink-0 md:flex-nowrap md:whitespace-nowrap">
              {meta}
            </div>
          ) : null}
        </div>
        {actions ? (
          <div className="ml-auto flex max-w-full min-w-0 flex-wrap items-center gap-2 md:shrink-0 md:flex-nowrap">
            {actions}
          </div>
        ) : null}
      </div>

      {stats && stats.length > 0 ? (
        <div
          data-slot="page-header-stats"
          className="grid gap-3 px-[22px] pb-3 max-sm:flex max-sm:overflow-x-auto max-sm:[&>*]:min-w-[11rem]"
          style={{
            gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))`,
          }}
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={cn(
                'flex min-w-0 items-center gap-3 rounded-[var(--radius-card)] border border-white/95 bg-[var(--surface-card)] px-4 py-3 shadow-card',
              )}
            >
              <div
                className={cn(
                  'text-[26px] font-display leading-none tabular-nums',
                  accentClass[stat.accent ?? 'ink'],
                )}
              >
                {stat.value}
              </div>
              <div className="min-w-0">
                <div className="text-[12px] font-semibold text-[var(--ink-3)]">
                  {stat.label}
                </div>
                {stat.sub ? (
                  <div className="mt-0.5 truncate text-[11.5px] text-[var(--ink-2)]">
                    {stat.sub}
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </header>
  );
}

type PageFooterProps = React.HTMLAttributes<HTMLElement>;

export function PageFooter({ children, className, ...props }: PageFooterProps) {
  return (
    <footer
      className={cn(
        'mt-auto flex min-h-11 shrink-0 items-center border-t border-[var(--line-2)] bg-transparent px-[22px] py-2.5 text-[12px] text-[var(--ink-3)]',
        className,
      )}
      {...props}
    >
      {children}
    </footer>
  );
}
