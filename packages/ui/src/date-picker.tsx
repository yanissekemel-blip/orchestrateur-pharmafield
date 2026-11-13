'use client';

import { CalendarDays } from 'lucide-react';
import { type ComponentProps, useState } from 'react';
import { Button } from './button';
import { Calendar } from './calendar';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { cn } from './utils';

function parseCalendarDate(value: string | null | undefined) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const [year = 0, month = 0, day = 0] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day, 12);
  return date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
    ? date
    : undefined;
}

function formatCalendarDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

type DatePickerProps = {
  value?: string | null;
  onValueChange: (value: string | null) => void;
  placeholder?: string;
} & Omit<
  ComponentProps<typeof Button>,
  'value' | 'onChange' | 'children' | 'type'
>;

export function DatePicker({
  value,
  onValueChange,
  placeholder = 'Choisir une date',
  className,
  disabled,
  ...triggerProps
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const selected = parseCalendarDate(value);
  const label = selected
    ? new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' }).format(selected)
    : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            'w-full justify-start gap-2 text-left rounded-[var(--radius-input)] border-[var(--charcoal-a10)] bg-white px-3 text-[12.5px] normal-case tracking-normal [font-stretch:100%] font-normal text-[var(--ink)] shadow-[var(--shadow-input)] hover:bg-white focus-visible:border-transparent data-[state=open]:border-transparent data-[state=open]:shadow-[var(--focus-ring)] active:scale-100',
            !selected && 'text-[var(--ink-3)]',
            className,
          )}
          {...triggerProps}
        >
          <CalendarDays
            className="size-[15px] text-[var(--ink-3)]"
            aria-hidden="true"
          />
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-2">
        <Calendar
          mode="single"
          selected={selected}
          defaultMonth={selected ?? new Date()}
          onSelect={(date) => {
            onValueChange(date ? formatCalendarDate(date) : null);
            setOpen(false);
          }}
        />
        {selected && (
          <div className="flex justify-end px-1 pt-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                onValueChange(null);
                setOpen(false);
              }}
            >
              Effacer la date
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
