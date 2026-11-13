import { useId, useState } from 'react';
import { Button } from './button';
import { Checkbox } from './checkbox';
import { Label } from './label';
import { TimeSelect } from './time-select';
import {
  crossesMidnight,
  type WeeklyDay,
  type WeeklyRange,
} from './weekly-schedule-ranges';

export function RangeEditor({
  title,
  initial,
  step,
  onDone,
  onRemove,
}: {
  title: string;
  initial: WeeklyRange;
  step: number;
  onDone: (range: WeeklyRange) => void;
  onRemove?: () => void;
}) {
  const [draft, setDraft] = useState(initial);
  const id = useId();
  // `00:00–00:00` is a whole day; any other equal pair is empty.
  const empty = draft.start === draft.end && draft.start !== '00:00';
  return (
    <div className="grid gap-3">
      <p className="text-[13px] font-extrabold text-[var(--ink)]">{title}</p>
      <div className="grid grid-cols-2 gap-2">
        <div className="grid gap-1">
          <Label htmlFor={`${id}-from`}>De</Label>
          <TimeSelect
            id={`${id}-from`}
            value={draft.start}
            step={step}
            onValueChange={(start) =>
              setDraft((current) => ({ ...current, start }))
            }
          />
        </div>
        <div className="grid gap-1">
          <Label htmlFor={`${id}-to`}>À</Label>
          <TimeSelect
            id={`${id}-to`}
            value={draft.end}
            step={step}
            aria-invalid={empty || undefined}
            onValueChange={(end) =>
              setDraft((current) => ({ ...current, end }))
            }
          />
        </div>
      </div>
      {empty ? (
        <p className="text-[11.5px] font-semibold text-[var(--bad)]">
          La fin doit être différente du début.
        </p>
      ) : crossesMidnight(draft) ? (
        <p className="text-[11.5px] text-[var(--ink-2)]">
          Se poursuit après minuit sur le jour suivant.
        </p>
      ) : null}
      <div className="flex items-center justify-between gap-2">
        {onRemove ? (
          <Button
            type="button"
            variant="discrete"
            size="sm"
            className="text-[var(--bad)]"
            onClick={onRemove}
          >
            Supprimer
          </Button>
        ) : (
          <span />
        )}
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={empty}
          onClick={() => onDone(draft)}
        >
          Terminé
        </Button>
      </div>
    </div>
  );
}

export function CopyDayEditor({
  source,
  days,
  onCopy,
}: {
  source: WeeklyDay;
  days: readonly WeeklyDay[];
  onCopy: (targets: number[]) => void;
}) {
  const [targets, setTargets] = useState<number[]>([]);
  const id = useId();
  return (
    <div className="grid gap-3">
      <p className="text-[13px] font-extrabold text-[var(--ink)]">
        Copier {source.label} vers
      </p>
      <div className="grid gap-2">
        {days
          .filter((day) => day.value !== source.value)
          .map((day) => (
            <div key={day.value} className="flex items-center gap-2">
              <Checkbox
                id={`${id}-${day.value}`}
                checked={targets.includes(day.value)}
                onCheckedChange={(checked) =>
                  setTargets((current) =>
                    checked
                      ? [...current, day.value]
                      : current.filter((value) => value !== day.value),
                  )
                }
              />
              <Label htmlFor={`${id}-${day.value}`} className="font-medium">
                {day.label}
              </Label>
            </div>
          ))}
      </div>
      <p className="text-[11.5px] text-[var(--ink-2)]">
        Remplace les plages des jours choisis.
      </p>
      <div className="flex justify-end">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={targets.length === 0}
          onClick={() => onCopy(targets)}
        >
          Copier
        </Button>
      </div>
    </div>
  );
}
