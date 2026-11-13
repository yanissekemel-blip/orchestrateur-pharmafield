'use client';

import { CalendarIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { DateRange, Matcher } from 'react-day-picker';
import { Button } from './button';
import { Calendar } from './calendar';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { defaultRangeCalendarPresets } from './range-calendar-with-presets.constants';
import type {
  RangeCalendarPreset,
  StrictDateRange,
} from './range-calendar-with-presets.types';
import {
  defaultFormatRangeLabel,
  startOfDay,
  toStrictDateRange,
} from './range-calendar-with-presets.utils';
import { cn } from './utils';

type RangeCalendarWithPresetsProps = {
  value: StrictDateRange;
  onApply: (range: StrictDateRange, presetId: string | null) => void;
  onChange?: (range: DateRange | undefined) => void;
  presets?: RangeCalendarPreset[];
  activePresetId?: string | null;
  disabled?: Matcher | Matcher[];
  triggerLabel?: string;
  formatLabel?: (range: StrictDateRange) => string;
  align?: 'start' | 'center' | 'end';
  className?: string;
  numberOfMonths?: number;
};

export function RangeCalendarWithPresets({
  value,
  onApply,
  onChange,
  presets = defaultRangeCalendarPresets,
  activePresetId,
  disabled,
  triggerLabel,
  formatLabel = defaultFormatRangeLabel,
  align = 'end',
  className,
  numberOfMonths = 2,
}: RangeCalendarWithPresetsProps) {
  const [open, setOpen] = useState(false);
  const [draftRange, setDraftRange] = useState<DateRange | undefined>(value);

  useEffect(() => {
    setDraftRange({ from: value.from, to: value.to });
  }, [value.from, value.to]);

  const label = useMemo(() => {
    if (triggerLabel) return triggerLabel;
    if (activePresetId) {
      const activePreset = presets.find(
        (preset) => preset.id === activePresetId,
      );
      if (activePreset) return activePreset.label;
    }
    return formatLabel(value);
  }, [activePresetId, formatLabel, presets, triggerLabel, value]);

  const hasValidDraftRange = Boolean(draftRange?.from && draftRange.to);

  function selectRange(range: DateRange | undefined) {
    setDraftRange(range);
    onChange?.(range);
  }

  function applyPreset(preset: RangeCalendarPreset) {
    const nextRange = preset.getRange(startOfDay(new Date()));
    setDraftRange(nextRange);
    onApply(nextRange, preset.id);
    setOpen(false);
  }

  function applyManualRange() {
    const nextRange = toStrictDateRange(draftRange);
    if (!nextRange) return;
    onApply(nextRange, null);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            'h-9 min-w-[230px] justify-start gap-2 rounded-[var(--radius-input)] border-[var(--charcoal-a10)] bg-white px-3 text-[12.5px] normal-case tracking-normal [font-stretch:100%] font-semibold text-[var(--ink)] shadow-[var(--shadow-input)] hover:bg-white focus-visible:border-transparent data-[state=open]:border-transparent data-[state=open]:shadow-[var(--focus-ring)] active:scale-100',
            className,
          )}
        >
          <CalendarIcon className="size-[15px] text-[var(--ink-3)]" />
          <span className="truncate">{label}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3" align={align}>
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="grid min-w-[154px] content-start gap-1">
            {presets.map((preset) => (
              <Button
                key={preset.id}
                type="button"
                variant={activePresetId === preset.id ? 'default' : 'ghost'}
                size="sm"
                className="justify-start"
                disabled={preset.disabled}
                onClick={() => applyPreset(preset)}
              >
                {preset.label}
              </Button>
            ))}
          </div>
          <div className="border-t border-[var(--charcoal-a07)] pt-3 lg:border-l lg:border-t-0 lg:pl-3 lg:pt-0">
            <Calendar
              mode="range"
              defaultMonth={draftRange?.from}
              selected={draftRange}
              onSelect={selectRange}
              numberOfMonths={numberOfMonths}
              disabled={disabled}
            />
            <div className="mt-3 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setOpen(false)}
              >
                Annuler
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={!hasValidDraftRange}
                onClick={applyManualRange}
              >
                Appliquer
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
