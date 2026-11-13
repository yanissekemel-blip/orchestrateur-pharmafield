/**
 * Toasts render above modal layers. Clicking one (for example its close
 * button) must not count as an outside interaction that dismisses the modal.
 */
export function keepOpenOnToastInteraction<
  E extends { target: EventTarget | null; preventDefault(): void },
>(handler?: (event: E) => void) {
  return (event: E) => {
    const target = event.target;
    if (target instanceof Element && target.closest('[data-sonner-toaster]')) {
      event.preventDefault();
      return;
    }
    handler?.(event);
  };
}
