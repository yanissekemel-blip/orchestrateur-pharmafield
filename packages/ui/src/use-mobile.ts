import * as React from 'react';

/** Phones: below Tailwind's `sm` breakpoint (40rem), as in `phone.css`. */
const PHONE_QUERY = '(width < 40rem)';

/**
 * True on phone-width viewports. Layout adapts in CSS (`phone.css`); use this
 * only inside `@orchestrateur-pharmafield/ui` when a component must render different markup.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(() =>
    typeof window === 'undefined'
      ? false
      : window.matchMedia(PHONE_QUERY).matches,
  );

  React.useEffect(() => {
    const mql = window.matchMedia(PHONE_QUERY);
    const onChange = () => setIsMobile(mql.matches);
    mql.addEventListener('change', onChange);
    onChange();
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return isMobile;
}
