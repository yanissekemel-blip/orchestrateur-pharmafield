import type { ComponentType, CSSProperties } from 'react';
import { Skeleton } from './skeleton';
import { cn } from './utils';

type MetricStripItem = {
  label: string;
  value: string;
  detail: string;
  icon: ComponentType<{ className?: string }>;
};

function MetricStrip({
  items,
  isLoading = false,
  className,
}: {
  items: MetricStripItem[];
  isLoading?: boolean;
  className?: string;
}) {
  return (
    <section
      className={cn(
        'grid gap-3 sm:grid-cols-2 xl:grid-cols-[repeat(var(--metric-count),minmax(0,1fr))]',
        className,
      )}
      style={{ '--metric-count': items.length } as CSSProperties}
      aria-label="Indicateurs"
    >
      {items.map((item) => (
        <div
          key={item.label}
          className="min-w-0 rounded-[var(--radius-card)] border border-white/95 bg-[var(--surface-card)] p-4 shadow-card motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-1 motion-safe:duration-300"
        >
          {isLoading ? (
            <>
              <div className="flex items-center justify-between gap-3">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="size-3.5" />
              </div>
              <Skeleton className="mt-2.5 h-7 w-20" />
              <Skeleton className="mt-1 h-3.5 w-32" />
            </>
          ) : (
            <>
              <div className="flex items-center justify-between gap-3">
                <p className="truncate text-[12px] font-semibold text-[var(--ink-3)]">
                  {item.label}
                </p>
                <item.icon
                  aria-hidden="true"
                  className="size-3.5 shrink-0 text-[var(--ink-3)] [&_*]:stroke-current"
                />
              </div>
              <div className="mt-2.5 text-[26px] font-display leading-none text-[var(--ink)]">
                {item.value}
              </div>
              <p className="mt-1.5 truncate text-[11.5px] text-[var(--ink-2)]">
                {item.detail}
              </p>
            </>
          )}
        </div>
      ))}
    </section>
  );
}

export type { MetricStripItem };
export { MetricStrip };
