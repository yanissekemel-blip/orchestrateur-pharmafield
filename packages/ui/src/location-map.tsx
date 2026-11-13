import { MapPinOff } from 'lucide-react';
import type { Map as MapLibreMap, Marker } from 'maplibre-gl';
import { useEffect, useRef, useState } from 'react';
import { Skeleton } from './skeleton';
import { cn } from './utils';

export type MapMarker = {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
};

/** Free OpenStreetMap vector tiles, no key or quota (OpenFreeMap). */
export const DEFAULT_MAP_STYLE =
  'https://tiles.openfreemap.org/styles/positron';

// The base style recoloured in the app's palette: the neutral grey canvas, pale
// teal water, white streets with soft grey casings, and charcoal labels.
const palette: [RegExp, string, string][] = [
  [/^background$/, 'background-color', '#f2f2f2'],
  [/^(park|landcover_wood)$/, 'fill-color', '#e3ebe6'],
  [/^water$/, 'fill-color', '#c3e1e6'],
  [/^waterway$/, 'line-color', '#c3e1e6'],
  [/^(landuse_residential|building)$/, 'fill-color', '#e9e9e9'],
  [/casing$/, 'line-color', '#d9d9d9'],
  [/^highway_(minor|path)$/, 'line-color', '#ffffff'],
  [/^highway-name/, 'text-color', '#5c5c5c'],
  [/^water_name/, 'text-color', '#5f8a91'],
  [/^label_(village|town|city|city_capital)$/, 'text-color', '#242424'],
  [/^label_(other|state|country)/, 'text-color', '#5c5c5c'],
];

function applyPalette(map: MapLibreMap) {
  for (const layer of map.getStyle().layers ?? []) {
    for (const [pattern, property, color] of palette) {
      if (!pattern.test(layer.id)) continue;
      try {
        map.setPaintProperty(layer.id, property, color);
      } catch {
        // A layer of another type with a matching name: leave it as is.
      }
    }
  }
}

// A charcoal drop pin with a white outline and the brand teal dot; its tip sits
// exactly on the position.
const markerSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="38" viewBox="-3 -3 36 46" aria-hidden="true"><path fill="#242424" stroke="#ffffff" stroke-width="3" stroke-linejoin="round" d="M15 40C15 40 0 24.5 0 15a15 15 0 0 1 30 0c0 9.5-15 25-15 25z"/><circle cx="15" cy="15" r="5.5" fill="#82c4cc"/></svg>`;

/**
 * Recordings on a free OpenStreetMap map (MapLibre with OpenFreeMap tiles by
 * default) recoloured like the app, with a brand drop pin. MapLibre is
 * loaded only when a map appears. When the tiles cannot load, a short notice
 * replaces the map; pages show the address and coordinates as text anyway.
 */
export function LocationMap({
  markers,
  onMarkerClick,
  zoom = 16,
  styleUrl = DEFAULT_MAP_STYLE,
  label = 'Carte',
  className,
}: {
  markers: readonly MapMarker[];
  onMarkerClick?: (id: string) => void;
  zoom?: number;
  styleUrl?: string;
  label?: string;
  className?: string;
}) {
  const container = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'unavailable'>(
    'loading',
  );
  const clickRef = useRef(onMarkerClick);
  clickRef.current = onMarkerClick;

  useEffect(() => {
    if (!container.current) return;
    let cancelled = false;
    let map: MapLibreMap | undefined;
    const pins: Marker[] = [];
    Promise.all([
      import('maplibre-gl'),
      import('maplibre-gl/dist/maplibre-gl.css'),
    ])
      .then(([maplibre]) => {
        if (cancelled || !container.current) return;
        const first = markers[0];
        map = new maplibre.Map({
          container: container.current,
          style: styleUrl,
          center: first ? [first.longitude, first.latitude] : [2.4, 46.6],
          zoom: first ? zoom : 4.6,
          attributionControl: { compact: true },
          cooperativeGestures: true,
          locale: {
            'CooperativeGesturesHandler.WindowsHelpText':
              'Utilisez Ctrl + molette pour zoomer.',
            'CooperativeGesturesHandler.MacHelpText':
              'Utilisez ⌘ + molette pour zoomer.',
            'CooperativeGesturesHandler.MobileHelpText':
              'Utilisez deux doigts pour déplacer la carte.',
          },
        });
        map.addControl(
          new maplibre.NavigationControl({ showCompass: false }),
          'top-right',
        );
        const active = map;
        active.on('style.load', () => applyPalette(active));
        active.on('load', () => {
          if (!cancelled) setState('ready');
        });
        active.on('error', (event) => {
          // Only a style that cannot load makes the map unusable.
          if (!active.isStyleLoaded() && !cancelled && event.error)
            setState('unavailable');
        });
        const bounds = new maplibre.LngLatBounds();
        for (const marker of markers) {
          const element = document.createElement('button');
          element.type = 'button';
          element.className = 'location-map-pin';
          element.title = marker.title;
          element.setAttribute('aria-label', marker.title);
          element.innerHTML = markerSvg;
          element.addEventListener('click', () =>
            clickRef.current?.(marker.id),
          );
          pins.push(
            new maplibre.Marker({ element, anchor: 'bottom', offset: [0, 2] })
              .setLngLat([marker.longitude, marker.latitude])
              .addTo(active),
          );
          bounds.extend([marker.longitude, marker.latitude]);
        }
        if (markers.length > 1)
          active.fitBounds(bounds, { padding: 56, maxZoom: 16, duration: 0 });
      })
      .catch(() => {
        if (!cancelled) setState('unavailable');
      });
    return () => {
      cancelled = true;
      for (const pin of pins) pin.remove();
      map?.remove();
    };
  }, [markers, zoom, styleUrl]);

  return (
    <div
      data-slot="location-map"
      className={cn(
        'relative min-h-56 overflow-hidden rounded-[var(--radius-card)] bg-[var(--bg)] shadow-[inset_0_0_0_1px_var(--line)]',
        className,
      )}
    >
      {state === 'unavailable' ? (
        <div className="absolute inset-0 grid place-content-center justify-items-center gap-2 p-6 text-center">
          <MapPinOff
            aria-hidden="true"
            className="size-7 stroke-[1.5] text-[var(--ink-3)]"
          />
          <p className="text-[13px] font-heading text-[var(--ink)]">
            Carte indisponible
          </p>
          <p className="max-w-64 text-[12px] text-[var(--ink-3)]">
            Le fond de carte n’a pas pu être chargé.
          </p>
        </div>
      ) : (
        <>
          {state === 'loading' ? (
            <Skeleton className="absolute inset-0 rounded-none" />
          ) : null}
          <section aria-label={label} className="absolute inset-0">
            {/* MapLibre makes its container `position: relative`, so the map
                lives on an inner element that fills the region. */}
            <div ref={container} className="size-full" />
          </section>
        </>
      )}
    </div>
  );
}
