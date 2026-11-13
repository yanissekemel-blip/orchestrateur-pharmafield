import { Calendar } from '@orchestrateur-pharmafield/ui/calendar';
import { DatePicker } from '@orchestrateur-pharmafield/ui/date-picker';
import { DateTimePicker } from '@orchestrateur-pharmafield/ui/date-time-picker';
import { RangeCalendarWithPresets } from '@orchestrateur-pharmafield/ui/range-calendar-with-presets';
import type {
  RangeCalendarPreset,
  StrictDateRange,
} from '@orchestrateur-pharmafield/ui/range-calendar-with-presets.types';
import { useState } from 'react';

export function CalendarPreview() {
  const [selected, setSelected] = useState<Date | undefined>(
    new Date(2025, 5, 12),
  );
  return (
    <Calendar
      mode="single"
      defaultMonth={new Date(2025, 5, 1)}
      selected={selected}
      onSelect={setSelected}
      aria-label="Choisir une date en juin 2025"
    />
  );
}

export function DatePickerPreview() {
  const [value, setValue] = useState<string | null>('2025-06-12');
  return (
    <div className="w-56">
      <DatePicker
        aria-label="Choisir une date d’exemple"
        value={value}
        onValueChange={setValue}
      />
    </div>
  );
}

export function DateTimePickerPreview() {
  const [value, setValue] = useState<string | null>('2025-06-12T14:30:00.000Z');
  return (
    <div className="w-64">
      <DateTimePicker
        aria-label="Choisir une date et une heure d’exemple"
        value={value}
        onValueChange={setValue}
      />
    </div>
  );
}

const catalogPresets: RangeCalendarPreset[] = [
  {
    id: 'first-week',
    label: 'Première semaine de juin',
    getRange: () => ({ from: new Date(2025, 5, 1), to: new Date(2025, 5, 7) }),
  },
  {
    id: 'second-week',
    label: 'Deuxième semaine de juin',
    getRange: () => ({ from: new Date(2025, 5, 8), to: new Date(2025, 5, 14) }),
  },
];

export function RangeCalendarPreview() {
  const [range, setRange] = useState<StrictDateRange>({
    from: new Date(2025, 5, 1),
    to: new Date(2025, 5, 7),
  });
  const [preset, setPreset] = useState<string | null>('first-week');
  return (
    <RangeCalendarWithPresets
      value={range}
      activePresetId={preset}
      presets={catalogPresets}
      numberOfMonths={1}
      align="start"
      onApply={(next, id) => {
        setRange(next);
        setPreset(id);
      }}
    />
  );
}
