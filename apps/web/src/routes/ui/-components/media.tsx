import { AudioPlayer } from '@orchestrateur-pharmafield/ui/audio-player';
import {
  AudioRecorder,
  type AudioRecorderState,
} from '@orchestrateur-pharmafield/ui/audio-recorder';
import {
  DocumentSheet,
  SheetInlineText,
  SheetText,
} from '@orchestrateur-pharmafield/ui/document-sheet';
import { LocationMap } from '@orchestrateur-pharmafield/ui/location-map';
import { useEffect, useState } from 'react';
import { webEnv } from '../../../lib/env';
import type { CatalogGroup } from './catalog-types';

/** A simulated recorder: no microphone, just moving levels and a clock. */
function RecorderPreview() {
  const [state, setState] = useState<AudioRecorderState>('idle');
  const [elapsedMs, setElapsedMs] = useState(0);
  const [levels, setLevels] = useState<number[]>([]);
  useEffect(() => {
    if (state !== 'recording') return;
    const timer = window.setInterval(() => {
      setElapsedMs((value) => value + 100);
      setLevels((current) => [
        ...current.slice(-47),
        0.2 + Math.abs(Math.sin(Date.now() / 180)) * 0.6,
      ]);
    }, 100);
    return () => window.clearInterval(timer);
  }, [state]);
  return (
    <AudioRecorder
      state={state}
      elapsedMs={elapsedMs}
      levels={levels}
      onStart={() => {
        setElapsedMs(0);
        setLevels([]);
        setState('recording');
      }}
      onPause={() => setState('paused')}
      onResume={() => setState('recording')}
      onStop={() => setState('idle')}
    />
  );
}

// A short generated tone, so the player works without a server.
function toneUrl(): string {
  const rate = 8_000;
  const samples = rate * 2;
  const buffer = new ArrayBuffer(44 + samples * 2);
  const view = new DataView(buffer);
  const write = (offset: number, text: string) => {
    for (let index = 0; index < text.length; index += 1)
      view.setUint8(offset + index, text.charCodeAt(index));
  };
  write(0, 'RIFF');
  view.setUint32(4, 36 + samples * 2, true);
  write(8, 'WAVEfmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, rate, true);
  view.setUint32(28, rate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  write(36, 'data');
  view.setUint32(40, samples * 2, true);
  for (let index = 0; index < samples; index += 1)
    view.setInt16(
      44 + index * 2,
      Math.sin((index / rate) * 2 * Math.PI * 440) * 6_000,
      true,
    );
  return URL.createObjectURL(new Blob([buffer], { type: 'audio/wav' }));
}

function PlayerPreview() {
  const [src] = useState(toneUrl);
  return <AudioPlayer src={src} durationMs={2_000} className="w-full" />;
}

function SheetPreview() {
  const [commune, setCommune] = useState('SALERNES');
  const [facts, setFacts] = useState('[à compléter]');
  return (
    <DocumentSheet aria-label="Feuille d’exemple" className="min-h-0">
      <p className="font-bold">
        COMMUNE DE{' '}
        <SheetInlineText
          label="Commune"
          value={commune}
          onChange={setCommune}
        />
      </p>
      <h3 className="mt-6 mb-2 border-b border-[var(--charcoal-900)] font-bold uppercase">
        Exposé des faits
      </h3>
      <SheetText label="Exposé des faits" value={facts} onChange={setFacts} />
    </DocumentSheet>
  );
}

export const mediaGroups: CatalogGroup[] = [
  {
    id: 'media',
    title: 'Audio et cartes',
    description:
      'Enregistrement vocal, lecture et localisation des enregistrements.',
    items: [
      {
        id: 'audio-recorder',
        name: 'Enregistreur',
        description:
          'Bouton d’enregistrement, durée et niveau du micro. L’application fournit le micro (navigateur ou natif).',
        preview: <RecorderPreview />,
      },
      {
        id: 'audio-player',
        name: 'Lecteur audio',
        description:
          'Lecture, pause et déplacement dans l’audio (le serveur répond aux requêtes Range).',
        preview: <PlayerPreview />,
      },
      {
        id: 'location-map',
        name: 'Carte',
        description:
          'Carte OpenStreetMap gratuite (MapLibre) aux couleurs de l’application, avec le repère de la marque.',
        preview: (
          <LocationMap
            styleUrl={webEnv.VITE_MAP_STYLE_URL}
            markers={[
              {
                id: 'salernes',
                latitude: 43.5626,
                longitude: 6.2328,
                title: 'Salernes',
              },
            ]}
            className="h-64 w-full"
          />
        ),
        wide: true,
      },
      {
        id: 'document-sheet',
        name: 'Feuille de document',
        description:
          'Page A4 modifiable sur place, dans la police de l’export : les valeurs vides ou « [à compléter] » sont teintées d’ambre.',
        preview: <SheetPreview />,
        wide: true,
      },
    ],
  },
];
