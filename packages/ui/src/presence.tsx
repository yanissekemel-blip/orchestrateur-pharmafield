'use client';

import {
  AnimatePresence,
  domAnimation,
  LazyMotion,
  MotionConfig,
  m,
} from 'motion/react';
import type { ReactNode } from 'react';
import { cn } from './utils';

/**
 * Animates content in and out of the layout: height springs open, opacity
 * fades, and the content stays mounted until its exit finishes. Use it for
 * conditional bars and sections that would otherwise pop in and out.
 */
function Presence({
  show,
  children,
  className,
}: {
  show: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <AnimatePresence initial={false}>
          {show ? (
            <m.div
              key="presence"
              data-slot="presence"
              className={cn('overflow-hidden', className)}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                height: { type: 'spring', stiffness: 520, damping: 44 },
                opacity: { duration: 0.16, ease: [0.2, 0.8, 0.2, 1] },
              }}
            >
              {children}
            </m.div>
          ) : null}
        </AnimatePresence>
      </MotionConfig>
    </LazyMotion>
  );
}

export { Presence };
