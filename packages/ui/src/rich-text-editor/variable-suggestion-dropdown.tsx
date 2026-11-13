'use client';

import {
  type SetStateAction,
  useCallback,
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../utils';
import { groupTemplateVariables } from './template-variable-categories';
import type {
  TemplateVariable,
  TemplateVariableCategoryOption,
} from './template-variables';

const portalContainer = typeof document === 'undefined' ? null : document.body;
const subscribeToClientSnapshot = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function VariableSuggestionDropdown({
  variables,
  categories,
  query,
  onSelect,
  coords,
  onClose,
}: {
  variables: TemplateVariable[];
  categories?: readonly TemplateVariableCategoryOption[];
  query: string;
  onSelect: (variable: TemplateVariable) => void;
  coords: { left: number; top: number };
  onClose: () => void;
}) {
  const [selection, setSelection] = useState({ query, index: 0 });
  const canUsePortal = useSyncExternalStore(
    subscribeToClientSnapshot,
    getClientSnapshot,
    getServerSnapshot,
  );
  const containerRef = useRef<HTMLDivElement>(null);

  const { orderedVariables: filtered, groups: variableGroups } = useMemo(
    () => groupTemplateVariables(variables, query, categories),
    [categories, query, variables],
  );
  const selectedIndex = selection.query === query ? selection.index : 0;

  const updateSelectedIndex = useCallback(
    (update: SetStateAction<number>) => {
      setSelection((current) => {
        const currentIndex = current.query === query ? current.index : 0;
        const index =
          typeof update === 'function' ? update(currentIndex) : update;

        return { query, index };
      });
    },
    [query],
  );

  useEffect(() => {
    const selected = containerRef.current?.querySelector<HTMLElement>(
      `[data-variable-index="${selectedIndex}"]`,
    );
    selected?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  const handleKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      updateSelectedIndex(
        (index) => (index + 1) % Math.max(1, filtered.length),
      );
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      updateSelectedIndex(
        (index) =>
          (index - 1 + Math.max(1, filtered.length)) %
          Math.max(1, filtered.length),
      );
    } else if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      const item = filtered[selectedIndex];
      if (item) onSelect(item);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
    }
  });

  useEffect(() => {
    const listener = (event: KeyboardEvent) => handleKeyDown(event);
    document.addEventListener('keydown', listener, true);
    return () => document.removeEventListener('keydown', listener, true);
    // Effect Events always read the latest values and must not be dependencies.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dropdown =
    filtered.length === 0 ? (
      <div
        className="fixed z-50 rounded-[var(--radius-card)] border border-white bg-white px-3 py-2.5 text-[12px] font-medium text-[var(--ink-2)] shadow-[var(--shadow-float)]"
        style={{ left: coords.left, top: coords.top }}
      >
        Aucune variable trouvée
      </div>
    ) : (
      <div
        ref={containerRef}
        className="fixed z-50 max-h-48 min-w-56 overflow-y-auto rounded-[var(--radius-card)] border border-white bg-white p-1.5 text-[var(--ink)] shadow-[var(--shadow-float)]"
        style={{ left: coords.left, top: coords.top }}
      >
        {variableGroups.map((group) => (
          <div key={group.category}>
            <p className="px-2.5 py-1.5 text-[12px] font-semibold text-[var(--ink-3)]">
              {group.label}
            </p>
            {group.variables.map(({ index, variable }) => {
              const isSelected = index === selectedIndex;

              return (
                <button
                  key={`${variable.category}:${variable.key}`}
                  type="button"
                  data-variable-index={index}
                  className={cn(
                    'flex min-h-8 w-full items-center gap-2 rounded-[var(--radius-md)] px-2.5 py-1.5 text-left text-[12.5px] font-semibold text-[var(--ink)] transition-colors hover:bg-[var(--charcoal-a06)]',
                    isSelected && 'bg-[var(--charcoal-a06)]',
                  )}
                  onMouseEnter={() => updateSelectedIndex(index)}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    onSelect(variable);
                  }}
                >
                  <span
                    className={cn(
                      'shrink-0 rounded-[var(--radius-control)] bg-[var(--accent-soft)] px-2 py-0.5 font-mono text-[11px] font-bold text-[var(--brand-ink)]',
                    )}
                  >
                    {variable.key}
                  </span>
                  <span
                    className={cn(
                      'min-w-0 truncate text-[12px] font-medium text-[var(--ink-2)]',
                    )}
                  >
                    - {variable.label}
                  </span>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    );

  return canUsePortal && portalContainer
    ? createPortal(dropdown, portalContainer)
    : dropdown;
}
