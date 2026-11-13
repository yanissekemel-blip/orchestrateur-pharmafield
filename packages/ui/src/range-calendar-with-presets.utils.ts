import type { DateRange } from 'react-day-picker';
import { defaultRangeCalendarPresets } from './range-calendar-with-presets.constants';
import type {
  RangeCalendarPreset,
  StrictDateRange,
} from './range-calendar-with-presets.types';

export function startOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

function addLocalDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function getRangeCalendarPresetValue(
  presetId: string,
  presets: RangeCalendarPreset[] = defaultRangeCalendarPresets,
  today: Date = startOfDay(new Date()),
): StrictDateRange {
  const preset =
    presets.find((item) => item.id === presetId) ??
    defaultRangeCalendarPresets.find((item) => item.id === 'last-30-days');

  if (preset) {
    return preset.getRange(startOfDay(today));
  }

  return {
    from: addLocalDays(startOfDay(today), -29),
    to: startOfDay(today),
  };
}

const rangeLabelFormatter = new Intl.DateTimeFormat('fr-FR', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

export function defaultFormatRangeLabel(range: StrictDateRange): string {
  if (Number.isNaN(range.from.getTime()) || Number.isNaN(range.to.getTime())) {
    return 'Sélectionner une période';
  }

  return `${rangeLabelFormatter.format(range.from)} - ${rangeLabelFormatter.format(range.to)}`;
}

export function toStrictDateRange(
  range: DateRange | undefined,
): StrictDateRange | null {
  if (!range?.from || !range.to) return null;
  return { from: range.from, to: range.to };
}
