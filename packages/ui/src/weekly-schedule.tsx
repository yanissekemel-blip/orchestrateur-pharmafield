'use client';

import { Copy, Plus } from 'lucide-react';
import {
  type CSSProperties,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
  useRef,
  useState,
} from 'react';
import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { cn } from './utils';
import { CopyDayEditor, RangeEditor } from './weekly-schedule-editors';
import {
  crossesMidnight,
  DAY_MINUTES,
  formatMinutes,
  mergePreview,
  mergeWeeklyRanges,
  nextFreeRange,
  shownEnd,
  toMinutes,
  type WeeklyDay,
  type WeeklyRange,
} from './weekly-schedule-ranges';

export type { WeeklyDay, WeeklyRange } from './weekly-schedule-ranges';

const percent = (minutes: number) => `${(minutes / DAY_MINUTES) * 100}%`;
const ticks = [0, 3, 6, 9, 12, 15, 18, 21, 24];

type Editing =
  | { kind: 'edit'; index: number; part: 'main' | 'tail' }
  | { kind: 'add'; day: number }
  | { kind: 'copy'; day: number }
  | null;

type Edge = 'start' | 'end';

/** A pointer gesture in progress on one day's track. */
type Drag =
  | { kind: 'create'; day: number; anchor: number; current: number }
  | {
      kind: 'resize';
      index: number;
      edge: Edge;
      minute: number;
      min: number;
      max: number;
    };

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

/** The ranges as they look mid-gesture, before merging. */
function applyDrag(ranges: readonly WeeklyRange[], drag: Drag | null) {
  if (!drag) return [...ranges];
  if (drag.kind === 'create') {
    const from = Math.min(drag.anchor, drag.current);
    const to = Math.max(drag.anchor, drag.current);
    if (to === from) return [...ranges];
    return [
      ...ranges,
      { day: drag.day, start: formatMinutes(from), end: formatMinutes(to) },
    ];
  }
  return ranges.map((range, index) =>
    index === drag.index
      ? { ...range, [drag.edge]: formatMinutes(drag.minute) }
      : range,
  );
}

/** How far an edge may move while the range keeps its shape. */
function resizeBounds(range: WeeklyRange, edge: Edge, step: number) {
  const start = toMinutes(range.start);
  const end = toMinutes(range.end);
  if (crossesMidnight(range))
    return edge === 'start'
      ? { min: end + step, max: DAY_MINUTES - step }
      : { min: step, max: start - step };
  const shown = range.end === '00:00' ? DAY_MINUTES : end;
  return edge === 'start'
    ? { min: 0, max: shown - step }
    : { min: start + step, max: DAY_MINUTES };
}

/**
 * Weekly calendar of time ranges, one column per day on a vertical 24-hour
 * axis. Drag on a day to add a range and drag a range's edges to resize it;
 * ranges also open an editor on click, and each column can add a range or copy
 * its ranges to other days. Overlapping or touching ranges merge; overnight
 * ranges continue at the top of the next column.
 */
