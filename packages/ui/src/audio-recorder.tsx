import { Mic, Pause, Play, Square } from 'lucide-react';
import { Button } from './button';
import { cn } from './utils';

export type AudioRecorderState = 'idle' | 'recording' | 'paused';

const BARS = 24;

/** « 03:27 », or « 1:03:27 » past an hour. */
export function formatDuration(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const pad = (value: number) => String(value).padStart(2, '0');
  return hours > 0
    ? `${hours}:${pad(minutes)}:${pad(seconds)}`
    : `${pad(minutes)}:${pad(seconds)}`;
}

/**
 * The recording controls: a large record button, the elapsed time, and a
 * live level meter. It only displays state; the app supplies the recorder
 * (the browser's MediaRecorder or the native plugin) through the callbacks.
 */
export function AudioRecorder({
  state,
  elapsedMs,
  levels,
  disabled = false,
  onStart,
  onPause,
  onResume,
  onStop,
  className,
}: {
  state: AudioRecorderState;
  elapsedMs: number;
  /** Recent input levels from 0 to 1, oldest first. */
  levels: readonly number[];
  disabled?: boolean;
  onStart: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onStop: () => void;
  className?: string;
}) {
  const recent = levels.slice(-BARS);
  const bars = [
    ...Array<number>(Math.max(0, BARS - recent.length)).fill(0),
    ...recent,
  ];
  return (
    <div
      data-slot="audio-recorder"
      data-state={state}
      className={cn('grid justify-items-center gap-5 py-2', className)}
    >
      <div
        className="flex h-12 w-full max-w-72 items-center justify-center gap-[3px]"
        aria-hidden="true"
      >
        {bars.map((level, index) => (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: bars are positional.
            key={index}
            data-slot="audio-recorder-bar"
            className="w-1.5 rounded-[2px] bg-[var(--charcoal-900)]"
            style={{
              height: `${Math.max(8, Math.round(level * 100))}%`,
              opacity: state === 'recording' ? 0.35 + level * 0.65 : 0.18,
            }}
          />
        ))}
      </div>
      <p
        className="font-mono text-[32px] leading-none font-semibold tabular-nums text-[var(--ink)]"
        role="timer"
        aria-label={`Durée enregistrée : ${formatDuration(elapsedMs)}`}
      >
        {formatDuration(elapsedMs)}
      </p>
      <div className="flex items-center justify-center gap-3">
        {state === 'idle' ? (
          <Button
            type="button"
            size="icon-lg"
            className="size-16 [&_svg:not([class*='size-'])]:size-7"
            onClick={onStart}
            disabled={disabled}
            aria-label="Commencer l’enregistrement"
          >
            <Mic aria-hidden="true" />
          </Button>
        ) : (
          <>
            {onPause && onResume ? (
              <Button
                type="button"
                variant="secondary"
                size="icon-lg"
                className="size-14 [&_svg:not([class*='size-'])]:size-6"
                onClick={state === 'recording' ? onPause : onResume}
                disabled={disabled}
                aria-label={
                  state === 'recording'
                    ? 'Mettre en pause'
                    : 'Reprendre l’enregistrement'
                }
              >
                {state === 'recording' ? (
                  <Pause aria-hidden="true" />
                ) : (
                  <Play aria-hidden="true" />
                )}
              </Button>
            ) : null}
            <Button
              type="button"
              size="icon-lg"
              className="size-16 [&_svg:not([class*='size-'])]:size-6"
              onClick={onStop}
              disabled={disabled}
              aria-label="Arrêter l’enregistrement"
            >
              <Square aria-hidden="true" fill="currentColor" />
            </Button>
          </>
        )}
      </div>
      <p className="text-[12.5px] text-[var(--ink-3)]" aria-live="polite">
        {state === 'idle'
          ? 'Appuyez pour commencer'
          : state === 'recording'
            ? 'Enregistrement en cours'
            : 'En pause'}
      </p>
    </div>
  );
}
