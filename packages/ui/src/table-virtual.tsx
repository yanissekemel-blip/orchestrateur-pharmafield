import { useVirtualizer } from '@tanstack/react-virtual';
import type * as React from 'react';
import { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { TableBody, TableContainerContext, TableRow } from './table';
import { useIsMobile } from './use-mobile';

/** The nearest ancestor that scrolls vertically: the filled table or the page content. */
function scrollParent(element: HTMLElement | null): HTMLElement | null {
  let current = element;
  while (current) {
    const overflow = getComputedStyle(current).overflowY;
    if (overflow === 'auto' || overflow === 'scroll') return current;
    current = current.parentElement;
  }
  return null;
}

/**
 * A table body that renders only the rows on screen (plus a margin), so long
 * lists stay fast on desktops and phones. Rows are measured once rendered:
 * desktop rows and phone cards keep their natural heights. `onEndReached`
 * fires when the last rows come into view, for infinite scrolling.
 *
 * `renderRow` must return a `TableRow` and pass it the given `rowProps`.
 */
export function TableVirtualBody<Item>({
  items,
  getKey,
  renderRow,
  estimateSize = 48,
  onEndReached,
  footer,
}: {
  items: readonly Item[];
  getKey: (item: Item) => string;
  renderRow: (
    item: Item,
    rowProps: {
      'data-index': number;
      ref: (element: HTMLTableRowElement | null) => void;
    },
  ) => React.ReactNode;
  /** Expected row height in pixels before measuring (cards are taller). */
  estimateSize?: number;
  onEndReached?: () => void;
  /** A last row, such as « Chargement… » while the next page loads. */
  footer?: React.ReactNode;
}) {
  const container = useContext(TableContainerContext);
  const phone = useIsMobile();
  const [scroller, setScroller] = useState<HTMLElement | null>(null);
  useLayoutEffect(() => {
    setScroller(scrollParent(container?.current ?? null));
  }, [container]);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => scroller,
    estimateSize: () => (phone ? estimateSize * 3.5 : estimateSize),
    getItemKey: (index) => {
      const item = items[index];
      return item === undefined ? index : getKey(item);
    },
    overscan: 8,
    // Until the scroller is measured (and where nothing is laid out, as in
    // tests), assume a screenful so the first rows render at once.
    initialRect: { width: 1024, height: 900 },
    // Phone cards sit 8px apart (phone.css).
    gap: phone ? 8 : 0,
  });
  const rows = virtualizer.getVirtualItems();
  const last = rows.at(-1);

  useEffect(() => {
    if (last && last.index >= items.length - 5) onEndReached?.();
  }, [last, items.length, onEndReached]);

  const before = rows[0]?.start ?? 0;
  const after = last ? virtualizer.getTotalSize() - last.end : 0;
  return (
    <TableBody data-virtual="">
      {before > 0 ? (
        <TableRow aria-hidden="true" data-spacer="">
          <td style={{ height: before, padding: 0, border: 0 }} />
        </TableRow>
      ) : null}
      {rows.map((row) => {
        const item = items[row.index];
        return item === undefined
          ? null
          : renderRow(item, {
              'data-index': row.index,
              ref: virtualizer.measureElement,
            });
      })}
      {after > 0 ? (
        <TableRow aria-hidden="true" data-spacer="">
          <td style={{ height: after, padding: 0, border: 0 }} />
        </TableRow>
      ) : null}
      {footer}
    </TableBody>
  );
}
