'use client';

import {
  type Ref,
  type RefCallback,
  useCallback,
  useEffect,
  useState,
} from 'react';

const ACTIVE = 'data-indicator-active';

/**
 * Drives the sliding active pill shared by tabs, segmented controls, the
 * workspace rail, and settings navigation. Returns a ref for the container;
 * the hook finds the item matching `activeSelector`, writes its box to
 * `--indicator-x/y/w/h`, and marks the container `data-indicator="ready"` so
 * `motion-controls.css` paints one pill that slides between items.
 */
export function useActiveIndicator<T extends HTMLElement>(
  activeSelector: string | null,
  forwardedRef?: Ref<T>,
): RefCallback<T> {
  const [node, setNode] = useState<T | null>(null);

  useEffect(() => {
    if (!node || !activeSelector) return;
    let frame = 0;
    let observed: HTMLElement | null = null;
    const resize =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(() => schedule());

    function update() {
      if (!node || !activeSelector) return;
      const active = node.querySelector<HTMLElement>(activeSelector);
      for (const item of node.querySelectorAll(`[${ACTIVE}]`))
        if (item !== active) item.removeAttribute(ACTIVE);
      if (!active || active.offsetWidth === 0) {
        node.setAttribute('data-indicator', 'idle');
        return;
      }
      // Layout offsets ignore transforms, so a dialog still springing open or
      // a pressed item never skews the measurement.
      let x = 0;
      let y = 0;
      let current: HTMLElement | null = active;
      while (current && current !== node) {
        x += current.offsetLeft;
        y += current.offsetTop;
        current = current.offsetParent as HTMLElement | null;
      }
      node.style.setProperty('--indicator-x', `${x}px`);
      node.style.setProperty('--indicator-y', `${y}px`);
      node.style.setProperty('--indicator-w', `${active.offsetWidth}px`);
      node.style.setProperty('--indicator-h', `${active.offsetHeight}px`);
      active.setAttribute(ACTIVE, '');
      node.setAttribute('data-indicator', 'ready');
      if (resize && observed !== active) {
        if (observed) resize.unobserve(observed);
        resize.observe(active);
        observed = active;
      }
    }

    function schedule() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    }

    // Positions the container first so it becomes the items' offsetParent.
    node.setAttribute('data-indicator', 'idle');
    update();
    const mutations = new MutationObserver(schedule);
    mutations.observe(node, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['data-state', 'aria-current', 'aria-selected'],
    });
    resize?.observe(node);
    return () => {
      cancelAnimationFrame(frame);
      mutations.disconnect();
      resize?.disconnect();
      node.removeAttribute('data-indicator');
      for (const item of node.querySelectorAll(`[${ACTIVE}]`))
        item.removeAttribute(ACTIVE);
    };
  }, [node, activeSelector]);

  return useCallback(
    (element: T | null) => {
      setNode(element);
      if (typeof forwardedRef === 'function') forwardedRef(element);
      else if (forwardedRef) forwardedRef.current = element;
    },
    [forwardedRef],
  );
}
