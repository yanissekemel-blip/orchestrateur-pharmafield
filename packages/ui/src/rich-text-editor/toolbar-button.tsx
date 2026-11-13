import { Separator } from '../separator';
import { Toggle } from '../toggle';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../tooltip';

export function ToolbarButton({
  pressed,
  onPressedChange,
  disabled,
  label,
  children,
}: {
  pressed?: boolean;
  onPressedChange: () => void;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Toggle
            size="sm"
            pressed={pressed}
            onPressedChange={onPressedChange}
            disabled={disabled}
            aria-label={label}
            className="size-7 rounded-[var(--radius-control)] p-0 hover:bg-white/70 data-[state=on]:bg-white data-[state=on]:text-[var(--ink)] data-[state=on]:shadow-[var(--shadow-raised)] data-[state=on]:hover:bg-white"
          >
            {children}
          </Toggle>
        </TooltipTrigger>
        <TooltipContent side="bottom">{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function ToolbarSeparator() {
  return (
    <Separator
      orientation="vertical"
      className="mx-1 h-4 bg-[var(--charcoal-a10)]"
    />
  );
}
