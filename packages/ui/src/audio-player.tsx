import { Pause, Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { formatDuration } from './audio-recorder';
import { Button } from './button';
import { Slider } from './slider';
import { cn } from './utils';

/**
 * Plays an audio file with the shared controls: play or pause, a seek bar,
 * and the elapsed and total time. The server must answer Range requests so
 * seeking works. `durationMs` covers formats whose length the browser cannot
 * read up front (WebM from MediaRecorder reports Infinity).
 */
export function AudioPlayer({
  src,
  durationMs,
  className,
}: {
  src: string;
  durationMs?: number | null;
  className?: string;
}) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentMs, setCurrentMs] = useState(0);
  const [mediaMs, setMediaMs] = useState<number | null>(null);
  const [failed, setFailed] = useState(false);
  const totalMs = mediaMs ?? durationMs ?? 0;

  useEffect(() => {
    const element = audio.current;
    if (!element) return;
    const update = () => setCurrentMs(element.currentTime * 1000);
    const loaded = () => {
      if (Number.isFinite(element.duration))
        setMediaMs(element.duration * 1000);
    };
    const play = () => setPlaying(true);
    const pause = () => setPlaying(false);
    const error = () => setFailed(true);
    element.addEventListener('timeupdate', update);
    element.addEventListener('loadedmetadata', loaded);
    element.addEventListener('durationchange', loaded);
    element.addEventListener('play', play);
    element.addEventListener('pause', pause);
    element.addEventListener('ended', pause);
    element.addEventListener('error', error);
    return () => {
      element.removeEventListener('timeupdate', update);
      element.removeEventListener('loadedmetadata', loaded);
      element.removeEventListener('durationchange', loaded);
      element.removeEventListener('play', play);
      element.removeEventListener('pause', pause);
      element.removeEventListener('ended', pause);
      element.removeEventListener('error', error);
    };
  }, []);

  return (
    <div
      data-slot="audio-player"
      className={cn('flex min-w-0 items-center gap-3', className)}
    >
      {/* biome-ignore lint/a11y/useMediaCaption: field recordings have no captions; the transcript sits beside the player. */}
      <audio ref={audio} src={src} preload="metadata" />
      <Button
        type="button"
        size="icon"
        onClick={() => {
          const element = audio.current;
          if (!element) return;
          if (element.paused) void element.play().catch(() => setFailed(true));
          else element.pause();
        }}
        disabled={failed}
        aria-label={playing ? 'Mettre en pause' : 'Écouter'}
      >
        {playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
      </Button>
      <div className="grid min-w-0 flex-1 gap-1.5">
        <Slider
          value={[Math.min(currentMs, totalMs || currentMs)]}
          max={Math.max(totalMs, 1)}
          step={100}
          disabled={failed || totalMs === 0}
          aria-label="Position de lecture"
          onValueChange={([value]) => {
            const element = audio.current;
            if (!element || value === undefined) return;
            element.currentTime = value / 1000;
            setCurrentMs(value);
          }}
        />
        <div className="flex justify-between font-mono text-[11.5px] tabular-nums text-[var(--ink-3)]">
          <span>{formatDuration(currentMs)}</span>
          <span>{failed ? 'Lecture impossible' : formatDuration(totalMs)}</span>
        </div>
      </div>
    </div>
  );
}
