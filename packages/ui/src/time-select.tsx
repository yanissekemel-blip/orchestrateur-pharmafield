'use client';

import { Clock3 } from 'lucide-react';
import { useMemo } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';
import { cn } from './utils';

/** Times of day as `HH:mm`, every `step` minutes from 00:00. */
function timeOptions(step: number) {
  const options: string[] = [];
  for (let minute = 0; minute < 1440; minute += step) {
    const hours = String(Math.floor(minute / 60)).padStart(2, '0');
    const minutes = String(minute % 60).padStart(2, '0');
    options.push(`${hours}:${minutes}`);
  }
  return options;
}

/**
 * Picks a wall-clock time of day (`HH:mm`, no zone). Values off the step grid
 * stay selectable so stored times are never rewritten silently.
 */
function TimeSelect({
  value,
  onValueChange,
  step = 15,
  disabled,
  className,
  id,
  'aria-label': ariaLabel,
  'aria-invalid': ariaInvalid,
}: {
  value: string;
  onValueChange: (value: string) => void;
  /** Minutes between options. */
  step?: number;
  disabled?: boolean;
  className?: string;
  id?: string;
  'aria-label'?: string;
  'aria-invalid'?: boolean;
}) {
  const options = useMemo(() => {
    const list = timeOptions(step);
    return list.includes(value) || !value ? list : [...list, value].sort();
  }, [step, value]);
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger
        id={id}
        aria-label={ariaLabel}
        aria-invalid={ariaInvalid}
        className={cn(
          'w-full justify-start font-mono tabular-nums [&>svg:last-child]:ml-auto',
          className,
        )}
      >
        <Clock3 aria-hidden="true" />
        <SelectValue placeholder="--:--" />
      </SelectTrigger>
      <SelectContent className="max-h-64">
        {options.map((option) => (
          <SelectItem key={option} value={option} className="font-mono">
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export { TimeSelect };
