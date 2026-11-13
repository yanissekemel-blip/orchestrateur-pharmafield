'use client';

import { ChevronDown, ChevronUp, Columns3, GripVertical } from 'lucide-react';
import { useId, useState } from 'react';
import { Button } from './button';
import { Checkbox } from './checkbox';
import {
  draggedId,
  endDrag,
  setDragPreview,
  startDrag,
} from './lib/drag-preview';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { cn } from './utils';

type Column = { id: string; label: string };

export function TableColumnPicker({
  columns,
  visible,
  order,
  requiredIds = [],
  onVisibleChange,
  onOrderChange,
}: {
  columns: readonly Column[];
  visible: readonly string[];
  order: readonly string[];
  requiredIds?: readonly string[];
  onVisibleChange: (visible: string[]) => void;
  onOrderChange: (order: string[]) => void;
}) {
  const idPrefix = useId();
  const dragScope = `column-picker-${idPrefix}`;
  const [dragId, setDragId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<{
    id: string;
    side: 'before' | 'after';
  } | null>(null);
  const orderedColumns = [
    ...order.flatMap((id) => columns.filter((column) => column.id === id)),
    ...columns.filter((column) => !order.includes(column.id)),
  ];
  const moveColumn = (from: number, to: number) => {
    if (from === to || from < 0 || to < 0 || to >= orderedColumns.length)
      return;
    const next = orderedColumns.map((column) => column.id);
    const [moved] = next.splice(from, 1);
    if (!moved) return;
    next.splice(to, 0, moved);
    onOrderChange(next);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label="Choisir les colonnes du tableau"
          title="Choisir les colonnes du tableau"
        >
          <Columns3 aria-hidden="true" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 p-1.5">
        <div className="px-2.5 pt-1.5 pb-2">
          <p className="text-[13.5px] font-heading text-[var(--ink)]">
            Colonnes
          </p>
          <p className="text-[11.5px] text-[var(--ink-3)]">
            Affichez, masquez et faites glisser pour réorganiser.
          </p>
        </div>
        <ul className="max-h-80 space-y-0.5 overflow-y-auto">
          {orderedColumns.map((column, index) => {
            const checked = visible.includes(column.id);
            const required =
              requiredIds.includes(column.id) ||
              (checked && visible.length === 1);
            return (
              <li
                key={column.id}
                draggable
                data-dragging={dragId === column.id || undefined}
                data-drop-side={
                  dropTarget?.id === column.id ? dropTarget.side : undefined
                }
                onDragStart={(event) => {
                  event.dataTransfer.setData('text/plain', column.id);
                  event.dataTransfer.effectAllowed = 'move';
                  setDragPreview(event.nativeEvent, column.label);
                  startDrag(dragScope, column.id);
                  setDragId(column.id);
                }}
                onDragEnd={() => {
                  endDrag();
                  setDragId(null);
                  setDropTarget(null);
                }}
                onDragOver={(event) => {
                  event.preventDefault();
                  const source = draggedId(dragScope);
                  const from = orderedColumns.findIndex(
                    (item) => item.id === source,
                  );
                  setDropTarget(
                    from < 0 || from === index
                      ? null
                      : {
                          id: column.id,
                          side: from < index ? 'after' : 'before',
                        },
                  );
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  setDropTarget(null);
                  const source = event.dataTransfer.getData('text/plain');
                  moveColumn(
                    orderedColumns.findIndex((item) => item.id === source),
                    index,
                  );
                }}
                className="group/column flex h-9 cursor-grab items-center gap-2 rounded-[var(--radius-md)] px-2 transition-[background-color,opacity] duration-150 hover:bg-[var(--charcoal-a06)] active:cursor-grabbing data-[dragging=true]:opacity-40 relative before:pointer-events-none before:absolute before:inset-x-2 before:h-0.5 before:rounded-[var(--radius-control)] before:bg-[var(--accent)] before:opacity-0 data-[drop-side=after]:before:-bottom-px data-[drop-side=after]:before:opacity-100 data-[drop-side=before]:before:-top-px data-[drop-side=before]:before:opacity-100 motion-reduce:transition-none"
              >
                <GripVertical
                  aria-hidden="true"
                  className="size-3.5 shrink-0 text-[var(--ink-3)] opacity-60 group-hover/column:opacity-100"
                />
                <Checkbox
                  id={`${idPrefix}-table-column-${column.id}`}
                  aria-label={`Afficher la colonne ${column.label}`}
                  checked={checked}
                  disabled={required}
                  onCheckedChange={(next) =>
                    onVisibleChange(
                      next
                        ? orderedColumns
                            .filter(
                              (item) =>
                                visible.includes(item.id) ||
                                item.id === column.id,
                            )
                            .map((item) => item.id)
                        : visible.filter((id) => id !== column.id),
                    )
                  }
                />
                <label
                  htmlFor={`${idPrefix}-table-column-${column.id}`}
                  className={cn(
                    'min-w-0 flex-1 cursor-pointer truncate text-[12.5px] font-semibold',
                    checked ? 'text-[var(--ink)]' : 'text-[var(--ink-2)]',
                  )}
                >
                  {column.label}
                </label>
                {/* Keyboard reordering; revealed on hover or focus to keep rows calm. */}
                <span className="flex items-center opacity-0 transition-opacity duration-150 group-focus-within/column:opacity-100 group-hover/column:opacity-100 motion-reduce:transition-none">
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    aria-label={`Monter ${column.label}`}
                    disabled={index === 0}
                    onClick={() => moveColumn(index, index - 1)}
                  >
                    <ChevronUp aria-hidden="true" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    aria-label={`Descendre ${column.label}`}
                    disabled={index === orderedColumns.length - 1}
                    onClick={() => moveColumn(index, index + 1)}
                  >
                    <ChevronDown aria-hidden="true" />
                  </Button>
                </span>
              </li>
            );
          })}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
