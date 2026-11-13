/**
 * Replaces the browser's translucent drag snapshot with a compact themed pill.
 * The element only needs to exist while the browser captures it.
 */
export function setDragPreview(event: DragEvent, label: string): void {
  if (typeof document === 'undefined' || !event.dataTransfer?.setDragImage)
    return;
  const pill = document.createElement('div');
  pill.textContent = label;
  Object.assign(pill.style, {
    position: 'fixed',
    top: '-1000px',
    left: '-1000px',
    padding: '7px 14px',
    borderRadius: '999px',
    background: '#ffffff',
    color: 'var(--charcoal-900)',
    font: '700 12.5px/1.2 var(--font-sans)',
    letterSpacing: '-0.005em',
    whiteSpace: 'nowrap',
    boxShadow: 'var(--shadow-float)',
    border: '1px solid var(--charcoal-a07)',
  });
  document.body.append(pill);
  event.dataTransfer.setDragImage(pill, 18, 16);
  requestAnimationFrame(() => pill.remove());
}

/** The id currently being dragged, readable during dragover (dataTransfer is not). */
let activeDrag: { scope: string; id: string } | null = null;

export function startDrag(scope: string, id: string): void {
  activeDrag = { scope, id };
}

export function endDrag(): void {
  activeDrag = null;
}

export function draggedId(scope: string): string | null {
  return activeDrag?.scope === scope ? activeDrag.id : null;
}
