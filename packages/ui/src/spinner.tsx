import { cn } from './utils';

function Spinner({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      role="status"
      aria-label="Chargement"
      viewBox="0 0 24 24"
      fill="none"
      className={cn(
        'size-4 animate-spin text-[var(--accent)] motion-reduce:animate-[spin_3s_linear_infinite]',
        className,
      )}
      {...props}
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="var(--charcoal-a10)"
        strokeWidth="2.5"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export { Spinner };
