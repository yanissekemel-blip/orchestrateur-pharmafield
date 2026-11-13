import type { HTMLAttributes } from 'react';
import { cn } from './utils';

export type PriorityLevel = 'low' | 'normal' | 'high';

const filled: Record<PriorityLevel, number> = { low: 1, normal: 2, high: 3 };
const labels: Record<PriorityLevel, string> = {
  low: 'Basse',
  normal: 'Normale',
  high: 'Haute',
};

/** Signal-bar priority with its label; high priority is highlighted. */
export function PriorityIndicator({
  level,
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { level: PriorityLevel }) {
  const count = filled[level];
  return (
    <span
      data-slot="priority-indicator"
      data-level={level}
      className={cn(
        'inline-flex items-center gap-2 text-[13px] font-bold text-[var(--ink)]',
        className,
      )}
      {...props}
    >
      <span aria-hidden="true" className="flex h-3.5 items-end gap-[2px]">
        {[0.45, 0.72, 1].map((height, index) => (
          <span
            key={height}
            className={cn(
              'w-[3px] rounded-[var(--radius-control)] bg-[var(--charcoal-a15)]',
              index < count &&
                (level === 'high'
                  ? 'bg-[var(--warn)]'
                  : 'bg-[var(--charcoal-900)]'),
            )}
            style={{ height: `${height * 100}%` }}
          />
        ))}
      </span>
      {labels[level]}
      <span className="sr-only"> (priorité)</span>
    </span>
  );
}