function WeeklySchedule({
  days,
  ranges,
  onChange,
  readOnly = false,
  step = 15,
  emptyLabel = 'Aucun envoi',
  className,
}: {
  days: readonly WeeklyDay[];
  ranges: readonly WeeklyRange[];
  onChange: (ranges: WeeklyRange[]) => void;
  readOnly?: boolean;
  step?: number;
  emptyLabel?: string;
  className?: string;
}) {
  const [editing, setEditing] = useState<Editing>(null);
  const [drag, setDrag] = useState<Drag | null>(null);
  const track = useRef<HTMLElement | null>(null);
  const shown = applyDrag(ranges, drag);
  const dayLabel = (value: number) =>
    days.find((day) => day.value === value)?.label ?? String(value);
  const nextDayOf = (value: number) => {
    const index = days.findIndex((day) => day.value === value);
    return days[(index + 1) % days.length]?.value ?? value;
  };
  const minuteAt = (clientY: number) => {
    const rect = track.current?.getBoundingClientRect();
    if (!rect?.height) return 0;
    const ratio = clamp((clientY - rect.top) / rect.height, 0, 1);
    return Math.round((ratio * DAY_MINUTES) / step) * step;
  };
  const startCreate = (event: ReactPointerEvent<HTMLElement>, day: number) => {
    if (readOnly || event.button !== 0) return;
    const target = event.target as HTMLElement;
    // Popover content is portalled but still bubbles through React; only
    // presses physically on the track, outside a range, start a drag.
    if (!event.currentTarget.contains(target)) return;
    if (target.closest('[data-range]')) return;
    track.current = event.currentTarget;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    const minute = minuteAt(event.clientY);
    setEditing(null);
    setDrag({ kind: 'create', day, anchor: minute, current: minute });
  };
  const startResize = (
    event: ReactPointerEvent<HTMLElement>,
    index: number,
    edge: Edge,
  ) => {
    const range = ranges[index];
    if (readOnly || event.button !== 0 || !range) return;
    event.stopPropagation();
    track.current = event.currentTarget.closest('fieldset');
    event.currentTarget.setPointerCapture?.(event.pointerId);
    const bounds = resizeBounds(range, edge, step);
    setEditing(null);
    setDrag({
      kind: 'resize',
      index,
      edge,
      minute: toMinutes(range[edge]) || (edge === 'end' ? DAY_MINUTES : 0),
      ...bounds,
    });
  };
  const moveDrag = (event: ReactPointerEvent<HTMLElement>) => {
    if (!drag) return;
    const minute = minuteAt(event.clientY);
    setDrag((current) =>
      current?.kind === 'create'
        ? { ...current, current: minute }
        : current?.kind === 'resize'
          ? { ...current, minute: clamp(minute, current.min, current.max) }
          : current,
    );
  };
  const endDrag = () => {
    if (!drag) return;
    const next = applyDrag(ranges, drag);
    setDrag(null);
    const changed =
      drag.kind === 'create'
        ? next.length > ranges.length
        : next[drag.index]?.[drag.edge] !== ranges[drag.index]?.[drag.edge];
    if (changed) commit(next);
  };
  return (
    <div
      className={cn(
        'grid min-w-0 grid-cols-[28px_repeat(var(--days),minmax(0,1fr))] grid-rows-[auto_minmax(420px,1fr)] gap-x-1 gap-y-2 sm:grid-cols-[36px_repeat(var(--days),minmax(0,1fr))] sm:gap-x-2',
        className,
      )}
      style={{ '--days': days.length } as CSSProperties}
    >
      <span aria-hidden="true" />
      {days.map((day) => (
        <div
          key={day.value}
          className="flex min-w-0 items-center justify-between gap-1 max-sm:flex-col max-sm:justify-end"
        >
          <span className="truncate text-[12.5px] font-bold text-[var(--ink)]">
            <span className="lg:hidden">{day.short}</span>
            <span className="max-lg:hidden">{day.label}</span>
          </span>
          {readOnly ? null : (
            <div className="flex shrink-0 items-center gap-0.5 max-sm:flex-col">
              <Popover
                open={editing?.kind === 'add' && editing.day === day.value}
                onOpenChange={(open) =>
                  setEditing(open ? { kind: 'add', day: day.value } : null)
                }
              >
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Ajouter une plage le ${day.label}`}
                  >
                    <Plus aria-hidden="true" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-[300px]">
                  <RangeEditor
                    title={`Nouvelle plage le ${day.label}`}
                    initial={nextFreeRange(ranges, day.value)}
                    step={step}
                    onDone={(next) => commit([...ranges, next])}
                  />
                </PopoverContent>
              </Popover>
              <Popover
                open={editing?.kind === 'copy' && editing.day === day.value}
                onOpenChange={(open) =>
                  setEditing(open ? { kind: 'copy', day: day.value } : null)
                }
              >
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Copier ${day.label} vers d’autres jours`}
                  >
                    <Copy aria-hidden="true" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-[260px]">
                  <CopyDayEditor
                    source={day}
                    days={days}
                    onCopy={(targets) => {
                      const copied = ranges.filter(
                        (range) => range.day === day.value,
                      );
                      commit([
                        ...ranges.filter(
                          (range) => !targets.includes(range.day),
                        ),
                        ...targets.flatMap((target) =>
                          copied.map((range) => ({ ...range, day: target })),
                        ),
                      ]);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
      ))}
      <div aria-hidden="true" className="relative">
        {ticks.map((tick) => (
          <span
            key={tick}
            className={cn(
              'absolute right-0 -translate-y-1/2 font-mono text-[10.5px] text-[var(--ink-3)] first:translate-y-0 last:-translate-y-full',
              tick % 6 !== 0 && 'max-sm:hidden',
            )}
            style={{ top: percent(tick * 60) }}
          >
            {String(tick).padStart(2, '0')}
          </span>
        ))}
      </div>
      {days.map((day) => {
        const own = shown
          .map((range, index) => ({ range, index }))
          .filter(({ range }) => range.day === day.value);
        const previous =
          days[(days.indexOf(day) + days.length - 1) % days.length];
        const tails = shown
          .map((range, index) => ({ range, index }))
          .filter(
            ({ range }) =>
              range.day === previous?.value && crossesMidnight(range),
          );
        const merge = drag
          ? mergePreview(
              [
                ...tails.map(({ range, index }) => ({
                  index,
                  start: 0,
                  end: toMinutes(range.end),
                })),
                ...own.map(({ range, index }) => ({
                  index,
                  start: toMinutes(range.start),
                  end:
                    crossesMidnight(range) || range.end === '00:00'
                      ? DAY_MINUTES
                      : toMinutes(range.end),
                })),
              ],
              drag.kind === 'create' ? ranges.length : drag.index,
            )
          : null;
        const editor = (index: number, range: WeeklyRange, title: string) => (
          <RangeEditor
            title={title}
            initial={range}
            step={step}
            onDone={(next) => {
              const all = [...ranges];
              all[index] = next;
              commit(all);
            }}
            onRemove={() => commit(ranges.filter((_, item) => item !== index))}
          />
        );
        return (
          <fieldset
            key={day.value}
            aria-label={`Plages du ${day.label}`}
            className={cn(
              '@container relative min-w-0 rounded-[var(--radius-md)]',
              day.weekend
                ? 'bg-[var(--charcoal-a10)]'
                : 'bg-[var(--charcoal-a05)]',
              !readOnly && 'cursor-crosshair touch-pan-x select-none',
            )}
            onPointerDown={(event) => startCreate(event, day.value)}
            onPointerMove={moveDrag}
            onPointerUp={endDrag}
            onPointerCancel={() => setDrag(null)}
          >
            {ticks.slice(1, -1).map((tick) => (
              <span
                key={tick}
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-1.5 h-px bg-[var(--charcoal-a07)]"
                style={{ top: percent(tick * 60) }}
              />
            ))}
            {own.length === 0 && tails.length === 0 ? (
              <span className="pointer-events-none absolute inset-0 grid place-items-center px-1 text-center text-[11.5px] text-[var(--ink-3)] max-sm:hidden">
                {emptyLabel}
              </span>
            ) : null}
            {merge ? (
              <span
                aria-hidden="true"
                data-slot="weekly-range-merge"
                className="pointer-events-none absolute inset-x-1 overflow-hidden rounded-[var(--radius-md)] border border-[var(--charcoal-a25)] bg-white px-1 font-mono text-[11px] font-bold text-[var(--ink)] shadow-[var(--shadow-input)]"
                style={{
                  top: percent(merge.start),
                  height: percent(merge.end - merge.start),
                }}
              >
                <RangeLabel
                  label={`${formatMinutes(merge.start)}–${shownEnd(formatMinutes(merge.end))}`}
                />
              </span>
            ) : null}
            {tails.map(({ range, index }) => (
              <RangeBlock
                key={`tail-${index}`}
                tail
                merging={merge?.indexes.has(index) ?? false}
                label={previous?.short ?? ''}
                accessibleLabel={`${dayLabel(range.day)} de ${range.start} à ${range.end}, se poursuit après minuit`}
                start={0}
                end={toMinutes(range.end)}
                readOnly={readOnly}
                dragging={drag?.kind === 'resize' && drag.index === index}
                onResizeEnd={(event) => startResize(event, index, 'end')}
                open={
                  editing?.kind === 'edit' &&
                  editing.index === index &&
                  editing.part === 'tail'
                }
                onOpenChange={(open) =>
                  setEditing(
                    open ? { kind: 'edit', index, part: 'tail' } : null,
                  )
                }
              >
                {editor(index, range, `Plage du ${dayLabel(range.day)}`)}
              </RangeBlock>
            ))}
            {own.map(({ range, index }) => {
              const overnight = crossesMidnight(range);
              return (
                <RangeBlock
                  key={`range-${index}`}
                  merging={merge?.indexes.has(index) ?? false}
                  label={`${range.start}–${shownEnd(range.end)}`}
                  accessibleLabel={`${day.label} de ${range.start} à ${shownEnd(range.end)}${overnight ? `, se poursuit jusqu’au ${dayLabel(nextDayOf(day.value))}` : ''}`}
                  start={toMinutes(range.start)}
                  end={
                    overnight || range.end === '00:00'
                      ? DAY_MINUTES
                      : toMinutes(range.end)
                  }
                  readOnly={readOnly || index >= ranges.length}
                  dragging={
                    (drag?.kind === 'resize' && drag.index === index) ||
                    index >= ranges.length
                  }
                  onResizeStart={(event) => startResize(event, index, 'start')}
                  onResizeEnd={
                    overnight
                      ? undefined
                      : (event) => startResize(event, index, 'end')
                  }
                  open={
                    editing?.kind === 'edit' &&
                    editing.index === index &&
                    editing.part === 'main'
                  }
                  onOpenChange={(open) =>
                    setEditing(
                      open ? { kind: 'edit', index, part: 'main' } : null,
                    )
                  }
                >
                  {editor(index, range, `Plage du ${day.label}`)}
                </RangeBlock>
              );
            })}
          </fieldset>
        );
      })}
    </div>
  );

  /** Applies an edit, merging overlapping and touching ranges. */
  function commit(next: WeeklyRange[]) {
    onChange(mergeWeeklyRanges(next, days));
    setEditing(null);
  }
}

function ResizeHandle({
  edge,
  active,
  onPointerDown,
}: {
  edge: Edge;
  active: boolean;
  onPointerDown: (event: ReactPointerEvent<HTMLElement>) => void;
}) {
  return (
    <span
      aria-hidden="true"
      data-range-handle={edge}
      className={cn(
        'absolute inset-x-0 z-10 h-4 cursor-ns-resize touch-none',
        edge === 'start' ? '-top-1' : '-bottom-1',
      )}
      onPointerDown={onPointerDown}
    >
      <span
        className={cn(
          'absolute left-1/2 h-[3px] w-6 max-w-[50%] -translate-x-1/2 rounded-[var(--radius-control)] bg-[var(--charcoal-a25)] opacity-0 group-hover/range:opacity-100 [@media(hover:none)]:opacity-100',
          edge === 'start' ? 'top-[9px]' : 'bottom-[9px]',
          active && 'opacity-100',
        )}
      />
    </span>
  );
}

function RangeLabel({ label }: { label: string }) {
  const [from, to] = label.split('–');
  return (
    <span className="flex h-full flex-wrap content-center items-center justify-center overflow-hidden whitespace-nowrap leading-[16px] @max-[44px]:sr-only">
      <span>{from}</span>
      {to ? <span>–{to}</span> : null}
    </span>
  );
}

function RangeBlock({
  label,
  accessibleLabel,
  start,
  end,
  tail = false,
  merging = false,
  readOnly,
  dragging,
  onResizeStart,
  onResizeEnd,
  open,
  onOpenChange,
  children,
}: {
  label: string;
  accessibleLabel: string;
  start: number;
  end: number;
  tail?: boolean;
  /** Fuses into the merge preview drawn behind it while a drag overlaps it. */
  merging?: boolean;
  readOnly: boolean;
  dragging: boolean;
  onResizeStart?: (event: ReactPointerEvent<HTMLElement>) => void;
  onResizeEnd?: (event: ReactPointerEvent<HTMLElement>) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}) {
  const className = cn(
    'absolute inset-0 overflow-hidden rounded-[var(--radius-md)] border border-[var(--charcoal-a10)] bg-white px-1 font-mono text-[11px] font-bold text-[var(--ink)] shadow-[var(--shadow-input)]',
    tail &&
      'bg-[repeating-linear-gradient(135deg,var(--charcoal-a05)_0_6px,white_6px_12px)] text-[var(--ink-2)]',
    dragging && 'border-[var(--charcoal-a25)]',
    merging &&
      'border-transparent bg-none bg-transparent text-transparent shadow-none hover:bg-transparent',
  );
  const text = <RangeLabel label={label} />;
  return (
    <div
      data-range
      className="group/range absolute inset-x-1 min-h-2"
      style={{ top: percent(start), height: percent(end - start) }}
    >
      {readOnly ? (
        <span data-range-surface className={className} title={accessibleLabel}>
          <span className="sr-only">{accessibleLabel}</span>
          <span aria-hidden="true">{text}</span>
        </span>
      ) : (
        <Popover open={open} onOpenChange={onOpenChange}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              aria-label={`${accessibleLabel}. Modifier la plage`}
              title={accessibleLabel}
              className={cn(
                className,
                'block h-auto cursor-pointer rounded-[var(--radius-md)] p-0 px-1 hover:bg-[var(--grey-50)] data-[state=open]:border-[var(--accent)] data-[state=open]:shadow-[var(--focus-ring)]',
              )}
            >
              {text}
            </Button>
          </PopoverTrigger>
          <PopoverContent side="right" align="start" className="w-[300px]">
            {children}
          </PopoverContent>
        </Popover>
      )}
      {!readOnly && onResizeStart ? (
        <ResizeHandle
          edge="start"
          active={dragging}
          onPointerDown={onResizeStart}
        />
      ) : null}
      {!readOnly && onResizeEnd ? (
        <ResizeHandle
          edge="end"
          active={dragging}
          onPointerDown={onResizeEnd}
        />
      ) : null}
    </div>
  );
}

export { WeeklySchedule };
