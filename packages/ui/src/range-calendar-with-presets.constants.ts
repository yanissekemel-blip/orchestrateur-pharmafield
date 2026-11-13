import type {
  RangeCalendarPreset,
  StrictDateRange,
} from './range-calendar-with-presets.types';

function addLocalDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function previousQuarterRange(today: Date): StrictDateRange {
  const currentQuarterStartMonth = Math.floor(today.getMonth() / 3) * 3;
  const previousQuarterStartMonth = currentQuarterStartMonth - 3;
  const from = new Date(today.getFullYear(), previousQuarterStartMonth, 1);
  const to = new Date(today.getFullYear(), currentQuarterStartMonth, 0);

  return { from, to };
}

function createLastDaysPreset(
  days: number,
  label: string,
): RangeCalendarPreset {
  return {
    id: `last-${days}-days`,
    label,
    getRange: (today) => ({
      from: addLocalDays(today, -(days - 1)),
      to: today,
    }),
  };
}

export const defaultRangeCalendarPresets: RangeCalendarPreset[] = [
  createLastDaysPreset(7, '7 derniers jours'),
  createLastDaysPreset(30, '30 derniers jours'),
  createLastDaysPreset(90, '90 derniers jours'),
  {
    id: 'this-month',
    label: 'Ce mois-ci',
    getRange: (today) => ({ from: startOfMonth(today), to: today }),
  },
  {
    id: 'last-month',
    label: 'Le mois dernier',
    getRange: (today) => {
      const previousMonth = new Date(
        today.getFullYear(),
        today.getMonth() - 1,
        1,
      );
      return {
        from: startOfMonth(previousMonth),
        to: endOfMonth(previousMonth),
      };
    },
  },
  {
    id: 'last-quarter',
    label: 'Le trimestre dernier',
    getRange: previousQuarterRange,
  },
  {
    id: 'this-year',
    label: 'Cette année',
    getRange: (today) => ({
      from: new Date(today.getFullYear(), 0, 1),
      to: today,
    }),
  },
  {
    id: 'last-year',
    label: 'L’année dernière',
    getRange: (today) => ({
      from: new Date(today.getFullYear() - 1, 0, 1),
      to: new Date(today.getFullYear() - 1, 11, 31),
    }),
  },
];
