'use client';

import { CalendarDays } from 'lucide-react';
import { type ComponentProps, useState } from 'react';
import { Button } from './button';
import { Calendar } from './calendar';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';
import { cn } from './utils';

const hours = Array.from({ length: 24 }, (_, hour) =>
  String(hour).padStart(2, '0'),
);
const minutes = Array.from({ length: 60 }, (_, minute) =>
  String(minute).padStart(2, '0'),
);

function parseInstant(value: string | null | undefined) {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

type DateTimePickerProps = {
  value?: string | null;
  onValueChange: (value: string | null) => void;
  placeholder?: string;
} & Omit<
  ComponentProps<typeof Button>,
  'value' | 'onChange' | 'children' | 'type'
>;

export function DateTimePicker({
  value,
  onValueChange,
  placeholder = 'Choisir une date et une heure',
  className,
  disabled,
  ...triggerProps
}: DateTimePickerProps) {
  const [open, setOpen] = useState(false);
  const selected = parseInstant(value);
  const [draft, setDraft] = useState(() => selected ?? new Date());
  const label = selected
    ? new Intl.DateTimeFormat('fr-FR', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(selected)
    : placeholder;

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        if (next) {
          const initial = new Date(selected ?? new Date());
          initial.setSeconds(0, 0);
          setDraft(initial);
        }
        setOpen(next);
      }}
    >
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
          selected={draft}
          defaultMonth={draft}
          onSelect={(date) => {
            if (!date) return;
            setDraft((current) => {
              const next = new Date(current);
              next.setFullYear(
                date.getFullYear(),
                date.getMonth(),
                date.getDate(),
              );
              return next;
            });
          }}
        />
        <div className="mt-1 flex items-center gap-2 border-t border-[var(--charcoal-a07)] px-1 py-3">
          <span className="mr-auto text-[12px] font-bold text-[var(--ink-2)]">
            Heure
          </span>
          <Select
            value={String(draft.getHours()).padStart(2, '0')}
            onValueChange={(value) =>
              setDraft((current) => {
                const next = new Date(current);
                next.setHours(Number(value));
                return next;
              })
            }
          >
            <SelectTrigger aria-label="Heure" className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {hours.map((hour) => (
                <SelectItem key={hour} value={hour}>
                  {hour}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span aria-hidden="true" className="font-bold text-[var(--ink-3)]">
            :
          </span>
          <Select
            value={String(draft.getMinutes()).padStart(2, '0')}
            onValueChange={(value) =>
              setDraft((current) => {
                const next = new Date(current);
                next.setMinutes(Number(value));
                return next;
              })
            }
          >
            <SelectTrigger aria-label="Minutes" className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {minutes.map((minute) => (
                <SelectItem key={minute} value={minute}>
                  {minute}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end gap-2 px-1 pt-1">
          {selected && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                onValueChange(null);
                setOpen(false);
              }}
            >
              Effacer
            </Button>
          )}
          <Button
            type="button"
            size="sm"
            onClick={() => {
              onValueChange(draft.toISOString());
              setOpen(false);
            }}
          >
            Appliquer
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
