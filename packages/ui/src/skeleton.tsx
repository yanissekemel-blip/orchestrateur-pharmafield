import { cn } from './utils';

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        'rounded-[var(--radius-md)] bg-[var(--charcoal-a06)]',
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
